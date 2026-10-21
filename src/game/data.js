// 腸内開発（アップグレード施設）のマスター定義
export const UPGRADE_DATA = [
  { id: 'water', name: 'コップ1杯の水', cost: 15, bps: 0.5, icon: 'fa-glass-water', desc: '朝の水分補給で腸を目覚めさせる基本の快便習慣。' },
  { id: 'fiber', name: 'キャベツの食物繊維', cost: 100, bps: 3, icon: 'fa-leaf', desc: '不溶性食物繊維が便のカサをモリモリ増す！' },
  { id: 'bacteria', name: '元気な乳酸菌', cost: 600, bps: 15, icon: 'fa-virus', desc: '善玉菌のチカラで腸内フローラを満開に整える。' },
  { id: 'yogurt', name: '自家製ビフィズスヨーグルト', cost: 3500, bps: 70, icon: 'fa-bowl-rice', desc: '生きたまま腸に届く超強力善玉菌の大群！' },
  { id: 'squat', name: 'ヤンキー座り快便ステップ', cost: 18000, bps: 300, icon: 'fa-shoe-prints', desc: '直腸と肛門が一直線になり、超超超スムーズな滑走を実現。' },
  { id: 'washlet', name: 'ハイテク温水温風便座', cost: 95000, bps: 1400, icon: 'fa-toilet-paper', desc: '快適すぎてトイレから出られなくなる人類最高の発明。' },
  { id: 'megaColon', name: 'メガギガ巨大結腸ファクトリー', cost: 500000, bps: 6000, icon: 'fa-industry', desc: '全自動で毎秒すさまじい質量のうんちを連続生産する。' },
];

// うんち図鑑＆スキンマスター
export const SKIN_DATA = [
  { id: 'default', name: 'ノーマルうんち', req: 0, mult: 1, fill: 'url(#poopGradDefault)', emoji: '💩', desc: '誰もが知っている伝統的で親しみやすいうんち。' },
  { id: 'banana', name: '極上バナナうんち', req: 300, mult: 2, fill: 'url(#bananaGrad)', emoji: '🍌', desc: '匂いも少なく水分量完璧！理想的な超快便の証。' },
  { id: 'gold', name: '黄金のゴールデンうんち', req: 5000, mult: 5, fill: 'url(#goldGrad)', emoji: '✨', desc: '金運を呼び込む輝くうんち。タップ獲得量5倍！' },
  { id: 'rainbow', name: 'レインボーギャラクシーうんち', req: 50000, mult: 12, fill: 'url(#rainbowGrad)', emoji: '🌌', desc: '宇宙の神秘を宿した虹色うんち。もはや神聖な芸術。' },
  // ガチャ限定スキン（gacha: true はBP条件では解放されない）
  { id: 'crystal', name: 'クリスタルうんち', req: 0, mult: 20, fill: 'url(#crystalGrad)', emoji: '💎', gacha: true, desc: 'ガチャでしか出会えない透明感あふれる逸品。' },
  { id: 'legend', name: '伝説の大便玉', req: 0, mult: 100, fill: 'url(#legendGrad)', emoji: '🔮', gacha: true, desc: '1/10,000の確率で腸から排出される幻の秘宝。' },
];

// 便通占いデータ
export const FORTUNE_DATA = [
  { rank: '🎉 大吉（快便無双）', msg: 'するりと一本バナナ！今日のあなたの腸は絶好調。何事もスムーズに進む最高の1日になります。', tip: '海藻とオリーブオイルを料理に少しプラスすると幸運UP！' },
  { rank: '✨ 中吉（すっきり快調）', msg: '残便感ゼロ！爽快なスタートが切れます。集中力と運気が高まる予感。', tip: 'お水をこまめにコップ1杯ずつ飲むとさらに好調キープ！' },
  { rank: '👍 小吉（ややコロコロ）', msg: '少し力みが必要かも。深呼吸してお腹をのの字にマッサージしてあげましょう。', tip: '納豆やキムチなど発酵食品を食べて腸内を応援しよう！' },
  { rank: '💨 吉（おならプープー日和）', msg: '音は豪快、でも実力はこれから！リラックスしてトイレに座ればスルッと出ます。', tip: '階段を使って腸を刺激するのがラッキーアクション！' },
  { rank: '🌟 奇跡（超ゴールデンうんち）', msg: '奇跡のゴールデンうんち降臨！あなたのうんち力は宇宙レベルに到達しました。宝くじを買うといいかも？', tip: '快便の喜びに感謝しながらトイレをピカピカに磨こう！' },
];

