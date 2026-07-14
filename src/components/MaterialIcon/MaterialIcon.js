import React from "react";
import Svg from "react-native-svg";
import { getIconShapes } from "./materialIconShapes";

// type: "silver" | "gold" | "diamond" | "arpg" | "cash" | "dud"
const MaterialIcon = ({ type, size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    {getIconShapes(type)}
  </Svg>
);

export default MaterialIcon;

// FILE LOCATION: src/components/MaterialIcon/MaterialIcon.js (NEW file)
