import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Drops | Amuraa — Quilted Bags & Accessories',
  description: 'Browse Amuraa\'s current drop collection — puffer tote bags, mini pouches, makeup bags, crossbody bags, and AirPod cases in playful prints.',
  openGraph: {
    title: 'Shop Drops | Amuraa',
    description: 'Limited-edition quilted accessories in gingham, leopard, polka dot, and floral prints.',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
