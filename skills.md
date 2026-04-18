# CLAUDE.md — Missing Podo: The Ankara Case


AI rules for this 3-hour session. Read before every action.

---

## Context

Investigation dashboard. 5 data sources (Checkins, Messages, Sightings, PersonalNotes, AnonymousTips).
Goal: make Podo's last known chain of events visible, and help the user identify suspicious people.

---

## Architecture

Flat. No feature folders. No exceptions.

```
src/
  api/         → one file per endpoint (checkins.js, messages.js, etc.)
  hooks/       → usePeople.js, usePodo.js, useSearch.js
  components/  → SearchBar, FilterBar, PersonCard, RecordList, DetailPanel, MapView, Timeline
  utils/       → linkRecords.js, suspicionScore.js, fuzzyMatch.js
  App.jsx
```

---

## Plan → Act

For any change touching more than 1 file:
1. Write bullet-point plan
2. Wait for confirmation
3. Then code

No surprise rewrites.

---

## Build Order (stick to this)

### Phase 1 — Core (first 90 min)
- [ ] Fetch all 5 endpoints, log raw data
- [ ] Person matching across sources (name normalization / fuzzy)
- [ ] RecordList: show all records, grouped by person
- [ ] DetailPanel: click a person → see all their linked records
- [ ] SearchBar: filter by name, location, content

### Phase 2 — Investigation UX (next 45 min)
- [ ] Podo's chain: ordered sightings timeline (chronological)
- [ ] Suspicion score: weighted by tip reliability + sighting frequency + message content
- [ ] "Last seen with" summary panel
- [ ] "Most suspicious" ranked list

### Phase 3 — Bonus (final 30 min, only if Phase 1+2 done)
- [ ] Map view with location pins
- [ ] Map ↔ list sync (click pin → open detail)
- [ ] Responsive polish

---

## Person Matching (critical)

Same person may appear under slightly different names across sources.
Normalize before linking:
- Lowercase + trim
- Remove punctuation
- Levenshtein distance ≤ 2 = same person (or simple includes check as fallback)

Build a `PersonIndex` object early — everything else depends on it.

---

## Mandatory State Handling

Every fetch must render all three states. No exceptions.

```jsx
if (loading) return <LoadingState />
if (error)   return <ErrorState message={error.message} />
if (!data?.length) return <EmptyState />
return <Component data={data} />
```

---

## Suspicion Score

Weight factors:
- Anonymous tip mentioning person → +2 per tip (reliability flag matters)
- Sighting with Podo → +3
- Last person seen with Podo → +5
- Message sent close to disappearance time → +2

Show score visibly on PersonCard. Sort by default descending.

---

## React Rules

- Functional components + hooks only. No class components.
- Custom hook per data source.
- Co-locate state close to consumer.

---

## Mock Data is Sacred

Do not modify any JSON or API response shape.
Transform only inside hooks/utils, never at the source.

---

## Immutable Stack

No new npm dependencies without permission.
No vite/config changes.
Use React primitives: useState, useEffect, useMemo, useCallback.

---

## Never Downgrade

Bug in filter? Fix the filter. Do not delete it.
Bug in person matching? Fix the logic. Do not hardcode.

---

## Git

Small, frequent commits.
Format: `feat: add suspicion score to PersonCard`
Commit after each Phase checkpoint.

---

## Definition of Done

- [ ] Renders without console errors
- [ ] All 3 states handled (loading / error / empty)
- [ ] Data flows end-to-end from API to UI
- [ ] No existing feature broken
- [ ] Matches existing design system

---

## Time Check

| Time elapsed | Where you should be |
|---|---|
| 30 min | All 5 endpoints fetched, PersonIndex built |
| 60 min | RecordList + DetailPanel working |
| 90 min | Search/filter + Podo chain visible |
| 120 min | Suspicion score + summary panels |
| 150 min | Bonus (map / timeline) or polish |
| 170 min | README written, final commit pushed |

URL = https://cem.jotform.pro/hackathon-2026/ankara/
