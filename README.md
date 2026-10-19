# Screen assistant (version 3)

Show a screenshot of an incomprehensible screen and get an explanation in simple words and step-by-step support
with backlighting of the required button. Suitable for children, teens, adults and seniors: tone, text size, examples and
alerts are tailored to your profile and interests.

## Launch
- **Website:** `cd app && python3 -m http.server 8080` → http://localhost:8080 (on Windows `python`).
- **Appendix:** `npm install && npm start`; installer - `npm run build`.
- When you first start, select your profile, interests and mode. Without a key, everything is calculated directly on the device.

## Connecting smart AI (free)
1. https://aistudio.google.com/apikey → Create API key.
2. ⚙ → “Privacy and AI” → insert key → **"Check key"**. The application itself will select a working model.

### If the AI "doesn't work"
The main reason is version 2: the gemini-2.5-flash model was disabled by Google on 10/16/2026. Now the application
goes through the current models (gemini-flash-latest, 3.5-flash, ...) and shows the real reason for the failure
(incorrect key, limit, no connection) with the “Details for assistant” block.

## Privacy
- “Only on my device” mode: nothing is sent (the text recognition module is downloaded for the first time).
- With the free Gemini plan, Google can use what you send to improve services and read requests
  (if a Cloud Billing payment account is connected, the conditions are different). Therefore: auto-hide numbers, emails, passwords,
  manual painting, consent before the first shipment, “What is being sent?” button.
- The key is only on the device (you can “before closing the tab”). History and pictures are disabled, there is “Erase everything”
  PIN for settings (protection from accidental changes, not from hacking).

## Profiles and settings
Child / Teen / Adult / Over 60: your tone, safety rules and recommended look. Customizable:
6 themes, interface and backlight color, 5 fonts, text size, spacing, angles, button size, animation, width,
language of answers, simplicity of explanations, number of steps, voice, who to call for help.
