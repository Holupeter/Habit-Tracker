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

Storage shapes and behavior live in `C:\Users\Orion\Desktop\App-Habit-Tracker\src\lib\auth.ts`, `C:\Users\Orion\Desktop\App-Habit-Tracker\src\lib\habits.ts`, and `C:\Users\Orion\Desktop\App-Habit-Tracker\src\lib\storage.ts`.

## PWA support

Required PWA files are included:

- `C:\Users\Orion\Desktop\App-Habit-Tracker\public\manifest.json`
- `C:\Users\Orion\Desktop\App-Habit-Tracker\public\sw.js`
- `C:\Users\Orion\Desktop\App-Habit-Tracker\public\icons\icon-192.png`
- `C:\Users\Orion\Desktop\App-Habit-Tracker\public\icons\icon-512.png`

The service worker is registered on the client via `C:\Users\Orion\Desktop\App-Habit-Tracker\src\components\shared\ServiceWorkerRegistration.tsx`.

## Trade-offs / limitations

- Authentication is intentionally local and deterministic (no server/database), per the spec.
- The service worker implements a minimal “app shell” cache and a simple runtime cache for GET requests.

## Test file mapping (required files)

- `C:\Users\Orion\Desktop\App-Habit-Tracker\tests\unit\slug.test.ts`: verifies `getHabitSlug` rules and examples
- `C:\Users\Orion\Desktop\App-Habit-Tracker\tests\unit\validators.test.ts`: verifies `validateHabitName` messages + normalization
- `C:\Users\Orion\Desktop\App-Habit-Tracker\tests\unit\streaks.test.ts`: verifies `calculateCurrentStreak` logic
- `C:\Users\Orion\Desktop\App-Habit-Tracker\tests\unit\habits.test.ts`: verifies `toggleHabitCompletion` behavior
- `C:\Users\Orion\Desktop\App-Habit-Tracker\tests\integration\auth-flow.test.tsx`: verifies signup/login error handling + session creation
- `C:\Users\Orion\Desktop\App-Habit-Tracker\tests\integration\habit-form.test.tsx`: verifies habit CRUD + streak UI updates
- `C:\Users\Orion\Desktop\App-Habit-Tracker\tests\e2e\app.spec.ts`: verifies routing, auth, habit flows, persistence, and offline app shell

