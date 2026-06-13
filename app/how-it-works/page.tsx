import React from 'react';
import Link from 'next/link';
import { ArrowRight, Lock, Scissors, RefreshCw, Truck, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Amuraa — Prepaid Drop Ordering',
  description: 'Understand Amuraa\'s prepaid drop process — from drop release to hand-quilting to dispatch. Learn our artisan stitching timeline and zero-waste fabric sourcing.',
  openGraph: {
    title: 'How It Works | Amuraa',
    description: 'Prepaid drops, hand-quilting, and slow fashion delivery — the Amuraa process explained.',
  },
};


export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-12 sm:gap-16">
      
      {/* Page Header */}
      <div className="text-center">
        <span className="font-script text-3xl text-brand-terracotta">Pre-Order Drops</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-brand-dark mt-2">How Drop Ordering Works</h1>
        <div className="h-0.5 w-16 bg-brand-terracotta/40 mx-auto mt-4" />
        <p className="mt-4 text-xs sm:text-sm text-brand-dark/70 max-w-md mx-auto leading-relaxed">
          We operate as a slow fashion house. Learn about how we secure fabrics, stitch bags, and ship your items.
        </p>
      </div>

      {/* 4 Steps Section */}
      <section className="flex flex-col gap-8">
        {[
          {
            step: '01',
            title: 'Drop Release & Prepaid Order',
            desc: 'We announce drop passwords and open checkout. You choose your quilted pattern and complete checkout. All orders are full payment upfront (prepaid) so we can secure custom printed cotton fabrics immediately.',
            icon: Lock
          },
          {
            step: '02',
            title: 'Fabric Sourcing & Cutting',
            desc: 'Once the drop closes (typically after 72 hours), we purchase the exact yards of leopard, checks, and floral fabric. We cut the fabric, stitch custom ruffles, and align the patterns for quilting.',
            icon: Scissors
          },
          {
            step: '03',
            title: 'Double-Stitched Hand Quilting',
            desc: 'Our local artisans pad the cotton sheets and quilt them by hand. Quilting is a slow, meticulous craft requiring precision to keep details puffy. Every item is inspected for seam durability.',
            icon: RefreshCw
          },
          {
            step: '04',
            title: 'Fulfillment & Dispatch Tracking',
            desc: 'Once complete, we pack your bag in eco-friendly wrapping and ship it out. You will receive an automated email confirmation with tracking codes to watch your quilted piece arrive.',
            icon: Truck
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-brand-pink/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start shadow-xs hover:border-brand-terracotta/35 transition-all">
            <div className="bg-brand-pink text-brand-terracotta p-4 rounded-2xl flex-shrink-0 flex items-center justify-center">
              <item.icon className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="flex-grow">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-brand-terracotta">Step {item.step}</span>
              <h3 className="font-serif text-xl font-semibold text-brand-dark mt-1">{item.title}</h3>
              <p className="text-xs sm:text-sm text-brand-dark/70 mt-2.5 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Timeframes Alert Box */}
      <section className="bg-brand-pink/20 border border-brand-pink/60 rounded-3xl p-6 sm:p-8">
        <h3 className="font-serif text-lg font-semibold text-brand-dark">Artisan Stitching Timeline</h3>
        <p className="text-xs text-brand-dark/70 leading-relaxed mt-2">
          Because every single bag is quilted by hand from scratch, the stitching period takes about **7 to 14 business days** after the drop closes. Regular shipping then takes another **2 to 4 days** to reach your shipping address. 
        </p>
        <p className="text-xs text-brand-dark/75 font-semibold italic mt-2">
          Total timeline from order to delivery is usually 2 to 3 weeks. We thank you for choosing slow handmade crafts over mass production!
        </p>
      </section>

      {/* FAQs redirection banner */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-brand-pink/30 pt-8 text-xs text-brand-dark/60 font-semibold">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-5 h-5 text-brand-terracotta" /> Have questions about shipping or cancellation policies?
        </span>
        <Link href="/faq" className="inline-flex items-center gap-1.5 text-brand-terracotta font-bold uppercase tracking-wider hover:underline">
          Visit FAQ Guide <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
