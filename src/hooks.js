import { useSyncExternalStore } from 'react';
import { subscribeFast, subscribeSlow, getFast, getSlow } from './game/engine';

// スコア・BPS・フィーバーゲージ等の高頻度更新
export const useFast = () => useSyncExternalStore(subscribeFast, getFast);

// アップグレード所持数・スキン・統計等の変化時のみ更新
export const useSlow = () => useSyncExternalStore(subscribeSlow, getSlow);
