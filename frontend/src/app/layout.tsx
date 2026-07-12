import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "PneumoVision AI — AI-Powered Chest X-Ray Screening",
  description:
    "Clinical-grade AI diagnostic console for chest X-ray pneumonia screening. ResNet50 classifier with Grad-CAM localization for explainable results.",
  keywords: ["pneumonia", "chest x-ray", "AI diagnosis", "medical imaging", "Grad-CAM", "deep learning"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-void text-bright font-body antialiased">
        <AuthProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
