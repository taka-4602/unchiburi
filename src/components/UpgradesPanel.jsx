import { UPGRADE_DATA, LAX } from '../game/data';
import { buyUpgrade, getUpgradeCost, buyLaxative, toggleLax } from '../game/engine';
import { useFast, useSlow } from '../hooks';
import { fmt } from '../game/format';

export default function UpgradesPanel() {
  const f = useFast();
  const s = useSlow();

  return (
    <div className="flex-grow flex flex-col space-y-2.5 overflow-y-auto max-h-[520px] pr-1">
      {UPGRADE_DATA.map((u) => {
        const cost = getUpgradeCost(u);
        const lvl = s.upgrades[u.id] || 0;
        const affordable = f.score >= cost;

        return (
          <div
            key={u.id}
            className="bg-white dark:bg-slate-800/60 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between hover:border-sky-300 dark:hover:border-sky-500/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xl flex-shrink-0">
                <i className={`fa-solid ${u.icon}`}></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm">{u.name}</h4>
                  <span className="text-[11px] font-black bg-sky-200 dark:bg-sky-900 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded-full">
                    Lv.{lvl}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold">{u.desc}</p>
                <div className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  +{u.bps} BP/秒
                </div>
              </div>
            </div>
            <button
              onClick={() => buyUpgrade(u)}
              disabled={!affordable}
              className={`bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-black px-3.5 py-2 rounded-xl text-xs shadow transition active:scale-95 flex-shrink-0 ${
                affordable ? '' : 'opacity-50 pointer-events-none'
              }`}
            >
              {fmt(cost)} BP
            </button>
          </div>
        );
      })}

      {/* 禁断の下剤（グランマポカリプス相当） */}
      {(s.laxUnlocked || s.totalScore >= LAX.unlockAt) && (
        <div className="bg-purple-50 dark:bg-purple-950/40 p-3 rounded-2xl border-2 border-dashed border-purple-400 dark:border-purple-600/60 shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xl flex-shrink-0">
              💊
            </div>
            <div className="flex-grow">
              <h4 className="font-black text-purple-800 dark:text-purple-300 text-sm">
                {s.laxUnlocked ? '下剤の乱用（服用中）' : '？？？ 禁断の下剤'}
              </h4>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">
                {s.laxUnlocked
                  ? `全生産+${Math.round((LAX.prodMult - 1) * 100)}%。ただし呪いうんちが現れ、ハエも繁殖しやすくなる。整腸剤で中和可能。`
                  : '飲めば全生産+25%…だが何かが変わり始める。呪いに要注意。'}
              </p>
            </div>
            {s.laxUnlocked ? (
              <button
                onClick={toggleLax}
                className={`font-black px-3.5 py-2 rounded-xl text-xs shadow transition active:scale-95 flex-shrink-0 ${
                  s.laxActive
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {s.laxActive ? '🌿 整腸剤で中和' : '💊 再び飲む'}
              </button>
            ) : (
              <button
                onClick={buyLaxative}
                disabled={f.score < LAX.cost}
                className={`bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black px-3.5 py-2 rounded-xl text-xs shadow transition active:scale-95 flex-shrink-0 ${
                  f.score >= LAX.cost ? '' : 'opacity-50 pointer-events-none'
                }`}
              >
                {fmt(LAX.cost)} BP
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
