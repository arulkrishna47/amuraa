import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Amuraa',
  description: 'Manage your Amuraa account — view order history, track shipments, and update your delivery addresses.',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