// 腸界転生（プレステージ）設定
export const PRESTIGE = {
  soulName: 'ゴールデンソウル',
  soulUnit: 'GS',
  // 累計BPから獲得ソウル数を算出: floor(sqrt(totalScore / 25000))
  soulDivisor: 25000,
  // 1ソウルあたりの生産・クリック倍率ボーナス (+4%)
  soulBonusPer: 0.04,
  // 転生に必要な最低ソウル数
  minSouls: 1,
};

export const BURI_WORDS = ['ぶりっ！', 'プリッ！', '快便！', 'ドバッ！', 'すっきり！'];

/* ==========================================================================
   ハエ（ウィンクラー相当）：BPSを吸い続け、潰すと利息つきで返還
   ========================================================================== */
export const FLY = {
  max: 6,
  drainPer: 0.05, // 1匹あたりBPSの5%を吸う
  cap: 0.5, // 合計吸収率の上限
  popMult: 1.1, // 潰した時の利息
  spawnMin: 45, // 出現間隔（秒）
  spawnMax: 100,
  spawnMinLax: 20, // 下剤モード中は繁殖しやすい
  spawnMaxLax: 50,
};

/* ==========================================================================
   ゴールデンうんち（ゴールデンクッキー相当）
   ========================================================================== */
export const GOLDEN = {
  minDelay: 60, // 出現間隔（秒）
  maxDelay: 180,
  life: 13, // 表示時間（秒）
  clickFrenzyMult: 7, // クリックフィーバー倍率
  clickFrenzyDur: 15,
};

// ゴールデンうんちの効果（重み付き抽選）
export const GOLDEN_EFFECTS = [
  { id: 'lucky', w: 30, name: 'ラッキー快便', desc: '所持BPの15%を獲得' },
  { id: 'fever', w: 25, name: '強制フィーバー', desc: '即座にフィーバータイム突入' },
  { id: 'click', w: 20, name: 'クリックフィーバー', desc: '15秒間クリック力×7' },
  { id: 'storm', w: 25, name: 'うんちストーム', desc: 'BPS60秒分を一括獲得' },
];

// 呪いうんちの効果（下剤モード中のみ出現）
export const CURSE_EFFECTS = [
  { id: 'diarrhea', w: 30, name: '下痢！', desc: '所持BPの10%を喪失' },
  { id: 'constipate', w: 25, name: '便秘気味', desc: '30秒間生産-50%' },
  { id: 'pain', w: 25, name: '腹痛', desc: '20秒間クリック力-50%' },
  { id: 'release', w: 20, name: '宿便排出', desc: 'BPS120秒分を一括獲得' },
];

/* ==========================================================================
   下剤の乱用（グランマポカリス相当）：生産UPだが世界が侵食される
   ========================================================================== */
export const LAX = {
  cost: 500000, // 購入BP
  prodMult: 1.25,
  curseChance: 0.3, // 金色イベントが呪いに置き換わる確率
  unlockAt: 250000, // 表示解放に必要な累計BP
};

/* ==========================================================================
   うんちガチャ：全排出物はコレクション。ハズレは物理的にクソ（キャラ）
   ========================================================================== */
export const GACHA = {
  costPct: 0.005, // 1回 = 所持BPの0.5%
  costMin: 1000, // 最低コスト
};

// レート表（重み/10000）
export const GACHA_RATES = [
  { id: 'n', w: 8500, name: 'N', emoji: '💩', label: 'クソ級' },
  { id: 'r', w: 1200, name: 'R', emoji: '🥉', label: 'レア' },
  { id: 'sr', w: 250, name: 'SR', emoji: '🥈', label: 'Sレア' },
  { id: 'ssr', w: 45, name: 'SSR', emoji: '🥇', label: '激レア' },
  { id: 'ur', w: 5, name: 'UR', emoji: '👑', label: '超激レア' },
];

