import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail, FiShield } from "react-icons/fi";

type LoginResponse = {
  refresh: string;
  access: string;
  is_admin: boolean;
};

type LoginErrorResponse = {
  detail?: string;
};

type LoginProps = {
  onLoginSuccess?: (isAdmin: boolean) => void;
};

export default function AdminLogin({ onLoginSuccess }: LoginProps) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = localStorage.getItem("access_token");
  const storedIsAdmin = localStorage.getItem("is_admin") === "true";

  useEffect(() => {
    if (token) {
      window.location.replace(storedIsAdmin ? "/admin" : "/guest");
    }
  }, [storedIsAdmin, token]);

  if (token) {
    return null;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        "https://bewnet.pythonanywhere.com/auth/jwt/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );

      const data = (await response.json()) as
        | LoginResponse
        | LoginErrorResponse;

      if (!response.ok) {
        const errorDetail =
          typeof data === "object" &&
          data !== null &&
          "detail" in data &&
          typeof data.detail === "string"
            ? data.detail
            : "Login failed";
        throw new Error(errorDetail);
      }

      const authData = data as LoginResponse;
      localStorage.setItem("access_token", authData.access);
      localStorage.setItem("refresh_token", authData.refresh);
      localStorage.setItem("is_admin", String(authData.is_admin));

      onLoginSuccess?.(authData.is_admin);
      window.location.replace(authData.is_admin ? "/admin" : "/guest");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Invalid credentials",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_26%),linear-gradient(135deg,#f8fbff_0%,#eef8f6_45%,#fdfdfd_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[36px] border border-white/70 bg-white/75 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30%)]" />
          <div className="relative max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100 backdrop-blur">
              <FiShield className="h-4 w-4" />
              Secure Access
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Welcome back.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              Sign in to open the right workspace for your role. Admin users are
              sent to the Kurifitu Go business dashboard suite. Non-admin users
              are routed to the Kurifitu Go guest workspace.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-cyan-100 bg-cyan-50 text-cyan-700 shadow-[0_12px_30px_rgba(14,165,233,0.18)]">
                <FiLock className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                Sign in
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use your workspace credentials to continue.
              </p>
            </div>

            {errorMessage ? (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <form onSubmit={handleLogin} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Username
                </span>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </span>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-13 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 px-5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(13,148,136,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(13,148,136,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Authenticating..." : "Access workspace"}
              </button>

              <div className="pt-1 text-center">
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => window.location.replace("/create-account")}
                    className="font-semibold text-cyan-700 transition hover:text-cyan-800"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
