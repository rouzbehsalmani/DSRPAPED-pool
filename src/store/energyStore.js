import { create } from "zustand";
import { ENERGY_MAX, ENERGY_PER_PLAY, ENERGY_FULL_REGEN_MS } from "../config/economyConfig";

// Acts as the game's "cooldown" - depletes a bit on every play, refills
// passively over time (0 -> 100 takes ENERGY_FULL_REGEN_MS). Once it drops
// below ENERGY_PER_PLAY, GameScreenShell blocks further play until enough
// has regenerated. This is what keeps a play session from being over in a
// minute even if the mini-games themselves are quick.
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
    const regen = (elapsed / ENERGY_FULL_REGEN_MS) * ENERGY_MAX;
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
    return (deficit / ENERGY_MAX) * ENERGY_FULL_REGEN_MS;
  },

  consumeEnergy: () => {
    get()._sync();
    set((state) => ({ energy: Math.max(0, state.energy - ENERGY_PER_PLAY) }));
  }
}));

// FILE LOCATION: src/store/energyStore.js (NEW file)
