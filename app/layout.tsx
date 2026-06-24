import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MRTB Nigeria | Medical Rehabilitation Therapists Board",
  description: "Official portal for registration and regulation of rehabilitation therapists in Nigeria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add suppressHydrationWarning here
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* This wrapper handles the "Home Page Only" logic */}
        <HeaderWrapper />
        
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
