import {
  UPGRADE_DATA,
  SKIN_DATA,
  PRESTIGE,
  FLY,
  GOLDEN,
  GOLDEN_EFFECTS,
  CURSE_EFFECTS,
  LAX,
  WATER_PER_ACH,
  ACHIEVEMENT_DATA,
  GACHA,
  GACHA_RATES,
  GACHA_CHARS,
  CHAR_BONUS,
} from './data';
import { sound } from './audio';

const SAVE_KEY = 'UNCHI_BURI_STUDIO_V1'; // v1と同じキーで既存セーブを引き継ぐ
const FEVER_DURATION = 12; // 秒

export const state = {
  score: 0,
  totalScore: 0,
  totalClicks: 0,
  flushCount: 0,
  feverCount: 0,
  prestigeCount: 0,
  souls: 0,
  totalSouls: 0,
  currentSkin: 'default',
  feverGauge: 0,
  isFever: false,
  feverEndsAt: 0,
  flushBonus: 0,
  upgrades: {},
  unlockedSkins: ['default'],
  // --- v2新システム ---
  flies: [], // [{id, sucked}]
  fliesPopped: 0,
  goldenCaught: 0,
  achievements: [],
  laxUnlocked: false,
  laxActive: false,
  laxUsed: 0,
  gachaPulls: 0,
  urCount: 0,
  gachaChars: [], // 排出済みガチャキャラid一覧
  // バフ/デバフ（終了時刻）
  clickFrenzyEndsAt: 0,
  prodDebuffEndsAt: 0,
  clickDebuffEndsAt: 0,
  // 金色うんち（揮発性・保存しない）
  golden: { active: false, x: 50, y: 40, expiresAt: 0 },
};
UPGRADE_DATA.forEach((u) => (state.upgrades[u.id] = 0));

let nextFlyAt = 0;
let nextGoldenAt = 0;
let flySeq = 0;

/* ==========================================================================
   購読（fast: スコア等の毎フレーム更新系 / slow: 構造的変化のみ）
   ========================================================================== */
let fastSnap = null;
let slowSnap = null;
const fastSubs = new Set();
const slowSubs = new Set();
const toastSubs = new Set();

const now = () => performance.now();

function buildFast() {
  fastSnap = {
    score: state.score,
    bps: getBps(),
    effectiveBps: getEffectiveBps(),
    clickPower: getClickPower(),
    feverGauge: state.feverGauge,
    isFever: state.isFever,
    feverRemain: state.isFever ? Math.max(0, (state.feverEndsAt - now()) / 1000) : 0,
    flushBonus: state.flushBonus,
    souls: state.souls,
    soulMult: getSoulMult(),
    waterMult: getWaterMult(),
    pendingSouls: getPendingSouls(),
    flies: state.flies.map((f) => ({ id: f.id, sucked: f.sucked })),
    drainRate: getDrainRate(),
    golden: { ...state.golden, remain: state.golden.active ? Math.max(0, (state.golden.expiresAt - now()) / 1000) : 0 },
    clickFrenzyRemain: Math.max(0, (state.clickFrenzyEndsAt - now()) / 1000),
    prodDebuffRemain: Math.max(0, (state.prodDebuffEndsAt - now()) / 1000),
    clickDebuffRemain: Math.max(0, (state.clickDebuffEndsAt - now()) / 1000),
    laxActive: state.laxActive,
  };
}

function buildSlow() {
  slowSnap = {
    upgrades: { ...state.upgrades },
    unlockedSkins: [...state.unlockedSkins],
    currentSkin: state.currentSkin,
    totalScore: state.totalScore,
    totalClicks: state.totalClicks,
    flushCount: state.flushCount,
    feverCount: state.feverCount,
    prestigeCount: state.prestigeCount,
    souls: state.souls,
    totalSouls: state.totalSouls,
    fliesPopped: state.fliesPopped,
    goldenCaught: state.goldenCaught,
    gachaPulls: state.gachaPulls,
    urCount: state.urCount,
    gachaChars: [...state.gachaChars],
    achievements: [...state.achievements],
    laxUnlocked: state.laxUnlocked,
    laxActive: state.laxActive,
  };
}

function notifyFast() {
  buildFast();
  fastSubs.forEach((l) => l());
}

function notifySlow() {
  buildSlow();
  slowSubs.forEach((l) => l());
}

