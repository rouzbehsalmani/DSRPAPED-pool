// src/components/TopBar/TopBar.js

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useEconomyStore } from "../../store/economyStore";

const TopBar = ({ arpgCounterRef }) => {
  const silver = useEconomyStore((s) => s.silver);
  const gold = useEconomyStore((s) => s.gold);
  const diamond = useEconomyStore((s) => s.diamond);
  const arpg = useEconomyStore((s) => s.arpg);

  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <Text style={styles.icon}>🥈</Text>
        <Text style={styles.value}>{silver}</Text>
      </View>
      <View style={styles.counter}>
        <Text style={styles.icon}>🥇</Text>
        <Text style={styles.value}>{gold}</Text>
      </View>
      <View style={styles.counter}>
        <Text style={styles.icon}>💎</Text>
        <Text style={styles.value}>{diamond}</Text>
      </View>
      <View style={styles.counter} ref={arpgCounterRef} collapsable={false}>
        <Text style={styles.icon}>🪙</Text>
        <Text style={styles.value}>{arpg} ARPG</Text>
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
    borderBottomColor: "#2E2E48"
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#26264A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  icon: {
    fontSize: 14,
    marginRight: 4
  },
  value: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13
  }
});

export default TopBar;
