import { useState } from 'react';
import { sound } from '../game/audio';

export default function Header({ onOpenFortune }) {
  const [muted, setMuted] = useState(false);
  const [bgmOn, setBgmOn] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleSound = () => {
    sound.init();
    sound.isMuted = !sound.isMuted;
    setMuted(sound.isMuted);
    if (!sound.isMuted) sound.playBuri(1.0);
  };

  const toggleBgm = () => {
    const playing = sound.toggleBgm();
    setBgmOn(playing);
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('UNCHI_BURI_THEME', next ? 'dark' : 'light');
    } catch {}
    sound.playPlop();
  };

  return (
    <header className="w-full bg-white/90 dark:bg-slate-950/85 backdrop-blur-md border-b-4 border-sky-200 dark:border-sky-500/30 sticky top-0 z-40 px-4 py-2.5 shadow-sm dark:shadow-[0_0_20px_rgba(56,189,248,0.15)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-3xl filter drop-shadow">🚽</span>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold text-sky-800 dark:text-sky-300 tracking-tight flex items-center gap-1">
              UNCHI BURI STUDIO
              <span className="text-xs bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full ml-1">PRO</span>
            </h1>
            <p className="text-[10px] md:text-xs text-sky-600 dark:text-sky-400 font-semibold">世界最高峰の快便＆ぶりぶり空間</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 border border-indigo-300 dark:border-indigo-500/40"
            title="テーマ切替"
          >
            <i className={`fa-solid ${dark ? 'fa-sun' : 'fa-moon'}`}></i>
            <span className="hidden sm:inline">{dark ? 'ライト' : 'ダーク'}</span>
          </button>

          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 bg-sky-100 hover:bg-sky-200 dark:bg-sky-950 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 border border-sky-300 dark:border-sky-500/40"
          >
            <i className={`fa-solid ${muted ? 'fa-volume-xmark text-rose-500' : 'fa-volume-high'}`}></i>
            <span className="hidden sm:inline">サウンド: {muted ? 'OFF' : 'ON'}</span>
          </button>

          <button
            onClick={toggleBgm}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition active:scale-95 border ${
              bgmOn
                ? 'bg-amber-300 text-amber-950 border-amber-400'
                : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
            }`}
          >
            <i className="fa-solid fa-music"></i>
            <span className="hidden sm:inline">おならBGM</span>
          </button>

          <button
            onClick={onOpenFortune}
            className="bg-gradient-to-r from-pink-400 to-rose-400 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-md hover:shadow-lg dark:shadow-[0_0_15px_rgba(244,114,182,0.4)] transition active:scale-95 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>便通診断</span>
          </button>
        </div>
      </div>
    </header>
  );
}
