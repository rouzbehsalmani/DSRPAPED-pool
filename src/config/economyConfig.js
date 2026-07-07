// src/config/economyConfig.js

export const AD_REVENUE_PER_VIEW = 0.01; // $0.01 per simulated ad view

export const REVENUE_SPLIT = {
  CASH_SHARE: 0.30,     // 30% direct cash pool
  ARPG_SHARE: 0.30,     // 30% ARPG token allocation
  PLATFORM_SHARE: 0.10, // 10% platform/operational
  MEGA_POOL_SHARE: 0.30 // 30% global mega pool
};

export const CONVERSION_RATES = {
  SILVER_TO_GOLD: 10,
  GOLD_TO_DIAMOND: 10,
  DIAMOND_TO_ARPG: 10
};

export const ARPG_USD_VALUE = 0.20; // 1 ARPG = $0.20
export const ARPG_TRIGGER_THRESHOLD = 0.20; // accumulated ARPG-share $ needed to award 1 ARPG

export const CASH_REWARD_TIERS = [0.001, 0.01, 0.10];

export const MEGA_POOL_PRIZES = [1.00, 2.00, 5.00, 10.00];
export const MEGA_POOL_SPIN_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24h
