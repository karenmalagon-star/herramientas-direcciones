const { requireAuth, unauthorized, json } = require('./_lib/auth');
const COUNTRIES = require('./_data/countries.json');

// Solo se listan nombres de ciudad/departamento (datos públicos de catálogos
// gubernamentales) — nunca la lógica de comparación ni el motor de alarmas.
exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!requireAuth(event)) return unauthorized();

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'bad_request' }); }

  const pais = String(body.pais || '');
  const country = COUNTRIES[pais];
  if (!country) return json(400, { error: 'pais_invalido' });

  const departamentos = [...new Set(country.data.map((r) => r.departamento))].sort((a, b) => a.localeCompare(b, 'es'));
  const ciudades = country.data
    .map((r) => ({ ciudad: r.ciudad, departamento: r.departamento }))
    .sort((a, b) => a.ciudad.localeCompare(b.ciudad, 'es'));

  return json(200, { departamentos, ciudades });
};