function notifyAll() {
  notifyFast();
  notifySlow();
}

export const subscribeFast = (l) => (fastSubs.add(l), () => fastSubs.delete(l));
export const subscribeSlow = (l) => (slowSubs.add(l), () => slowSubs.delete(l));
export const getFast = () => fastSnap ?? (buildFast(), fastSnap);
export const getSlow = () => slowSnap ?? (buildSlow(), slowSnap);

export const subscribeToast = (l) => (toastSubs.add(l), () => toastSubs.delete(l));
export function showToast(msg, icon = '💩') {
  toastSubs.forEach((l) => l({ msg, icon, ts: Date.now() }));
}

/* ==========================================================================
   計算ロジック
   ========================================================================== */
export function getSkin() {
  return SKIN_DATA.find((s) => s.id === state.currentSkin) ?? SKIN_DATA[0];
}

export function getSoulMult() {
  return 1 + state.souls * PRESTIGE.soulBonusPer;
}

// 水分量：実績解除数に比例するグローバル倍率
export function getWaterMult() {
  return 1 + state.achievements.length * WATER_PER_ACH;
}

// 図鑑ボーナス：ガチャキャラ収集数に比例するグローバル倍率
export function getCharMult() {
  return 1 + state.gachaChars.length * CHAR_BONUS;
}

export function getDrainRate() {
  return Math.min(FLY.cap, state.flies.length * FLY.drainPer);
}

const isActive = (endsAt) => endsAt > now();

export function getClickPower() {
  const base = 1;
  let upgradeBonus = 0;
  upgradeBonus += (state.upgrades['water'] || 0) * 0.5;
  upgradeBonus += (state.upgrades['fiber'] || 0) * 1.5;

  let mult = getSkin().mult * getSoulMult() * getWaterMult() * getCharMult();
  if (state.isFever) mult *= 4;
  if (state.laxActive) mult *= LAX.prodMult;
  if (isActive(state.clickFrenzyEndsAt)) mult *= GOLDEN.clickFrenzyMult;
  if (isActive(state.clickDebuffEndsAt)) mult *= 0.5;

  return Math.max(1, Math.floor((base + upgradeBonus) * mult));
}

export function getBps() {
  let total = 0;
  UPGRADE_DATA.forEach((u) => {
    total += (state.upgrades[u.id] || 0) * u.bps;
  });
  let mult = getSoulMult() * getWaterMult() * getCharMult();
  if (state.isFever) mult *= 2;
  if (state.laxActive) mult *= LAX.prodMult;
  if (isActive(state.prodDebuffEndsAt)) mult *= 0.5;
  return total * mult;
}

// ハエに吸われた後の実効生産量
export function getEffectiveBps() {
  return getBps() * (1 - getDrainRate());
}

export function getUpgradeCost(item) {
  const lvl = state.upgrades[item.id] || 0;
  return Math.floor(item.cost * Math.pow(1.15, lvl));
}

export function getPendingSouls() {
  const earnable = Math.floor(Math.sqrt(state.totalScore / PRESTIGE.soulDivisor));
  return Math.max(0, earnable - state.totalSouls);
}

export function getCounters() {
  return {
    totalClicks: state.totalClicks,
    totalScore: state.totalScore,
    flushCount: state.flushCount,
    feverCount: state.feverCount,
    prestigeCount: state.prestigeCount,
    totalSouls: state.totalSouls,
    upgradesTotal: Object.values(state.upgrades).reduce((a, b) => a + b, 0),
    skinsUnlocked: state.unlockedSkins.length,
    fliesPopped: state.fliesPopped,
    goldenCaught: state.goldenCaught,
    laxUsed: state.laxUsed,
    gachaPulls: state.gachaPulls,
    urCount: state.urCount,
    charsOwned: state.gachaChars.length,
  };
}

/* ==========================================================================
   セーブ / ロード（v1互換）
   ========================================================================== */
