import { sound } from '../game/audio';

export default function FortuneModal({ fortune, onClose }) {
  if (!fortune) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-pink-200 dark:border-pink-500/40 transform transition-all text-center space-y-4 animate-squish">
        <div className="text-5xl filter drop-shadow">🔮</div>
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">本日の便通診断＆うんち占い</h3>
        <div className="bg-pink-50 dark:bg-pink-950/40 p-4 rounded-2xl border border-pink-200 dark:border-pink-500/30 text-left space-y-2 text-xs">
          <div className="text-sm font-black text-pink-700 dark:text-pink-300">{fortune.rank}</div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-bold">{fortune.msg}</p>
          <div className="bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-pink-100 dark:border-pink-500/20 mt-2">
            <span className="text-pink-600 dark:text-pink-400 font-black">🌱 本日の腸活アドバイス:</span>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">{fortune.tip}</p>
          </div>
        </div>
        <button
          onClick={() => {
            sound.playPlop();
            onClose();
          }}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-extrabold py-3 rounded-2xl shadow-lg transition active:scale-95"
        >
          スッキリ確認した！
        </button>
      </div>
    </div>
  );
}
