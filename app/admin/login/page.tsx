"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoLockClosedOutline, IoPersonOutline, IoArrowForward } from "react-icons/io5";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden">
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 80%)",
        }}
      />

      <div className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-700/60 rounded-3xl p-8 shadow-2xl shadow-blue-900/30">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
            <IoLockClosedOutline size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Sign in to manage your portfolio content &amp; projects
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <IoPersonOutline size={18} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 bg-gray-950/60 border border-gray-700/70 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <IoLockClosedOutline size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-950/60 border border-gray-700/70 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer text-sm mt-2"
          >
            {loading ? "Authenticating..." : "Sign In"}
            {!loading && <IoArrowForward size={16} />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <a
            href="/"
            className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
          >
            &larr; Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

