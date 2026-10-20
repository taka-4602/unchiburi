import { useFast } from '../hooks';
import { fmt } from '../game/format';
import { PRESTIGE } from '../game/data';

export default function StatsBar() {
  const f = useFast();

  return (
    <div className="w-full text-center space-y-1 mb-2">
      <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-slate-800/80 px-4 py-1.5 rounded-full border border-amber-200 dark:border-amber-500/40 shadow-inner dark:shadow-[0_0_15px_rgba(251,191,36,0.1)]">
        <span className="text-xl">💩</span>
        <span className="text-3xl md:text-4xl font-black text-amber-900 dark:text-amber-300 tracking-wider">
          {fmt(f.score)}
        </span>
        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">BP (ぶりP)</span>
      </div>
      <div className="flex justify-center gap-4 text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 pt-1">
        <span className="flex items-center gap-1">
          <i className="fa-solid fa-bolt text-yellow-500"></i> クリック力:{' '}
          <span className="text-slate-800 dark:text-slate-100 font-extrabold">{fmt(f.clickPower)}</span> BP
        </span>
        <span className="flex items-center gap-1" title={f.drainRate > 0 ? `ハエが-${Math.round(f.drainRate * 100)}%吸収中` : undefined}>
          <i className="fa-solid fa-clock text-sky-500"></i> 秒産:{' '}
          <span className="text-slate-800 dark:text-slate-100 font-extrabold">
            {f.effectiveBps < 1000 ? f.effectiveBps.toFixed(1) : fmt(f.effectiveBps)}
          </span>{' '}
          BP/秒
        </span>
        {f.waterMult > 1 && (
          <span className="flex items-center gap-1" title="実績による水分量ボーナス">
            <i className="fa-solid fa-droplet text-sky-400"></i>
            <span className="text-sky-600 dark:text-sky-300 font-extrabold">×{f.waterMult.toFixed(2)}</span>
          </span>
        )}
        {f.souls > 0 && (
          <span className="flex items-center gap-1" title={`${PRESTIGE.soulName}による倍率`}>
            <i className="fa-solid fa-star text-amber-400"></i>
            <span className="text-amber-600 dark:text-amber-300 font-extrabold">
              ×{f.soulMult.toFixed(2)}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