export function saveGame() {
  try {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        score: state.score,
        totalScore: state.totalScore,
        totalClicks: state.totalClicks,
        flushCount: state.flushCount,
        feverCount: state.feverCount,
        prestigeCount: state.prestigeCount,
        souls: state.souls,
        totalSouls: state.totalSouls,
        currentSkin: state.currentSkin,
        unlockedSkins: state.unlockedSkins,
        upgrades: state.upgrades,
        flushBonus: state.flushBonus,
        flies: state.flies,
        fliesPopped: state.fliesPopped,
        goldenCaught: state.goldenCaught,
        achievements: state.achievements,
        laxUnlocked: state.laxUnlocked,
        laxActive: state.laxActive,
        laxUsed: state.laxUsed,
        gachaPulls: state.gachaPulls,
        urCount: state.urCount,
        gachaChars: state.gachaChars,
      })
    );
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

export function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return;
    const p = JSON.parse(saved);
    state.score = p.score || 0;
    state.totalScore = p.totalScore || 0;
    state.totalClicks = p.totalClicks || 0;
    state.flushCount = p.flushCount || 0;
    state.feverCount = p.feverCount || 0;
    state.prestigeCount = p.prestigeCount || 0;
    state.souls = p.souls || 0;
    state.totalSouls = p.totalSouls || 0;
    state.currentSkin = p.currentSkin || 'default';
    state.unlockedSkins = p.unlockedSkins || ['default'];
    state.flushBonus = p.flushBonus || 0;
    state.flies = Array.isArray(p.flies) ? p.flies.slice(0, FLY.max) : [];
    state.fliesPopped = p.fliesPopped || 0;
    state.goldenCaught = p.goldenCaught || 0;
    state.achievements = Array.isArray(p.achievements) ? p.achievements : [];
    state.laxUnlocked = !!p.laxUnlocked;
    state.laxActive = !!p.laxActive;
    state.laxUsed = p.laxUsed || 0;
    state.gachaPulls = p.gachaPulls || 0;
    state.urCount = p.urCount || 0;
    state.gachaChars = Array.isArray(p.gachaChars) ? p.gachaChars : [];
    state.flies.forEach((f) => {
      f.id = f.id ?? ++flySeq;
      f.sucked = f.sucked || 0;
      if (f.id > flySeq) flySeq = f.id;
    });
    if (p.upgrades) {
      Object.keys(p.upgrades).forEach((k) => {
        if (state.upgrades[k] !== undefined) state.upgrades[k] = p.upgrades[k];
      });
    }
  } catch (e) {
    console.warn('LocalStorage load failed', e);
  }
}

export function resetAll() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

/* ==========================================================================
   実績チェック
   ========================================================================== */
function checkAchievements() {
  const counters = getCounters();
  let changed = false;
  ACHIEVEMENT_DATA.forEach((a) => {
    if (!state.achievements.includes(a.id) && (counters[a.stat] || 0) >= a.req) {
      state.achievements.push(a.id);
      showToast(`実績解除「${a.name}」！水分量+${Math.round(WATER_PER_ACH * 100)}%`, a.emoji);
      changed = true;
    }
  });
  if (changed) notifySlow();
}

/* ==========================================================================
   スキン解放チェック
   ========================================================================== */
function checkUnlocks() {
  let changed = false;
  SKIN_DATA.forEach((s) => {
    // gacha:true のスキンはBP条件では解放されない
    if (!s.gacha && !state.unlockedSkins.includes(s.id) && state.totalScore >= s.req) {
      state.unlockedSkins.push(s.id);
      showToast(`新しい図鑑解放:「${s.name}」！`, '✨');
      changed = true;
    }
  });
  if (changed) notifySlow();
}

/* ==========================================================================
   アクション
   ========================================================================== */
export function click() {
  const power = getClickPower();
  state.score += power;
  state.totalScore += power;
  state.totalClicks += 1;
  state.flushBonus += power * 0.5;

  sound.playBuri(state.isFever ? 1.5 : 1.0);

  if (!state.isFever) {
    state.feverGauge = Math.min(100, state.feverGauge + 2.5);
    if (state.feverGauge >= 100) startFever();
  }

  checkUnlocks();
  checkAchievements();
  notifyFast();
  return power;
}

export function buyUpgrade(item) {
  const cost = getUpgradeCost(item);
  if (state.score < cost) return false;
  state.score -= cost;
  state.upgrades[item.id] = (state.upgrades[item.id] || 0) + 1;
  sound.playPlop();
  checkAchievements();
  notifyAll();
  return true;
}

export function selectSkin(skinId) {
  if (!state.unlockedSkins.includes(skinId)) return;
  state.currentSkin = skinId;
  sound.playPlop();
  notifySlow();
}

