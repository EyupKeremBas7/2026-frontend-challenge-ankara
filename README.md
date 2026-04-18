# Jotform Frontend Challenge Project

## User Information

- **Name**: Eyüp Kerem Baş

## Project Description

**Investigation Dashboard** — React-based dashboard that visualizes crowdsourced investigation data about a subject named Podo.

**Core Features:**
- Timeline view of Podo's movements with coordinates
- Interactive map with OpenStreetMap (Leaflet)
- People index with suspicion scoring
- Chain-of-relations visualization
- Multi-source data integration (Sightings, Messages, Tips, Notes, Check-ins)

**Tech Stack:** React 19.2.4 · Vite 8.0.4 · Leaflet 1.9.4 + React-Leaflet 5.0.0 · CSS Grid/Flexbox

## Getting Started

## Environment Variables (.env)

Since the project fetches data from the live Jotform API, a `.env` file is required in the project root.

Example `.env`:

```bash
VITE_API_KEY_1=your_jotform_api_key
VITE_API_KEY_2=your_second_key_optional
VITE_API_KEY_3=your_third_key_optional

VITE_FORM_CHECKINS=your_checkins_form_id
VITE_FORM_MESSAGES=your_messages_form_id
VITE_FORM_SIGHTINGS=your_sightings_form_id
VITE_FORM_PERSONAL_NOTES=your_personal_notes_form_id
VITE_FORM_ANONYMOUS_TIPS=your_anonymous_tips_form_id
```

Notes:
- At least `VITE_API_KEY_1` must be defined.
- If form IDs are incorrect, related data sources may return empty/error states.
- After changing `.env`, restart the dev server (`npm run dev`).

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in browser.

## Optional: Run with Docker

If you want to run the project with Docker (optional):

```bash
docker compose up --build
```

Then open: `http://localhost:5173`

Notes:
- Because `docker-compose.yml` uses `env_file: .env`, the `.env` file is still required.
- To run in detached mode: `docker compose up -d --build`
- To stop: `docker compose down`

### Data Status: ✅ WORKING

All 5 data sources successfully loaded:
- Sightings: 9 records
- Messages: 14 records  
- Anonymous Tips: 5 records
- Personal Notes: 8 records
- Check-ins: 9 records
- **Total: 45 records, 11 unique people indexed**

### Most Suspicious Person: **PODO** (Score: 24.5/100)
- 6 sightings across locations
- 8 connections (Kağan, Fatih, Cem, Hami, Aslı, Can, Kağan A., Kagan)
- 5 messages sent
- Central figure in investigation network

---

# 🚀 Challenge Announcement

## 📅 Date and Time
The challenge duration is 3 hours from the official start time on Saturday.

## 🎯 Challenge Concept
In this challenge, participants are expected to build a web application based on a custom scenario. Scenario details are shared at the start of the challenge. Participants should fork the provided GitHub repository and build their solution in their own environment.

## 📦 GitHub Repository
Repository used in the challenge: https://github.com/cemjotform/2026-frontend-challenge-ankara

## 🛠️ Preparation Steps
1. Fork the GitHub repository
2. Prepare your development environment with your preferred framework
3. Push your prepared setup to your forked repository

## 💡 Important Notes
- Participants may use their preferred framework
