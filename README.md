# 🔥 GitHub Roaster

> Masukkan username GitHub siapapun — dapatkan roasting berbasis AI yang spesifik, sarkastis, dan (mungkin) menyakitkan.

GitHub Roaster adalah web app full-stack yang menganalisis profil GitHub target — repo, statistik, bio, follower ratio — lalu menghasilkan roast comedy standup yang dipersonalisasi menggunakan AI. Tersedia dalam Bahasa Indonesia (gaul) dan English.

---

## Fitur

- **Roasting berbasis data nyata** — setiap baris roast dibangun dari repo asli, bio asli, dan statistik asli target
- **3 tingkat kepedasan** — Hangat (Singe), Pedas (Burn), Nuklir (Nuclear)
- **Bilingual** — Bahasa Indonesia gaul Jakarta & English, bisa ganti kapan saja
- **Multi-provider AI dengan auto-fallback** — Gemini → Groq → Grok → OpenRouter → OpenAI, otomatis pindah ke provider berikutnya jika satu gagal
- **Multi-key rotation** — daftar API key dipisah koma, auto-rotate saat rate limit
- **Quick roast** — input username langsung dari header hasil tanpa kembali ke halaman awal
- **Settings panel** — atur bahasa dan tingkat kepedasan langsung dari header
- **Preset profiles** — 4 profil demo (Torvalds, Dan Abramov, DHH, Junior Dev Cliché) untuk test tanpa API call
- **Flow 3 tahap** — Input screen → Loading screen (dengan avatar target) → Result screen

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Motion (Framer) |
| Backend | Express.js, Node.js (tsx untuk dev) |
| AI | Gemini 2.0 Flash, Groq (Llama 70B), Grok, OpenRouter, OpenAI |
| Build | Vite + esbuild (server bundle) |
| Icons | Lucide React |

---

## Struktur Project

```
github-roaster/
├── server.ts                    # Entry point — Express + Vite dev middleware
├── server/
│   ├── lib/
│   │   ├── keyRotator.ts        # Multi-key rotation per provider
│   │   └── promptBuilder.ts     # Prompt engineering — roast techniques & tone
│   ├── providers/
│   │   ├── index.ts             # Orchestrator: primary → fallback chain
│   │   ├── gemini.ts
│   │   ├── groq.ts
│   │   ├── grok.ts
│   │   ├── openrouter.ts
│   │   └── openai.ts
│   └── routes/
│       ├── github.ts            # GET /api/github/:username
│       └── roast.ts             # POST /api/roast
└── src/
    ├── App.tsx                  # State machine: input | loading | result
    ├── components/
    │   ├── InputScreen.tsx      # Halaman awal — full screen input
    │   ├── LoadingScreen.tsx    # Loading dengan avatar target + progress
    │   └── ResultScreen.tsx     # Hasil — profile card kiri, roast kanan
    ├── hooks/
    │   └── useRoaster.ts        # Semua state & logic roasting
    ├── data/
    │   ├── presets.ts           # Mock profiles untuk demo
    │   └── loadingSteps.ts      # Teks langkah loading
    └── types/index.ts           # Shared TypeScript types
```

---

## Setup & Instalasi

### Prasyarat

- Node.js 18+
- Minimal satu API key dari provider AI yang didukung

### 1. Clone dan install

```bash
git clone https://github.com/your-username/github-roaster.git
cd github-roaster
npm install
```

### 2. Buat file `.env`

```bash
cp .env.example .env
```

Isi minimal satu API key:

```env
# Provider utama — yang dicoba pertama kali
AI_PROVIDER="gemini"

# Bisa isi lebih dari satu key dipisah koma untuk auto-rotation
GEMINI_API_KEY="key1,key2,key3"
GEMINI_MODEL="gemini-2.0-flash"

# Provider lain sebagai fallback (opsional tapi direkomendasikan)
GROQ_API_KEY="your_groq_key"
GROK_API_KEY="your_grok_key"
OPENROUTER_API_KEY="your_openrouter_key"
OPENAI_API_KEY="your_openai_key"

# GitHub token — opsional, naikkan rate limit dari 60 → 5000 req/jam
GITHUB_TOKEN="your_github_pat"

PORT=3000
```

### 3. Jalankan

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

Buka `http://localhost:3000`

---

## Cara Kerja AI

### Multi-Provider Fallback

Server mencoba provider secara berurutan, dimulai dari `AI_PROVIDER` di `.env`:

```
Gemini → Groq → Grok → OpenRouter → OpenAI
```

Jika satu provider gagal (rate limit, quota habis, key tidak valid) — otomatis lanjut ke berikutnya tanpa error ke user.

### Multi-Key Rotation

Setiap provider bisa menerima beberapa API key dipisah koma:

```env
GEMINI_API_KEY="key1,key2,key3"
```

Saat satu key kena rate limit, sistem otomatis pakai key berikutnya dalam satu request.

### Prompt Engineering

`server/lib/promptBuilder.ts` membangun prompt dengan:

- **Data profil spesifik** — username, bio, follower ratio, umur akun, daftar repo lengkap
- **Roast ammunition** — flags otomatis untuk pattern mencurigakan (tutorial hell, following >>> followers, zero-star repos, bio klaim vs realita repo)
- **Tone guide per level** — instruksi karakter berbeda untuk Singe / Burn / Nuclear
- **Hard limits** — setiap field dibatasi ketat agar output tidak kepanjangan
- **Anti-nama rule** — AI dilarang sebut username/nama, hanya "bro", "ini orang", dll

---

## Environment Variables

| Variable | Keterangan | Default |
|---|---|---|
| `AI_PROVIDER` | Provider utama (`gemini` / `groq` / `grok` / `openrouter` / `openai`) | `gemini` |
| `GEMINI_API_KEY` | API key Gemini, boleh koma-separated | — |
| `GEMINI_MODEL` | Model Gemini yang dipakai | `gemini-2.0-flash` |
| `GROQ_API_KEY` | API key Groq | — |
| `GROQ_MODEL` | Model Groq | `llama-3.3-70b-versatile` |
| `GROK_API_KEY` | API key xAI Grok | — |
| `GROK_MODEL` | Model Grok | `grok-3-mini` |
| `OPENROUTER_API_KEY` | API key OpenRouter | — |
| `OPENROUTER_MODEL` | Model OpenRouter | `meta-llama/llama-3.3-8b-instruct:free` |
| `OPENAI_API_KEY` | API key OpenAI | — |
| `OPENAI_MODEL` | Model OpenAI | `gpt-4o-mini` |
| `GITHUB_TOKEN` | GitHub Personal Access Token (opsional) | — |
| `PORT` | Port server | `3000` |

---

## API Endpoints

### `GET /api/github/:username`

Fetch profil dan repo publik GitHub user.

**Response:**
```json
{
  "profile": { "login": "...", "name": "...", "bio": "...", "followers": 0, "..." },
  "repos": [{ "name": "...", "language": "...", "stargazers_count": 0, "..." }]
}
```

### `POST /api/roast`

Generate roast untuk profil yang sudah di-fetch.

**Body:**
```json
{
  "profile": { "..." },
  "repos": [{ "..." }],
  "heatLevel": "nuclear",
  "language": "id"
}
```

**Response:**
```json
{
  "roast": {
    "developerTitle": "...",
    "statsRoast": "...",
    "bioRoast": "...",
    "reposRoast": "...",
    "theMainRoast": "...",
    "roastedTags": ["#tag1", "#tag2"],
    "burnScore": 87
  },
  "provider": "groq"
}
```

---

## Lisensi

MIT
