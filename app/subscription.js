import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSettingsStore } from "../src/store/settingsStore";
import { getVipPlans, purchaseVip, restorePurchases } from "../src/services/iapService";
import { COLORS, RADIUS, FONTS, SPACING } from "../src/theme/theme";

const formatExpiry = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleDateString();
};

const COMPARISON_ROWS = [
  { label: "Energy full refill time", free: "10 minutes", vip: "5 minutes (2x faster)" },
  { label: "Ads between rounds", free: "Every 4 rounds", vip: "None - fully ad-free" },
  { label: "Spin the Wheel / Scratch Card / Slot Machine / Lucky Chests", free: "Standard odds, dud outcomes possible", vip: "Zero-dud versions - always a real prize" },
  { label: "Minimum prize tier", free: "Silver / small cash", vip: "Gold and Diamond only" }
];

export default function SubscriptionRoute() {
  const isVip = useSettingsStore((s) => s.isVip);
  const vipPlanId = useSettingsStore((s) => s.vipPlanId);
  const vipExpiresAt = useSettingsStore((s) => s.vipExpiresAt);
  const activateVip = useSettingsStore((s) => s.activateVip);
  const cancelVip = useSettingsStore((s) => s.cancelVip);
  const checkVipExpiry = useSettingsStore((s) => s.checkVipExpiry);

  const [purchasingPlanId, setPurchasingPlanId] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const plans = getVipPlans();

  useEffect(() => {
    checkVipExpiry();
  }, []);

  const handlePurchase = (planId) => {
    if (purchasingPlanId) return;
    setPurchasingPlanId(planId);
    purchaseVip(planId).then((result) => {
      setPurchasingPlanId(null);
      if (result.success) {
        activateVip(result.planId, result.expiresAt);
      }
    });
  };

  const handleRestore = () => {
    if (restoring) return;
    setRestoring(true);
    restorePurchases().then(() => {
      setRestoring(false);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <Text style={styles.title}>VIP Pass</Text>

        <View style={styles.card}>
          <Text style={styles.statusLabel}>Current Status</Text>
          <Text style={[styles.statusValue, { color: isVip ? COLORS.gold : COLORS.textSecondary }]}>
            {isVip ? "VIP ACTIVE" : "STANDARD"}
          </Text>
          {isVip && vipExpiresAt && (
            <Text style={styles.expiryNote}>
              Plan: {vipPlanId} - renews/expires {formatExpiry(vipExpiresAt)}
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>What changes with VIP</Text>
        <View style={styles.comparisonCard}>
          <View style={styles.comparisonHeaderRow}>
            <Text style={[styles.comparisonHeaderCell, { flex: 1.3 }]}> </Text>
            <Text style={styles.comparisonHeaderCell}>Free</Text>
            <Text style={[styles.comparisonHeaderCell, { color: COLORS.gold }]}>VIP</Text>
          </View>
          {COMPARISON_ROWS.map((row, i) => (
            <View key={i} style={[styles.comparisonRow, i === COMPARISON_ROWS.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={[styles.comparisonLabel, { flex: 1.3 }]}>{row.label}</Text>
              <Text style={styles.comparisonValue}>{row.free}</Text>
              <Text style={[styles.comparisonValue, { color: COLORS.gold }]}>{row.vip}</Text>
            </View>
          ))}
        </View>

        {!isVip &&
          plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, !!purchasingPlanId && styles.planCardDisabled]}
              onPress={() => handlePurchase(plan.id)}
              disabled={!!purchasingPlanId}
            >
              <View>
                <Text style={styles.planLabel}>{plan.label}</Text>
                <Text style={styles.planPrice}>{plan.priceLabel}</Text>
              </View>
              {purchasingPlanId === plan.id ? (
                <ActivityIndicator color="#1A1A2E" />
              ) : (
                <Text style={styles.planCta}>Subscribe</Text>
              )}
            </TouchableOpacity>
          ))}

        {isVip && (
          <TouchableOpacity style={styles.dangerButton} onPress={cancelVip}>
            <Text style={styles.actionText}>Cancel VIP Pass</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={restoring}>
          <Text style={styles.restoreText}>{restoring ? "Restoring..." : "Restore Purchases"}</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          TEST MODE - purchases are simulated locally. Real billing (App Store / Play
          Store / RevenueCat) plugs into src/services/iapService.js in Phase 9/10.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bgDark },
  body: { flex: 1, padding: SPACING.lg },
  title: { color: COLORS.textPrimary, fontFamily: FONTS.bold, fontSize: 18, marginBottom: 20 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.gold
  },
  statusLabel: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 12, marginBottom: 6 },
  statusValue: { fontFamily: FONTS.bold, fontSize: 22, marginBottom: 6 },
  expiryNote: { color: COLORS.textMuted, fontFamily: FONTS.regular, fontSize: 11 },
  sectionTitle: { color: COLORS.textPrimary, fontFamily: FONTS.semiBold, fontSize: 14, marginBottom: 10 },
  comparisonCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 20
  },
  comparisonHeaderRow: { flexDirection: "row", marginBottom: 8 },
  comparisonHeaderCell: { flex: 1, color: COLORS.textMuted, fontFamily: FONTS.semiBold, fontSize: 11, textAlign: "right" },
  comparisonRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  comparisonLabel: { color: COLORS.textPrimary, fontFamily: FONTS.medium, fontSize: 12 },
  comparisonValue: { flex: 1, color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 11, textAlign: "right" },
  planCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  planCardDisabled: { opacity: 0.7 },
  planLabel: { color: COLORS.gold, fontFamily: FONTS.semiBold, fontSize: 15 },
  planPrice: { color: COLORS.textSecondary, fontFamily: FONTS.regular, fontSize: 12, marginTop: 2 },
  planCta: {
    color: "#FFFFFF",
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    backgroundColor: COLORS.success,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12
  },
  actionText: { color: "#FFFFFF", fontFamily: FONTS.semiBold, fontSize: 14 },
  restoreButton: { alignItems: "center", paddingVertical: 10, marginBottom: 16 },
  restoreText: { color: COLORS.textMuted, fontFamily: FONTS.medium, fontSize: 13, textDecorationLine: "underline" },
  disclaimer: { color: COLORS.textMuted, fontFamily: FONTS.regular, fontSize: 11, textAlign: "center" }
});

// FILE LOCATION: app/subscription.js (REPLACE existing file)
