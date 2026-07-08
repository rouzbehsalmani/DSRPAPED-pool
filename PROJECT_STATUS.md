# DARPAPED-pool - Project Status

## Stack
- React Native + Expo (SDK 57), Web target via react-native-web
- State management: Zustand
- Repo: https://github.com/rouzbehsalmani/DSRPAPED-pool
- Local path: E:\desktop\استارتاپها\DARPAPED-pool
- Dev server port: 8082 (fixed in package.json to avoid the 8081 prompt)
- Run: npx expo start --web

## Known environment gotchas (do not repeat these mistakes)
- npm registry must be https://registry.npmjs.org/ (a corrupted mirror caused hours of ECONNRESET errors)
- Windows Defender must have an exclusion on the project folder (EPERM rmdir errors during install otherwise)
- LongPathsEnabled must be set in the registry (react-native has very deep node_modules paths)
- package.json must be saved WITHOUT a BOM (ASCII/UTF8-no-BOM), otherwise Expo's JSON parser throws
- User's OS is Windows, no WSL - never suggest Linux-only tooling

## Economy design decisions (final, do not re-litigate these)
- Ad revenue is NOT fixed - it depends on the user's real ad-market tier (TIER_1/2/3), which is auto-detected (in production: real geo/eCPM data from the Ad Network SDK), never user- or dev-editable in the UI. Currently mocked via src/services/geoTierService.js (locale-based guess) - must be replaced by real SDK data in Phase 10.
- Split ratio is always 30% direct cash / 30% ARPG share / 10% platform / 30% Mega Pool, regardless of tier or amount.
- ARPG award threshold: every $0.02 accumulated in the user's ARPG share pool = 1 ARPG token (NOT $0.20 - that is the token's fixed USD value, a separate constant).
- Multiple thresholds crossed in a single revenue event must ALL be queued (pendingArpgAwards), never dropped.
- Claiming pending ARPG awards happens ALL AT ONCE per OK tap (not one-by-one).
- Mega Pool wins (once the wheel is built) must run through resolveMegaPoolWin(amount), which splits 10% team / 50% user cash / 40% user ARPG share (same threshold/queue logic reused).
- Material currencies (Silver/Gold/Diamond) are separate from the ad-revenue split; they come from mini-game rewards (not yet implemented) and manually convert 10:1 up the chain to ARPG.

## File structure (all built so far - Phase 1 complete)
src/
  config/economyConfig.js
  services/geoTierService.js
  store/economyStore.js
  utils/uiEventEmitter.js
  components/TopBar/TopBar.js
  components/SimulateAdButton/SimulateAdButton.js
  components/ARPGCongratsModal/ARPGCongratsModal.js
  components/FloatingArpgText/FloatingArpgText.js
  screens/Phase1TestScreen/Phase1TestScreen.js
App.js
package.json

## Phase plan
- Phase 1 - DONE: Core economy/tokenomics engine, fully tested and debugged.
- Phase 2 - NEXT: Main navigation (burger/drawer menu) + placeholder screens for: Settings, Wallet, VIP Pass (Subscription), Main Game Selection, Mega Pool Wheel, VIP Games. Replace App.js direct render with a real navigation root.
- Phase 3: Spin the Wheel - 8 segments, standard materials + small cash rewards.
- Phase 4: Scratch Card - mask/alpha layer reveal, 3x3 or 3x6 grid, 3-match win logic.
- Phase 5: Slot Machine - 3 reels, lever pull animation, match-3 payout.
- Phase 6: Lucky Chests - 3x3 grid, pick 1 of 9, randomized prize/empty.
- Phase 7: Mega Pool Wheel - global jackpot, 24h cooldown, prizes $1/$2/$5/$10, guardrail against underfunded pool, hooks into resolveMegaPoolWin from Phase 1.
- Phase 8: VIP (zero-dud) variants of all 4 mini-games.
- Phase 9: Real Wallet screen (cash balance, withdrawal requests, top-ups) + real Subscription/VIP Pass purchase flow.
- Phase 10: Replace SimulateAdButton + geoTierService mock with a real Ad Network SDK integration (AdMob/Unity Ads).

## Immediate next step
Start Phase 2: navigation shell. Needs a decision on which navigation library (React Navigation is the standard choice for Expo) before scaffolding.
