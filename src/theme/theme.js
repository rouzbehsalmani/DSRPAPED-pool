// src/theme/theme.js
//
// Central style tokens - colors, spacing, radii, fonts. Pull from here
// instead of hardcoding hex values / font names so the whole app's look
// stays consistent and can be re-themed from one place later.

export const COLORS = {
  bgDeep: "#05050A",
  bgDark: "#0B0B16",
  bgCard: "#1A1A2E",
  bgCardAlt: "#20203A",
  bgChip: "#26264A",
  border: "#2A2A45",
  borderSoft: "#26264A",
  gold: "#FFD700",
  goldSoft: "#FFE9A8",
  goldDeep: "#B8860B",
  textPrimary: "#FFFFFF",
  textSecondary: "#AAAAC0",
  textMuted: "#77779A",
  success: "#4CAF50",
  danger: "#E05555"
};

export const GRADIENTS = {
  background: ["#171728", "#0B0B16"],
  gold: ["#FFE9A8", "#E8B438"],
  topBar: ["#22224A", "#15152A"]
};

export const RADIUS = { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 };
export const SPACING = { xs: 6, sm: 10, md: 16, lg: 20, xl: 28 };

export const FONTS = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semiBold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold"
};

// FILE LOCATION: src/theme/theme.js (NEW file)
