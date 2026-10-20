import { useFast } from '../hooks';

export default function FeverBar() {
  const f = useFast();

  return (
    <div className="w-full max-w-md px-2 my-2">
      <div className="flex justify-between items-center text-xs font-black mb-1">
        <span className="flex items-center gap-1 text-pink-600 dark:text-pink-400">
          <i className="fa-solid fa-fire-flame-curved"></i> ぶりぶりフィーバーゲージ
        </span>
        <span className="text-pink-600 dark:text-pink-400 font-extrabold">
          {f.isFever ? `${Math.ceil(f.feverRemain)}秒` : `${Math.floor(f.feverGauge)}%`}
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full transition-all duration-150"
          style={{ width: `${f.feverGauge}%` }}
        ></div>
      </div>
      <div
        className={`text-center text-xs font-black h-4 mt-0.5 tracking-wider ${
          f.isFever ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'text-pink-600 dark:text-pink-400'
        }`}
      >
        {f.isFever ? '🔥 絶頂フィーバータイム中!! (生産力超UP!) 🔥' : '連打してゲージをMAXにしろ！'}
      </div>
    </div>
  );
}
