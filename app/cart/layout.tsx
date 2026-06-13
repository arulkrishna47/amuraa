import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Bag | Amuraa — Shopping Cart',
  description: 'Review the quilted accessories in your bag before checkout. Amuraa — prepaid, handmade, limited-edition drops.',
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
