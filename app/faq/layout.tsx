import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Amuraa — Handmade Quilted Bags',
  description:
    "Find answers to common questions about Amuraa's prepaid drops, handmade quilted bag sizing, shipping timelines, return policies, and care instructions.",
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
