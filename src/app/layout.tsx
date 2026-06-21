import { TRPCReactProvider } from '@/trpc/client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Simple task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <TRPCReactProvider>
          <ToastProvider>
            <main className="max-w-2xl mx-auto px-4 py-10">
              {children}
            </main>
          </ToastProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
