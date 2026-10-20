import { useEffect, useState } from 'react';
import { PRESTIGE } from '../game/data';
import { prestige } from '../game/engine';
import { useFast, useSlow } from '../hooks';
import { fmt } from '../game/format';

export default function PrestigePanel() {
  const f = useFast();
  const s = useSlow();
  const [confirming, setConfirming] = useState(false);

  const pending = f.pendingSouls;
  const canPrestige = pending >= PRESTIGE.minSouls;
  // 次のソウル獲得に必要な累計BP
  const nextSoulAt = Math.pow(s.totalSouls + pending + 1, 2) * PRESTIGE.soulDivisor;

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  const handlePrestige = () => {
    if (!canPrestige) return;
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    prestige();
  };

  const bonusPct = Math.round(PRESTIGE.soulBonusPer * 100);

  return (
    <div className="flex-grow flex flex-col space-y-3 overflow-y-auto max-h-[520px] pr-1">
      {/* 現在のソウル */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/50 dark:to-yellow-950/40 rounded-2xl p-4 border-2 border-amber-300 dark:border-amber-500/40 text-center space-y-1 dark:shadow-[0_0_25px_rgba(251,191,36,0.12)]">
        <div className="text-4xl">🌟</div>
        <div className="text-3xl font-black text-amber-700 dark:text-amber-300">
          {fmt(s.souls)} <span className="text-sm">{PRESTIGE.soulUnit}</span>
        </div>
        <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{PRESTIGE.soulName}</p>
        <div className="inline-block bg-white/70 dark:bg-slate-800/70 rounded-full px-3 py-1 text-xs font-black text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
          全生産・クリック <span className="text-emerald-600 dark:text-emerald-400">×{f.soulMult.toFixed(2)}</span>
        </div>
      </div>

      {/* 転生で得られるソウル */}
      <div className="bg-sky-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-sky-200 dark:border-slate-700 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-600 dark:text-slate-300">転生で獲得予定:</span>
          <span className={`font-black text-lg ${canPrestige ? 'text-amber-600 dark:text-amber-300' : 'text-slate-400 dark:text-slate-600'}`}>
            +{fmt(pending)} {PRESTIGE.soulUnit}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          累計 <span className="font-black text-slate-700 dark:text-slate-200">{fmt(s.totalScore)} BP</span> をぶりぶりすると転生可能。
          次の{PRESTIGE.soulUnit}まであと <span className="font-black text-sky-600 dark:text-sky-400">{fmt(Math.max(0, nextSoulAt - s.totalScore))} BP</span>
        </div>
      </div>

      {/* 転生の説明 */}
      <div className="bg-rose-50 dark:bg-rose-950/30 rounded-2xl p-3 border border-rose-200 dark:border-rose-500/30 text-[11px] text-rose-700 dark:text-rose-300 space-y-1.5 font-bold">
        <p>🚽 <span className="font-black">腸界転生とは？</span></p>
        <p>すべてのBPと腸内開発をリセットし、その代わりに{PRESTIGE.soulName}を獲得します。</p>
        <p>{PRESTIGE.soulUnit} 1個につき、全生産量とクリック力が <span className="font-black">+{bonusPct}%</span> 永久アップ！</p>
        <p className="text-rose-500 dark:text-rose-400">※ うんち図鑑・累計統計は引き継がれます</p>
      </div>

      {/* 転生ボタン（2段階確認） */}
      <button
        onClick={handlePrestige}
        disabled={!canPrestige}
        className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 border-2 ${
          !canPrestige
            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-300 dark:border-slate-700 cursor-not-allowed'
            : confirming
              ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white border-rose-300 animate-pulse shadow-lg dark:shadow-[0_0_25px_rgba(244,63,94,0.4)]'
              : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 border-amber-300 shadow-lg dark:shadow-[0_0_25px_rgba(251,191,36,0.3)]'
        }`}
      >
        {!canPrestige
          ? '🔒 まだ転生できません'
          : confirming
            ? `⚠️ 本当に転生？ +${fmt(pending)} ${PRESTIGE.soulUnit} を得る（再タップで確定）`
            : `🌟 腸界転生する（+${fmt(pending)} ${PRESTIGE.soulUnit}）`}
      </button>

      {/* 転生履歴 */}
      {s.prestigeCount > 0 && (
        <div className="text-center text-xs font-bold text-slate-500 dark:text-slate-400">
          転生回数: <span className="text-amber-600 dark:text-amber-300 font-black">{s.prestigeCount}回</span>
          　累計獲得: <span className="text-amber-600 dark:text-amber-300 font-black">{fmt(s.totalSouls)} {PRESTIGE.soulUnit}</span>
        </div>
      )}
    </div>
  );
}
