# Epic Math (Expo app)

A math practice game for kids, built with Expo Router + TypeScript. Currently in **Phase 1: Foundation** — navigation, design system, reusable components, and local storage are in place; the math quiz itself (Times Tables, Subtraction, Division, Percentages, Mixed Bag) lives under the **Play** tab, carried over unchanged from the original prototype.

Built on **Expo SDK 54**.

## Run it with Expo Go

1. Install [Expo Go](https://expo.dev/go) on your phone (App Store / Play Store).
2. On your computer, from this folder:
   ```
   npm install
   npx expo start
   ```
3. Scan the QR code that appears in the terminal/browser with your phone:
   - iOS: scan with the Camera app
   - Android: scan from inside the Expo Go app
4. Make sure your phone and computer are on the same WiFi network.

## Typecheck

```
npm run typecheck
```

## Project structure

```
app/                          - Expo Router screens (file-based routing)
  _layout.tsx                 - root layout: gradient background, gesture/safe-area providers
  (tabs)/
    _layout.tsx                - 5-tab navigator: Home, Play, Progress, Rewards, Parent
    index.tsx                  - Home tab (profile, XP, coins, continue button)
    play.tsx                   - Play tab (mode select -> quiz -> results)
    progress.tsx                - placeholder (Phase 2+)
    rewards.tsx                 - placeholder (Phase 2/6)
    parent.tsx                  - placeholder (Phase 4/5)

components/                   - reusable UI primitives
  Button.tsx, Card.tsx, ProgressBar.tsx, Modal.tsx,
  LoadingState.tsx, EmptyState.tsx, Confetti.tsx, ScreenContainer.tsx

constants/theme.ts            - design tokens: colors, gradients, spacing, radii, typography

features/
  gameplay/                    - the math quiz itself
    questions.ts                - question generators (times/subtraction/division/percentages)
    modes.ts                     - per-mode metadata (icon, label, gradient)
    ModeSelect.tsx                - mode-picker grid
    QuizFlow.tsx                   - question/answer/feedback/streak/progress
    ResultsSummary.tsx              - star-rated results screen
  profile/
    sampleProfiles.ts            - seed data for the local profile (pre-accounts)

hooks/useActiveProfile.ts      - loads/saves the active child profile via AsyncStorage
services/storage.ts            - AsyncStorage read/write helpers
types/index.ts                 - shared TypeScript types (GameMode, Question, ChildProfile)
```

## Roadmap

See the phase breakdown in project conversation history / commit messages. Phase 1 (this) covers foundation only — no accounts, Supabase, RevenueCat, AdMob, Adventure Mode, or XP/coin awarding yet. Those are Phases 2 onward.
