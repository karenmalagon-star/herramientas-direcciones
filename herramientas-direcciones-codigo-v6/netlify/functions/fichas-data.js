const { requireAuth, unauthorized, json } = require('./_lib/auth');
const { DATA, ADDR, TRIES, COUNTRY_ORDER } = require('./_data/fichas');

// Sin "pais": lista de países. Con "pais": fichas (direcciones + transportadoras) de ese país.
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!requireAuth(event)) return unauthorized();
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'bad_request' }); }
  const k = String(body.pais || '').toLowerCase();
  if (!k) {
    return json(200, { ok: true, paises: COUNTRY_ORDER.map((c) => ({ key: c, name: DATA[c].name, code: DATA[c].code })) });
  }
  if (!DATA[k]) return json(200, { ok: false, message: 'País no encontrado.' });
  return json(200, { ok: true, pais: k, data: DATA[k], addr: ADDR[k], tries: TRIES[k] });
};
