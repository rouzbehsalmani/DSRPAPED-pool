import React from "react";
import { Circle, Polygon, Text as SvgText, Line } from "react-native-svg";

// Returns the inner SVG shapes for a given material icon, drawn inside a
// 24x24 coordinate box. Shared by MaterialIcon.js (top bar / win modal) and
// SpinWheel.js (wedge labels) so every place in the app renders the exact
// same icon for a given material - no more "Silver"/"Gold"/"Diamond"/"$"
// words anywhere except the win modal's result text.
export function getIconShapes(type) {
  switch (type) {
    case "silver":
      return (
        <>
          <Circle cx="12" cy="12" r="10" fill="#B9BAC4" stroke="#8C8C9A" strokeWidth="1.5" />
          <Circle cx="9" cy="9" r="2.5" fill="#E4E4EA" opacity="0.7" />
        </>
      );
    case "gold":
      return (
        <>
          <Circle cx="12" cy="12" r="10" fill="#E8B438" stroke="#B8860B" strokeWidth="1.5" />
          <Circle cx="9" cy="9" r="2.5" fill="#FFE9A8" opacity="0.8" />
        </>
      );
    case "diamond":
      return (
        <>
          <Polygon points="12,2 20,9 12,22 4,9" fill="#5FB6EE" stroke="#2E7FB8" strokeWidth="1.2" />
          <Polygon points="12,2 16,9 8,9" fill="#9AD6F7" opacity="0.7" />
        </>
      );
    case "arpg":
      return (
        <>
          <Polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="#FFD700" stroke="#B8860B" strokeWidth="1.2" />
          <SvgText x="12" y="16" fontSize="10" fontWeight="700" fill="#3B2A05" textAnchor="middle">A</SvgText>
        </>
      );
    case "cash":
      return (
        <>
          <Circle cx="12" cy="12" r="10" fill="#3FC9A6" stroke="#1C7E68" strokeWidth="1.5" />
          <SvgText x="12" y="16" fontSize="12" fontWeight="700" fill="#0B3D30" textAnchor="middle">$</SvgText>
        </>
      );
    case "dud":
    default:
      return (
        <>
          <Circle cx="12" cy="12" r="10" fill="#3A3A55" stroke="#4A4A6A" strokeWidth="1.5" />
          <Line x1="7" y1="7" x2="17" y2="17" stroke="#8C8C9A" strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
  }
}

// FILE LOCATION: src/components/MaterialIcon/materialIconShapes.js (NEW file)
