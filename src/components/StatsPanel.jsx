import { useEffect, useRef, useState } from 'react';
import { resetAll, showToast } from '../game/engine';
import { exportSave, parseSaveFile, applySave } from '../game/migration';
import { useSlow } from '../hooks';
import { fmt } from '../game/format';
import { PRESTIGE } from '../game/data';

export default function StatsPanel() {
  const s = useSlow();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  const rows = [
    ['累計ぶりぶり生成量', `${fmt(s.totalScore)} BP`],
    ['総タップ数', `${fmt(s.totalClicks)} 回`],
    ['トイレ水洗回数', `${fmt(s.flushCount)} 回`],
    ['フィーバー突入回数', `${fmt(s.feverCount)} 回`],
    ['腸界転生回数', `${fmt(s.prestigeCount)} 回`],
    [`累計${PRESTIGE.soulName}`, `${fmt(s.totalSouls)} ${PRESTIGE.soulUnit}`],
    ['ハエ撃退数', `${fmt(s.fliesPopped)} 匹`],
    ['レアうんち捕獲数', `${fmt(s.goldenCaught)} 回`],
    ['ガチャ排出数', `${fmt(s.gachaPulls)} 回`],
    ['キャラ収集数', `${fmt(s.gachaChars.length)} 種`],
    ['UR排出数', `${fmt(s.urCount)} 個`],
    ['実績解除数', `${s.achievements.length} 個`],
  ];

  const handleExport = () => {
    exportSave();
    showToast('セーブをダウンロードしました！', '💾');
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const text = await file.text();
    const res = parseSaveFile(text);
    if (!res.ok) {
      showToast('セーブファイルが読めません（破損または改ざん）', '⚠️');
      return;
    }
    setPending(res.clean);
  };

  return (
    <div className="flex-grow flex flex-col space-y-3 overflow-y-auto max-h-[520px] pr-1">
      <div className="bg-sky-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-sky-200 dark:border-slate-700 space-y-2 text-xs">
        <h4 className="font-black text-sky-900 dark:text-sky-300 text-sm flex items-center gap-1.5">
          <i className="fa-solid fa-clipboard-list"></i> プレイ戦績
        </h4>
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={`flex justify-between py-1 ${i < rows.length - 1 ? 'border-b border-sky-100 dark:border-slate-700/60' : ''}`}
          >
            <span className="text-slate-600 dark:text-slate-400">{label}:</span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{value}</span>
          </div>
        ))}
      </div>

      {/* データ移行 */}
      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-xs space-y-2">
        <h4 className="font-black text-emerald-800 dark:text-emerald-300">💾 データ移行</h4>
        <p className="text-emerald-600 dark:text-emerald-400">
          セーブをファイルにダウンロードして、別端末や別バージョンへお引っ越しできます。
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <i className="fa-solid fa-download"></i>ダウンロード
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <i className="fa-solid fa-upload"></i>復元
          </button>
        </div>
        <input ref={fileRef} type="file" accept=".unchi,.txt" className="hidden" onChange={handleFile} />

        {pending && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 rounded-xl p-2.5 space-y-2">
            <p className="text-amber-700 dark:text-amber-300 font-bold">
              読み込んだセーブで現在のデータを上書きします。よろしいですか？
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => applySave(pending)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 rounded-lg transition active:scale-95"
              >
                上書き復元する
              </button>
              <button
                onClick={() => setPending(null)}
                className="px-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-1.5 rounded-lg transition active:scale-95"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 rounded-2xl text-xs space-y-2">
        <h4 className="font-black text-rose-800 dark:text-rose-300">⚠️ データ管理</h4>
        <p className="text-rose-600 dark:text-rose-400">ゲームデータはブラウザのLocalStorageに自動保存されています。</p>
        <button
          onClick={() => {
            if (!confirming) {
              setConfirming(true);
              return;
            }
            resetAll();
          }}
          className={`w-full font-bold py-2 rounded-xl transition active:scale-95 text-white ${
            confirming ? 'bg-red-600 animate-pulse' : 'bg-rose-500 hover:bg-rose-600'
          }`}
        >
          {confirming ? '本当に全消去？再タップで確定' : '全データをリセットして最初から'}
        </button>
      </div>
    </div>
  );
}
