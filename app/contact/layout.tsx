import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Amuraa Studio',
  description: 'Reach out to the Amuraa studio team for order inquiries, custom quilted bag requests, bulk bridal party pouches, or general questions.',
  openGraph: {
    title: 'Contact Us | Amuraa',
    description: 'Get in touch with our handmade accessories studio.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
