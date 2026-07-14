import React, { useRef, useState } from "react";
import { View, Text, Animated, Easing, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, G, Text as SvgText } from "react-native-svg";
import { pickWeightedIndex } from "../../utils/weightedRandom";
import { getIconShapes } from "../MaterialIcon/materialIconShapes";

const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 6;
const ICON_BOX = 24; // materialIconShapes are authored in a 24x24 box
const ICON_SIZE = 20; // rendered size inside a wedge
const ICON_SCALE = ICON_SIZE / ICON_BOX;

const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeWedge = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
};

// A real circular wheel with EQUAL-SIZED wedges, like a normal casino wheel.
// The real odds live only in each segment's `weight` (used to pick the
// winner) - visual size never encodes probability, so the wheel always
// looks standard while staying mathematically fair underneath.
// Each wedge shows a small vector icon + a short number instead of a text
// label, so nothing spills into the neighboring wedge.
// segments: [{ icon, amount, weight, color, prize }]
const SpinWheel = ({ segments, onResult, disabled }) => {
  const [spinning, setSpinning] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const currentRotationRef = useRef(0);

  const sliceAngle = 360 / segments.length;
  const wedges = segments.map((seg, i) => ({
    ...seg,
    startAngle: i * sliceAngle,
    endAngle: (i + 1) * sliceAngle
  }));

  const spin = () => {
    if (spinning || disabled) return;
    setSpinning(true);

    const winnerIndex = pickWeightedIndex(segments.map((s) => s.weight));
    const winner = wedges[winnerIndex];
    const midAngle = winner.startAngle + sliceAngle / 2;

    // Land exactly on the winner regardless of where the wheel currently
    // rests (fixes drift that would otherwise creep in after every repeat
    // spin): compute how far to rotate FROM the current resting angle, not
    // from an assumed start of 0.
    const currentVisual = ((currentRotationRef.current % 360) + 360) % 360;
    const desiredVisual = (360 - midAngle) % 360;
    let delta = desiredVisual - currentVisual;
    if (delta < 0) delta += 360;

    const extraSpins = 7;
    const target = currentRotationRef.current + extraSpins * 360 + delta;

    Animated.timing(rotation, {
      toValue: target,
      duration: 6200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(() => {
      currentRotationRef.current = target;
      setSpinning(false);
      onResult(winner.prize, winner);
    });
  };

  const spinDeg = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.wheelArea}>
        <View style={styles.pointer} />
        <Animated.View style={{ transform: [{ rotate: spinDeg }] }}>
          <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {wedges.map((seg, i) => (
              <Path
                key={`wedge-${i}`}
                d={describeWedge(CENTER, CENTER, RADIUS, seg.startAngle, seg.endAngle)}
                fill={seg.color}
                stroke="#0F0F1E"
                strokeWidth={2}
              />
            ))}
            {wedges.map((seg, i) => {
              const mid = seg.startAngle + sliceAngle / 2;
              const iconPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.68, mid);
              const textPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.42, mid);
              const tx = iconPos.x - (ICON_BOX * ICON_SCALE) / 2;
              const ty = iconPos.y - (ICON_BOX * ICON_SCALE) / 2;
              return (
                <G key={`label-${i}`}>
                  <G transform={`translate(${tx} ${ty}) scale(${ICON_SCALE})`}>
                    {getIconShapes(seg.icon)}
                  </G>
                  {seg.amount != null && (
                    <SvgText
                      x={textPos.x}
                      y={textPos.y + 4}
                      fontSize="11"
                      fontWeight="700"
                      fill="#0F0F1E"
                      textAnchor="middle"
                    >
                      {seg.amount}
                    </SvgText>
                  )}
                </G>
              );
            })}
          </Svg>
        </Animated.View>
        <View style={styles.hub}>
          <Text style={styles.hubText}>SPIN</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.spinButton, (spinning || disabled) && styles.spinButtonDisabled]}
        onPress={spin}
        disabled={spinning || disabled}
        activeOpacity={0.85}
      >
        <Text style={styles.spinButtonText}>{spinning ? "Spinning..." : "Spin the Wheel"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", paddingVertical: 20 },
  wheelArea: { width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  pointer: {
    position: "absolute",
    top: -4,
    zIndex: 5,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFD700"
  },
  hub: {
    position: "absolute",
    top: SIZE / 2 - 28,
    left: SIZE / 2 - 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0F0F1E",
    borderWidth: 2,
    borderColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center"
  },
  hubText: { color: "#FFD700", fontWeight: "800", fontSize: 11 },
  spinButton: { backgroundColor: "#FFD700", paddingHorizontal: 36, paddingVertical: 14, borderRadius: 16 },
  spinButtonDisabled: { opacity: 0.5 },
  spinButtonText: { color: "#1A1A2E", fontWeight: "800", fontSize: 15 }
});

export default SpinWheel;

// FILE LOCATION: src/components/SpinWheel/SpinWheel.js (REPLACE existing file)