// 新キャラ1種につき全生産+0.5%
export const CHAR_BONUS = 0.005;

// ガチャコレクションキャラクター（絵文字図鑑）
// type: 'char' = 図鑑キャラ / 'skin' = 限定スキン解放
export const GACHA_CHARS = [
  // --- N（クソ級） ---
  { id: 'n_normal', rarity: 'n', type: 'char', name: 'ふつうのうんち', emoji: '💩', desc: 'どこにでもいる平凡なうんち。' },
  { id: 'n_small', rarity: 'n', type: 'char', name: 'ちいさいうんち', emoji: '💩', desc: '小粒。でもうんちはうんち。' },
  { id: 'n_corn', rarity: 'n', type: 'char', name: 'コーンうんち', emoji: '🌽', desc: '消化しきれなかった昨日のとうもろこし付き。' },
  { id: 'n_wet', rarity: 'n', type: 'char', name: '水っぽいうんち', emoji: '💧', desc: '水分過多。もうちょっと頑張って。' },
  { id: 'n_koro', rarity: 'n', type: 'char', name: 'コロコロうんち', emoji: '⚫', desc: 'ウサギ風。便秘気味のサイン。' },
  { id: 'n_neba', rarity: 'n', type: 'char', name: 'ねばねばうんち', emoji: '🫠', desc: '脂っこいものの食べすぎかも。' },
  { id: 'n_curry', rarity: 'n', type: 'char', name: 'カレーうんち', emoji: '🍛', desc: '昨日の夕飯がそのままの姿で。' },
  { id: 'n_morning', rarity: 'n', type: 'char', name: '朝イチうんち', emoji: '🌅', desc: '規則正しい生活の産物。' },
  { id: 'n_sleepy', rarity: 'n', type: 'char', name: '寝ぼけうんち', emoji: '😴', desc: '出たことすら覚えていない。' },
  { id: 'n_half', rarity: 'n', type: 'char', name: '半分うんち', emoji: '🚽', desc: '残り半分は体内に残したまま。' },
  // --- R ---
  { id: 'r_gloss', rarity: 'r', type: 'char', name: 'ツヤツヤうんち', emoji: '✨', desc: '表面のツヤが違う。質の良い食事の証。' },
  { id: 'r_long', rarity: 'r', type: 'char', name: 'ロングうんち', emoji: '📏', desc: '切れ目なくスルッと出た一本。' },
  { id: 'r_spiral', rarity: 'r', type: 'char', name: 'うずまきうんち', emoji: '🌀', desc: '美しい螺旋。ソフトクリーム級。' },
  { id: 'r_diet', rarity: 'r', type: 'char', name: 'ダイエットうんち', emoji: '🥗', desc: '野菜中心のヘルシー仕上げ。' },
  { id: 'r_protein', rarity: 'r', type: 'char', name: 'プロテインうんち', emoji: '💪', desc: '筋トレの成果が腸にも表れている。' },
  { id: 'r_onsen', rarity: 'r', type: 'char', name: '温泉うんち', emoji: '♨️', desc: '湯気が立ちのぼるできたてホヤホヤ。' },
  // --- SR ---
  { id: 'sr_gentle', rarity: 'sr', type: 'char', name: '紳士うんち', emoji: '🎩', desc: 'シルクハットをかぶった品格ある逸品。' },
  { id: 'sr_idol', rarity: 'sr', type: 'char', name: 'アイドルうんち', emoji: '🎤', desc: '便器のステージで今日も輝く。' },
  { id: 'sr_ninja', rarity: 'sr', type: 'char', name: '忍者うんち', emoji: '🥷', desc: '音もなく影もなくスルッと排出。' },
  { id: 'sr_king', rarity: 'sr', type: 'char', name: '王様うんち', emoji: '🤴', desc: '玉座（便座）にふさわしい風格。' },
  { id: 'sr_teller', rarity: 'sr', type: 'char', name: '占い師うんち', emoji: '🔮', desc: 'あなたの明日の便通を知っている。' },
  // --- SSR ---
  { id: 'ssr_skin_crystal', rarity: 'ssr', type: 'skin', skin: 'crystal', name: 'クリスタルうんち', emoji: '💎', desc: 'ガチャ限定スキン。排出で図鑑解放。' },
  { id: 'ssr_knight', rarity: 'ssr', type: 'char', name: '騎士うんち', emoji: '⚔️', desc: '腸の平和を守り続ける忠実な騎士。' },
  { id: 'ssr_angel', rarity: 'ssr', type: 'char', name: '天使うんち', emoji: '👼', desc: '天から降りた祝福の快便。' },
  { id: 'ssr_demon', rarity: 'ssr', type: 'char', name: '魔王うんち', emoji: '😈', desc: '恐ろしき魔王。ただし形状は完璧。' },
  // --- UR ---
  { id: 'ur_skin_legend', rarity: 'ur', type: 'skin', skin: 'legend', name: '伝説の大便玉', emoji: '🔮', desc: 'ガチャ限定スキン。1/2,000の奇跡。' },
  { id: 'ur_god', rarity: 'ur', type: 'char', name: '神のうんち', emoji: '🌠', desc: '神々が認めた究極のうんち。拝む価値あり。' },
  { id: 'ur_alien', rarity: 'ur', type: 'char', name: '宇宙うんち', emoji: '👽', desc: '地球外生命体が残していった謎の物体。' },
];

