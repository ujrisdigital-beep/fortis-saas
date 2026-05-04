import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navigation from "../components/Navigation";
import Providers from "../components/Providers";
import FloatingUJU from "../components/FloatingUJU";
import { ServiceWorkerRegister } from "../components/sw-register";
import CopyrightProtection from "../components/CopyrightProtection";
import TradeSecretWatermark from "../components/TradeSecretWatermark";
import "../styles/design-tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "FORTIS OS — National Economic Intelligence Platform",
  description: "AI-powered business transformation, economic intelligence, and forensic document analysis for The Gambia.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B4D3E" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="FORTIS OS" />
      </head>
      <body>
        <Providers>
          <Navigation />
          {children}
          <FloatingUJU />
          <ServiceWorkerRegister />
          <CopyrightProtection />
          <TradeSecretWatermark />
        </Providers>
      </body>
    </html>
  );
}
