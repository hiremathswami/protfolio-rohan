# Rohan OS

A responsive, single-page portfolio desktop for Rohan Hiremathswami.

## Run locally

Serve the folder with any static file server, for example:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Content and privacy

- Profile content lives in `index.html` and `app.js`.
- The whiteboard uses the local-only key `rohan-os-whiteboard-v1`.
- Theme preference uses `rohan-os-theme-v1`.
- There are no API keys, tracking scripts, forms, or third-party embeds.
- The generated avatar in `assets/portraits/rohan-avatar.png` is based only on owner-provided likeness reference.

## Deployment

Deploy this folder to any static hosting provider or Vercel. Set the site domain and contact/booking conversion before production launch.

---

## 🤖 Adi — AI Portfolio Assistant Integration

This portfolio includes **Adi**, an AI portfolio assistant that helps recruiters, hiring managers, and collaborators explore Rohan Hiremathswami’s verified work.

### 1. Where to Update Portfolio Data
All assistant knowledge is centralized in a single source of truth:
- [src/data/portfolioData.js](file:///c:/Users/Rohan%20Hiremathswami/Documents/Codex/2026-08-06/files-mentioned-by-the-user-rohan/personal-ai-operating-system/src/data/portfolioData.js)

To update your skills, projects, certifications, education, availability, or contact links, edit `portfolioData.js`. Adi will automatically read and cite the updated information.

### 2. Client-Side Fallback Search Mode
If no API key is configured or the network is offline, Adi operates in **Portfolio Search Mode**. It uses client-side natural query matching and intent analysis against `portfolioData.js` to provide factual answers, source chips, and action links without making external network calls.

### 3. Configuring Server-Side AI API Keys
For live LLM responses, set environment variables on your server or Vercel project:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your server API key:
   ```env
   AI_API_KEY=your_llm_api_key_here
   AI_MODEL=gemini-1.5-flash
   ```
3. The serverless API endpoint at `/api/adi.js` will handle request processing and system prompt construction securely without exposing the API key to client bundles.

### 4. Recruiter Job Description Matcher
Adi includes a **Job Description Matcher** ("Analyze fit"). Visitors can paste job requirements, and Adi evaluates the text against verified evidence in `portfolioData.js`, breaking output down into:
- Role-fit Overview
- Strong Portfolio Matches
- Potential Gaps / Unverified Areas
- Suggested Next Steps

### 5. Privacy & Voice Interactions
- Optional Voice Input (`🎤`) and Read-Aloud Speech (`🔊`) operate strictly on tap.
- No automatic recording, listening, audio storage, or automatic voice playback.
- Chat history is stored locally in `sessionStorage` with a clear chat button control (`🗑️`).
