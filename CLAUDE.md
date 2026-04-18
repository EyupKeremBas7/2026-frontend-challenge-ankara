# CLAUDE.md — Jotform Frontend Hackathon

AI system rules for this session. Read and follow these before every action.

---

## 1. Plan → Act (CRITICAL)

For any task involving **more than one file or component**, you MUST:

1. Write a short bullet-point plan (2–4 lines)
2. Wait for my confirmation
3. Then write code

Do **not** generate large file changes speculatively. Do not hallucinate cross-file rewrites.

> ✅ Allowed: "Here's my plan — confirm?" → I confirm → you code.
> ❌ Forbidden: Silently rewriting 5 files because you thought it would help.

---

## 2. Immutable Stack

You are **forbidden** from adding new npm dependencies without my explicit permission.

- Use `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback` — React primitives only
- Do not modify `vite.config`, `tsconfig`, `package.json`, or any config file unless I ask
- Do not suggest switching to a different build tool, router, or state manager

---

## 3. Never Downgrade

If a feature has a bug, **fix the bug**. Do not:

- Delete the feature to make the error go away
- Simplify the requirement to avoid the complexity
- Replace a working implementation with a stub
- Switch to a weaker model, library version, or approach without telling me

> "It's simpler this way" is not a valid reason to remove something that was working.

---

## 4. Mock Data is Sacred

The provided mock data / API responses are **read-only**:

- Do not modify, reshape, or delete mock JSON files
- Do not hardcode derived values that should come from the data
- Consume the data as-is; transform only in component/hook logic

---

## 5. React Rules

- **Functional components only** — no class components, ever
- Keep components **small and focused** — one responsibility per file
- Co-locate state as close to its consumer as possible
- Custom hooks for any reusable async or transformation logic

---

## 6. Mandatory State Handling

Every data-fetching operation **must** explicitly render three states. No exceptions.

```jsx
if (loading) return <LoadingState />
if (error)   return <ErrorState message={error.message} />
if (!data || data.length === 0) return <EmptyState />
return <YourComponent data={data} />
```

"It should work" is not acceptable. All three states must be visually present.

---

## 7. Design System Conformity

Once a visual style is established (spacing, colors, card style, typography), **all new components must match it**.

- Do not introduce a new card style when one already exists
- Do not invent new spacing values — reuse existing ones
- If Tailwind is used, use only the configured utility classes

---

## 8. Git Discipline

- **Pull and read before writing** — never assume the file hasn't changed
- **Edit, don't rewrite** — use targeted edits (str_replace style), not full file dumps
- Run `git diff` mentally before declaring something done
- Commit messages must be descriptive: `feat: add filter by status to RecordList`, not `update stuff`

---

## 9. No Port or Environment Changes

- Do not change the frontend or backend port
- Do not modify Docker, environment files, or database config
- Do not touch `.env` files without asking

---

## 10. Definition of Done

A task is **complete** only when:

- [ ] The component renders without console errors
- [ ] All three states (loading, error, empty) are handled
- [ ] The feature works end-to-end (data flows from source to UI)
- [ ] No existing feature was broken or removed
- [ ] The code follows the established design system

"It should work" or "I think this is fine" are **not** acceptable sign-offs.

---

## Priority Order for the Hackathon

When time is limited, build in this order:

1. Project setup + data fetching
2. Core list/display view
3. Related record linking
4. Search and filtering
5. Detail view for selected record
6. Polish and edge cases

Do not skip to polish before the core experience works.
