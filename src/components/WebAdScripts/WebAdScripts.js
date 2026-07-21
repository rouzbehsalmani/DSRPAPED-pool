import { useEffect } from "react";
import { Platform } from "react-native";

// Adsterra site-wide placements (Popunder + Social Bar) - obtained from
// https://beta.publishers.adsterra.com/websites. IMPORTANT DISTINCTION:
// these are NOT the same thing as the rewarded-video ad-provider rotation
// in src/services/adNetworkService.js / adProviders/*.js. Those are
// consent-based ("watch this to earn a reward") and only fire from
// GameScreenShell's AdBreakModal. Adsterra Popunder/Social Bar are passive,
// site-wide, non-rewarded placements that just run in the background the
// whole time someone is on the site - they don't feed into the 30/30/10/30
// split logic at all, since there's no single "view" to attribute revenue
// to. Keep that revenue as pure platform income, or fold an estimate of it
// into the Mega Pool manually later if you want - that's a business
// decision, not something the code currently automates.
//
// Renders nothing. Web-only (Platform.OS !== "web" is a no-op) since these
// are raw <script> tags meant for a browser page, not something that has
// any equivalent inside a native iOS/Android app - Adsterra doesn't apply
// there at all, only to the Vercel web build.
const ADSTERRA_SCRIPTS = [
  "https://pl30447990.effectivecpmnetwork.com/5b/2a/3f/5b2a3ff57322574c4352fff5b5e051e2.js", // Popunder
  "https://pl30447991.effectivecpmnetwork.com/92/97/91/929791823e5487b2dbf9ebb99641e5b9.js" // Social Bar
];

const WebAdScripts = () => {
  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") return undefined;

    const injected = ADSTERRA_SCRIPTS.map((src) => {
      const el = document.createElement("script");
      el.src = src;
      el.async = true;
      document.body.appendChild(el);
      return el;
    });

    return () => {
      injected.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
    };
  }, []);

  return null;
};

export default WebAdScripts;

// FILE LOCATION: src/components/WebAdScripts/WebAdScripts.js (NEW file)
