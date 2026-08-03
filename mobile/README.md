# Math Practice (Expo app)

Same math quiz as the web version, built as an Expo (React Native) app so it can run on your phone through Expo Go.

- Times Tables (1-12), Subtraction, Division, Percentages, and Mixed Bag modes
- Sets of 20 questions, one at a time, with instant correct/wrong feedback
- Confetti, streaks, an animated progress bar, and a star-rated results screen

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

## Project structure

```
App.js                  - screen router (home / quiz / results)
src/questions.js        - question generators for each mode
src/theme.js            - per-mode colors and gradient background
src/components/Confetti.js
src/screens/HomeScreen.js
src/screens/QuizScreen.js
src/screens/ResultsScreen.js
```
