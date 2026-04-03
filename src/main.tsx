import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import AdminLogin from "./components/login.tsx";
import CreateAccount from "./components/createAccount.tsx";
import "./index.css";

type AppMode = "admin" | "guest";

function ProtectedShell({ mode }: { mode: AppMode }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.replace("/");
    return null;
  }

  return <App mode={mode} />;
}

function RootApp() {
  const path = window.location.pathname;
  const storedIsAdmin = localStorage.getItem("is_admin") === "true";

  if (path.startsWith("/create-account")) {
    return <CreateAccount />;
  }

  if (path.startsWith("/guest")) {
    return <ProtectedShell mode="guest" />;
  }

  if (path.startsWith("/admin")) {
    return <ProtectedShell mode="admin" />;
  }

  if (path !== "/") {
    window.location.replace(storedIsAdmin ? "/admin" : "/guest");
    return null;
  }

  return <AdminLogin />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
