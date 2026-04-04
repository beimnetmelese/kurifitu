import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import kuriftuLogo from "../assets/kuriftu.png";

type RegisterPayload = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

type RegisterResponse = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

type LoginResponse = {
  refresh: string;
  access: string;
  is_admin: boolean;
};

export default function CreateAccount() {
  const [formData, setFormData] = useState<RegisterPayload>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(
        "https://bewnet.pythonanywhere.com/auth/users/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = (await response.json()) as
        | RegisterResponse
        | Record<string, unknown>;

      if (!response.ok) {
        const message =
          typeof data === "object" && data !== null
            ? Object.entries(data)
                .map(([field, value]) => {
                  if (Array.isArray(value)) {
                    return `${field}: ${value.join(", ")}`;
                  }
                  if (typeof value === "string") {
                    return `${field}: ${value}`;
                  }
                  return null;
                })
                .filter(Boolean)
                .join(" | ")
            : "Failed to create account";

        throw new Error(message || "Failed to create account");
      }

      const created = data as RegisterResponse;

      const loginResponse = await fetch(
        "http://bewnet.pythonanywhere.com/auth/jwt/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        },
      );

      const loginData = (await loginResponse.json()) as
        | LoginResponse
        | Record<string, unknown>;

      if (!loginResponse.ok) {
        throw new Error(
          "Account created, but auto-login failed. Please sign in.",
        );
      }

      const authData = loginData as LoginResponse;
      localStorage.setItem("access_token", authData.access);
      localStorage.setItem("refresh_token", authData.refresh);
      localStorage.setItem("is_admin", String(authData.is_admin));

      setSuccessMessage(
        `Welcome ${created.first_name || created.username}. Logging you in...`,
      );
      window.setTimeout(() => {
        window.location.replace(authData.is_admin ? "/admin" : "/guest");
      }, 700);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create account",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_24%),linear-gradient(135deg,#f8fbff_0%,#eef7ff_45%,#fefefe_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_28%)]" />
          <div className="relative max-w-xl">
            <img
              src={kuriftuLogo}
              alt="Kuriftu logo"
              className="h-14 w-14 rounded-2xl border border-white/20 object-cover shadow-[0_12px_30px_rgba(8,145,178,0.24)]"
            />
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100 backdrop-blur">
              <FiCheckCircle className="h-4 w-4" />
              New Account
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Create your account
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              Register once, then sign in to access the right workspace for your
              role.
            </p>
          </div>

          <div className="relative mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["Profile", "First and last name"],
              ["Identity", "Username + email"],
              ["Security", "Password protected"],
            ].map(([title, detail]) => (
              <div
                key={title}
                className="rounded-[24px] border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/90">
                  {title}
                </p>
                <p className="mt-2 text-sm text-slate-200">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <button
              type="button"
              onClick={() => window.location.replace("/")}
              className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <FiArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Sign up
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create your profile and continue to login.
              </p>
            </div>

            {errorMessage ? (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    First name
                  </span>
                  <div className="relative">
                    <FiUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Last name
                  </span>
                  <div className="relative">
                    <FiUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                      required
                    />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Username
                </span>
                <div className="relative">
                  <FiUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Email
                </span>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Password
                </span>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
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
                className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 px-5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(13,148,136,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(13,148,136,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
