import type { Metadata } from 'next';
import { Cormorant_Garamond, Caveat, DM_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Amuraa | Crafted with Soul, Worn with Pride',
  description: 'Handmade, quilted, limited-edition prepaid drop accessories. Puffer totes, mini pouches, makeup bags, and crossbody accessories crafted from playful printed fabrics.',
  keywords: 'quilted tote bag, puffer tote, handmade pouch, indie brand, Amuraa bags, limited-edition accessories',
  authors: [{ name: 'Amuraa Team' }],
  openGraph: {
    title: 'Amuraa | Quilted Handmade Accessories',
    description: 'Playful quilted bags, puffer totes, and mini pouches, crafted with soul.',
    url: 'https://amuraa.com',
    siteName: 'Amuraa',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${caveat.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-dark selection:bg-brand-pink selection:text-brand-terracotta">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
