// src/components/TopBar/TopBar.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEconomyStore } from "../../store/economyStore";
import MaterialIcon from "../MaterialIcon/MaterialIcon";
import { COLORS, GRADIENTS, RADIUS, FONTS } from "../../theme/theme";

// Icon-only balance badges - no "Silver"/"Gold"/"Diamond"/"USD" words here.
// The material name is only ever spelled out in the win modal (e.g. "3 Silver").
const TopBar = ({ arpgCounterRef }) => {
  const silver = useEconomyStore((s) => s.silver);
  const gold = useEconomyStore((s) => s.gold);
  const diamond = useEconomyStore((s) => s.diamond);
  const arpg = useEconomyStore((s) => s.arpg);
  const walletCashBalance = useEconomyStore((s) => s.walletCashBalance);

  return (
    <LinearGradient colors={GRADIENTS.topBar} style={styles.container}>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexWrap: "wrap",
    rowGap: 8
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 5
  },
  value: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.semiBold,
    fontSize: 13
  }
});

export default TopBar;

// FILE LOCATION: src/components/TopBar/TopBar.js (REPLACE existing file)
