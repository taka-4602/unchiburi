import { useState } from 'react';
import { GACHA_RATES, GACHA_CHARS, CHAR_BONUS } from '../game/data';
import { pullGacha, getGachaCost } from '../game/engine';
import { useFast, useSlow } from '../hooks';
import { fmt } from '../game/format';

const RARITY_STYLE = {
  n: 'border-slate-300 dark:border-slate-600',
  r: 'border-amber-500/60 bg-amber-50/50 dark:bg-amber-950/20',
  sr: 'border-sky-400 bg-sky-50/60 dark:bg-sky-950/30 shadow-md',
  ssr: 'border-yellow-400 bg-yellow-50/60 dark:bg-yellow-950/30 shadow-lg dark:shadow-[0_0_20px_rgba(251,191,36,0.25)]',
  ur: 'border-fuchsia-500 bg-gradient-to-br from-fuchsia-50 to-purple-100 dark:from-fuchsia-950/50 dark:to-purple-950/40 shadow-xl dark:shadow-[0_0_30px_rgba(217,70,239,0.4)] animate-pulse',
};

const CHAR_CARD_STYLE = {
  n: 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700',
  r: 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/50',
  sr: 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-700/50',
  ssr: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-600/50',
  ur: 'bg-fuchsia-50 dark:bg-fuchsia-950/30 border-fuchsia-300 dark:border-fuchsia-600/50',
};

export default function GachaPanel() {
  const f = useFast();
  const s = useSlow();
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const cost = getGachaCost();
  const charCount = s.gachaChars.length;
  const totalChars = GACHA_CHARS.filter((c) => c.type === 'char').length;

  const pull = (n) => {
    if (spinning) return;
    setSpinning(true);
    // ガチャっぽい小さな間を作る
    setTimeout(() => {
      const res = pullGacha(n);
      setResult(res);
      setSpinning(false);
    }, n >= 100 ? 400 : 250);
  };

  const canPull = (n) => f.score >= cost * n && !spinning;

  return (
    <div className="flex-grow flex flex-col space-y-3 overflow-y-auto max-h-[520px] pr-1">
      {/* ガチャ説明 */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-slate-800/70 dark:to-slate-900/60 rounded-2xl p-4 border-2 border-amber-200 dark:border-amber-500/40 text-center space-y-1">
        <div className="text-3xl">🎰💩</div>
        <h4 className="font-black text-amber-800 dark:text-amber-300">うんちガチャ</h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
          腸の奥からランダムに排出されるガチャ。<br />
          新キャラ1種ごとに<span className="text-amber-600 dark:text-amber-400">全生産+{CHAR_BONUS * 100}%の図鑑ボーナス</span>。<br />
          ガチャ限定スキンはここでしか手に入りません。
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
          {GACHA_RATES.map((r) => `${r.emoji}${r.name} ${(r.w / 100).toFixed(2).replace(/\.?0+$/, '')}%`).join('　')}
        </p>
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
          累計排出回数: <span className="text-amber-700 dark:text-amber-300 font-black">{fmt(s.gachaPulls)}回</span>
          {s.urCount > 0 && <>　/　UR排出: <span className="text-fuchsia-600 dark:text-fuchsia-400 font-black">{s.urCount}個</span></>}
        </p>
      </div>

      {/* 排出ボタン */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { n: 1, label: '1回' },
          { n: 10, label: '10連' },
          { n: 100, label: '100連' },
        ].map(({ n, label }) => (
          <button
            key={n}
            onClick={() => pull(n)}
            disabled={!canPull(n)}
            className={`py-3 rounded-2xl font-black text-xs transition-all active:scale-95 border-2 flex flex-col items-center gap-0.5 ${
              canPull(n)
                ? 'bg-gradient-to-b from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 border-amber-300 shadow-md dark:shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-300 dark:border-slate-700 cursor-not-allowed'
            }`}
          >
            <span className="text-base">{spinning ? '🌀' : '💩'}</span>
            <span>{label}</span>
            <span className="text-[10px] opacity-80">{fmt(cost * n)} BP</span>
          </button>
        ))}
      </div>
      <p className="text-center text-[9px] font-bold text-slate-400 dark:text-slate-500 -mt-1">
        ※ 排出コストは所持BPの0.5%（最低1,000BP）
      </p>

      {/* 結果表示 */}
      {result && (
        <div className={`rounded-2xl border-2 p-3 space-y-2 transition-all ${RARITY_STYLE[result.best]}`}>
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-700 dark:text-slate-200">{result.n}連の排出結果</span>
            {result.bpBack > 0 && <span className="text-slate-500 dark:text-slate-400">回収 +{fmt(result.bpBack)} BP</span>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {GACHA_RATES.map((r) =>
              result.counts[r.id] > 0 ? (
                <span
                  key={r.id}
                  className={`text-[11px] font-black px-2 py-1 rounded-lg ${
                    r.id === 'n'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-amber-300 dark:border-amber-500/50'
                  }`}
                >
                  {r.emoji}{r.name} ×{result.counts[r.id]}
                </span>
              ) : null
            )}
          </div>
          {result.notes.length > 0 && (
            <div className="bg-white/70 dark:bg-slate-800/60 rounded-xl p-2 space-y-1 max-h-32 overflow-y-auto">
              {result.notes.map((note, i) => (
                <p key={i} className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                  {note}
                </p>
              ))}
            </div>
          )}
          {result.best === 'ur' && (
            <p className="text-center text-xs font-black text-fuchsia-600 dark:text-fuchsia-300 animate-bounce">
              🌈 超激レア！！！奇跡の排出！！！ 🌈
            </p>
          )}
        </div>
      )}

      {/* キャラ図鑑 */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 space-y-2">
        <h4 className="text-[11px] font-black text-slate-600 dark:text-slate-300">
          📚 うんちキャラ図鑑　<span className="text-amber-600 dark:text-amber-400">{charCount}/{totalChars}</span>
          <span className="text-[9px] font-bold text-slate-400 ml-1">（収集+{CHAR_BONUS * 100}%/種）</span>
        </h4>
        {GACHA_RATES.map((r) => {
          const chars = GACHA_CHARS.filter((c) => c.rarity === r.id);
          return (
            <div key={r.id}>
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 mt-1 mb-0.5">
                {r.emoji} {r.name}（{r.label}）
              </p>
              <div className="grid grid-cols-2 gap-1">
                {chars.map((c) => {
                  const owned = c.type === 'skin' ? s.unlockedSkins.includes(c.skin) : s.gachaChars.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      className={`rounded-lg border px-2 py-1.5 flex items-center gap-1.5 ${CHAR_CARD_STYLE[c.rarity]} ${
                        owned ? '' : 'opacity-50'
                      }`}
                    >
                      <span className={`text-base ${owned ? '' : 'grayscale'}`}>{owned ? c.emoji : '❓'}</span>
                      <div className="min-w-0">
                        <p
                          className={`text-[10px] font-black truncate ${
                            owned ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        >
                          {owned ? c.name : '？？？？？'}
                        </p>
                        <p className="text-[8px] text-slate-400 dark:text-slate-500 truncate">
                          {owned ? c.desc : c.type === 'skin' ? 'ガチャ限定スキン' : '未排出'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
