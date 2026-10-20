import { useRef, useState } from 'react';
import { click, flush, getSkin, popFly, grabGolden } from '../game/engine';
import { useFast, useSlow } from '../hooks';
import { sound } from '../game/audio';
import { BURI_WORDS } from '../game/data';
import { fmt } from '../game/format';
import StatsBar from './StatsBar';
import FeverBar from './FeverBar';

// ハエの配置（便座周辺を円周上に6カ所）
const FLY_SPOTS = [
  { left: '12%', top: '18%' },
  { left: '82%', top: '15%' },
  { left: '88%', top: '58%' },
  { left: '72%', top: '85%' },
  { left: '18%', top: '78%' },
  { left: '6%', top: '50%' },
];

export default function ClickerStage() {
  const f = useFast();
  useSlow(); // スキン変更時の再描画用
  const skin = getSkin();

  const poopRef = useRef(null);
  const svgRef = useRef(null);
  const particleRef = useRef(null);
  const waterRef = useRef(null);
  const [flushing, setFlushing] = useState(false);

  // クリック位置の「+N ぶりっ！」浮き上がりテキスト
  const spawnClickParticle = (x, y, text) => {
    const el = document.createElement('div');
    el.className =
      'absolute text-base md:text-xl font-black text-amber-700 dark:text-amber-300 pointer-events-none animate-float select-none z-30 drop-shadow';
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    particleRef.current.appendChild(el);
    setTimeout(() => el.remove(), 800);
  };

  // ミニうんち飛び散り
  const spawnMiniSplash = (x, y) => {
    const count = 5 + Math.floor(Math.random() * 4);
    const emojis = ['💩', '✨', '💨', '🌟'];
    for (let i = 0; i < count; i++) {
      const mini = document.createElement('div');
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 80;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      mini.className = 'absolute text-sm pointer-events-none transition-all duration-500 z-20';
      mini.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      mini.style.left = `${x}px`;
      mini.style.top = `${y}px`;
      mini.style.transform = 'translate(0, 0) scale(1)';
      particleRef.current.appendChild(mini);

      requestAnimationFrame(() => {
        mini.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
        mini.style.opacity = '0';
      });
      setTimeout(() => mini.remove(), 550);
    }
  };

  // ぷにぷに顔リアクション（お口を「O」に）
  const animateFace = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const mouth = svg.querySelector('#poopMouth');
    const eyeL = svg.querySelector('#eyeLeft');
    const eyeR = svg.querySelector('#eyeRight');
    if (!mouth) return;
    mouth.setAttribute('d', 'M 94,128 A 6,6 0 1,0 106,128 A 6,6 0 1,0 94,128');
    eyeL.setAttribute('r', '9');
    eyeR.setAttribute('r', '9');
    setTimeout(() => {
      mouth.setAttribute('d', 'M 92,126 Q 100,135 108,126');
      eyeL.setAttribute('r', '7');
      eyeR.setAttribute('r', '7');
    }, 160);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const power = click();

    // ぷにぷにアニメーション再トリガー
    const el = poopRef.current;
    el.classList.remove('animate-squish');
    void el.offsetWidth;
    el.classList.add('animate-squish');
    animateFace();

    // クリック位置にパーティクル
    const rect = particleRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;
    const text = `+${fmt(power)} ${BURI_WORDS[Math.floor(Math.random() * BURI_WORDS.length)]}`;
    spawnClickParticle(x, y, text);
    spawnMiniSplash(x + 20, y + 20);
  };

  const handleFlush = () => {
    if (flushing) return;
    flush();
    setFlushing(true);
    waterRef.current?.classList.add('scale-75', 'opacity-30');
    setTimeout(() => {
      waterRef.current?.classList.remove('scale-75', 'opacity-30');
      sound.playPlop();
    }, 1200);
    setTimeout(() => setFlushing(false), 1600);
  };

  return (
    <section
      className={`lg:col-span-7 flex flex-col items-center justify-between bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-xl dark:shadow-[0_0_30px_rgba(56,189,248,0.08)] border-4 border-sky-100 dark:border-sky-500/25 relative overflow-hidden ${
        f.isFever ? 'fever-mode' : ''
      }`}
    >
      <StatsBar />
      <FeverBar />

      {/* バフ/デバフ表示 */}
      {(f.clickFrenzyRemain > 0 || f.prodDebuffRemain > 0 || f.clickDebuffRemain > 0 || f.drainRate > 0) && (
        <div className="flex flex-wrap justify-center gap-1.5 text-[10px] font-black">
          {f.clickFrenzyRemain > 0 && (
            <span className="bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-full animate-pulse">
              ⚡ クリック×7 残り{Math.ceil(f.clickFrenzyRemain)}秒
            </span>
          )}
          {f.prodDebuffRemain > 0 && (
            <span className="bg-purple-700 text-white px-2 py-0.5 rounded-full">
              💀 生産-50% 残り{Math.ceil(f.prodDebuffRemain)}秒
            </span>
          )}
          {f.clickDebuffRemain > 0 && (
            <span className="bg-purple-700 text-white px-2 py-0.5 rounded-full">
              💀 腹痛 残り{Math.ceil(f.clickDebuffRemain)}秒
            </span>
          )}
          {f.drainRate > 0 && (
            <span className="bg-slate-700 dark:bg-slate-600 text-white px-2 py-0.5 rounded-full">
              🪰 ハエに-{Math.round(f.drainRate * 100)}%吸収中
            </span>
          )}
        </div>
      )}

      {/* トイレ型クリッカーメイン舞台 */}
      <div className="relative w-full flex-grow flex items-center justify-center my-4 min-h-[300px] select-none">
        {/* 便座の土台 */}
        <div className="absolute w-72 h-80 md:w-88 md:h-96 rounded-[50%/60%] bg-white dark:bg-slate-800 border-8 border-sky-200 dark:border-sky-600/50 shadow-2xl dark:shadow-[0_0_40px_rgba(56,189,248,0.2)] flex items-center justify-center pointer-events-none">
          <div
            ref={waterRef}
            className="w-52 h-60 md:w-64 md:h-72 rounded-[50%/60%] bg-gradient-to-b from-sky-300 to-sky-400 dark:from-sky-500 dark:to-blue-600 shadow-inner opacity-90 transition-all duration-300 flex items-center justify-center"
          >
            <div className="w-40 h-44 border-2 border-white/40 rounded-full animate-ping opacity-25"></div>
          </div>
        </div>

        {/* 巨大うんちキャラクター */}
        <div
          ref={poopRef}
          onPointerDown={handleClick}
          className="relative z-10 cursor-pointer transition-transform transform active:scale-95 duration-75 select-none"
          style={{ touchAction: 'none' }}
        >
          <svg
            ref={svgRef}
            className={`w-48 h-48 md:w-56 md:h-56 filter drop-shadow-xl ${
              skin.id === 'rainbow' ? 'animate-rainbow' : skin.id === 'legend' ? 'animate-wobble' : ''
            }`}
            viewBox="0 0 200 200"
          >
            <defs>
              <linearGradient id="poopGradDefault" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ab6938" />
                <stop offset="50%" stopColor="#8b4513" />
                <stop offset="100%" stopColor="#5a2c0c" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff59d" />
                <stop offset="50%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#b8860b" />
              </linearGradient>
              <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7675" />
                <stop offset="25%" stopColor="#ffeaa7" />
                <stop offset="50%" stopColor="#55efc4" />
                <stop offset="75%" stopColor="#74b9ff" />
                <stop offset="100%" stopColor="#a29bfe" />
              </linearGradient>
              <linearGradient id="bananaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
              <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="50%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="legendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5d0fe" />
                <stop offset="50%" stopColor="#c026d3" />
                <stop offset="100%" stopColor="#581c87" />
              </linearGradient>
            </defs>

            {/* うんちの本体シェイプ */}
            <g>
              <ellipse cx="100" cy="155" rx="65" ry="28" fill={skin.fill} />
              <ellipse cx="100" cy="120" rx="52" ry="24" fill={skin.fill} />
              <ellipse cx="100" cy="85" rx="38" ry="20" fill={skin.fill} />
              <path d="M 85,85 C 85,60 110,40 120,42 C 128,43 130,55 110,65 Z" fill={skin.fill} />
            </g>

            {/* つや（ハイライト） */}
            <path d="M 70,80 C 65,95 72,105 76,95 C 80,85 75,75 70,80 Z" fill="#ffffff" opacity="0.35" />
            <path d="M 55,120 C 50,135 60,145 64,135 C 68,125 60,115 55,120 Z" fill="#ffffff" opacity="0.35" />

            {/* 顔（下剤モード中は目が赤く侵食される） */}
            <g>
              <circle id="eyeLeft" cx="80" cy="115" r="7" fill={f.laxActive ? '#dc2626' : '#1e293b'} />
              <circle id="eyeRight" cx="120" cy="115" r="7" fill={f.laxActive ? '#dc2626' : '#1e293b'} />
              <circle cx="78" cy="112" r="2.5" fill="#ffffff" />
              <circle cx="118" cy="112" r="2.5" fill="#ffffff" />
              <circle cx="68" cy="125" r="5" fill="#f43f5e" opacity="0.4" />
              <circle cx="132" cy="125" r="5" fill="#f43f5e" opacity="0.4" />
              <path
                id="poopMouth"
                d="M 92,126 Q 100,135 108,126"
                stroke="#1e293b"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </svg>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-950/80 dark:bg-amber-400/90 dark:text-amber-950 text-white font-extrabold text-[11px] px-3 py-0.5 rounded-full shadow pointer-events-none whitespace-nowrap animate-bounce">
            連打してぶりぶり！
          </div>
        </div>

        {/* ハエ（BPSを吸い続ける、タップでパチンと潰して利息つき回収） */}
        {f.flies.map((fly, i) => {
          const spot = FLY_SPOTS[i % FLY_SPOTS.length];
          return (
            <button
              key={fly.id}
              onPointerDown={(e) => {
                e.stopPropagation();
                popFly(fly.id);
              }}
              className="absolute z-30 text-2xl md:text-3xl fly-bob cursor-pointer transition-transform hover:scale-125 active:scale-90"
              style={{ left: spot.left, top: spot.top, animationDelay: `${i * 0.35}s` }}
              title={`吸い取り中: ${fmt(fly.sucked)} BP（タップで回収×1.1）`}
            >
              🪰
            </button>
          );
        })}

        {/* ゴールデンうんち（期間限定・タップでランダム効果） */}
        {f.golden.active && (
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              grabGolden();
            }}
            className="absolute z-30 text-5xl golden-pulse cursor-pointer"
            style={{ left: `${f.golden.x}%`, top: `${f.golden.y}%` }}
            title={`レアうんち！残り${Math.ceil(f.golden.remain)}秒`}
          >
            💩
          </button>
        )}

        {/* クリックエフェクト表示コンテナ */}
        <div ref={particleRef} className="absolute inset-0 pointer-events-none overflow-hidden z-20"></div>

        {/* 水洗フラッシュ用オーバーレイ */}
        {flushing && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
            <div className="w-96 h-96 rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-cyan-300 opacity-90 water-swirl flex items-center justify-center">
              <span className="text-white font-black text-2xl tracking-widest drop-shadow-lg">ジャーーーッ！</span>
            </div>
          </div>
        )}
      </div>

      {/* アクションバー */}
      <div className="w-full flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">水流パワー:</span>
          <span className="text-xs bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-extrabold px-2.5 py-1 rounded-lg border dark:border-sky-500/30">
            蓄積: {fmt(f.flushBonus)} 💩
          </span>
        </div>

        <button
          onClick={handleFlush}
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black px-5 py-2.5 rounded-2xl shadow-md hover:shadow-lg dark:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all active:scale-95 flex items-center gap-2 text-sm border-2 border-sky-300 dark:border-sky-400/50"
        >
          <i className="fa-solid fa-water"></i>
          <span>トイレを流す！(大)</span>
        </button>
      </div>
    </section>
  );
}
