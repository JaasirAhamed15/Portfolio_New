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
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative bg-[#0a0e17] text-slate-100">
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-sm bg-[#0e1422] border border-slate-800/90 rounded-2xl p-7 sm:p-8 shadow-xl">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-3.5">
            <IoLockClosedOutline size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Portfolio Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to manage sections, projects, and content
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <IoPersonOutline size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <IoLockClosedOutline size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#111827] border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-xs sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm transition active:scale-[0.99] disabled:opacity-50 cursor-pointer text-xs sm:text-sm mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <IoArrowForward size={15} />}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
          >
            &larr; Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

