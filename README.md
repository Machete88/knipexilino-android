# Knipexilino Android

Android-first AI document manager built with **Expo / React Native**, **TypeScript** and **Zustand**.

Scans, imports and manages documents — with OCR, automatic deadline detection, AI-generated summaries and reply drafts, translation, semantic search, encrypted vault, backup/restore and email integration.

---

## Stack

| Layer | Technology |
|---|---|
| App framework | Expo ~53 + Expo Router ~5 |
| Language | TypeScript ~5.8 |
| State | Zustand ^5 + AsyncStorage |
| Build | EAS Build (preview APK / production AAB) |
| OCR | Tesseract (local) or Google Vision API |
| AI | OpenAI / Anthropic / Gemini |
| Translation | DeepL API |
| Backup | expo-file-system (local JSON export) |

---

## Project structure

```
app/
  _layout.tsx          Root stack
  search.tsx           Semantic search screen
  (tabs)/
    _layout.tsx        Tab navigation
    index.tsx          Home dashboard
    documents.tsx      Document list
    scan.tsx           Camera / file import
    settings.tsx       API keys, backup, vault
  document/[id].tsx    Detail + AI actions

src/
  types/document.ts
  store/documentStore.ts
  data/mockDocuments.ts
  services/
    ai.ts              Summary, reply, translation, embedding
    ocr.ts             Image/PDF OCR
    deadline.ts        Date detection
    translation.ts     DeepL adapter
    search.ts          Keyword + semantic search
    backup.ts          JSON export/import via file system
    vault.ts           AES-256 encryption placeholder
    email.ts           IMAP/SMTP integration placeholder
```

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env
# Fill in API keys for OpenAI / DeepL / Google Vision etc.

# 3. Start Expo dev server
npx expo start
# Scan QR code with Expo Go on Android
```

---

## Build APK (EAS)

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Requires an [Expo account](https://expo.dev) and `eas.json` (included).

---

## Environment variables

See `.env.example` for all required keys:

- `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY`
- `GOOGLE_VISION_API_KEY`
- `DEEPL_API_KEY`
- `VAULT_PASSPHRASE`
- `S3_*` for cloud backup
- `SMTP_*` for email

---

## Roadmap

- [x] v0.1.0 — App scaffold, navigation, services
- [x] v0.2.0 — Persistent store, real scan/import, full detail screen
- [x] v0.3.0 — EAS build, search screen, backup export, zustand persist
- [ ] v0.4.0 — Real OCR (Tesseract / Vision API)
- [ ] v0.5.0 — Real AI (OpenAI / Anthropic)
- [ ] v0.6.0 — Vault encryption, secure storage
- [ ] v1.0.0 — APK on Google Play / F-Droid
