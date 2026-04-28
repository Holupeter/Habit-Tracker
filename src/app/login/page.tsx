import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Log in</h1>
        <div className="mt-4">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

