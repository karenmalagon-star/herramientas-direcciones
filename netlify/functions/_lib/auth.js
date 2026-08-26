const crypto = require('crypto');

const SESSION_HOURS = 12;

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64');
}

function sign(payload) {
  const secret = process.env.APP_SECRET;
  if (!secret) throw new Error('APP_SECRET no está configurado');
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = b64url(payloadStr);
  const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest();
  return payloadB64 + '.' + b64url(sig);
}

function makeToken() {
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  return sign({ exp });
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, sigB64] = parts;
  const secret = process.env.APP_SECRET;
  if (!secret) return false;
  const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest();
  const gotSig = b64urlDecode(sigB64);
  if (expectedSig.length !== gotSig.length || !crypto.timingSafeEqual(expectedSig, gotSig)) return false;
  let payload;
  try {
    payload = JSON.parse(b64urlDecode(payloadB64).toString('utf8'));
  } catch (e) {
    return false;
  }
  if (!payload || typeof payload.exp !== 'number' || Date.now() > payload.exp) return false;
  return true;
}

function requireAuth(event) {
  const header = event.headers && (event.headers.authorization || event.headers.Authorization);
  if (!header || !header.startsWith('Bearer ')) return false;
  const token = header.slice('Bearer '.length).trim();
  return verifyToken(token);
}

const CORS_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
};

function json(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

function unauthorized() {
  return json(401, { error: 'unauthorized', message: 'Sesión inválida o expirada. Vuelve a iniciar sesión.' });
}

module.exports = { makeToken, verifyToken, requireAuth, json, unauthorized };
