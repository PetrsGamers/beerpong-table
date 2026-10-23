"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Trophy,
  Shield,
  Beer,
  Layers,
  Palette,
  Type,
  MousePointerClick,
  Table as TableIcon,
  BellRing,
  RotateCcw,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function DesignSystemPage() {
  const [currentTheme, setCurrentTheme] = useState<string>("beerpong-light");
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

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
              <span className="badge badge-primary gap-1.5 font-bold text-xs uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                SPPDF BeerPong 2.0
              </span>
              <span className="badge badge-ghost text-xs">Styleguide a designové tokeny</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Design System a témata vzhledu
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

      {/* Toast notifikace */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <BellRing className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">Toast notifikace</h2>
        </div>
        <p className="text-sm text-base-content/70">
          Systémová hlášení plně sladěná s design systémem ve světlém i tmavém režimu.
          Mají vysoký kontrast, zaoblení rohů, jemný stín a podporují ikony i akční tlačítka.
        </p>

        <div className="card bg-base-100 border border-base-300 shadow-md">
          <div className="card-body p-6 sm:p-8">
            <div className="flex flex-wrap gap-4">
              {/* Success Toast */}
              <button
                onClick={() => {
                  toast({
                    variant: "success",
                    title: "Výsledek zápasu uložen",
                    description: "Brouci zvítězili 10:7 nad Vlky a získávají 3 body.",
                  });
                }}
                className="btn btn-success gap-2 text-white"
              >
                <CheckCircle2 className="w-4 h-4" />
                Spustit úspěšný toast
              </button>

              {/* Error Toast */}
              <button
                onClick={() => {
                  toast({
                    variant: "destructive",
                    title: "Chyba při zápisu",
                    description: "Hráč Josef Skalka již v tomto turnajovém večeru nastoupil za tým Brouci.",
                  });
                }}
                className="btn btn-error gap-2 text-white"
              >
                <XCircle className="w-4 h-4" />
                Spustit chybový toast
              </button>

              {/* Warning Toast */}
              <button
                onClick={() => {
                  toast({
                    variant: "warning",
                    title: "Upozornění",
                    description: "Tento turnajový večer ještě nebyl označen jako dohraný.",
                  });
                }}
                className="btn btn-warning gap-2 text-white"
              >
                <AlertTriangle className="w-4 h-4" />
                Spustit varovný toast
              </button>

              {/* Info Toast */}
              <button
                onClick={() => {
                  toast({
                    variant: "info",
                    title: "Král střelců aktualizován",
                    description: "Karel Střelec právě trefil 6. kelímek večera.",
                  });
                }}
                className="btn btn-info gap-2 text-white"
              >
                <Info className="w-4 h-4" />
                Spustit informační toast
              </button>

              {/* Default Toast s Akcí */}
              <button
                onClick={() => {
                  toast({
                    variant: "default",
                    title: "Zápas byl smazán",
                    description: "Zápas byl úspěšně odstraněn ze systému.",
                    action: (
                      <ToastAction
                        altText="Vrátit zpět"
                        onClick={() => {
                          toast({
                            variant: "success",
                            title: "Akce vrácena zpět",
                            description: "Zápas byl obnoven.",
                          });
                        }}
                      >
                        Vrátit zpět
                      </ToastAction>
                    ),
                  });
                }}
                className="btn btn-neutral gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Toast s akčním tlačítkem
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Odznaky a ligové medaile */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <Trophy className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-black">Odznaky a ligové medaile</h2>
        </div>
        <p className="text-sm text-base-content/70">
          Všechny badges mají vyvážený padding a vertikální centrování bez použití monospace fontů. Emojis jsou vyhrazeny výhradně pro medaile prvních tří pozic.
        </p>

        <div className="card bg-base-100 border border-base-300 shadow-md">
          <div className="card-body p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Ligová ocenění a medaile (Velikost: badge-lg)
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="badge badge-lg bg-warning/20 border border-warning text-warning font-bold">
                  🥇 1. Místo (Šampioni)
                </span>
                <span className="badge badge-lg bg-slate-400/20 border border-slate-400 text-base-content font-bold">
                  🥈 2. Místo
                </span>
                <span className="badge badge-lg bg-amber-700/20 border border-amber-700 text-amber-600 font-bold">
                  🥉 3. Místo
                </span>
                <span className="badge badge-lg badge-primary font-bold">
                  <Trophy className="w-4 h-4" />
                  Král střelců (13 bodů)
                </span>
                <span className="badge badge-lg badge-info text-info-content font-bold">
                  <Shield className="w-4 h-4" />
                  BlowJob King (4 body)
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Stavové odznaky
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="badge badge-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  Odehráno
                </span>
                <span className="badge badge-warning">
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  Právě probíhá
                </span>
                <span className="badge badge-ghost">
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                  Čeká na odehrání
                </span>
                <span className="badge badge-primary badge-outline">Aktivní semestr</span>
                <span className="badge badge-error">Kontumace</span>
                <span className="badge badge-neutral">5 kol</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Velikostní hierarchie (xs → sm → md → lg)
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="badge badge-xs badge-primary">Extra Small (xs)</span>
                <span className="badge badge-sm badge-primary">Small (sm)</span>
                <span className="badge badge-primary">Standardní (md)</span>
                <span className="badge badge-lg badge-primary">Large (lg)</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Zápasový indikátor skóre
              </h3>
              <div className="inline-flex items-center gap-3 p-3 bg-base-200 rounded-2xl border border-base-300">
                <span className="font-extrabold text-lg px-2">Brouci</span>
                <span className="badge badge-lg font-black bg-base-100 text-xl border-base-300 shadow-inner px-5 py-3 tabular-nums">
                  10 : 7
                </span>
                <span className="font-extrabold text-lg px-2">Vlci</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barevná paleta a sémantické tokeny */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <Palette className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">Barevná paleta a sémantické tokeny</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {/* Base-100 */}
          <div className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold">base-100</span>
                <span className="badge badge-xs badge-ghost">{isDark ? "#131b2e" : "#ffffff"}</span>
              </div>
              <h3 className="font-bold text-base">Povrch karet a tabulek</h3>
              <p className="text-xs text-base-content/70 mt-1">Základní tělo boxů, formulářů a modálů.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-base-300 text-[11px] text-base-content/60">
              Karty a kontejnery
            </div>
          </div>

          {/* Base-200 */}
          <div className="card bg-base-200 border border-base-300 shadow-sm p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold">base-200</span>
                <span className="badge badge-xs badge-ghost">{isDark ? "#0b0f19" : "#f8fafc"}</span>
              </div>
              <h3 className="font-bold text-base">Pozadí aplikace</h3>
              <p className="text-xs text-base-content/70 mt-1">Hluboký podklad pod kartami a sekcemi.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-base-300 text-[11px] text-base-content/60">
              Hlavní podklad stránky
            </div>
          </div>

          {/* Base-300 */}
          <div className="card bg-base-300 border border-base-300 shadow-sm p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold">base-300</span>
                <span className="badge badge-xs badge-ghost">{isDark ? "#1e293b" : "#e2e8f0"}</span>
              </div>
              <h3 className="font-bold text-base">Ohraničení a oddělovače</h3>
              <p className="text-xs text-base-content/70 mt-1">Jemné a přesné linky tabulek a karet.</p>
            </div>
            <div className="mt-4 pt-2 border-t border-base-300 text-[11px] text-base-content/60">
              Ohraničení prvků
            </div>
          </div>

          {/* Base-content */}
          <div className="card bg-base-100 border border-base-300 shadow-sm p-4 flex flex-col justify-between ring-1 ring-primary/30">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold">base-content</span>
                <span className="badge badge-xs badge-success font-bold">WCAG AAA (16:1)</span>
              </div>
              <h3 className="font-bold text-base text-base-content">Hlavní text a titulky</h3>
              <p className="text-xs text-base-content/70 mt-1">
                Maximální kontrast. Vysoká čitelnost ve světlém i tmavém režimu.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-base-300 text-[11px] font-bold text-success flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% čitelnost
            </div>
          </div>
        </div>

        {/* Akcentní a stavové barvy */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <div className="p-4 rounded-2xl bg-primary text-primary-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold uppercase">primary</span>
            <div>
              <div className="font-black text-sm">Pivní oranžová</div>
              <span className="text-[11px] opacity-80">Akce a tlačítka</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-accent text-accent-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold uppercase">accent</span>
            <div>
              <div className="font-black text-sm">Zlatý ležák</div>
              <span className="text-[11px] opacity-80">1. místo a ocenění</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-secondary text-secondary-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold uppercase">secondary</span>
            <div>
              <div className="font-black text-sm">Sekundární</div>
              <span className="text-[11px] opacity-80">Doplňky a badge</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-success text-success-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold uppercase">success</span>
            <div>
              <div className="font-black text-sm">Výhra / Úspěch</div>
              <span className="text-[11px] opacity-80">Pozitivní stavy</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-warning text-warning-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold uppercase">warning</span>
            <div>
              <div className="font-black text-sm">Varování</div>
              <span className="text-[11px] opacity-80">Probíhající kola</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-error text-error-content shadow-md flex flex-col justify-between h-28">
            <span className="text-xs font-bold uppercase">error</span>
            <div>
              <div className="font-black text-sm">Prohra / Smazat</div>
              <span className="text-[11px] opacity-80">Kritické akce</span>
            </div>
          </div>
        </div>
      </section>

      {/* Typografie a textový kontrast */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <Type className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">Typografie a textový kontrast</h2>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-md">
          <div className="card-body p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-base-300 pb-4 gap-2">
              <span className="text-xs text-base-content/60 w-32 font-medium">Heading 1</span>
              <h1 className="text-4xl font-black flex-1">SPPDF BeerPong Liga 2025</h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-base-300 pb-4 gap-2">
              <span className="text-xs text-base-content/60 w-32 font-medium">Heading 2</span>
              <h2 className="text-2xl font-extrabold flex-1">1. Kolo – Turnajový večer</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-base-300 pb-4 gap-2">
              <span className="text-xs text-base-content/60 w-32 font-medium">Heading 3</span>
              <h3 className="text-lg font-bold flex-1">Brouci vs. Vlci (Zápis zápasu)</h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-base-300 pb-4 gap-2">
              <span className="text-xs text-base-content/60 w-32 font-medium">Body</span>
              <p className="text-base text-base-content flex-1">
                Základní čtecí text s plným kontrastem. Tento text je bezpečně čitelný za jakýchkoliv světelných podmínek na monitoru i mobilu bez použití umělých monospace písem.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="text-xs text-base-content/60 w-32 font-medium">Muted / Podtitulek</span>
              <p className="text-sm text-base-content/70 flex-1">
                Podtitulky a doplňující informace: 24. 10. 2026 • 5 odehraných zápasů.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tlačítka a stavy */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <MousePointerClick className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">Tlačítka a stavy</h2>
        </div>

        <div className="card bg-base-100 border border-base-300 shadow-md">
          <div className="card-body p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Základní varianty
              </h3>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary">Primární akce</button>
                <button className="btn btn-secondary">Sekundární akce</button>
                <button className="btn btn-accent">Akcentní akce</button>
                <button className="btn btn-neutral">Neutrální</button>
                <button className="btn btn-outline">Obrysové</button>
                <button className="btn btn-ghost">Nenápadné (Ghost)</button>
                <button className="btn btn-success">Úspěšné</button>
                <button className="btn btn-error">Kritické</button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Velikosti tlačítek
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn btn-primary btn-lg">Velké (lg)</button>
                <button className="btn btn-primary btn-md">Střední (md)</button>
                <button className="btn btn-primary btn-sm">Malé (sm)</button>
                <button className="btn btn-primary btn-xs">Kompaktní (xs)</button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-3">
                Stavy
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

      {/* Ligová tabulka */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <TableIcon className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">Ligová tabulka</h2>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="card-title text-xl font-bold">Celková ligová tabulka (Jarní semestr 2025)</h3>
                <p className="text-xs text-base-content/70">Přirozená čísla s vysokým kontrastem i při zlatavém podbarvení prvního místa</p>
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
                  <tr className="bg-warning/15 font-bold border-b border-base-300">
                    <td className="text-lg">🥇</td>
                    <td className="text-base text-base-content">Vlci</td>
                    <td className="text-center tabular-nums">3</td>
                    <td className="text-center text-success font-black tabular-nums">3</td>
                    <td className="text-center text-base-content/60 tabular-nums">0</td>
                    <td className="text-center text-error tabular-nums">0</td>
                    <td className="text-center tabular-nums">30:19</td>
                    <td className="text-center tabular-nums text-success font-bold">+11</td>
                    <td className="text-right font-black text-xl text-primary tabular-nums">9</td>
                  </tr>

                  <tr className="border-b border-base-300/80 hover:bg-base-200/50 transition-colors">
                    <td className="text-lg">🥈</td>
                    <td className="font-semibold text-base text-base-content">Brouci</td>
                    <td className="text-center tabular-nums">3</td>
                    <td className="text-center text-success font-bold tabular-nums">2</td>
                    <td className="text-center text-base-content/60 tabular-nums">0</td>
                    <td className="text-center text-error tabular-nums">1</td>
                    <td className="text-center tabular-nums">26:24</td>
                    <td className="text-center tabular-nums text-success font-bold">+2</td>
                    <td className="text-right font-bold text-lg text-primary tabular-nums">6</td>
                  </tr>

                  <tr className="border-b border-base-300/80 hover:bg-base-200/50 transition-colors">
                    <td className="text-lg">🥉</td>
                    <td className="font-semibold text-base text-base-content">Šneci</td>
                    <td className="text-center tabular-nums">3</td>
                    <td className="text-center text-success tabular-nums">0</td>
                    <td className="text-center text-base-content/60 tabular-nums">0</td>
                    <td className="text-center text-error font-bold tabular-nums">3</td>
                    <td className="text-center tabular-nums">15:28</td>
                    <td className="text-center tabular-nums text-error font-bold">-13</td>
                    <td className="text-right font-bold text-lg text-base-content/70 tabular-nums">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Formulářové prvky */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-base-300 pb-3">
          <Layers className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-black">Formulářové prvky a vstupy</h2>
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
                  className="input input-bordered w-full text-center font-bold text-lg tabular-nums"
                />
                <span className="font-bold text-xl">:</span>
                <input
                  type="number"
                  defaultValue="7"
                  className="input input-bordered w-full text-center font-bold text-lg tabular-nums"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Systémová hlášení */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Systémová hlášení</h2>
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
