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

Proje canlı Jotform API'den veri çektiği için kök dizinde `.env` dosyası zorunludur.

Örnek `.env`:

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

Notlar:
- En az `VITE_API_KEY_1` tanımlı olmalıdır.
- Form ID'ler doğru değilse ilgili veri kaynağı boş/hata dönebilir.
- `.env` değiştirdikten sonra dev server'ı yeniden başlat (`npm run dev`).

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in browser.

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

# 🚀 Challenge Duyurusu

## 📅 Tarih ve Saat
Cumartesi günü başlama saatinden itibaren üç saattir.

## 🎯 Challenge Konsepti
Bu challenge'da, size özel hazırlanmış bir senaryo üzerine web uygulaması geliştirmeniz istenecektir. Challenge başlangıcında senaryo detayları paylaşılacaktır.Katılımcılar, verilen GitHub reposunu fork ederek kendi geliştirme ortamlarını oluşturacaklardır.

## 📦 GitHub Reposu
Challenge için kullanılacak repo: https://github.com/cemjotform/2026-frontend-challenge-ankara

## 🛠️ Hazırlık Süreci
1. GitHub reposunu fork edin
2. Tercih ettiğiniz framework ile geliştirme ortamınızı hazırlayın
3. Hazırladığınız setup'ı fork ettiğiniz repoya gönderin

## 💡 Önemli Notlar
- Katılımcılar kendi tercih ettikleri framework'leri kullanabilirler
