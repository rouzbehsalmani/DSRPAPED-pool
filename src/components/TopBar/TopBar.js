// src/components/TopBar/TopBar.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useEconomyStore } from "../../store/economyStore";
import MaterialIcon from "../MaterialIcon/MaterialIcon";

// Icon-only balance badges - no "Silver"/"Gold"/"Diamond"/"USD" words here.
// The material name is only ever spelled out in the win modal (e.g. "3 Silver").
const TopBar = ({ arpgCounterRef }) => {
  const silver = useEconomyStore((s) => s.silver);
  const gold = useEconomyStore((s) => s.gold);
  const diamond = useEconomyStore((s) => s.diamond);
  const arpg = useEconomyStore((s) => s.arpg);
  const walletCashBalance = useEconomyStore((s) => s.walletCashBalance);

  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <MaterialIcon type="cash" size={16} />
        <Text style={styles.value}>{walletCashBalance.toFixed(4)}</Text>
      </View>
      <View style={styles.counter}>
        <MaterialIcon type="silver" size={16} />
        <Text style={styles.value}>{silver}</Text>
      </View>
      <View style={styles.counter}>
        <MaterialIcon type="gold" size={16} />
        <Text style={styles.value}>{gold}</Text>
      </View>
      <View style={styles.counter}>
        <MaterialIcon type="diamond" size={16} />
        <Text style={styles.value}>{diamond}</Text>
      </View>
      <View style={styles.counter} ref={arpgCounterRef} collapsable={false}>
        <MaterialIcon type="arpg" size={16} />
        <Text style={styles.value}>{arpg}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#1A1A2E",
    borderBottomWidth: 1,
    borderBottomColor: "#2E2E48",
    flexWrap: "wrap",
    rowGap: 8
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#26264A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5
  },
  value: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13
  }
});

export default TopBar;

// FILE LOCATION: src/components/TopBar/TopBar.js (REPLACE existing file)