// 確率表記用
export function gachaRateText() {
  return GACHA_RATES.map((r) => `${r.emoji}${r.name} ${(r.w / 100).toFixed(2).replace(/\.?0+$/, '')}%`).join(' / ');
}

/* ==========================================================================
   実績（アチーブメント）：解除数×2%が水分量ボーナスに直結
   ========================================================================== */
export const WATER_PER_ACH = 0.02;

export const ACHIEVEMENT_DATA = [
  { id: 'click10', name: '初めてのぶりぶり', desc: '10回タップする', emoji: '💩', stat: 'totalClicks', req: 10 },
  { id: 'click100', name: '連打入門', desc: '100回タップする', emoji: '👆', stat: 'totalClicks', req: 100 },
  { id: 'click1k', name: '腸活の鬼', desc: '1,000回タップする', emoji: '🔥', stat: 'totalClicks', req: 1000 },
  { id: 'click10k', name: '神の右手', desc: '10,000回タップする', emoji: '⚡', stat: 'totalClicks', req: 10000 },
  { id: 'bp1k', name: '快便入門', desc: '累計1,000 BP', emoji: '🌱', stat: 'totalScore', req: 1e3 },
  { id: 'bp100k', name: '立派な一本', desc: '累計10万 BP', emoji: '🎖️', stat: 'totalScore', req: 1e5 },
  { id: 'bp1m', name: 'ミリオン快便', desc: '累計100万 BP', emoji: '💰', stat: 'totalScore', req: 1e6 },
  { id: 'bp100m', name: '億ション快便', desc: '累計1億 BP', emoji: '🏆', stat: 'totalScore', req: 1e8 },
  { id: 'bp10b', name: '伝説の大便官', desc: '累計100億 BP', emoji: '👑', stat: 'totalScore', req: 1e10 },
  { id: 'flush10', name: '水洗デビュー', desc: 'トイレを10回流す', emoji: '🚽', stat: 'flushCount', req: 10 },
  { id: 'flush100', name: '水流マスター', desc: 'トイレを100回流す', emoji: '🌊', stat: 'flushCount', req: 100 },
  { id: 'fever10', name: 'フィーバーの申し子', desc: 'フィーバーに10回突入', emoji: '🎉', stat: 'feverCount', req: 10 },
  { id: 'fever100', name: '絶頂の住人', desc: 'フィーバーに100回突入', emoji: '🌈', stat: 'feverCount', req: 100 },
  { id: 'prestige1', name: '初転生', desc: '腸界転生を1回行う', emoji: '🌟', stat: 'prestigeCount', req: 1 },
  { id: 'prestige10', name: '輪廻の覇者', desc: '腸界転生を10回行う', emoji: '♾️', stat: 'prestigeCount', req: 10 },
  { id: 'souls100', name: 'ソウルコレクター', desc: '累計100 GS獲得', emoji: '✨', stat: 'totalSouls', req: 100 },
  { id: 'upg50', name: '腸内開発マニア', desc: '腸内開発合計50Lv', emoji: '🔬', stat: 'upgradesTotal', req: 50 },
  { id: 'upg200', name: '結腸大富豪', desc: '腸内開発合計200Lv', emoji: '🏭', stat: 'upgradesTotal', req: 200 },
  { id: 'skin2', name: 'うんちコレクター', desc: 'スキンを2種解放', emoji: '📖', stat: 'skinsUnlocked', req: 2 },
  { id: 'skin4', name: '図鑑コンプリート', desc: 'スキンを全種解放', emoji: '📚', stat: 'skinsUnlocked', req: 4 },
  { id: 'fly10', name: 'ハエたたき名人', desc: 'ハエを10匹潰す', emoji: '🪰', stat: 'fliesPopped', req: 10 },
  { id: 'fly100', name: 'ハエ殲滅兵器', desc: 'ハエを100匹潰す', emoji: '💥', stat: 'fliesPopped', req: 100 },
  { id: 'golden1', name: '金のうんち発見', desc: 'レアうんちを1回捕まえる', emoji: '🌟', stat: 'goldenCaught', req: 1 },
  { id: 'golden25', name: '黄金ハンター', desc: 'レアうんちを25回捕まえる', emoji: '🏅', stat: 'goldenCaught', req: 25 },
  { id: 'lax1', name: '禁断の扉', desc: '下剤に手を出してしまった…', emoji: '💊', stat: 'laxUsed', req: 1 },
  { id: 'gacha100', name: 'ガチャの虜', desc: 'ガチャを100回まわす', emoji: '🎰', stat: 'gachaPulls', req: 100 },
  { id: 'gacha1k', name: 'ガチャ中毒', desc: 'ガチャを1,000回まわす', emoji: '🎲', stat: 'gachaPulls', req: 1000 },
  { id: 'gacha10k', name: 'ガチャの帝王', desc: 'ガチャを10,000回まわす', emoji: '👑', stat: 'gachaPulls', req: 10000 },
  { id: 'ur1', name: '神引き', desc: 'URを引き当てた…！', emoji: '🌈', stat: 'urCount', req: 1 },
  { id: 'chars10', name: 'キャラコレクター', desc: 'ガチャキャラを10種集める', emoji: '🗂️', stat: 'charsOwned', req: 10 },
  { id: 'chars20', name: 'うんち博士', desc: 'ガチャキャラを20種集める', emoji: '🎓', stat: 'charsOwned', req: 20 },
  { id: 'charsall', name: '全員排出', desc: 'ガチャキャラを全種類集める', emoji: '🏅', stat: 'charsOwned', req: 24 },
  { id: 'skin6', name: '真・図鑑コンプリート', desc: 'ガチャ限定を含む全スキン解放', emoji: '👑', stat: 'skinsUnlocked', req: 6 },
];

