# Habit Tracker PWA (Stage 3)

A local-first Habit Tracker Progressive Web App built strictly from the Stage 3 Technical Requirements Document.

## Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- `localStorage` persistence
- Tests: Vitest (unit + integration) and Playwright (end-to-end)

## Setup

```bash
npm install
```

## Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Run tests

```bash
# unit tests + coverage (src/lib coverage threshold enforced)
npm run test:unit

# integration/component tests
npm run test:integration

# end-to-end tests (Playwright)
npm run test:e2e

# run everything
npm test
```

## Routes

The app supports these public routes exactly:

- `/` (splash/boot route; redirects to `/dashboard` if session exists, otherwise `/login`)
- `/login`
- `/signup`
- `/dashboard` (protected; redirects to `/login` without a valid session)

## Local persistence (localStorage)

The app uses `localStorage` with these required keys:

- `habit-tracker-users`: JSON array of users
- `habit-tracker-session`: `null` or `{ userId, email }`
- `habit-tracker-habits`: JSON array of habits

Storage shapes and behavior live in [`src/lib/auth.ts`](./src/lib/auth.ts), [`src/lib/habits.ts`](./src/lib/habits.ts), and [`src/lib/storage.ts`](./src/lib/storage.ts).

## PWA support

Required PWA files are included:

- [`public/manifest.json`](./public/manifest.json)
- [`public/sw.js`](./public/sw.js)
- [`public/icons/icon-192.png`](./public/icons/icon-192.png)
- [`public/icons/icon-512.png`](./public/icons/icon-512.png)

The service worker is registered on the client via [`src/components/shared/ServiceWorkerRegistration.tsx`](./src/components/shared/ServiceWorkerRegistration.tsx).

## Design Decisions & Usage

- **Daily Frequency Focus:** In this stage of the application, habit tracking is strictly focused on a *daily* frequency to maintain core streak calculation reliability. The "Frequency" dropdown in the creation form is intentionally locked to "Daily" to communicate this to the user, acting as a placeholder for future iterations (e.g., weekly/custom scheduling).
- **Calendar Toggles:** To keep the dashboard clean and focused on actionable items, we omitted a full-screen calendar view. Instead, the calendar toggle is integrated directly into each habit card via the **"Complete today"** / **"Completed"** button, which instantly updates the internal completion record for the current date.
- **Dark Mode Compatibility:** The UI uses Tailwind CSS `dark:` utility variants to automatically adapt to system-level light/dark preferences without requiring a manual toggle.

## Trade-offs / limitations

- Authentication is intentionally local and deterministic (no server/database), per the spec.
- The service worker implements a minimal “app shell” cache and a simple runtime cache for GET requests.

## Test file mapping (required files)

- [`tests/unit/slug.test.ts`](./tests/unit/slug.test.ts): verifies `getHabitSlug` rules and examples
- [`tests/unit/validators.test.ts`](./tests/unit/validators.test.ts): verifies `validateHabitName` messages + normalization
- [`tests/unit/streaks.test.ts`](./tests/unit/streaks.test.ts): verifies `calculateCurrentStreak` logic
- [`tests/unit/habits.test.ts`](./tests/unit/habits.test.ts): verifies `toggleHabitCompletion` behavior
- [`tests/integration/auth-flow.test.tsx`](./tests/integration/auth-flow.test.tsx): verifies signup/login error handling + session creation
- [`tests/integration/habit-form.test.tsx`](./tests/integration/habit-form.test.tsx): verifies habit CRUD + streak UI updates
- [`tests/e2e/app.spec.ts`](./tests/e2e/app.spec.ts): verifies routing, auth, habit flows, persistence, and offline app shell

