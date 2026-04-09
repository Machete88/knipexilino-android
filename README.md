# Knipexilino Android

Android-first AI document manager built with **Expo / React Native**, **TypeScript** and **Zustand**.

Scans, imports and manages documents — with OCR, automatic deadline detection, AI-generated summaries and reply drafts, translation, semantic search, encrypted vault, backup/restore and email integration.

---

## Stack

| Layer | Technology |
|---|---|
| App framework | Expo ~53 + Expo Router ~5 |
| Language | TypeScript ~5.8 |
| State | Zustand ^5 + AsyncStorage (persisted) |
| Build | EAS Build (preview APK / production AAB) |
| OCR | Google Vision API / Tesseract fallback |
| AI | OpenRouter (Mistral, GPT-4o, Claude, Llama …) |
| Translation | DeepL API → OpenRouter fallback |
| Backup | expo-file-system (local JSON export) |
| Security | expo-secure-store for all API keys |

---

## Project structure

```
app/
  _layout.tsx              Root stack
  search.tsx               Semantic search screen
  (tabs)/
    _layout.tsx            Tab navigation
    index.tsx              Home dashboard
    documents.tsx          Document list + live search
    scan.tsx               Camera / file import → OCR
    settings.tsx           API keys, model select, backup, vault
  document/[id].tsx        Detail + AI actions

src/
  types/document.ts
  store/documentStore.ts   Zustand + AsyncStorage persist
  data/mockDocuments.ts
  services/
    ai.ts                  OpenRouter (summary, reply, translation)
    ocr.ts                 Google Vision API / placeholder
    deadline.ts            Date extraction
    translation.ts         DeepL → AI fallback
    search.ts              Keyword search (embedding-ready)
    backup.ts              JSON export via expo-file-system
    vault.ts               Private flag + AES placeholder
    email.ts               SMTP placeholder
```

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env
# Keys go into Settings screen → saved to expo-secure-store

# 3. Start Expo dev server
npx expo start
# Scan QR code with Expo Go on Android
```

---

## API Keys Setup (in-app)

All keys are stored securely via `expo-secure-store` — never in code or `.env` at runtime:

1. Open the app → **Einstellungen** tab
2. Enter your **OpenRouter API Key** (`sk-or-v1-...`)
3. Pick a model (Mistral 7B is free on OpenRouter)
4. Optionally add **Google Vision Key** for real OCR
5. Optionally add **DeepL Key** for premium translation
6. Tap **Keys speichern**

---

## Build APK (EAS)

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
# → Downloads a ready-to-install APK
```

---

## Roadmap

- [x] v0.1.0 — App scaffold, navigation, services
- [x] v0.2.0 — Persistent store, real scan/import, full detail screen
- [x] v0.3.0 — EAS build, search screen, backup export, zustand persist, CI
- [x] v0.4.0 — Real OpenRouter AI, Google Vision OCR, secure key storage
- [ ] v0.5.0 — Semantic search with embeddings
- [ ] v0.6.0 — AES-256 vault encryption
- [ ] v0.7.0 — Email / IMAP integration
- [ ] v1.0.0 — APK release
