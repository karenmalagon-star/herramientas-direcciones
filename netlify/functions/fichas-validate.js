const { requireAuth, unauthorized, json } = require('./_lib/auth');
const { VALID } = require('./_data/fichas');

// El validador de formato corre solo aquí; el navegador recibe únicamente el resultado.
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!requireAuth(event)) return unauthorized();
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'bad_request' }); }
  const k = String(body.pais || '').toLowerCase();
  const raw = String(body.raw || '').slice(0, 1000);
  if (!VALID[k]) return json(200, { ok: false, message: 'País no encontrado.' });
  if (!raw.trim()) return json(200, { ok: true, result: null });
  const result = VALID[k](raw, String(body.city || '').slice(0, 200), String(body.cp || '').slice(0, 10));
  return json(200, { ok: true, result });
};
