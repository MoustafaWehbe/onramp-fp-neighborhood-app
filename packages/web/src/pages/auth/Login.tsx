import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Waves } from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.44c-.28 1.46-1.12 2.69-2.39 3.52v2.93h3.86c2.26-2.08 3.58-5.15 3.58-8.69z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.93c-1.07.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.36c-.24-.72-.38-1.49-.38-2.36s.14-1.64.38-2.36V6.55H1.29A11.97 11.97 0 0 0 0 12c0 1.94.47 3.77 1.29 5.45l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.55l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function Login() {
  const [loading, setLoading] = useState(false);
console.log("hello from login page");

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      toast.error("Missing VITE_API_URL", {
        description: "Add it inside packages/web/.env",
      });
      return;
    }

    setLoading(true);

    // This is not fetch / React Query.
    // OAuth starts with a full browser redirect.
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-ocean-teal/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-ocean-mid/20 blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-border/60 bg-card/80 p-8 shadow-xl backdrop-blur">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ocean-mid to-ocean-teal text-primary-foreground shadow-lg">
            <Waves className="h-6 w-6" />
          </div>

          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Welcome to CivicWave
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with Google to report issues and track what your city is fixing.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full gap-3 border-border/80 bg-background font-medium hover:bg-accent"
        >
          <GoogleIcon />
          {loading ? "Redirecting..." : "Continue with Google"}
        </Button>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          New users are created automatically with the default user role.
        </p>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to CivicWave&apos;s{" "}
          <Link
            to="/"
            className="underline-offset-2 hover:text-foreground hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            to="/"
            className="underline-offset-2 hover:text-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}