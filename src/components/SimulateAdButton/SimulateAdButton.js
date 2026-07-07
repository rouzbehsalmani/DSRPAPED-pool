// src/components/SimulateAdButton/SimulateAdButton.js

import React, { forwardRef } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useEconomyStore } from "../../store/economyStore";

const SimulateAdButton = forwardRef((props, ref) => {
  const simulateAdView = useEconomyStore((s) => s.simulateAdView);

  return (
    <TouchableOpacity
      ref={ref}
      collapsable={false}
      style={styles.button}
      onPress={simulateAdView}
      activeOpacity={0.85}
    >
      <Text style={styles.text}>▶ Simulate Ad View (+$0.01)</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14
  }
});

export default SimulateAdButton;
