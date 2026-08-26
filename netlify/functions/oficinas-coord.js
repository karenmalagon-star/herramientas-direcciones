const { requireAuth, unauthorized, json } = require('./_lib/auth');
const { DATA, resolveCity, parseCoords, haversineKm, toPublic } = require('./_lib/agencias-engine');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!requireAuth(event)) return unauthorized();

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'bad_request' }); }

  const cityRes = resolveCity(String(body.ciudad || ''));
  if (cityRes.status === 'ambiguous' || cityRes.status === 'notfound') {
    return json(200, { ok: false, cityStatus: cityRes.status, options: cityRes.options || [] });
  }

  const pt = parseCoords(String(body.coord || ''));
  if (!pt) {
    return json(200, { ok: false, coordError: true });
  }
  const outOfEcuador = Math.abs(pt.lat) > 3 || pt.lon > -74 || pt.lon < -92;

  const city = cityRes.city;
  const radius = parseFloat(body.radius) || 0;
  const pool = DATA.filter((d) => d.coordOk && (!city || d.ciudad === city));
  let withDist = pool.map((d) => ({ item: d, dist: haversineKm(pt.lat, pt.lon, d.lat, d.lon) }))
    .sort((a, b) => a.dist - b.dist);

  if (radius > 0) {
    const within = withDist.filter((w) => w.dist <= radius);
    if (within.length > 0) withDist = within;
  }
  const top = withDist.slice(0, 5).map((w) => ({ item: toPublic(w.item), distKm: w.dist }));

  return json(200, { ok: true, city: city || null, cityStatus: cityRes.status, outOfEcuador, results: top });
};
