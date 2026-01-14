import type { Metadata } from "next";
import { Montserrat, Spicy_Rice } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const spicyRice = Spicy_Rice({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-spicy-rice",
});

export const metadata: Metadata = {
  title: "LocasPuntadas - Tienda Artesanal",
  description: "Piezas únicas que no salen de un molde, sino de un proceso lento y dedicado.",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${spicyRice.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-white selection:bg-rosa-empolvado selection:text-coral">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
