import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "🦊 SPPDF BeerPong",
  description: "BeerPong Scoring App & League System",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var m = localStorage.getItem('beerpong_theme_mode');
                var t = 'beerpong-light';
                if (m === 'dark') {
                  t = 'beerpong-dark';
                } else if (m === 'light') {
                  t = 'beerpong-light';
                } else {
                  t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'beerpong-dark' : 'beerpong-light';
                }
                document.documentElement.setAttribute('data-theme', t);
                if (t === 'beerpong-dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-base-200 text-base-content`}
      >
        <Navbar />
        <main className="flex-1 container mx-auto p-4 sm:p-6">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