export function flush() {
  sound.playFlush();
  state.flushCount++;

  const bonus = Math.max(50, Math.floor(state.flushBonus * 1.5));
  state.score += bonus;
  state.totalScore += bonus;
  state.flushBonus = 0;

  checkUnlocks();
  checkAchievements();
  notifyAll();
  showToast(`トイレ洗浄完了！ボーナス +${bonus.toLocaleString()} BP 獲得！`, '🚾');
  return bonus;
}

/* ==========================================================================
   ハエ（ウィンクラー）
   ========================================================================== */
export function popFly(id) {
  const idx = state.flies.findIndex((f) => f.id === id);
  if (idx === -1) return 0;
  const fly = state.flies[idx];
  state.flies.splice(idx, 1);
  const gain = Math.floor(fly.sucked * FLY.popMult);
  state.score += gain;
  state.totalScore += gain;
  state.fliesPopped++;
  sound.playBuri(0.7);
  showToast(`ハエをパチン！溜まり分×${FLY.popMult} = +${gain.toLocaleString()} BP`, '🪰');
  checkAchievements();
  notifyAll();
  return gain;
}

function scheduleNextFly() {
  const min = state.laxActive ? FLY.spawnMinLax : FLY.spawnMin;
  const max = state.laxActive ? FLY.spawnMaxLax : FLY.spawnMax;
  nextFlyAt = now() + (min + Math.random() * (max - min)) * 1000;
}

/* ==========================================================================
   ゴールデンうんち / 呪いうんち
   ========================================================================== */
function scheduleNextGolden() {
  nextGoldenAt = now() + (GOLDEN.minDelay + Math.random() * (GOLDEN.maxDelay - GOLDEN.minDelay)) * 1000;
}

function spawnGolden() {
  state.golden = {
    active: true,
    x: 15 + Math.random() * 60,
    y: 15 + Math.random() * 55,
    expiresAt: now() + GOLDEN.life * 1000,
  };
}

function weightedPick(list) {
  const total = list.reduce((a, e) => a + e.w, 0);
  let r = Math.random() * total;
  for (const e of list) {
    r -= e.w;
    if (r <= 0) return e;
  }
  return list[0];
}

export function grabGolden() {
  if (!state.golden.active) return;
  state.golden.active = false;
  state.goldenCaught++;

  const cursed = state.laxActive && Math.random() < LAX.curseChance;
  const eff = cursed ? weightedPick(CURSE_EFFECTS) : weightedPick(GOLDEN_EFFECTS);
  const bps = getBps();
  let bonus = 0;

  switch (eff.id) {
    case 'lucky':
      bonus = Math.max(13, Math.min(state.score * 0.15, bps * 900));
      addScore(bonus);
      showToast(`✨ ラッキー快便！ +${Math.floor(bonus).toLocaleString()} BP`, '🌟');
      sound.playFeverStart();
      break;
    case 'fever':
      if (!state.isFever) startFever();
      showToast('✨ 強制フィーバー突入！', '🔥');
      break;
    case 'click':
      state.clickFrenzyEndsAt = now() + GOLDEN.clickFrenzyDur * 1000;
      showToast(`✨ クリックフィーバー！${GOLDEN.clickFrenzyDur}秒間クリック×${GOLDEN.clickFrenzyMult}`, '⚡');
      sound.playFeverStart();
      break;
    case 'storm':
      bonus = Math.max(50, bps * 60);
      addScore(bonus);
      showToast(`✨ うんちストーム！ +${Math.floor(bonus).toLocaleString()} BP`, '🌪️');
      sound.playFlush();
      break;
    case 'diarrhea': {
      const loss = Math.floor(state.score * 0.1);
      state.score = Math.max(0, state.score - loss);
      showToast(`💀 下痢！ -${loss.toLocaleString()} BP 流出…`, '☠️');
      sound.playBuri(1.8);
      break;
    }
    case 'constipate':
      state.prodDebuffEndsAt = now() + 30000;
      showToast('💀 便秘気味… 30秒間生産-50%', '☠️');
      sound.playBuri(0.5);
      break;
    case 'pain':
      state.clickDebuffEndsAt = now() + 20000;
      showToast('💀 腹痛… 20秒間クリック力-50%', '☠️');
      sound.playBuri(0.5);
      break;
    case 'release':
      bonus = Math.max(100, bps * 120);
      addScore(bonus);
      showToast(`✨ 宿便排出！ +${Math.floor(bonus).toLocaleString()} BP`, '💫');
      sound.playFeverStart();
      break;
  }

  checkUnlocks();
  checkAchievements();
  notifyAll();
}

