import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navigation from "../components/Navigation";
import { AskUjrisFab } from "../components/ask-ujris-fab";
import { ServiceWorkerRegister } from "../components/sw-register";
import "../styles/design-tokens.css";

export const metadata: Metadata = {
  title: "FORTIS OS — UJU GROUP LIMITED",
  description: "AI-powered business transformation, brand intelligence, and forensic document analysis for African leaders.",
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B4D3E" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="FORTIS OS" />
      </head>
      <body>
        <Navigation />
        {children}
        <AskUjrisFab />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
