import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POLER Engine — Ваги = машинний код",
  description:
    "POLER Engine: перехід від статичного Transformer Inference (ChatGLM3-6B, Int4/Trit5, чистий Rust) до динамічного JIT-контуру пластичності — Hebbian STDP, трити, машиниий код x86_64 у реальному часі.",
  keywords: [
    "POLER Engine",
    "JIT learning",
    "Hebbian STDP",
    "Trit5",
    "RoPE",
    "ChatGLM3",
    "Rust",
    "x86_64",
    "пластичність",
  ],
  authors: [{ name: "POLER Engine Org" }],
  openGraph: {
    title: "POLER Engine — Ваги = машинний код",
    description:
      "6.2 млрд параметрів портовано на чистий Rust. Далі — не повільний декодер, а живий JIT-контур: 3000× швидше, 100% пластичність.",
    siteName: "POLER Engine",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
