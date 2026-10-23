"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("beerpong_theme_mode") as ThemeMode | null;
    if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
      setThemeMode(saved);
      applyTheme(saved);
    } else {
      applyTheme("system");
    }
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    let effectiveTheme = "beerpong-light";
    if (mode === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      effectiveTheme = isDark ? "beerpong-dark" : "beerpong-light";
    } else if (mode === "dark") {
      effectiveTheme = "beerpong-dark";
    }

    document.documentElement.setAttribute("data-theme", effectiveTheme);
    if (effectiveTheme === "beerpong-dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("beerpong_theme_mode", mode);
    document.cookie = `beerpong_theme_mode=${mode}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const handleSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    applyTheme(mode);
  };

  if (!mounted) {
    return (
      <div className={`btn btn-ghost btn-circle btn-sm opacity-50 ${className}`}>
        <Sun className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div className={`dropdown dropdown-end ${className}`}>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle btn-sm border border-base-300"
        title="Přepnout motiv vzhledu"
      >
        {themeMode === "light" && <Sun className="w-4 h-4 text-warning" />}
        {themeMode === "dark" && <Moon className="w-4 h-4 text-primary" />}
        {themeMode === "system" && <Laptop className="w-4 h-4 text-base-content/80" />}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-50 menu p-2 shadow-2xl bg-base-100 rounded-box w-44 border border-base-300 mt-2 text-xs font-semibold"
      >
        <li>
          <button
            onClick={() => handleSelect("light")}
            className={`flex items-center gap-2 py-2 ${
              themeMode === "light" ? "active bg-primary text-primary-content" : ""
            }`}
          >
            <Sun className="w-4 h-4 text-warning" />
            <span>Světlý motiv</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSelect("dark")}
            className={`flex items-center gap-2 py-2 ${
              themeMode === "dark" ? "active bg-primary text-primary-content" : ""
            }`}
          >
            <Moon className="w-4 h-4 text-primary" />
            <span>Tmavý motiv</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSelect("system")}
            className={`flex items-center gap-2 py-2 ${
              themeMode === "system" ? "active bg-primary text-primary-content" : ""
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Dle systému (Auto)</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
