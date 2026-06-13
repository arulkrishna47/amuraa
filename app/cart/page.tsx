'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart } = useCart();

  const shippingCost = 0; // Free shipping
  const estimatedTax = Math.round(cartSubtotal * 0.08 * 100) / 100; // 8% sales tax mock
  const orderTotal = cartSubtotal + shippingCost + estimatedTax;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header title */}
      <div className="border-b border-brand-pink/40 pb-6 mb-10">
        <span className="font-script text-2xl text-brand-terracotta">Your Bag</span>
        <h1 className="font-serif text-3xl font-semibold text-brand-dark mt-1">Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-brand-pink/30 rounded-3xl py-20 px-4 text-center flex flex-col items-center max-w-xl mx-auto shadow-xs">
          <ShoppingBag className="h-16 w-16 text-brand-terracotta/30 stroke-[1.5] mb-4" />
          <h2 className="font-serif text-2xl text-brand-dark">Your bag is currently empty</h2>
          <p className="text-xs text-brand-dark/50 mt-1 mb-8 max-w-xs">
            We operate in limited fabric quantities. Items in your bag are not reserved until checkout is completed!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-brand-terracotta px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xs hover:bg-brand-terracotta/90"
          >
            Explore Current Drop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT SIDE: Items Table List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Header row for tables */}
            <div className="hidden sm:grid grid-cols-12 text-[10px] font-bold uppercase tracking-widest text-brand-dark/50 px-6 pb-2 border-b border-brand-pink/20">
              <span className="col-span-6">Product Item</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            {/* List entries */}
            <div className="flex flex-col gap-4 divide-y divide-brand-pink/15">
              {cartItems.map((item) => (
                <div 
                  key={item.product} 
                  className="pt-4 first:pt-0 grid grid-cols-1 sm:grid-cols-12 items-center gap-4 bg-white border border-brand-pink/30 p-5 rounded-2xl shadow-xs"
                >
                  {/* Column: Info & Image */}
                  <div className="col-span-1 sm:col-span-6 flex gap-4 items-center">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-brand-cream border border-brand-pink/40">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link 
                        href={`/shop/${item.product}`}
                        className="font-serif text-sm font-semibold text-brand-dark hover:text-brand-terracotta line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-brand-dark/50 mt-0.5">Fabric print: {item.fabric}</p>
                      {item.stock <= 5 && (
                        <span className="inline-block text-[9px] font-bold text-brand-terracotta uppercase bg-brand-pink px-2 py-0.5 rounded-full mt-1.5 animate-pulse">
                          Only {item.stock} left in stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Column: Price */}
                  <div className="col-span-1 sm:col-span-2 text-left sm:text-center">
                    <span className="sm:hidden text-[10px] font-bold uppercase text-brand-dark/40 block">Price:</span>
                    <span className="text-sm font-semibold text-brand-dark">${item.price}</span>
                  </div>

                  {/* Column: Quantity Selector */}
                  <div className="col-span-1 sm:col-span-2 flex justify-start sm:justify-center items-center gap-3">
                    <div className="flex items-center border border-brand-pink/60 rounded-full bg-brand-cream/30">
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                        className="p-1 px-2.5 text-brand-dark hover:text-brand-terracotta"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1 min-w-[16px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                        className="p-1 px-2.5 text-brand-dark hover:text-brand-terracotta"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Column: Subtotal per row */}
                  <div className="col-span-1 sm:col-span-2 text-left sm:text-right">
                    <span className="sm:hidden text-[10px] font-bold uppercase text-brand-dark/40 block">Subtotal:</span>
                    <span className="text-sm font-bold text-brand-terracotta">${item.price * item.quantity}</span>
                  </div>

                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center mt-6">
              <Link
                href="/shop"
                className="text-xs font-bold uppercase tracking-wider text-brand-dark hover:text-brand-terracotta hover:underline focus:outline-none"
              >
                &larr; Continue Shopping
              </Link>
            </div>

          </div>

          {/* RIGHT SIDE: Summary Card */}
          <div className="lg:col-span-4 bg-white border border-brand-pink/30 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
            <h3 className="font-serif text-xl font-semibold text-brand-dark border-b border-brand-pink/20 pb-4">
              Order Summary
            </h3>

            <div className="flex flex-col gap-3 text-xs text-brand-dark/70">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-semibold text-brand-dark">${cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Free
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-semibold text-brand-dark">${estimatedTax}</span>
              </div>
            </div>

            <div className="border-t border-brand-pink/20 pt-4 flex justify-between font-serif text-lg font-bold text-brand-dark">
              <span>Total Price</span>
              <span className="text-brand-terracotta">${orderTotal}</span>
            </div>

            <p className="text-[10px] text-brand-dark/50 leading-relaxed bg-brand-pink/15 p-4 rounded-xl border border-brand-pink/20">
              ⚠️ **Prepaid drops only:** Our handmade items require full payment upfront. COD is not available to secure artisan time and custom printed fabric.
            </p>

            <Link
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-terracotta py-4 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:bg-brand-terracotta/90 hover:scale-101 transition-all duration-200"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
