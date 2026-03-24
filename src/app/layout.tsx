import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LocasPuntadas - Tienda Artesanal',
  description: 'Piezas unicas que no salen de un molde, sino de un proceso lento y dedicado.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased text-gray-900 bg-white selection:bg-rosa-empolvado selection:text-coral">
        {children}
      </body>
    </html>
  );
}
