const { requireAuth, unauthorized, json } = require('./_lib/auth');
const { DATA, resolveCity, parseCoords, haversineKm, rankAgencies, partialMatch, toPublic } = require('./_lib/agencias-engine');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!requireAuth(event)) return unauthorized();

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'bad_request' }); }

  const cityRes = resolveCity(String(body.ciudad || ''));
  if (cityRes.status === 'ambiguous' || cityRes.status === 'notfound') {
    return json(200, { ok: false, cityStatus: cityRes.status, options: cityRes.options || [] });
  }

  const city = cityRes.city;
  const pt = parseCoords(String(body.coord || ''));
  const direccion = String(body.direccion || '').trim();

  if (!pt) {
    // Sin coordenadas válidas: si hay una dirección de texto, se busca por
    // parecido de texto (mismo motor que "Por palabra clave"), no por distancia real.
    if (!direccion) {
      return json(200, { ok: false, coordError: true });
    }
    const pool = DATA.filter((d) => !city || d.ciudad === city);
    const scored = rankAgencies(direccion, pool).filter((s) => s.score > 0);
    let matches;
    if (scored.length) {
      matches = scored.map((s) => s.agency);
    } else {
      const partial = partialMatch(direccion, pool);
      matches = partial.length ? partial.map((p) => p.agency) : pool;
    }
    const top = matches.slice(0, 5).map((item) => ({ item: toPublic(item), distKm: null }));
    return json(200, { ok: true, mode: 'texto', city: city || null, cityStatus: cityRes.status, results: top });
  }

  const outOfEcuador = Math.abs(pt.lat) > 3 || pt.lon > -74 || pt.lon < -92;
  const radius = parseFloat(body.radius) || 0;
  const pool = DATA.filter((d) => d.coordOk && (!city || d.ciudad === city));
  let withDist = pool.map((d) => ({ item: d, dist: haversineKm(pt.lat, pt.lon, d.lat, d.lon) }))
    .sort((a, b) => a.dist - b.dist);

  if (radius > 0) {
    const within = withDist.filter((w) => w.dist <= radius);
    if (within.length > 0) withDist = within;
  }
  const top = withDist.slice(0, 5).map((w) => ({ item: toPublic(w.item), distKm: w.dist }));

  return json(200, { ok: true, mode: 'coordenadas', city: city || null, cityStatus: cityRes.status, outOfEcuador, results: top });
};
