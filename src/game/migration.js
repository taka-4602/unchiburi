import { UPGRADE_DATA, SKIN_DATA, ACHIEVEMENT_DATA, GACHA_CHARS, FLY } from './data';
import { state } from './engine';

const MAGIC = 'UBS1';
const KEY = 'UNCHI-BURI-PRO-2026';
const SAVE_KEY = 'UNCHI_BURI_STUDIO_V1';

// 移行対象の数値フィールド
const NUM_FIELDS = [
  'score',
  'totalScore',
  'totalClicks',
  'flushCount',
  'feverCount',
  'prestigeCount',
  'souls',
  'totalSouls',
  'flushBonus',
  'fliesPopped',
  'goldenCaught',
  'laxUsed',
  'gachaPulls',
  'urCount',
];

// 移行対象の真偽値フィールド
const BOOL_FIELDS = ['laxUnlocked', 'laxActive'];

// FNV-1a風の軽量チェックサム（カジュアル改ざん検知用）
function checksum(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

// キーを再帰ソートしてチェックサムを安定化
function sortDeep(v) {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v && typeof v === 'object') {
    const o = {};
    Object.keys(v)
      .sort()
      .forEach((k) => (o[k] = sortDeep(v[k])));
    return o;
  }
  return v;
}
const canon = (d) => JSON.stringify(sortDeep(d));

function pack(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = '';
  bytes.forEach((b, i) => {
    bin += String.fromCharCode(b ^ KEY.charCodeAt(i % KEY.length));
  });
  return MAGIC + '.' + btoa(bin);
}

function unpack(text) {
  const t = text.trim();
  if (!t.startsWith(MAGIC + '.')) return null;
  const bin = atob(t.slice(MAGIC.length + 1));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length);
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function collectSave() {
  const d = {};
  NUM_FIELDS.forEach((k) => (d[k] = state[k] || 0));
  BOOL_FIELDS.forEach((k) => (d[k] = !!state[k]));
  d.upgrades = { ...state.upgrades };
  d.unlockedSkins = [...state.unlockedSkins];
  d.achievements = [...state.achievements];
  d.gachaChars = [...state.gachaChars];
  d.flies = state.flies.map((f) => ({ id: f.id, sucked: f.sucked }));
  d.currentSkin = state.currentSkin;
  return d;
}

const num = (v) => (Number.isFinite(+v) && +v >= 0 ? +v : 0);

// 既知フィールドのみ・非負数のみ・既知IDのみに整形（チート/壊れデータ対策）
function sanitize(d) {
  if (!d || typeof d !== 'object') return null;
  const out = {};
  NUM_FIELDS.forEach((k) => (out[k] = num(d[k])));
  BOOL_FIELDS.forEach((k) => (out[k] = !!d[k]));

  out.upgrades = {};
  UPGRADE_DATA.forEach((u) => {
    out.upgrades[u.id] = Math.floor(num(d.upgrades?.[u.id]));
  });

  const knownSkins = SKIN_DATA.map((s) => s.id);
  out.unlockedSkins = Array.isArray(d.unlockedSkins)
    ? d.unlockedSkins.filter((id) => knownSkins.includes(id))
    : [];
  if (!out.unlockedSkins.includes('default')) out.unlockedSkins.unshift('default');
  out.currentSkin = out.unlockedSkins.includes(d.currentSkin) ? d.currentSkin : 'default';

  const knownAch = ACHIEVEMENT_DATA.map((a) => a.id);
  out.achievements = Array.isArray(d.achievements)
    ? [...new Set(d.achievements.filter((id) => knownAch.includes(id)))]
    : [];

  const knownChars = GACHA_CHARS.filter((c) => c.type === 'char').map((c) => c.id);
  out.gachaChars = Array.isArray(d.gachaChars)
    ? [...new Set(d.gachaChars.filter((id) => knownChars.includes(id)))]
    : [];

  out.flies = Array.isArray(d.flies)
    ? d.flies
        .slice(0, FLY.max)
        .filter((f) => f && typeof f === 'object')
        .map((f) => ({ id: Math.floor(num(f.id)), sucked: num(f.sucked) }))
    : [];

  return out;
}

// 現在のセーブを難読化ファイルとしてダウンロード
export function exportSave() {
  const d = collectSave();
  const payload = { v: 1, c: checksum(canon(d)), d };
  const blob = new Blob([pack(payload)], { type: 'application/octet-stream' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `unchiburi_save_${new Date().toISOString().slice(0, 10)}.unchi`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ファイル文字列 → { ok, clean } 検証＆サニタイズ済みデータ
export function parseSaveFile(text) {
  try {
    const p = unpack(text);
    if (!p || p.v !== 1 || !p.d || p.c !== checksum(canon(p.d))) {
      return { ok: false };
    }
    const clean = sanitize(p.d);
    return clean ? { ok: true, clean } : { ok: false };
  } catch {
    return { ok: false };
  }
}

// サニタイズ済みデータを適用して再起動
export function applySave(clean) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(clean));
  location.reload();
}
