import { useEffect } from "react";
import { Platform } from "react-native";

// Adsterra site-wide placements, obtained from
// https://beta.publishers.adsterra.com/websites. NOT the same thing as the
// rewarded-video ad-provider rotation in src/services/adNetworkService.js -
// these run passively in the background and aren't tied to the
// 30/30/10/30 revenue split. Web-only (Platform.OS !== "web" is a no-op),
// since Adsterra has no equivalent for a native iOS/Android app.
const SOCIAL_BAR_SRC =
  "https://pl30447991.effectivecpmnetwork.com/92/97/91/929791823e5487b2dbf9ebb99641e5b9.js";
const POPUNDER_SRC =
  "https://pl30447990.effectivecpmnetwork.com/5b/2a/3f/5b2a3ff57322574c4352fff5b5e051e2.js";

// How often a real popunder is allowed to fire, per browser. Adjust freely -
// 30 * 60 * 1000 = 30 minutes, 60 * 60 * 1000 = 1 hour.
const POPUNDER_COOLDOWN_MS = 30 * 60 * 1000;
const POPUNDER_STORAGE_KEY = "spinvault_popunder_last_shown_at";

function msSinceLastPopunder() {
  if (typeof window === "undefined") return Infinity;
  const last = Number(window.localStorage.getItem(POPUNDER_STORAGE_KEY) || 0);
  return Date.now() - last;
}

function markPopunderShownNow() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(POPUNDER_STORAGE_KEY, String(Date.now()));
}

// Renders nothing.
//
// WHY A localStorage TIMESTAMP ALONE ISN'T ENOUGH:
// The Adsterra popunder script attaches its OWN click listener to the
// document the moment it loads, and that listener fires on every single
// click for as long as the page is open - a timestamp check by itself
// can't stop that listener from firing, it can only tell you it fired.
//
// THE FIX - "gatekeeper" listener in the CAPTURE phase:
// A browser click travels in two passes: CAPTURE (top-down, from the
// window down to whatever was clicked) happens first, then BUBBLE
// (bottom-up) happens second - and the vendor's listener (like almost
// all third-party scripts) is a normal bubble-phase listener. By adding
// our own listener with `capture: true`, ours is GUARANTEED to run before
// the vendor's, on every single click, no matter which script loaded
// first. That gives us a chance to call `stopImmediatePropagation()` and
// kill the click before it ever reaches the vendor's listener - the
// popunder script never even finds out that click happened.
//
// So the logic per click is: if we're still inside the cooldown window,
// swallow the click (no popunder). If the cooldown has elapsed, let this
// one click through as normal (a real popunder opens, tied to a real
// click) and immediately stamp "now" as the new cooldown start.
const WebAdScripts = () => {
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return undefined;

    const socialBarEl = document.createElement("script");
    socialBarEl.src = SOCIAL_BAR_SRC;
    socialBarEl.async = true;
    document.body.appendChild(socialBarEl);

    // Registered BEFORE the popunder script is injected, and with
    // capture:true - both together guarantee this always runs first.
    const gatekeeper = (event) => {
      if (msSinceLastPopunder() < POPUNDER_COOLDOWN_MS) {
        event.stopImmediatePropagation();
        return;
      }
      markPopunderShownNow();
      // Falls through and lets the click continue on to the vendor's own
      // listener normally - exactly one real popunder opens from this click.
    };
    document.addEventListener("click", gatekeeper, true);

    const popunderEl = document.createElement("script");
    popunderEl.src = POPUNDER_SRC;
    popunderEl.async = true;
    document.body.appendChild(popunderEl);

    return () => {
      document.removeEventListener("click", gatekeeper, true);
      [socialBarEl, popunderEl].forEach((el) => el.parentNode && el.parentNode.removeChild(el));
    };
  }, []);

  return null;
};

export default WebAdScripts;

// FILE LOCATION: src/components/WebAdScripts/WebAdScripts.js (REPLACE existing file)
