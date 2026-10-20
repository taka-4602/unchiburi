// 日本語単位（万・億・兆・京・垓）での数値フォーマット
const UNITS = [
  [1e20, '垓'],
  [1e16, '京'],
  [1e12, '兆'],
  [1e8, '億'],
  [1e4, '万'],
];

function trimZeros(s) {
  return s.replace(/\.?0+$/, '');
}

export function fmt(n) {
  if (!isFinite(n)) return '∞';
  if (n < 1e4) return Math.floor(n).toLocaleString();
  for (const [v, u] of UNITS) {
    if (n >= v) {
      const x = n / v;
      const s = x >= 100 ? String(Math.floor(x)) : trimZeros(x.toFixed(x >= 10 ? 1 : 2));
      return s + u;
    }
  }
  return Math.floor(n).toLocaleString();
}

export const fmtFull = (n) => Math.floor(n).toLocaleString();