/* ==========================================================================
   トイレ新聞（ニュースティッカー）
   ========================================================================== */
export const NEWS_STATIC = [
  'うんち学会「今年のうんちは過去最高の出来」',
  '専門家「1日1快便が長寿の秘訣」と学会で発表',
  'トイレの神様がご機嫌な模様',
  '腸内フローラ、満開の報せ',
  '世界快便指数、史上最高値を更新',
  'おなら楽団、世界ツアー開催を発表',
  '「トイレは聖地」トイレ研究家が断言',
  'うんち占い、的中率99%の衝撃',
  'スッキリ感を数値化する技術に特許取得',
  'バナナうんちの輸出量が過去最高に',
  '「快便は世界を救う」国連で演説',
  '水分摂取量が過去10年で最高を記録',
  'うんちドルレート、1うんち=1万BPに上昇',
  '深夜のトイレに現れるハエは幸運の象徴と判明',
  '「ヤンキー座り」が快便の極意として再評価',
  '便秘外来に行列、待ち時間3時間',
  '新種の乳酸菌「ぶりぶり菌」発見される',
  'ハイテク便座の国内シェア、ついに99%突破',
  '黄金うんちの目撃情報が相次ぐ',
  'トイレットペーパー業界「在庫は十分」と呼びかけ',
];
