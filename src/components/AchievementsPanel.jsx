import { ACHIEVEMENT_DATA, WATER_PER_ACH } from '../game/data';
import { useSlow } from '../hooks';

export default function AchievementsPanel() {
  const s = useSlow();
  const unlocked = s.achievements.length;
  const total = ACHIEVEMENT_DATA.length;
  const waterPct = Math.round(unlocked * WATER_PER_ACH * 100);

  return (
    <div className="flex-grow flex flex-col space-y-3 overflow-y-auto max-h-[520px] pr-1">
      {/* 水分量ゲージ */}
      <div className="bg-sky-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-sky-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-1.5">
          <h4 className="font-black text-sky-900 dark:text-sky-300 text-sm flex items-center gap-1.5">
            💧 水分量
          </h4>
          <span className="text-xs font-black text-sky-600 dark:text-sky-400">
            {unlocked}/{total} 実績 → 全生産+{waterPct}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(unlocked / total) * 100}%` }}
          ></div>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
          実績1つにつき全生産・クリック力が +{Math.round(WATER_PER_ACH * 100)}% ずつ潤います。
        </p>
      </div>

      {/* 実績一覧 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ACHIEVEMENT_DATA.map((a) => {
          const done = s.achievements.includes(a.id);
          return (
            <div
              key={a.id}
              className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                done
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-500/60 dark:shadow-[0_0_15px_rgba(251,191,36,0.15)]'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 opacity-50'
              }`}
              title={done ? a.desc : `${a.desc}（未達成）`}
            >
              <div className={`text-2xl ${done ? '' : 'grayscale'}`}>{a.emoji}</div>
              <div className={`text-[11px] font-black mt-1 ${done ? 'text-amber-800 dark:text-amber-300' : 'text-slate-500 dark:text-slate-500'}`}>
                {a.name}
              </div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">{a.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
