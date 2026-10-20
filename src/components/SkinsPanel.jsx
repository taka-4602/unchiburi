import { SKIN_DATA } from '../game/data';
import { selectSkin, showToast } from '../game/engine';
import { useSlow } from '../hooks';
import { fmt } from '../game/format';

export default function SkinsPanel() {
  const s = useSlow();

  return (
    <div className="flex-grow flex flex-col space-y-3 overflow-y-auto max-h-[520px] pr-1">
      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200 dark:border-amber-500/30">
        💡 解放したうんちはタップしてメイン見た目を変更できます！スキンごとに特殊クリック倍率が付与されます。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SKIN_DATA.map((skin) => {
          const isUnlocked = s.unlockedSkins.includes(skin.id);
          const isSelected = s.currentSkin === skin.id;

          return (
            <div
              key={skin.id}
              className={`p-3 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30 shadow-md ring-2 ring-pink-300 dark:ring-pink-500/50'
                  : isUnlocked
                    ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-amber-300 dark:hover:border-amber-500/50'
                    : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 opacity-60'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-2xl">{skin.emoji}</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isSelected ? '装着中' : isUnlocked ? '解放済' : skin.gacha ? '🎰 ガチャ限定' : `必要: ${fmt(skin.req)}BP`}
                  </span>
                </div>
                <h4 className="font-black text-slate-800 dark:text-slate-100 text-xs mt-1">{skin.name}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isUnlocked ? skin.desc : '？？？？？'}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-[11px] font-extrabold">
                <span className="text-pink-600 dark:text-pink-400">倍率: ×{skin.mult}</span>
                {isUnlocked && !isSelected && (
                  <button
                    onClick={() => {
                      selectSkin(skin.id);
                      showToast(`スキンを「${skin.name}」に変更！`, '🎨');
                    }}
                    className="text-xs bg-sky-500 hover:bg-sky-600 text-white px-2.5 py-1 rounded-lg"
                  >
                    選択
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
