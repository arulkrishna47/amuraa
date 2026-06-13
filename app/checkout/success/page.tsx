'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { Check, ShoppingBag, Sparkles, Heart } from 'lucide-react';

interface OrderItem {
  product: string;
  name: string;
  fabric: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  totalAmount: number;
  email: string;
  orderStatus: string;
  paymentStatus: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    // Call confirm endpoint to mark order as paid, trigger email confirmation, and fetch items
    async function confirmPayment() {
      if (confirmedRef.current) return;
      confirmedRef.current = true;

      try {
        const res = await fetch('/api/checkout/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            sessionId,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.order);
          // Pop Confetti on successful load!
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FDF2F4', '#C87A80', '#8EACCD', '#E6F0FA'],
          });
        } else {
          setError(data.error || 'Failed to verify payment session.');
        }
      } catch (err) {
        console.error('Payment confirmation error:', err);
        setError('An unexpected error occurred verifying this order.');
      } finally {
        setLoading(false);
      }
    }

    confirmPayment();
  }, [orderId, sessionId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center animate-pulse">
        <p className="font-serif text-lg text-brand-dark/50">Processing transaction & allocating artisan materials...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <ShoppingBag className="w-14 h-14 text-red-400 stroke-[1.5] mb-4 mx-auto" />
        <h2 className="font-serif text-2xl font-semibold text-brand-dark">Order confirmation failed</h2>
        <p className="text-xs text-brand-dark/60 mt-1 mb-8">
          {error || 'We could not fetch the details for this transaction session.'}
        </p>
        <Link href="/shop" className="rounded-full bg-brand-terracotta px-6 py-2.5 text-xs font-bold uppercase text-white shadow-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Visual Success Indicator banner */}
      <div className="text-center mb-10">
        <div className="mx-auto h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 flex text-emerald-600 mb-6 shadow-xs animate-bounce">
          <Check className="h-8 w-8 stroke-[2.5]" />
        </div>
        
        <span className="font-script text-3xl text-brand-terracotta flex justify-center items-center gap-1.5">
          <Heart className="w-5 h-5 fill-current text-brand-terracotta/40" /> Thank You for Supporting Slow Craft
        </span>
        
        <h1 className="font-serif text-4xl font-semibold text-brand-dark mt-2">
          Your Order is Secured!
        </h1>
        
        <p className="text-xs text-brand-dark/60 mt-2 max-w-md mx-auto leading-relaxed">
          Order Code: <span className="font-mono font-bold">#{order._id.slice(-6).toUpperCase()}</span>. 
          A confirmation email has been dispatched to <span className="font-semibold text-brand-dark">{order.email}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT CARD: Receipt and story */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* Handmade story box */}
          <div className="bg-brand-pink/20 border border-brand-pink/55 rounded-3xl p-6 relative overflow-hidden">
            <div className="quilt-bg absolute inset-0 pointer-events-none" />
            <h3 className="font-serif text-base font-semibold text-brand-dark flex items-center gap-1.5 relative z-10">
              <Sparkles className="w-4 h-4 text-brand-terracotta" /> What Happens Next?
            </h3>
            <p className="text-xs text-brand-dark/70 leading-relaxed mt-2 relative z-10">
              Our artisans in the studio have allocated the custom printed fabric for your order. Over the next few days, your bag/pouch will be cut, padded, and quilted by hand. 
            </p>
            <p className="text-xs text-brand-dark/70 leading-relaxed mt-2 relative z-10 font-medium italic">
              Slow craft takes a little time, but we promise the wait is worth it!
            </p>
          </div>

          {/* Delivery & Address */}
          <div className="bg-white border border-brand-pink/35 rounded-3xl p-6 shadow-xs flex flex-col gap-3">
            <h3 className="font-serif text-sm font-semibold text-brand-dark border-b border-brand-pink/20 pb-2">
              Deliver To
            </h3>
            <div className="text-xs text-brand-dark/70 leading-relaxed">
              <p className="font-bold text-brand-dark">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

        </div>

        {/* RIGHT CARD: Items breakdown */}
        <div className="md:col-span-5 bg-white border border-brand-pink/35 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
          <h3 className="font-serif text-sm font-semibold text-brand-dark border-b border-brand-pink/20 pb-2">
            Items Secured
          </h3>

          <div className="flex flex-col gap-4 divide-y divide-brand-pink/15">
            {order.items.map((item) => (
              <div key={item.product} className="flex gap-4 pt-4 first:pt-0 items-center">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-brand-cream border border-brand-pink/30">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-brand-dark truncate">{item.name}</h4>
                  <p className="text-[9px] text-brand-dark/50 mt-0.5">Print: {item.fabric} x{item.quantity}</p>
                </div>
                <span className="text-xs font-semibold text-brand-dark">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-pink/15 pt-4 flex justify-between font-serif text-base font-bold text-brand-dark">
            <span>Total Paid</span>
            <span className="text-brand-terracotta">${order.totalAmount}</span>
          </div>

          <Link
            href="/account"
            className="w-full inline-flex items-center justify-center rounded-full bg-brand-dark py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand-dark/90 transition-all text-center mt-2"
          >
            Track Order History
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-xl px-4 py-24 text-center animate-pulse">
        <p className="font-serif text-lg text-brand-dark/50">Processing transaction & allocating artisan materials...</p>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
