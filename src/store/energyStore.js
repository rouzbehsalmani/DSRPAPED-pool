import { create } from "zustand";
import {
  ENERGY_MAX,
  ENERGY_PER_PLAY,
  ENERGY_FULL_REGEN_MS,
  ENERGY_FULL_REGEN_MS_VIP
} from "../config/economyConfig";
import { useSettingsStore } from "./settingsStore";

function currentRegenMs() {
  return useSettingsStore.getState().isVip ? ENERGY_FULL_REGEN_MS_VIP : ENERGY_FULL_REGEN_MS;
}

// Acts as the game's "cooldown" - depletes a bit on every play, refills
// passively over time (0 -> 100 takes ENERGY_FULL_REGEN_MS, or the faster
// ENERGY_FULL_REGEN_MS_VIP while the player has an active VIP Pass). Once it
// drops below ENERGY_PER_PLAY, GameScreenShell blocks further play until
// enough has regenerated.
export const useEnergyStore = create((set, get) => ({
  energy: ENERGY_MAX,
  lastUpdatedAt: Date.now(),

  // Recomputes energy based on elapsed real time since the last check.
  _sync: () => {
    const { energy, lastUpdatedAt } = get();
    if (energy >= ENERGY_MAX) {
      set({ lastUpdatedAt: Date.now() });
      return;
    }
    const now = Date.now();
    const elapsed = now - lastUpdatedAt;
    const regen = (elapsed / currentRegenMs()) * ENERGY_MAX;
    const nextEnergy = Math.min(ENERGY_MAX, energy + regen);
    set({ energy: nextEnergy, lastUpdatedAt: now });
  },

  getEnergy: () => {
    get()._sync();
    return get().energy;
  },

  hasEnergyForPlay: () => {
    get()._sync();
    return get().energy >= ENERGY_PER_PLAY;
  },

  // How many ms until the player will have enough energy for one more play.
  msUntilNextPlay: () => {
    get()._sync();
    const { energy } = get();
    if (energy >= ENERGY_PER_PLAY) return 0;
    const deficit = ENERGY_PER_PLAY - energy;
    return (deficit / ENERGY_MAX) * currentRegenMs();
  },

  consumeEnergy: () => {
    get()._sync();
    set((state) => ({ energy: Math.max(0, state.energy - ENERGY_PER_PLAY) }));
  }
}));

// FILE LOCATION: src/store/energyStore.js (REPLACE existing file)
