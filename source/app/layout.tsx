import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "慢慢小屋 · eva-mum",
  description: "Boris 陪你慢慢照顧自己。私人的健康與經期小日記。",
  manifest: "/eva-mum/manifest.webmanifest",
  appleWebApp: { capable: true, title: "慢慢小屋", statusBarStyle: "default" },
  robots: { index: false, follow: false },
  icons: {
    icon: "/eva-mum/boris-icon-v3-32.png",
    shortcut: "/eva-mum/boris-icon-v3-32.png",
    apple: "/eva-mum/boris-icon-v3-180.png",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#fffaf2" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/eva-mum/mum-api-shim.js" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
