import { useState } from 'react';
import { GACHA, GACHA_RATES, SKIN_DATA } from '../game/data';
import { pullGacha } from '../game/engine';
import { useFast, useSlow } from '../hooks';
import { fmt } from '../game/format';

const RARITY_STYLE = {
  lose: 'border-slate-300 dark:border-slate-600',
  r: 'border-amber-500/60 bg-amber-50/50 dark:bg-amber-950/20',
  sr: 'border-sky-400 bg-sky-50/60 dark:bg-sky-950/30 shadow-md',
  ssr: 'border-yellow-400 bg-yellow-50/60 dark:bg-yellow-950/30 shadow-lg dark:shadow-[0_0_20px_rgba(251,191,36,0.25)]',
  ur: 'border-fuchsia-500 bg-gradient-to-br from-fuchsia-50 to-purple-100 dark:from-fuchsia-950/50 dark:to-purple-950/40 shadow-xl dark:shadow-[0_0_30px_rgba(217,70,239,0.4)] animate-pulse',
};

export default function GachaPanel() {
  const f = useFast();
  const s = useSlow();
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const gachaSkins = SKIN_DATA.filter((x) => x.gacha);

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

  const canPull = (n) => f.score >= GACHA.cost * n && !spinning;

  return (
    <div className="flex-grow flex flex-col space-y-3 overflow-y-auto max-h-[520px] pr-1">
      {/* ガチャ説明 */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-slate-800/70 dark:to-slate-900/60 rounded-2xl p-4 border-2 border-amber-200 dark:border-amber-500/40 text-center space-y-1">
        <div className="text-3xl">🎰💩</div>
        <h4 className="font-black text-amber-800 dark:text-amber-300">うんちガチャ</h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
          腸の奥からランダムに排出されるガチャ。<br />
          ハズレは文字通り「クソ」ですが、大量にまわせます。<br />
          <span className="text-amber-600 dark:text-amber-400">ガチャ限定スキンはここでしか手に入りません。</span>
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
            <span className="text-[10px] opacity-80">{fmt(GACHA.cost * n)} BP</span>
          </button>
        ))}
      </div>

      {/* 結果表示 */}
      {result && (
        <div className={`rounded-2xl border-2 p-3 space-y-2 transition-all ${RARITY_STYLE[result.best]}`}>
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-700 dark:text-slate-200">{result.n}連の排出結果</span>
            <span className="text-slate-500 dark:text-slate-400">回収 +{fmt(result.bpBack)} BP</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {GACHA_RATES.map((r) =>
              result.counts[r.id] > 0 ? (
                <span
                  key={r.id}
                  className={`text-[11px] font-black px-2 py-1 rounded-lg ${
                    r.id === 'lose'
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

      {/* 限定スキンラインナップ */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 space-y-2">
        <h4 className="text-[11px] font-black text-slate-600 dark:text-slate-300">✨ ガチャ限定ラインナップ</h4>
        {gachaSkins.map((skin) => {
          const owned = s.unlockedSkins.includes(skin.id);
          return (
            <div key={skin.id} className="flex items-center gap-2.5 text-xs">
              <span className={`text-xl ${owned ? '' : 'grayscale opacity-40'}`}>{skin.emoji}</span>
              <div className="flex-grow">
                <p className={`font-black ${owned ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                  {owned ? skin.name : '？？？？？'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  {skin.id === 'crystal' ? 'SSR排出で解放' : 'UR排出で解放'} / 倍率×{skin.mult}
                </p>
              </div>
              {owned && (
                <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  所持
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
