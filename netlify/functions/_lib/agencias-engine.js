const DATA = require('../_data/agencias.json');

function normCity(s) {
  return String(s || '')
    .toUpperCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const CITIES = [...new Set(DATA.map((d) => d.ciudad))];
const CITY_INDEX = CITIES.map((c) => ({ norm: normCity(c), original: c }));

// Returns { city, status } — status: 'empty' | 'exact' | 'fuzzy' | 'fuzzy_provincia' | 'ambiguous' | 'notfound'
function resolveCity(raw, provinciaRaw) {
  const n = normCity(raw);
  if (!n) return { city: '', status: 'empty' };
  const exact = CITY_INDEX.filter((c) => c.norm === n);
  if (exact.length) return { city: exact[0].original, status: 'exact' };
  const starts = CITY_INDEX.filter((c) => c.norm.indexOf(n) === 0);
  if (starts.length === 1) return { city: starts[0].original, status: 'fuzzy' };
  const contains = CITY_INDEX.filter((c) => c.norm.indexOf(n) !== -1);
  if (contains.length === 1) return { city: contains[0].original, status: 'fuzzy' };
  const pool = starts.length ? starts : contains;
  if (pool.length > 1 && provinciaRaw) {
    const pn = normCity(provinciaRaw);
    const byProv = pool.filter((c) => DATA.some((d) => d.ciudad === c.original && normCity(d.provincia) === pn));
    if (byProv.length === 1) return { city: byProv[0].original, status: 'fuzzy_provincia' };
  }
  if (pool.length) {
    return { city: null, status: 'ambiguous', options: pool.map((c) => c.original).sort() };
  }
  return { city: null, status: 'notfound' };
}

const STOPWORDS = {};
('DE DEL LA EL LOS LAS Y EN A SN S N NO NRO NUMERO CALLE AV AVE AVENIDA AVDA VIA ' +
  'BARRIO SECTOR PARROQUIA CIUDAD ESQUINA ENTRE ATRAS DETRAS CERCA LADO JUNTO ' +
  'FRENTE DIAGONAL REF REFERENCIA DOMICILIO OFICINA PRINCIPAL SERVIENTREGA ' +
  'AGENCIA ENTREGA CASA EDIFICIO LOCAL PISO TORRE CDLA CIUDADELA URB ' +
  'URBANIZACION COOP COOPERATIVA CONJ CONJUNTO KM SUR NORTE CENTRO ESTE OESTE ' +
  'CON RECAUDO SIN CLIENTE PEDIDO ORDEN GUIA TRANSPORTADORA DESTINO')
  .split(' ').forEach((w) => { STOPWORDS[w] = true; });

// Los números de calle/avenida ("Calle 13", "Ave 21 y 22") son la parte más
// específica de una dirección ecuatoriana — se conservan aunque sean cortos.
// Las palabras de texto siguen filtrando conectores y requieren 3+ letras
// (antes 4) para no perder nombres cortos de calles/sectores.
function tokenize(s, minLen) {
  minLen = minLen || 3;
  return normCity(s).split(' ').filter((t) => {
    if (!t) return false;
    if (/^\d+$/.test(t)) return true; // número de calle/avenida: siempre se conserva
    return t.length >= minLen && !STOPWORDS[t];
  });
}
function normNoSpace(s) { return normCity(s).replace(/\s+/g, ''); }

function tokenWeight(t) {
  if (/^\d+$/.test(t)) return t.length >= 2 ? 3 : 1; // número específico (ej. "13", "22") pesa más
  return 2; // palabra de texto (nombre de calle, sector, etc.)
}

function scoreAgency(orderText, agency) {
  const orderToks = {};
  tokenize(orderText).forEach((t) => { orderToks[t] = true; });
  const orderNoSpace = normNoSpace(orderText);
  const agencyToks = tokenize(agency.direccion + ' ' + agency.sucursal);
  const seen = {};
  let overlap = 0, substrBonus = 0;
  agencyToks.forEach((t) => {
    if (seen[t]) return;
    seen[t] = true;
    if (orderToks[t]) overlap += tokenWeight(t);
    if (!/^\d+$/.test(t) && t.length >= 5 && orderNoSpace.indexOf(t) !== -1) substrBonus++;
  });
  return overlap + substrBonus;
}

function rankAgencies(orderText, pool) {
  return pool.map((a) => ({ score: scoreAgency(orderText, a), agency: a }))
    .sort((x, y) => y.score - x.score);
}

// Coincidencia parcial de respaldo: cuenta cuántas palabras/números del texto
// libre aparecen en la agencia, sin exigir que estén TODOS presentes (a
// diferencia de una búsqueda por subcadena estricta). Útil cuando el agente
// escribió una referencia con datos que no calzan 100% (p. ej. "entre Ave.
// 22 y 23" cuando la agencia registra "Ave 21 y 22") — al menos "22" coincide.
function partialMatch(orderText, pool) {
  const terms = tokenize(orderText);
  if (!terms.length) return [];
  return pool.map((a) => {
    const hay = tokenize(a.direccion + ' ' + a.sucursal + ' ' + a.ciudad);
    const haySet = {};
    hay.forEach((t) => { haySet[t] = true; });
    let hits = 0;
    terms.forEach((t) => { if (haySet[t]) hits++; });
    return { agency: a, hits };
  }).filter((r) => r.hits > 0).sort((a, b) => b.hits - a.hits);
}

// Solo se consideran agencias registradas en Dropi para resolución automática o candidatas a revisar.
function bestAgencyMatch(orderText, city) {
  const poolTodas = DATA.filter((d) => d.ciudad === city);
  const pool = poolTodas.filter((d) => !!d.dropi);
  if (pool.length === 0) {
    return { match: null, candidates: [], method: poolTodas.length === 0 ? 'sin_agencias_en_ciudad' : 'sin_agencias_dropi_en_ciudad' };
  }
  if (pool.length === 1) return { match: pool[0], candidates: pool, method: 'unica_agencia_en_ciudad' };
  const scored = rankAgencies(orderText, pool);
  const topScore = scored[0].score;
  if (topScore === 0) {
    const partial = partialMatch(orderText, pool);
    const candidates = partial.length
      ? partial.slice(0, 5).map((p) => p.agency)
      : scored.slice().sort((a, b) => a.agency.sucursal.localeCompare(b.agency.sucursal)).slice(0, 5).map((s) => s.agency);
    return { match: null, candidates, totalEnCiudad: pool.length, method: 'sin_coincidencia_texto' };
  }
  const tied = scored.filter((s) => s.score === topScore);
  if (tied.length > 1) {
    return { match: null, candidates: tied.slice(0, 12).map((s) => s.agency), totalTied: tied.length, method: 'empate_revisar' };
  }
  return { match: scored[0].agency, candidates: scored.slice(0, 5).map((s) => s.agency), method: 'coincidencia_texto' };
}

function normText(s) {
  return String(s || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseCoords(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  let m = s.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  m = s.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (m) return { lat: parseFloat(m[1]), lon: parseFloat(m[2]) };
  return null;
}

// Publicly-safe projection of an agency record: no internal identifiers beyond what the UI shows.
function toPublic(item) {
  return {
    ciudad: item.ciudad,
    provincia: item.provincia,
    sucursal: item.sucursal,
    direccion: item.direccion,
    telefono: item.telefono || '',
    tipo: item.tipo,
    horarioNormal: item.horarioNormal || '',
    horarioEspecial: item.horarioEspecial || '',
    lat: item.lat != null ? item.lat : null,
    lon: item.lon != null ? item.lon : null,
    dropi: !!item.dropi,
  };
}

module.exports = {
  DATA, normCity, resolveCity, tokenize, scoreAgency, rankAgencies, bestAgencyMatch,
  normText, haversineKm, parseCoords, toPublic, partialMatch,
};
