# Jotform Frontend Challenge Project

## User Information
Please fill in your information after forking this repository:

- **Name**: Eyüp Kerem Baş

## Project Description
[Add a brief description of your project here]

## Getting Started
[Add instructions for setting up and running the project]

# Development (no API requests)
If you want to develop without hitting Jotform API rate limits, the app will **prefer local JSON** in dev mode when these files exist:

- `public/mock/checkins.json`
- `public/mock/messages.json`
- `public/mock/sightings.json`
- `public/mock/personalNotes.json`
- `public/mock/anonymousTips.json`

To generate them:

```bash
node scripts/export-submissions.mjs
node scripts/copy-exports-to-public.mjs
npm run dev
```

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
