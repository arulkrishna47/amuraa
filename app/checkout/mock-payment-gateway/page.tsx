'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { CreditCard, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface Order {
  _id: string;
  totalAmount: number;
  email: string;
  items: Array<{
    name: string;
    fabric: string;
    quantity: number;
  }>;
}

function MockPaymentGatewayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // Form states for credit card details
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [cardName, setCardName] = useState('Amuraa Customer');

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center animate-pulse">
        <p className="font-serif text-lg text-brand-dark/50">Opening secure mock gateway...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h2 className="font-serif text-xl font-bold text-brand-dark">Invalid Checkout Session</h2>
        <p className="text-xs text-brand-dark/50 mt-1 mb-6">No pending order session matches this gateway link.</p>
        <Link href="/cart" className="rounded-full bg-brand-terracotta px-6 py-2.5 text-xs font-bold uppercase text-white">
          Return to Cart
        </Link>
      </div>
    );
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order._id,
          isMock: true,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Payment successful! Processing order details...', 'success');
        router.push(`/checkout/success?orderId=${order._id}`);
      } else {
        showToast(data.error || 'Payment confirmation failed.', 'error');
        setPaying(false);
      }
    } catch (err) {
      showToast('An unexpected error occurred during confirmation.', 'error');
      setPaying(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      
      {/* Brand Header */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl font-bold text-brand-dark">Amuraa Payment Hub</h1>
        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] uppercase font-bold tracking-wider text-brand-terracotta bg-brand-pink px-3 py-1 rounded-full border border-brand-terracotta/20">
          <Sparkles className="w-3 h-3" /> Test Payment Gateway
        </span>
      </div>

      <div className="bg-white border border-brand-pink/40 shadow-xl rounded-3xl overflow-hidden">
        
        {/* Order Details Banner */}
        <div className="bg-brand-pink/35 border-b border-brand-pink/30 p-6 flex justify-between items-center text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-dark/50">Order Code</p>
            <p className="font-mono font-bold text-brand-dark mt-0.5">#{order._id.slice(-6).toUpperCase()}</p>
            <p className="text-[10px] text-brand-dark/60 mt-1">{order.email}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-brand-dark/50">Total Charge</p>
            <p className="font-serif text-2xl font-bold text-brand-terracotta mt-0.5">${order.totalAmount}</p>
          </div>
        </div>

        {/* Form container */}
        <form onSubmit={handlePaymentSubmit} className="p-6 flex flex-col gap-5">
          
          {/* Simulated Card layout box */}
          <div className="w-full aspect-1.6/1 bg-gradient-to-br from-brand-terracotta/90 to-brand-accent/90 rounded-2xl p-5 text-white flex flex-col justify-between shadow-md relative overflow-hidden select-none">
            <div className="absolute inset-0 quilt-bg opacity-10 pointer-events-none" />
            <div className="flex justify-between items-start">
              <span className="font-serif text-lg font-bold tracking-wide italic">Amuraa Card</span>
              <Lock className="w-4.5 h-4.5 opacity-80" />
            </div>
            <div className="font-mono text-lg tracking-widest my-4">{cardNumber || '•••• •••• •••• ••••'}</div>
            <div className="flex justify-between items-end text-xs uppercase font-medium">
              <div>
                <p className="text-[8px] opacity-75">Card Holder</p>
                <p className="tracking-wide">{cardName || 'Amuraa Customer'}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] opacity-75">Expires</p>
                <p>{expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>

          {/* Input Controls */}
          <div className="flex flex-col gap-4 mt-2">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1">Card Number (Standard Test Card)</label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-brand-cream/35 border border-brand-pink/60 rounded-full px-4 py-2 text-xs font-mono text-brand-dark focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1">Expiration</label>
                <input
                  type="text"
                  required
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-pink/60 rounded-full px-4 py-2 text-xs font-mono text-brand-dark focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1">CVC Code</label>
                <input
                  type="password"
                  required
                  maxLength={3}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="w-full bg-brand-cream/35 border border-brand-pink/60 rounded-full px-4 py-2 text-xs font-mono text-brand-dark focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1">Name on Card</label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full bg-brand-cream/35 border border-brand-pink/60 rounded-full px-4 py-2 text-xs text-brand-dark focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={paying}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-terracotta py-4 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:bg-brand-terracotta/95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all mt-4"
          >
            {paying ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Confirming Transaction...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4.5 h-4.5" />
                Pay Now (Test Mode)
              </>
            )}
          </button>

          <Link
            href="/cart"
            className="text-center text-[10px] font-bold uppercase text-brand-dark/50 hover:text-brand-terracotta hover:underline mt-1"
          >
            Cancel & Return to Cart
          </Link>

        </form>
      </div>
    </div>
  );
}

export default function MockPaymentGatewayPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md px-4 py-24 text-center animate-pulse">
        <p className="font-serif text-lg text-brand-dark/50">Opening secure mock gateway...</p>
      </div>
    }>
      <MockPaymentGatewayContent />
    </Suspense>
  );
}
