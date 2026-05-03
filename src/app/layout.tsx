import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Scene from "@/components/canvas/Scene";
import CookingImageLayer from "@/components/canvas/CookingImageLayer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ricardo Salume | Nutrição de Alta Performance",
  description:
    "Nutrição clínica especializada em hipertrofia, emagrecimento, patologias e performance de elite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="font-sans bg-[#080808]">
        {/* Cooking image — behind everything */}
        <CookingImageLayer />
        {/* WebGL particles — transparent canvas over cooking image */}
        <Scene />
        {children}
      </body>
    </html>
  );
}
