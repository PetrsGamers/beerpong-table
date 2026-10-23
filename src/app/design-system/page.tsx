"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Trophy,
  Flame,
  Shield,
  Beer,
  Layers,
  Sparkles,
  Palette,
  Type,
  MousePointerClick,
  Table as TableIcon,
} from "lucide-react";

export default function DesignSystemPage() {
  const [currentTheme, setCurrentTheme] = useState<string>("beerpong-light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const attr = document.documentElement.getAttribute("data-theme") || "beerpong-light";
    setCurrentTheme(attr);
  }, []);

  const switchTheme = (themeName: "beerpong-light" | "beerpong-dark") => {
    document.documentElement.setAttribute("data-theme", themeName);
    if (themeName === "beerpong-dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setCurrentTheme(themeName);
    localStorage.setItem("beerpong_theme_mode", themeName === "beerpong-dark" ? "dark" : "light");
  };

  const isDark = currentTheme === "beerpong-dark";

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto flex flex-col gap-12 transition-colors">
      {/* Hero Header s rychlým přepínačem */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-primary gap-1 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> SPPDF BeerPong 2.0
              </span>
              <span className="badge badge-ghost text-xs">Styleguide & Design Tokens</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              🎨 Design System & Témata
            </h1>
            <p className="py-2 text-base-content/80 text-sm sm:text-base max-w-2xl">
              Interaktivní vzorník a specifikace nového designového systému. Tento systém sjednocuje
              DaisyUI a Tailwind tokeny a garantuje maximální kontrast a čitelnost ve světlém i tmavém režimu.
            </p>
          </div>

          {/* Přepínače témat */}
          <div className="flex flex-col gap-2 p-3 bg-base-200 rounded-2xl border border-base-300 w-full md:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60 px-1">
              Aktivní motiv: <strong className="text-primary">{isDark ? "Tmavý (Dark)" : "Světlý (Light)"}</strong>
            </span>
            <div className="join w-full">
              <button
                onClick={() => switchTheme("beerpong-light")}
                className={`btn btn-sm join-item flex-1 gap-2 ${
                  !isDark ? "btn-primary shadow-sm" : "btn-ghost"
                }`}
              >
                <Sun className="w-4 h-4 text-warning" />
                Světlý
              </button>
              <button
                onClick={() => switchTheme("beerpong-dark")}
                className={`btn btn-sm join-item flex-1 gap-2 ${
                  isDark ? "btn-primary shadow-sm" : "btn-ghost"
                }`}
              >
                <Moon className="w-4 h-4 text-primary" />
                Tmavý
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Barevná paleta (Color Tokens & WCAG Contrast) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">1. Barevná paleta a sémantické tokeny</h2>
        </div>
        <p className="text-sm text-base-content/70">
          Všechny barvy jsou definovány v <code>tailwind.config.ts</code> v sekci DaisyUI custom themes. 
          Žádné barvy nejsou hardcodované – komponenty dědí tyto tokeny.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {/* Base-100 */}
          <div className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-bold">base-100</span>
                <span className="badge badge-xs badge-ghost font-mono">{isDark ? "#131b2e" : "#ffffff"}</span>
              </div>
              <h3 className="font-bold text-base">Povrch karet & tabulek</h3>
              <p className="text-xs text-base-content/70 mt-1">Základní tělo boxů, formulářů a modálů.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-base-300 text-[10px] text-base-content/60 font-mono">
              Surface background
            </div>
          </div>

          {/* Base-200 */}
          <div className="card bg-base-200 border border-base-300 shadow-sm p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-bold">base-200</span>
                <span className="badge badge-xs badge-ghost font-mono">{isDark ? "#0b0f19" : "#f8fafc"}</span>
              </div>
              <h3 className="font-bold text-base">Pozadí aplikace</h3>
              <p className="text-xs text-base-content/70 mt-1">Hluboký podklad pod kartami a sekcemi.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-base-300 text-[10px] text-base-content/60 font-mono">
              App main background
            </div>
          </div>

          {/* Base-300 */}
          <div className="card bg-base-300 border border-base-300 shadow-sm p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-bold">base-300</span>
                <span className="badge badge-xs badge-ghost font-mono">{isDark ? "#1e293b" : "#e2e8f0"}</span>
              </div>
              <h3 className="font-bold text-base">Ohraničení & oddělovače</h3>
              <p className="text-xs text-base-content/70 mt-1">Jemné a přesné linky tabulek a karet.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-base-300 text-[10px] text-base-content/60 font-mono">
              Borders & Dividers
            </div>
          </div>

          {/* Base-content */}
          <div className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-col justify-between ring-1 ring-primary/30">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-bold">base-content</span>
                <span className="badge badge-xs badge-success font-bold font-mono">WCAG AAA (16:1)</span>
              </div>
              <h3 className="font-bold text-base text-base-content">Hlavní text & titulky</h3>
              <p className="text-xs text-base-content/70 mt-1">
                Maximální kontrast. Už žádný nečitelný světlý text ve white mode!
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-base-300 text-[10px] font-mono font-bold text-success">
              ✓ 100% čitelnost
            </div>
          </div>
        </div>

        {/* Akcentní a stavové barvy */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <div className="p-4 rounded-2xl bg-primary text-primary-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold font-mono uppercase">primary</span>
            <div>
              <div className="font-black text-sm">Pivní oranžová</div>
              <span className="text-[10px] opacity-80">Akce a tlačítka</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-accent text-accent-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold font-mono uppercase">accent</span>
            <div>
              <div className="font-black text-sm">Zlatý ležák</div>
              <span className="text-[10px] opacity-80">1. místo, koruny</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-secondary text-secondary-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold font-mono uppercase">secondary</span>
            <div>
              <div className="font-black text-sm">Sekundární</div>
              <span className="text-[10px] opacity-80">Badge & doplňky</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-success text-success-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold font-mono uppercase">success</span>
            <div>
              <div className="font-black text-sm">Výhra / Úspěch</div>
              <span className="text-[10px] opacity-80">Zelené stavy</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-warning text-warning-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold font-mono uppercase">warning</span>
            <div>
              <div className="font-black text-sm">Varování</div>
              <span className="text-[10px] opacity-80">Probíhající kola</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-error text-error-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold font-mono uppercase">error</span>
            <div>
              <div className="font-black text-sm">Prohra / Smazat</div>
              <span className="text-[10px] opacity-80">Kritické akce</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Typografie & Hierarchie */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <Type className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">2. Typografie a textový kontrast</h2>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-md">
          <div className="card-body p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-base-300 pb-4 gap-2">
              <span className="text-xs font-mono text-base-content/60 w-32">Heading 1 (text-4xl)</span>
              <h1 className="text-4xl font-black flex-1">SPPDF BeerPong Liga 2025</h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-base-300 pb-4 gap-2">
              <span className="text-xs font-mono text-base-content/60 w-32">Heading 2 (text-2xl)</span>
              <h2 className="text-2xl font-extrabold flex-1">1. Kolo – Turnajový večer</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-base-300 pb-4 gap-2">
              <span className="text-xs font-mono text-base-content/60 w-32">Heading 3 (text-lg)</span>
              <h3 className="text-lg font-bold flex-1">Brouci vs. Vlci (Zápis zápasu)</h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-base-300 pb-4 gap-2">
              <span className="text-xs font-mono text-base-content/60 w-32">Body (text-base)</span>
              <p className="text-base text-base-content flex-1">
                Základní čtecí text s plným kontrastem. Tento text je bezpečně čitelný za jakýchkoliv světelných podmínek na monitoru i mobilu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-base-300 pb-4 gap-2">
              <span className="text-xs font-mono text-base-content/60 w-32">Muted / Podtitulek</span>
              <p className="text-sm text-base-content/70 flex-1">
                <code>text-base-content/70</code>: Používá se pro popisky, metadata, datum a doplňující informace (např. <em>📅 24. 10. 2026 • 5 odehraných zápasů</em>).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="text-xs font-mono text-base-content/60 w-32">Monospace čísla</span>
              <div className="flex-1 flex gap-4 font-mono font-bold text-lg">
                <span className="badge badge-lg bg-base-200 border-base-300 px-4 py-3">10 : 7</span>
                <span className="badge badge-lg badge-success text-success-content px-4 py-3">+3 body</span>
                <span className="badge badge-lg badge-ghost px-4 py-3">Skóre: 34:18 (+16)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tlačítka a interaktivní prvky */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <MousePointerClick className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">3. Tlačítka a stavy (Buttons)</h2>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-md">
          <div className="card-body p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Základní varianty
              </h3>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary">btn-primary</button>
                <button className="btn btn-secondary">btn-secondary</button>
                <button className="btn btn-accent">btn-accent</button>
                <button className="btn btn-neutral">btn-neutral</button>
                <button className="btn btn-outline">btn-outline</button>
                <button className="btn btn-ghost">btn-ghost</button>
                <button className="btn btn-success">btn-success</button>
                <button className="btn btn-error">btn-error</button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Velikosti (Sizes)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn btn-primary btn-lg">Large (lg)</button>
                <button className="btn btn-primary btn-md">Medium (md)</button>
                <button className="btn btn-primary btn-sm">Small (sm)</button>
                <button className="btn btn-primary btn-xs">Extra Small (xs)</button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Speciální stavy (Loading & Disabled)
              </h3>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary">
                  <span className="loading loading-spinner loading-xs"></span>
                  Ukládání zápasu...
                </button>
                <button className="btn" disabled>
                  Deaktivované tlačítko
                </button>
                <button className="btn btn-outline btn-sm gap-2">
                  <Beer className="w-4 h-4 text-primary" />
                  S ikonou
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Odznaky, Badges & Sportovní metriky */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <Trophy className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-black">4. Ligové odznaky & Skóre (Badges)</h2>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-md">
          <div className="card-body p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Ligová umístění a ocenění
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="badge badge-lg bg-warning/20 border-warning text-warning font-bold gap-1 px-3 py-3">
                  🥇 1. Místo (Šampioni)
                </span>
                <span className="badge badge-lg bg-slate-300/20 border-slate-400 text-base-content font-bold gap-1 px-3 py-3">
                  🥈 2. Místo
                </span>
                <span className="badge badge-lg bg-amber-700/20 border-amber-700 text-amber-600 font-bold gap-1 px-3 py-3">
                  🥉 3. Místo
                </span>
                <span className="badge badge-lg badge-primary gap-1 font-bold px-3 py-3">
                  👑 Král střelců
                </span>
                <span className="badge badge-lg badge-info text-info-content gap-1 font-bold px-3 py-3">
                  🌬️ BlowJob King
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Stavy turnajového večera
              </h3>
              <div className="flex flex-wrap gap-3">
                <span className="badge badge-success gap-1 font-semibold">● Odehráno</span>
                <span className="badge badge-warning gap-1 font-semibold">● Právě probíhá</span>
                <span className="badge badge-ghost gap-1">Čeká na odehrání</span>
                <span className="badge badge-primary badge-outline font-semibold">Aktivní semestr</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Zápasové skóre komponenty
              </h3>
              <div className="inline-flex items-center gap-3 p-3 bg-base-200 rounded-2xl border border-base-300">
                <span className="font-extrabold text-lg px-2">Brouci</span>
                <span className="badge badge-lg font-black px-5 py-4 bg-base-100 text-xl border-base-300 shadow-inner">
                  10 : 7
                </span>
                <span className="font-extrabold text-lg px-2">Vlci</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Ligová tabulka & Karty v reálném nasazení */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <TableIcon className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">5. Ukázka ligové tabulky (Table Component)</h2>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="card-title text-xl font-bold">🏆 Celková ligová tabulka (Jarní semestr 2025)</h3>
                <p className="text-xs text-base-content/70">Ukázka vysokého kontrastu textů i při podbarvení prvního místa</p>
              </div>
              <span className="badge badge-neutral">5 kol</span>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-base-300 text-base-content/80 text-xs uppercase tracking-wider font-bold">
                    <th className="w-12">Poř.</th>
                    <th>Tým</th>
                    <th className="text-center">Zápasy</th>
                    <th className="text-center">V</th>
                    <th className="text-center">R</th>
                    <th className="text-center">P</th>
                    <th className="text-center">Skóre</th>
                    <th className="text-center">+/-</th>
                    <th className="text-right">Body</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 1. Místo */}
                  <tr className="bg-warning/15 font-bold border-b border-base-300">
                    <td className="text-lg">🥇</td>
                    <td className="text-base text-base-content">Vlci</td>
                    <td className="text-center">3</td>
                    <td className="text-center text-success font-black">3</td>
                    <td className="text-center text-base-content/60">0</td>
                    <td className="text-center text-error">0</td>
                    <td className="text-center font-mono">30:19</td>
                    <td className="text-center font-mono text-success">+11</td>
                    <td className="text-right font-black text-xl text-primary">9</td>
                  </tr>

                  {/* 2. Místo */}
                  <tr className="border-b border-base-300/80 hover:bg-base-200/50 transition-colors">
                    <td>2.</td>
                    <td className="font-semibold text-base text-base-content">Brouci</td>
                    <td className="text-center">3</td>
                    <td className="text-center text-success font-bold">2</td>
                    <td className="text-center text-base-content/60">0</td>
                    <td className="text-center text-error">1</td>
                    <td className="text-center font-mono">26:24</td>
                    <td className="text-center font-mono text-success">+2</td>
                    <td className="text-right font-bold text-lg text-primary">6</td>
                  </tr>

                  {/* 3. Místo */}
                  <tr className="border-b border-base-300/80 hover:bg-base-200/50 transition-colors">
                    <td>3.</td>
                    <td className="font-semibold text-base text-base-content">Šneci</td>
                    <td className="text-center">3</td>
                    <td className="text-center text-success">0</td>
                    <td className="text-center text-base-content/60">0</td>
                    <td className="text-center text-error font-bold">3</td>
                    <td className="text-center font-mono">15:28</td>
                    <td className="text-center font-mono text-error">-13</td>
                    <td className="text-right font-bold text-lg text-base-content/70">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Formulářové prvky */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <Layers className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">6. Formulářové prvky a vstupy</h2>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-md">
          <div className="card-body p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Název týmu</span>
              </label>
              <input
                type="text"
                placeholder="Např. Pivní Šneci"
                className="input input-bordered w-full"
                defaultValue="Brouci"
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">Jméno musí být unikátní pro semestr</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Výběr turnajového večera</span>
              </label>
              <select className="select select-bordered w-full" defaultValue="2">
                <option value="1">1. Kolo (Odehráno)</option>
                <option value="2">2. Kolo (Odehráno)</option>
                <option value="3">3. Kolo (Nadcházející)</option>
                <option value="4">4. Kolo (Nadcházející)</option>
                <option value="5">5. Kolo - Velké Finále</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Skóre zápasu</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue="10"
                  className="input input-bordered w-full text-center font-bold text-lg"
                />
                <span className="font-bold text-xl">:</span>
                <input
                  type="number"
                  defaultValue="7"
                  className="input input-bordered w-full text-center font-bold text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Systémová hlášení (Alerts) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">7. Systémová hlášení (Alerts)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="alert alert-info">
            <Info className="w-5 h-5" />
            <span>Tento semestr obsahuje celkem 5 turnajových večerů.</span>
          </div>
          <div className="alert alert-success">
            <CheckCircle2 className="w-5 h-5" />
            <span>Výsledek zápasu byl úspěšně uložen do databáze.</span>
          </div>
          <div className="alert alert-warning">
            <AlertTriangle className="w-5 h-5" />
            <span>Turnajový večer ještě nebyl označen jako ukončený.</span>
          </div>
          <div className="alert alert-error">
            <XCircle className="w-5 h-5" />
            <span>Hráč již v tomto večeru nastoupil za jiný tým.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