function addScore(n) {
  state.score += n;
  state.totalScore += n;
}

/* ==========================================================================
   下剤の乱用（グランマポカリプス）
   ========================================================================== */
export function buyLaxative() {
  if (state.laxUnlocked || state.score < LAX.cost) return false;
  state.score -= LAX.cost;
  state.laxUnlocked = true;
  state.laxActive = true;
  state.laxUsed++;
  scheduleNextFly();
  sound.playBuri(2.0);
  showToast('💊 下剤を飲み干した…世界が歪み始める', '☠️');
  checkAchievements();
  notifyAll();
  return true;
}

export function toggleLax() {
  if (!state.laxUnlocked) return;
  state.laxActive = !state.laxActive;
  if (state.laxActive) {
    state.laxUsed++;
    showToast('💊 再び下剤に手を出した…', '☠️');
  } else {
    showToast('整腸剤で中和。腸が穏やかになった', '🌿');
  }
  sound.playPlop();
  checkAchievements();
  scheduleNextFly();
  notifyAll();
}

/* ==========================================================================
   フィーバー
   ========================================================================== */
let feverTimer = null;

function startFever() {
  state.isFever = true;
  state.feverCount++;
  state.feverGauge = 100;
  state.feverEndsAt = now() + FEVER_DURATION * 1000;
  sound.playFeverStart();
  showToast('超絶フィーバー突入！全生産力バースト！', '🔥');

  if (feverTimer) clearInterval(feverTimer);
  feverTimer = setInterval(() => {
    const remain = (state.feverEndsAt - now()) / 1000;
    if (remain <= 0) {
      endFever();
    } else {
      state.feverGauge = (remain / FEVER_DURATION) * 100;
      notifyFast();
    }
  }, 100);
  checkAchievements();
  notifyAll();
}

export function endFever(silent = false) {
  state.isFever = false;
  state.feverGauge = 0;
  state.feverEndsAt = 0;
  if (feverTimer) {
    clearInterval(feverTimer);
    feverTimer = null;
  }
  if (!silent) notifyAll();
}

/* ==========================================================================
   うんちガチャ（排出物は全てコレクション。ハズレは物理的にクソキャラ）
   ========================================================================== */
const GACHA_RANK = { n: 0, r: 1, sr: 2, ssr: 3, ur: 4 };
const GACHA_DUP_SOULS = { sr: 1, ssr: 5, ur: 20 };

// レアリティ別の排出プール
const GACHA_POOLS = {};
GACHA_RATES.forEach((r) => {
  GACHA_POOLS[r.id] = GACHA_CHARS.filter((c) => c.rarity === r.id);
});

// 1回あたりのコスト：所持BPの0.5%（最低1,000BP）
export function getGachaCost() {
  return Math.max(GACHA.costMin, Math.floor(state.score * GACHA.costPct));
}

function rollGacha() {
  const roll = Math.random() * 10000;
  let acc = 0;
  for (const r of GACHA_RATES) {
    acc += r.w;
    if (roll < acc) return r.id;
  }
  return 'n';
}

function unlockSkin(id) {
  if (state.unlockedSkins.includes(id)) return false;
  state.unlockedSkins.push(id);
  return true;
}

