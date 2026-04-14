import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/context/SocketContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NovaPulse Crypto Intelligence",
  description: "Real-time cryptocurrency predictive analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-navy text-white min-h-screen`}>
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
