const { requireAuth, unauthorized, json } = require('./_lib/auth');
const { DATA, resolveCity, rankAgencies, partialMatch, toPublic } = require('./_lib/agencias-engine');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!requireAuth(event)) return unauthorized();

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'bad_request' }); }

  const cityRaw = String(body.ciudad || '');
  const raw = String(body.query || '').trim();
  const cityRes = resolveCity(cityRaw);

  if (!raw && !cityRaw.trim()) {
    return json(200, { ok: false, message: 'Escribe una palabra clave o una ciudad para buscar.' });
  }
  if (cityRes.status === 'ambiguous' || cityRes.status === 'notfound') {
    return json(200, { ok: false, cityStatus: cityRes.status, options: cityRes.options || [] });
  }

  const city = cityRes.city;
  const pool = DATA.filter((d) => !city || d.ciudad === city);

  if (city && pool.length === 1) {
    return json(200, { ok: true, onlyOne: true, city, results: [toPublic(pool[0])] });
  }

  let matches;
  if (!raw) {
    matches = pool.slice().sort((a, b) => a.sucursal.localeCompare(b.sucursal));
  } else {
    const scored = rankAgencies(raw, pool).filter((s) => s.score > 0);
    if (scored.length) {
      matches = scored.map((s) => s.agency);
    } else {
      // Nadie tuvo coincidencia por palabras/números — se muestra la mejor
      // coincidencia PARCIAL (agencias que comparten al menos un dato con el
      // texto, ordenadas por cuántos coinciden) en vez de dejar la búsqueda vacía.
      const partial = partialMatch(raw, pool);
      matches = partial.map((p) => p.agency);
    }
  }

  if (matches.length === 0) {
    return json(200, { ok: true, results: [], truncatedFrom: 0 });
  }

  const shown = matches.slice(0, 20);
  return json(200, { ok: true, city: city || null, results: shown.map(toPublic), totalMatches: matches.length });
};
