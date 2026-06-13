import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Amuraa — Secure Prepaid Order',
  description: 'Complete your prepaid order for handmade quilted accessories. Secure payment processing with Stripe.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
