import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Sign up</h1>
        <div className="mt-4">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}