export function pullGacha(n = 1) {
  const costPer = getGachaCost();
  const cost = costPer * n;
  if (state.score < cost) return null;
  state.score -= cost;
  state.gachaPulls += n;

  const counts = { n: 0, r: 0, sr: 0, ssr: 0, ur: 0 };
  const notes = [];
  let bpBack = 0;
  let best = 'n';
  const pushNote = (t) => {
    if (notes.length < 12) notes.push(t);
  };

  for (let i = 0; i < n; i++) {
    const rarity = rollGacha();
    counts[rarity]++;
    if (GACHA_RANK[rarity] > GACHA_RANK[best]) best = rarity;

    const pool = GACHA_POOLS[rarity];
    const item = pool[Math.floor(Math.random() * pool.length)];
    if (!item) continue;

    if (item.type === 'skin') {
      if (unlockSkin(item.skin)) {
        pushNote(`${item.emoji} 限定スキン「${item.name}」解放！！`);
      } else {
        // スキンダブり → GS変換
        const gs = rarity === 'ur' ? 50 : 10;
        state.souls += gs;
        state.totalSouls += gs;
        pushNote(`${item.emoji} 「${item.name}」ダブり変換 +${gs} GS`);
      }
    } else if (!state.gachaChars.includes(item.id)) {
      state.gachaChars.push(item.id);
      pushNote(`${item.emoji} NEW「${item.name}」ゲット！図鑑ボーナス+${Math.round(CHAR_BONUS * 1000) / 10}%`);
    } else {
      // キャラダブり → 少量BP返却 / 上位レアはGS変換
      if (GACHA_DUP_SOULS[rarity]) {
        const gs = GACHA_DUP_SOULS[rarity];
        state.souls += gs;
        state.totalSouls += gs;
        pushNote(`${item.emoji} 「${item.name}」ダブり変換 +${gs} GS`);
      } else {
        const back = Math.floor(costPer * 0.05);
        bpBack += back;
        addScore(back);
      }
    }
  }

  if (counts.ur > 0) state.urCount += counts.ur;

  if (counts.ur > 0) sound.playPrestige();
  else if (counts.ssr > 0 || counts.sr > 0) sound.playFeverStart();
  else sound.playPlop();

  checkUnlocks();
  checkAchievements();
  notifyAll();
  if (best === 'ssr' || best === 'ur') saveGame();

  return { n, counts, best, bpBack, notes };
}

/* ==========================================================================
   腸界転生（プレステージ）
   ========================================================================== */
export function prestige() {
  const gain = getPendingSouls();
  if (gain < PRESTIGE.minSouls) return 0;

  endFever(true);
  state.souls += gain;
  state.totalSouls += gain;
  state.prestigeCount++;
  state.score = 0;
  state.flushBonus = 0;
  state.feverGauge = 0;
  state.flies = [];
  state.golden.active = false;
  state.clickFrenzyEndsAt = 0;
  state.prodDebuffEndsAt = 0;
  state.clickDebuffEndsAt = 0;
  UPGRADE_DATA.forEach((u) => (state.upgrades[u.id] = 0));

  sound.playPrestige();
  checkAchievements();
  notifyAll();
  saveGame();
  showToast(`腸界転生完了！${PRESTIGE.soulName} +${gain} ${PRESTIGE.soulUnit}`, '🌟');
  return gain;
}

/* ==========================================================================
   メインループ & 自動セーブ
   ========================================================================== */
let rafId = null;
let saveTimer = null;
let lastTick = 0;

function loop(t) {
  const delta = Math.min(1, (t - lastTick) / 1000); // タブ非復帰時の暴発防止
  lastTick = t;

  const bps = getBps();
  if (bps > 0) {
    const gross = bps * delta;
    const drain = getDrainRate();
    const toScore = gross * (1 - drain);
    state.score += toScore;
    state.totalScore += toScore;
    state.flushBonus += toScore * 0.2;
    // ハエが吸い取る分
    if (drain > 0) {
      const perFly = gross * FLY.drainPer;
      state.flies.forEach((f) => (f.sucked += perFly));
    }
    checkUnlocks();
    notifyFast();
  }

  // ハエ出現
  if (state.flies.length < FLY.max && t >= nextFlyAt) {
    state.flies.push({ id: ++flySeq, sucked: 0 });
    scheduleNextFly();
    notifyFast();
  }

  // ゴールデンうんち出現/消滅
  if (t >= nextGoldenAt) {
    if (!state.golden.active) spawnGolden();
    scheduleNextGolden();
  }
  if (state.golden.active && t >= state.golden.expiresAt) {
    state.golden.active = false;
    notifyFast();
  }

  rafId = requestAnimationFrame(loop);
}

export function start() {
  loadGame();
  notifyAll();
  lastTick = performance.now();
  scheduleNextFly();
  // 初回の金色うんちは早めに出して仕組みを伝える
  nextGoldenAt = now() + (30 + Math.random() * 60) * 1000;
  rafId = requestAnimationFrame(loop);
  saveTimer = setInterval(saveGame, 5000);
}

export function stop() {
  if (rafId) cancelAnimationFrame(rafId);
  if (saveTimer) clearInterval(saveTimer);
  saveGame();
}
