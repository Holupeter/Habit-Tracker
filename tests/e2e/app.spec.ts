import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('**/login');
    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({ userId: 'u1', email: 'u1@example.com' }),
      );
    });
    await page.goto('/');
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.getByTestId('auth-signup-email').fill('new@example.com');
    await page.getByTestId('auth-signup-password').fill('password');
    await page.getByTestId('auth-signup-submit').click();
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'habit-tracker-users',
        JSON.stringify([
          {
            id: 'u1',
            email: 'u1@example.com',
            password: 'password',
            createdAt: new Date().toISOString(),
          },
        ]),
      );
      window.localStorage.setItem(
        'habit-tracker-habits',
        JSON.stringify([
          {
            id: 'h1',
            userId: 'u1',
            name: 'Drink Water',
            description: '',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: [],
          },
          {
            id: 'h2',
            userId: 'u2',
            name: 'Should Not Appear',
            description: '',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: [],
          },
        ]),
      );
    });

    await page.goto('/login');
    await page.getByTestId('auth-login-email').fill('u1@example.com');
    await page.getByTestId('auth-login-password').fill('password');
    await page.getByTestId('auth-login-submit').click();
    await page.waitForURL('**/dashboard');

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByText('Should Not Appear')).toHaveCount(0);
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({ userId: 'u1', email: 'u1@example.com' }),
      );
    });

    await page.goto('/dashboard');
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Read Books');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await page.addInitScript(() => {
      const today = new Date().toISOString().slice(0, 10);
      window.localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({ userId: 'u1', email: 'u1@example.com' }),
      );
      window.localStorage.setItem(
        'habit-tracker-habits',
        JSON.stringify([
          {
            id: 'h1',
            userId: 'u1',
            name: 'Run',
            description: '',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: [],
          },
        ]),
      );
    });

    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-streak-run')).toHaveText('0');
    await page.getByTestId('habit-complete-run').click();
    await expect(page.getByTestId('habit-streak-run')).toHaveText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({ userId: 'u1', email: 'u1@example.com' }),
      );
      window.localStorage.setItem(
        'habit-tracker-habits',
        JSON.stringify([
          {
            id: 'h1',
            userId: 'u1',
            name: 'Drink Water',
            description: '',
            frequency: 'daily',
            createdAt: new Date().toISOString(),
            completions: [],
          },
        ]),
      );
    });

    await page.goto('/dashboard');
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await page.reload();
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'habit-tracker-session',
        JSON.stringify({ userId: 'u1', email: 'u1@example.com' }),
      );
    });
    await page.goto('/dashboard');
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login');
    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    // wait for service worker to take control (may require a reload)
    await page.waitForFunction(() => 'serviceWorker' in navigator);
    await page.waitForTimeout(1000);
    const hasController = await page.evaluate(() => !!navigator.serviceWorker.controller);
    if (!hasController) {
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => !!navigator.serviceWorker.controller, { timeout: 10_000 });
    }

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await context.setOffline(false);
  });
});
