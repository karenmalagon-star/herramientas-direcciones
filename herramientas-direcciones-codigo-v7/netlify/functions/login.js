const { makeToken, json } = require('./_lib/auth');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'method_not_allowed' });
  }
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'bad_request' });
  }
  const password = String(body.password || '');
  const expected = process.env.APP_PASSWORD || '';
  if (!expected) {
    return json(500, { error: 'server_misconfigured', message: 'No hay contraseña configurada en el servidor.' });
  }
  if (password !== expected) {
    return json(401, { error: 'invalid_password', message: 'Contraseña incorrecta.' });
  }
  const token = makeToken();
  return json(200, { token });
};
