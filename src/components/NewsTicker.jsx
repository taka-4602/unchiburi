import { useMemo } from 'react';
import { NEWS_STATIC } from '../game/data';
import { useSlow } from '../hooks';
import { fmt } from '../game/format';

export default function NewsTicker() {
  const s = useSlow();

  // 静的ニュース + 動的ニュースをミックス
  const messages = useMemo(() => {
    const dynamic = [];
    if (s.totalScore > 0) dynamic.push(`当スタジオの累計うんち生産量が${fmt(s.totalScore)} BPを突破`);
    if (s.totalClicks >= 1000) dynamic.push(`「1日1万タップ」の猛者現る、医師も驚愕`);
    if (s.fliesPopped > 0) dynamic.push(`ハエ被害届出${s.fliesPopped}件、当局は「美味しい貯金」と擁護`);
    if (s.goldenCaught > 0) dynamic.push(`黄金うんちの目撃${s.goldenCaught}件目、専門家も追尾困難`);
    if (s.prestigeCount > 0) dynamic.push(`${s.prestigeCount}度目の腸界転生を確認、魂の行方は不明`);
    if (s.laxActive) dynamic.push(`【緊急速報】下剤の効果で世界のうんち供給が異常増加中`);
    if (s.gachaPulls >= 100) dynamic.push(`うんちガチャ場に長蛇の列、累計排出${fmt(s.gachaPulls)}個を突破`);
    if (s.urCount > 0) dynamic.push(`【号外】伝説の大便玉の排出を確認！警察が実物鑑定へ`);
    if (s.souls > 0) dynamic.push(`ゴールデンソウル相場、${s.souls} GS保有者は「億ソウ長者」に`);

    // ステータスをシードにして決定的に選出（再描画でチラつかない）
    const seed = Math.floor(s.totalScore) + s.totalClicks * 31 + s.prestigeCount * 101;
    const picked = [];
    const pool = [...NEWS_STATIC];
    for (let i = 0; i < 8 && pool.length; i++) {
      const idx = Math.abs(seed * 2654435761 + i * 40503) % pool.length;
      picked.push(pool.splice(idx, 1)[0]);
    }
    return [...dynamic, ...picked];
  }, [s.totalScore, s.totalClicks, s.fliesPopped, s.goldenCaught, s.prestigeCount, s.laxActive, s.souls, s.gachaPulls, s.urCount]);

  const items = [...messages, ...messages]; // ループ用に2周分

  return (
    <div className="w-full bg-amber-50/90 dark:bg-slate-900/80 border-b border-amber-200 dark:border-amber-500/30 overflow-hidden py-1 relative z-30">
      <div className="flex items-center">
        <span className="flex-shrink-0 bg-amber-500 dark:bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 mx-2 rounded">
          📰 トイレ新聞
        </span>
        <div className="overflow-hidden flex-grow">
          <div className="marquee-inner text-[11px] font-bold text-amber-800 dark:text-amber-300">
            {items.map((m, i) => (
              <span key={i} className="mx-6">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
