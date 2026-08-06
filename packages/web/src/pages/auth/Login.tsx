import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Mail, Lock, MapPin, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const pipeline = [
  { stage: "Reported", detail: "Streetlight out on Rue Verdun", dot: "bg-status-reported" },
  { stage: "Acknowledged", detail: "Routed to the district team", dot: "bg-status-acknowledged" },
  { stage: "In Progress", detail: "Crew scheduled for Thursday", dot: "bg-status-progress" },
  { stage: "Resolved", detail: "Light replaced — report closed", dot: "bg-status-resolved" },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data.email, data.password);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* ── brand panel ─────────────────────────────────────────── */}
      <aside className="relative isolate flex flex-col justify-between overflow-hidden bg-sidebar px-6 py-8 sm:px-10 lg:px-12 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#7fd4d0 1px, transparent 1px), linear-gradient(90deg, #7fd4d0 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
              <MapPin className="h-5 w-5 text-sidebar-primary-foreground" aria-hidden="true" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-white">
              CivicWave
            </span>
          </div>

          <p className="mt-8 max-w-sm font-display text-2xl font-semibold leading-snug tracking-tight text-white lg:mt-12 lg:text-[2rem]">
            Every pothole, broken light and blocked drain — tracked until it's
            fixed.
          </p>
        </div>

        {/* status rail */}
        <ol className="mt-10 hidden lg:block">
          <li className="mb-5 text-xs font-medium uppercase tracking-[0.14em] text-white/45">
            How a report moves
          </li>
          {pipeline.map((step, i) => (
            <li key={step.stage} className="grid grid-cols-[auto_1fr] gap-x-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${step.dot}`} />
                {i < pipeline.length - 1 && <span className="mt-1 w-px flex-1 bg-white/15" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{step.stage}</p>
                <p className="mt-0.5 text-sm text-white/55">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 hidden text-xs text-white/40 lg:block">
          Built for residents and municipal teams.
        </p>
      </aside>

      {/* ── form column ─────────────────────────────────────────── */}
      <main className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[25rem]">
          <header className="mb-8">
            <h1 className="font-display text-[1.75rem] font-semibold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Sign in to your account to continue
            </p>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email address
              </Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? true : undefined}
                  className="h-11 rounded-lg border-slate-200 bg-white pl-10 text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-600">{errors.email.message}</p>
              )}
            </div>

            {/* password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={errors.password ? true : undefined}
                  className="h-11 rounded-lg border-slate-200 bg-white pl-10 text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-lg font-medium shadow-sm transition-shadow hover:shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-3 text-xs uppercase tracking-[0.14em] text-slate-400">
                or
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full gap-2.5 rounded-lg border-slate-200 bg-white font-medium text-slate-700 transition-colors hover:bg-slate-50"
            onClick={handleGoogleLogin}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="rounded-sm font-medium text-accent underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}