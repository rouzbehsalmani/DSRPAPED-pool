import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import TopBar from "../TopBar/TopBar";
import PrizeResultModal from "../PrizeResultModal/PrizeResultModal";
import AdBreakModal from "../AdBreakModal/AdBreakModal";
import VipLockedNotice from "../VipLockedNotice/VipLockedNotice";
import EnergyBar from "../EnergyBar/EnergyBar";
import { useEconomyStore } from "../../store/economyStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useEnergyStore } from "../../store/energyStore";
import { showRewardedAd } from "../../services/adNetworkService";
import { ENERGY_PER_PLAY } from "../../config/economyConfig";

const formatCountdown = (ms) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

// Shared shell used by every mini-game route. Centralizes:
// - TopBar + title
// - VIP gating (requireVip)
// - Prize award + result modal
// - Simulated ad-break cadence (registerGamePlay / AdBreakModal)
// - Energy/stamina cooldown gate (EnergyBar) so a play session can't be
//   over in a minute even though each mini-game round itself is quick
//
// Usage:
//   <GameScreenShell title="Spin the Wheel">
//     {(handleResult) => <SpinWheel segments={...} onResult={handleResult} />}
//   </GameScreenShell>
const GameScreenShell = ({ title, subtitle, accentColor = "#FFFFFF", requireVip = false, children }) => {
  const arpgCounterRef = useRef(null);
  const isVip = useSettingsStore((s) => s.isVip);
  const awardPrize = useEconomyStore((s) => s.awardPrize);
  const registerGamePlay = useEconomyStore((s) => s.registerGamePlay);
  const adBreakPending = useEconomyStore((s) => s.adBreakPending);
  const clearAdBreak = useEconomyStore((s) => s.clearAdBreak);
  const processAdResult = useEconomyStore((s) => s.processAdResult);

  const hasEnergyForPlay = useEnergyStore((s) => s.hasEnergyForPlay);
  const msUntilNextPlay = useEnergyStore((s) => s.msUntilNextPlay);
  const consumeEnergy = useEnergyStore((s) => s.consumeEnergy);

  const [resultPrize, setResultPrize] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [, setTick] = useState(0);

  // Ticks once a second purely to re-evaluate the energy gate below, since
  // energy regenerates lazily (only recomputed when read).
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResult = (prize) => {
    awardPrize(prize);
    setResultPrize(prize);
    setModalVisible(true);
    registerGamePlay();
    consumeEnergy();
  };

  const handleAdBreakComplete = () => {
    showRewardedAd().then((result) => {
      if (result.success) {
        processAdResult(result.revenue);
      }
      clearAdBreak();
    });
  };

  if (requireVip && !isVip) {
    return <VipLockedNotice arpgCounterRef={arpgCounterRef} />;
  }

  const canPlay = hasEnergyForPlay();

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar arpgCounterRef={arpgCounterRef} />
      <View style={styles.body}>
        <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        {canPlay ? (
          children(handleResult)
        ) : (
          <View style={styles.rechargeCard}>
            <Text style={styles.rechargeTitle}>Recharging...</Text>
            <Text style={styles.rechargeSubtitle}>
              Come back in {formatCountdown(msUntilNextPlay())} for your next play
            </Text>
          </View>
        )}
      </View>

      <EnergyBar />

      <PrizeResultModal
        visible={modalVisible}
        prize={resultPrize}
        onClose={() => setModalVisible(false)}
      />

      <AdBreakModal visible={adBreakPending} onComplete={handleAdBreakComplete} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0F0F1E" },
  body: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4, alignSelf: "flex-start" },
  subtitle: { color: "#77779A", fontSize: 12, marginBottom: 8, alignSelf: "flex-start" },
  rechargeCard: {
    marginTop: 60,
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#26264A",
    width: "100%"
  },
  rechargeTitle: { color: "#FFD700", fontSize: 16, fontWeight: "700", marginBottom: 8 },
  rechargeSubtitle: { color: "#AAAAC0", fontSize: 13, textAlign: "center" }
});

export default GameScreenShell;

// FILE LOCATION: src/components/GameScreenShell/GameScreenShell.js (REPLACE existing file)
