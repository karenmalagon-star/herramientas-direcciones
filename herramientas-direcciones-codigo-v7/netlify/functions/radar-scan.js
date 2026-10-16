const { requireAuth, unauthorized, json } = require('./_lib/auth');
const COUNTRIES = require('./_data/countries.json');

function normalize(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const INDEX_CACHE = {};
function getIndex(code) {
  if (INDEX_CACHE[code]) return INDEX_CACHE[code];
  const country = COUNTRIES[code];
  if (!country) return null;
  const idx = new Map();
  let maxN = 1;
  for (const row of country.data) {
    const norm = normalize(row.ciudad);
    const wc = norm.split(' ').length;
    if (wc > maxN) maxN = wc;
    if (!idx.has(norm)) idx.set(norm, []);
    idx.get(norm).push(row);
  }
  INDEX_CACHE[code] = { idx, maxN, country };
  return INDEX_CACHE[code];
}

function scan(text, idx, maxN) {
  const norm = normalize(text);
  if (!norm) return [];
  const words = norm.split(' ');
  const found = [];
  const seen = new Set();
  for (let i = 0; i < words.length; i++) {
    for (let len = Math.min(maxN, words.length - i); len >= 1; len--) {
      const phrase = words.slice(i, i + len).join(' ');
      if (idx.has(phrase)) {
        for (const row of idx.get(phrase)) {
          const key = phrase + '|' + row.departamento;
          if (seen.has(key)) continue;
          seen.add(key);
          found.push({ phrase, ciudad: row.ciudad, departamento: row.departamento });
        }
      }
    }
  }
  return found;
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' });
  if (!requireAuth(event)) return unauthorized();

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'bad_request' });
  }

  const pais = String(body.pais || '');
  const direccion = String(body.direccion || '');
  const declCity = String(body.ciudad || '');
  const declDept = String(body.departamento || '');

  const info = getIndex(pais);
  if (!info) return json(400, { error: 'pais_invalido' });
  const { idx, maxN, country } = info;

  const allMatches = scan(direccion, idx, maxN);
  const declCityNorm = normalize(declCity);
  const declDeptNorm = normalize(declDept);

  const otherMatches = [];
  for (const m of allMatches) {
    const cityNorm = normalize(m.ciudad);
    const phraseNorm = normalize(m.phrase);
    const isDeclaredCity = declCityNorm && cityNorm === declCityNorm;
    const isDeclaredDeptLabel = declDeptNorm && phraseNorm === declDeptNorm;
    if (isDeclaredCity || isDeclaredDeptLabel) continue;
    const sameDept = !!(declDeptNorm && normalize(m.departamento) === declDeptNorm);
    otherMatches.push({ phrase: m.phrase, ciudad: m.ciudad, departamento: m.departamento, sameDept });
  }
  otherMatches.sort((a, b) => {
    if (a.sameDept !== b.sameDept) return a.sameDept ? -1 : 1;
    return b.phrase.split(' ').length - a.phrase.split(' ').length;
  });

  const hasSameDept = otherMatches.some((m) => m.sameDept);
  const hasOtherDept = otherMatches.some((m) => !m.sameDept);
  let level = 'ok';
  if (hasSameDept) level = 'alert';
  else if (hasOtherDept) level = 'warn';

  // Autofill de departamento: solo si el campo llegó vacío y la ciudad declarada
  // tiene una única coincidencia posible en el catálogo.
  let autofill = null;
  if (!declDept.trim() && declCityNorm && idx.has(declCityNorm)) {
    const rows = idx.get(declCityNorm);
    const depts = [...new Set(rows.map((r) => r.departamento))];
    if (depts.length === 1) {
      autofill = { departamento: depts[0] };
    } else if (depts.length > 1) {
      autofill = { ambiguous: depts };
    }
  }

  return json(200, {
    unit: country.unit,
    label: country.label,
    source: country.source,
    total: country.data.length,
    level,
    matches: otherMatches,
    autofill,
  });
};
