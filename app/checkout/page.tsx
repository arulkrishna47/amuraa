'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);

  // Autofill form if user is logged in and has default address
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
      const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      if (defaultAddr) {
        setStreet(defaultAddr.street);
        setCity(defaultAddr.city);
        setState(defaultAddr.state);
        setPostalCode(defaultAddr.postalCode);
        setCountry(defaultAddr.country);
      }
    }
  }, [user]);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
        <ShoppingBag className="h-16 w-16 text-brand-terracotta/30 stroke-[1.5] mb-4 mx-auto" />
        <h2 className="font-serif text-2xl font-semibold text-brand-dark">Nothing to check out</h2>
        <p className="text-xs text-brand-dark/50 mt-1 mb-6">Your shopping bag is empty.</p>
        <Link
          href="/shop"
          className="rounded-full bg-brand-terracotta px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand-terracotta/95"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const estimatedTax = Math.round(cartSubtotal * 0.08 * 100) / 100;
  const orderTotal = cartSubtotal + estimatedTax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !name || !street || !city || !state || !postalCode || !phone) {
      showToast('Please fill in all required shipping and contact details.', 'error');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        email,
        items: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          fabric: item.fabric,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name,
          street,
          city,
          state,
          postalCode,
          country,
          phone,
        },
        totalAmount: orderTotal,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Redirecting to secure payment checkout...', 'success');
        clearCart(); // Clear local shopping bag since order allocation succeeded
        router.push(data.redirectUrl); // Redirect to Stripe checkout or local Mock payment gateway
      } else {
        showToast(data.error || 'Stock allocation or checkout failed.', 'error');
      }
    } catch (err) {
      showToast('An unexpected checkout error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="border-b border-brand-pink/40 pb-6 mb-10">
        <span className="font-script text-2xl text-brand-terracotta">Secure Checkout</span>
        <h1 className="font-serif text-3xl font-semibold text-brand-dark mt-1">Shipping & Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Shipping Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Card: Contact Details */}
          <div className="bg-white border border-brand-pink/30 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-brand-dark border-b border-brand-pink/20 pb-3">
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1.5">Email Address*</label>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-terracotta"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1.5">Phone Number*</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-terracotta"
                />
              </div>
            </div>
          </div>

          {/* Card: Shipping Address */}
          <div className="bg-white border border-brand-pink/30 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-brand-dark border-b border-brand-pink/20 pb-3">
              Shipping Address
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1.5">Full Recipient Name*</label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-terracotta"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1.5">Street Address*</label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, suite, unit, building, street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-terracotta"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1.5">City*</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-terracotta"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1.5">State / Region*</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-terracotta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1.5">PIN / Postal Code*</label>
                  <input
                    type="text"
                    required
                    placeholder="Zip code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-terracotta"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/60 block mb-1.5">Country*</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-terracotta cursor-pointer"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-terracotta py-4 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:bg-brand-terracotta/90 hover:scale-101 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200"
          >
            <CreditCard className="w-4.5 h-4.5" />
            {loading ? 'Securing Stock...' : 'Proceed to Prepaid Payment'}
          </button>

        </form>

        {/* RIGHT COLUMN: Order Summary review */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-brand-pink/30 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
            <h3 className="font-serif text-lg font-semibold text-brand-dark border-b border-brand-pink/20 pb-3">
              Review Items
            </h3>

            {/* List items briefly */}
            <div className="flex flex-col gap-4 divide-y divide-brand-pink/15">
              {cartItems.map((item) => (
                <div key={item.product} className="flex gap-4 pt-4 first:pt-0 items-center">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-brand-cream border border-brand-pink/30">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-brand-dark truncate">{item.name}</h4>
                    <p className="text-[10px] text-brand-dark/50 mt-0.5">Print: {item.fabric} x{item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-dark">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Pricing details */}
            <div className="border-t border-brand-pink/20 pt-4 flex flex-col gap-2 text-xs text-brand-dark/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-brand-dark">${cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold uppercase tracking-wider text-[10px]">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-semibold text-brand-dark">${estimatedTax}</span>
              </div>
              <div className="border-t border-brand-pink/20 pt-3 flex justify-between font-serif text-base font-bold text-brand-dark">
                <span>Total Due</span>
                <span className="text-brand-terracotta">${orderTotal}</span>
              </div>
            </div>

            {/* Quality check disclaimer */}
            <div className="border-t border-brand-pink/20 pt-4 flex items-center gap-3 text-[10px] text-brand-dark/60 leading-relaxed font-semibold">
              <ShieldCheck className="w-8 h-8 text-brand-terracotta flex-shrink-0 stroke-[1.5]" />
              <span>
                By placing your prepaid order, you reserve handcrafted artisan time and materials for this specific print drop.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
