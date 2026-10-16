const { requireAuth, unauthorized, json } = require('./_lib/auth');
const { DATA } = require('./_lib/agencias-engine');

// Solo se listan nombres de ciudad (para el desplegable) — nunca las
// direcciones de las agencias ni el indicador de Dropi.
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!requireAuth(event)) return unauthorized();

  const ciudades = [...new Set(DATA.map((d) => d.ciudad))].sort((a, b) => a.localeCompare(b, 'es'));
  return json(200, { ciudades });
};
