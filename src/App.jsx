import { useEffect, useState } from 'react';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';
import ClickerStage from './components/ClickerStage';
import UpgradesPanel from './components/UpgradesPanel';
import SkinsPanel from './components/SkinsPanel';
import PrestigePanel from './components/PrestigePanel';
import GachaPanel from './components/GachaPanel';
import AchievementsPanel from './components/AchievementsPanel';
import StatsPanel from './components/StatsPanel';
import FortuneModal from './components/FortuneModal';
import Toast from './components/Toast';
import { start, stop } from './game/engine';
import { FORTUNE_DATA } from './game/data';
import { sound } from './game/audio';
import { useFast } from './hooks';

// 下剤モードの侵食オーバーレイ（fast購読はここだけに閉じ込める）
function CorruptOverlay() {
  const f = useFast();
  return f.laxActive ? <div className="corrupt-overlay"></div> : null;
}

const TABS = [
  { id: 'upgrades', label: '開発', icon: 'fa-bacteria' },
  { id: 'skins', label: '図鑑', icon: 'fa-book-bookmark' },
  { id: 'prestige', label: '転生', icon: 'fa-star' },
  { id: 'gacha', label: 'ガチャ', icon: 'fa-clover' },
  { id: 'achievements', label: '実績', icon: 'fa-trophy' },
  { id: 'stats', label: '統計', icon: 'fa-chart-simple' },
];

export default function App() {
  const [tab, setTab] = useState('upgrades');
  const [fortune, setFortune] = useState(null);

  useEffect(() => {
    start();
    return stop;
  }, []);

  const openFortune = () => {
    sound.playPlop();
    setFortune(FORTUNE_DATA[Math.floor(Math.random() * FORTUNE_DATA.length)]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-800 dark:text-slate-100 antialiased overflow-x-hidden selection:bg-yellow-300">
      {/* 下剤モード：世界の侵食オーバーレイ */}
      <CorruptOverlay />

      <Header onOpenFortune={openFortune} />
      <NewsTicker />

      <main className="max-w-6xl w-full mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-grow">
        <ClickerStage />

        <section className="lg:col-span-5 flex flex-col bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm rounded-3xl p-4 shadow-xl dark:shadow-[0_0_30px_rgba(56,189,248,0.08)] border-4 border-sky-100 dark:border-sky-500/25 min-h-[500px]">
          {/* タブメニュー */}
          <div className="grid grid-cols-6 gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl mb-4 font-extrabold text-xs">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  sound.playPlop();
                }}
                className={`tab-btn py-2 rounded-xl transition ${
                  tab === t.id
                    ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-sky-300 shadow font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <i className={`fa-solid ${t.icon} mr-1`}></i>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'upgrades' && <UpgradesPanel />}
          {tab === 'skins' && <SkinsPanel />}
          {tab === 'prestige' && <PrestigePanel />}
          {tab === 'gacha' && <GachaPanel />}
          {tab === 'achievements' && <AchievementsPanel />}
          {tab === 'stats' && <StatsPanel />}
        </section>
      </main>

      <footer className="w-full bg-white/70 dark:bg-slate-950/70 border-t border-sky-200 dark:border-sky-500/20 text-center py-3 text-xs text-slate-500 dark:text-slate-400 font-bold">
        UNCHI BURI STUDIO v2 &copy; 2026 - 快便は世界を救う。
      </footer>

      <FortuneModal fortune={fortune} onClose={() => setFortune(null)} />
      <Toast />
    </div>
  );
}
