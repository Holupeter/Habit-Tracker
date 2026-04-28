import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const routerReplace = vi.fn();
vi.mock('next/navigation', async () => {
  return {
    useRouter: () => ({ replace: routerReplace }),
  };
});

import { STORAGE_KEYS } from '@/lib/constants';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

describe('auth flow', () => {
  beforeEach(() => {
    routerReplace.mockClear();
    window.localStorage.clear();
  });

  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password');
    await user.click(screen.getByTestId('auth-signup-submit'));

    const sessionRaw = window.localStorage.getItem(STORAGE_KEYS.session);
    expect(sessionRaw).not.toBeNull();
    expect(routerReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup();
    const first = render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'dup@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password');
    await user.click(screen.getByTestId('auth-signup-submit'));

    first.unmount();
    render(<SignupForm />);
    await user.type(screen.getByTestId('auth-signup-email'), 'dup@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password');
    await user.click(screen.getByTestId('auth-signup-submit'));

    expect(screen.getByText('User already exists')).toBeInTheDocument();
  });

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);
    await user.type(screen.getByTestId('auth-signup-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password');
    await user.click(screen.getByTestId('auth-signup-submit'));

    window.localStorage.removeItem(STORAGE_KEYS.session);
    routerReplace.mockClear();

    render(<LoginForm />);
    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'password');
    await user.click(screen.getByTestId('auth-login-submit'));

    expect(window.localStorage.getItem(STORAGE_KEYS.session)).not.toBeNull();
    expect(routerReplace).toHaveBeenCalledWith('/dashboard');
  });

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'missing@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrong');
    await user.click(screen.getByTestId('auth-login-submit'));

    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });
});
