import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcon from "../MaterialIcon/MaterialIcon";

const formatCash = (amount) => {
  const fixed = amount.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  return `$${fixed}`;
};

const PRIZE_LABELS = {
  silver: (amt) => `${amt} Silver`,
  gold: (amt) => `${amt} Gold`,
  diamond: (amt) => `${amt} Diamond`,
  cash: (amt) => formatCash(amt)
};

// This is the ONLY place the words "Silver" / "Gold" / "Diamond" appear -
// everywhere else (TopBar, wheel wedges) uses MaterialIcon instead.
const PrizeResultModal = ({ visible, prize, onClose }) => {
  if (!prize) return null;
  const isDud = prize.type === "dud";
  const label = !isDud && PRIZE_LABELS[prize.type] ? PRIZE_LABELS[prize.type](prize.amount) : "";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, isDud && styles.cardDud]}>
          <Text style={styles.title}>{isDud ? "No Luck This Time" : "You Won!"}</Text>
          {!isDud && (
            <View style={styles.prizeRow}>
              <MaterialIcon type={prize.type} size={26} />
              <Text style={styles.prize}>{label}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", alignItems: "center" },
  card: {
    width: 280,
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD700"
  },
  cardDud: { borderColor: "#3A3A55" },
  title: { fontSize: 18, fontWeight: "700", color: "#FFD700", marginBottom: 14 },
  prizeRow: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 10 },
  prize: { fontSize: 22, fontWeight: "800", color: "#FFFFFF" },
  button: { backgroundColor: "#FFD700", paddingHorizontal: 32, paddingVertical: 10, borderRadius: 12, marginTop: 10 },
  buttonText: { color: "#1A1A2E", fontWeight: "700", fontSize: 14 }
});

export default PrizeResultModal;

// FILE LOCATION: src/components/PrizeResultModal/PrizeResultModal.js (REPLACE existing file)
