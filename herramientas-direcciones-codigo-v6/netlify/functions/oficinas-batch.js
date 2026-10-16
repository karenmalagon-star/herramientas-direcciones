const { requireAuth, unauthorized, json } = require('./_lib/auth');
const { normCity, resolveCity, bestAgencyMatch } = require('./_lib/agencias-engine');

const BATCH_KEYWORDS = ['SERVIENTREGA', 'ENTREGA EN AGENCIA', 'RETIRA EN AGENCIA', 'RECLAMA EN AGENCIA'];

function isAgencyCandidate(transportadora, direccion, notas) {
  const t = normCity(transportadora);
  if (t === 'SERVIENTREGA') return true;
  const text = normCity(direccion) + ' ' + normCity(notas);
  return BATCH_KEYWORDS.some((kw) => text.indexOf(kw) !== -1);
}

function findCol(headers, candidates) {
  const normed = headers.map(normCity);
  for (let i = 0; i < candidates.length; i++) {
    const idx = normed.indexOf(normCity(candidates[i]));
    if (idx !== -1) return idx;
  }
  return -1;
}

const INTRO_AGENCIAS = 'Estamos revisando la información que colocaste y para enviártelo a una agencia indícanos cuál es la más cercana entre estas opciones:';

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!requireAuth(event)) return unauthorized();

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'bad_request' }); }

  const aoa = Array.isArray(body.rows) ? body.rows : null;
  if (!aoa || aoa.length < 2) {
    return json(400, { error: 'sin_filas', message: 'No se recibieron filas de datos válidas.' });
  }
  if (aoa.length > 5001) {
    return json(400, { error: 'demasiadas_filas', message: 'El archivo tiene demasiadas filas (máximo 5000).' });
  }

  const headers = aoa[0].map((h) => String(h || '').trim());
  const iId = findCol(headers, ['ID', 'NUMERO GUIA']);
  const iTransp = findCol(headers, ['TRANSPORTADORA']);
  const iDir = findCol(headers, ['DIRECCION', 'DIRECCIÓN']);
  const iNotas = findCol(headers, ['NOTAS']);
  const iCiudad = findCol(headers, ['CIUDAD DESTINO', 'CIUDAD']);
  const iTelCliente = findCol(headers, ['TELEFONO', 'TELÉFONO']);

  if (iDir === -1 || iCiudad === -1) {
    return json(400, { error: 'columnas_faltantes', message: 'No encontré las columnas DIRECCION y/o CIUDAD DESTINO en el archivo.' });
  }

  const dataRows = aoa.slice(1).filter((r) => r.some((v) => String(v || '').trim() !== ''));
  const total = dataRows.length;
  const out = [];
  let nCandidatas = 0, nAuto = 0, nRevisar = 0;

  dataRows.forEach((r, i) => {
    const id = iId !== -1 ? r[iId] : i + 1;
    const transportadora = iTransp !== -1 ? r[iTransp] : '';
    const direccion = iDir !== -1 ? r[iDir] : '';
    const notas = iNotas !== -1 ? r[iNotas] : '';
    const ciudadDestino = iCiudad !== -1 ? r[iCiudad] : '';
    const deptoDestino = findColValue(r, headers, ['DEPARTAMENTO DESTINO', 'DEPARTAMENTO', 'PROVINCIA']);
    const telCliente = iTelCliente !== -1 ? r[iTelCliente] : '';

    if (!isAgencyCandidate(transportadora, direccion, notas)) return;
    nCandidatas++;

    const cityRes = resolveCity(ciudadDestino, deptoDestino);
    const rec = {
      id, ciudadOriginal: ciudadDestino,
      direccionInicial: [direccion, notas].filter(Boolean).join(' — '),
      telefono: telCliente,
      ciudadFinal: cityRes.city || ciudadDestino,
      direccionFinal: '', estado: 'Revisar', mensajeCliente: '', dropi: null,
    };

    if (cityRes.status === 'exact' || cityRes.status === 'fuzzy' || cityRes.status === 'fuzzy_provincia') {
      const res = bestAgencyMatch(direccion + ' ' + notas, cityRes.city);
      if (res.match) {
        rec.direccionFinal = res.match.direccion;
        rec.estado = 'Resuelto';
        rec.dropi = !!res.match.dropi;
        nAuto++;
      } else if (res.method === 'sin_agencias_dropi_en_ciudad') {
        rec.direccionFinal = 'REVISAR — ' + ciudadDestino + ' tiene agencias Servientrega, pero ninguna está registrada en Dropi.';
        rec.mensajeCliente = 'Estamos revisando la información que colocaste — por ahora no tenemos una agencia Servientrega habilitada en Dropi en tu ciudad para hacer la entrega. Te contactaremos para coordinar otra opción.';
        nRevisar++;
      } else {
        const lines = res.candidates.map((a) => (a.sucursal + ': ' + a.direccion).toLowerCase());
        const bulletLines = lines.map((l) => '- ' + l);
        if (res.totalTied && res.totalTied > res.candidates.length) {
          bulletLines.push('(+' + (res.totalTied - res.candidates.length) + ' agencia(s) más con la misma coincidencia — revisar manualmente)');
        }
        rec.direccionFinal = 'REVISAR — candidatas (registradas en Dropi):\n' + bulletLines.join('\n');
        rec.mensajeCliente = INTRO_AGENCIAS + '\n' + lines.map((l) => '- ' + l).join('\n');
        nRevisar++;
      }
    } else if (cityRes.status === 'ambiguous') {
      const cityLines = cityRes.options.map((o) => o.toLowerCase());
      rec.direccionFinal = 'REVISAR — ciudad ambigua:\n' + cityLines.map((l) => '- ' + l).join('\n');
      rec.mensajeCliente = 'Estamos revisando la información que colocaste, ¿nos confirmas a cuál de estas ciudades corresponde tu pedido?\n' + cityLines.map((l) => '- ' + l).join('\n');
      nRevisar++;
    } else {
      rec.direccionFinal = 'REVISAR — ciudad "' + ciudadDestino + '" no reconocida en el listado de agencias';
      rec.mensajeCliente = 'Estamos revisando la información que colocaste, ¿nos puedes confirmar la ciudad y una referencia cercana a la agencia Servientrega donde deseas recibir tu pedido?';
      nRevisar++;
    }
    out.push(rec);
  });

  return json(200, { ok: true, stats: { total, candidatas: nCandidatas, auto: nAuto, revisar: nRevisar }, rows: out });
};

function findColValue(row, headers, candidates) {
  const normed = headers.map(normCity);
  for (let i = 0; i < candidates.length; i++) {
    const idx = normed.indexOf(normCity(candidates[i]));
    if (idx !== -1) return row[idx];
  }
  return '';
}
