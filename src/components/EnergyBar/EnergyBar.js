import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useEnergyStore } from "../../store/energyStore";

// Vertical stamina/cooldown gauge shown on the right edge of every game
// screen. Ticks once a second purely to re-read the lazily-computed energy
// value from the store (see energyStore.js _sync).
const EnergyBar = () => {
  const getEnergy = useEnergyStore((s) => s.getEnergy);
  const [energy, setEnergy] = useState(() => getEnergy());

  useEffect(() => {
    const interval = setInterval(() => setEnergy(getEnergy()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pct = Math.round(energy);
  const fillColor = pct <= 20 ? "#E05555" : pct <= 50 ? "#E8B438" : "#4CAF50";

  return (
    <View style={styles.container} pointerEvents="none">
      <Text style={styles.bolt}>⚡</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { height: `${pct}%`, backgroundColor: fillColor }]} />
      </View>
      <Text style={styles.pct}>{pct}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 10,
    top: 90,
    bottom: 130,
    alignItems: "center",
    width: 34
  },
  bolt: { fontSize: 14, marginBottom: 6 },
  track: {
    flex: 1,
    width: 14,
    borderRadius: 7,
    backgroundColor: "#26264A",
    overflow: "hidden",
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: "#3A3A55"
  },
  fill: { width: "100%" },
  pct: { color: "#AAAAC0", fontSize: 10, marginTop: 6, fontWeight: "700" }
});

export default EnergyBar;

// FILE LOCATION: src/components/EnergyBar/EnergyBar.js (NEW file)
