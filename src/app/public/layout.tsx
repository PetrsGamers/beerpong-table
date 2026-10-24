import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "🦊 SPPDF Beer Pong - Výsledky",
  description: "Veřejné výsledky Beer Pong turnajů SPPDF",
  icons: {
    icon: "/icon.svg",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className="dark" data-theme="dark">
      <body className={`${inter.className} antialiased bg-[#0a0a0f] text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
