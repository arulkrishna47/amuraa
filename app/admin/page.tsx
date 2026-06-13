'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BarChart3, Package, ShoppingCart, Users, Edit3, Trash2, Check, Send, AlertTriangle, ShieldAlert, Plus, X } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  category: string;
  fabric: string;
  price: number;
  stock: number;
  images: string[];
  description: string;
}

interface Order {
  _id: string;
  email: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  items: Array<{
    name: string;
    fabric: string;
    quantity: number;
  }>;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  // Admin Sub-Tab Control: 'dashboard' | 'products' | 'orders' | 'subscribers'
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'orders' | 'subscribers'>('dashboard');

  // Database lists
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Stock edit states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);

  // Order status update states
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState('Processing');
  const [newCarrier, setNewCarrier] = useState('');
  const [newTracking, setNewTracking] = useState('');

  // Add Product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Puffer Tote Bags');
  const [newFabric, setNewFabric] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImages, setNewImages] = useState('/images/products/tote_pink_leopard_1.jpg'); // default seed fallback
  const [newDimensions, setNewDimensions] = useState('');
  const [newCare, setNewCare] = useState('');

  useEffect(() => {
    // If auth loading is done and user is not admin, redirect or halt
    if (!loading && (!user || user.role !== 'admin')) {
      // Don't auto-redirect immediately, let them see unauthorized notice or login
    }
  }, [user, loading]);

  const loadAdminData = async () => {
    if (!user || user.role !== 'admin') return;
    setDataLoading(true);
    try {
      // 1. Fetch Products
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData.products) setProducts(prodData.products);

      // 2. Fetch Orders
      const orderRes = await fetch('/api/orders');
      const orderData = await orderRes.json();
      if (orderData.orders) setOrders(orderData.orders);

      // 3. Fetch Subscribers
      const subRes = await fetch('/api/newsletter'); // we added a fallback GET or mock load in dataService
      // For subscribers list, retrieve from subscriber list
      const subResDetail = await fetch('/api/newsletter');
      const subData = await subResDetail.json();
      // If endpoint doesn't support GET directly, fallback
      setSubscribers(subData.subscribers || []);
    } catch (e) {
      console.error('Failed to load admin stats:', e);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  // Auth Guard view
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center animate-pulse">
        <p className="font-serif text-lg text-brand-dark/50">Verifying administrative credentials...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <ShieldAlert className="w-16 h-16 text-brand-terracotta mx-auto stroke-[1.5] mb-4" />
        <h2 className="font-serif text-2xl font-bold text-brand-dark">Admin Access Required</h2>
        <p className="text-xs text-brand-dark/60 mt-1 mb-8 leading-relaxed">
          This portal is protected. Please log in using the credentials specified in your database seed file.
        </p>
        <button
          onClick={() => router.push('/account')}
          className="rounded-full bg-brand-terracotta px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand-terracotta/90"
        >
          Go to Login Page
        </button>
      </div>
    );
  }

  // Calculate aggregates
  const totalRevenue = orders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  // Stock edit handler
  const handleStockUpdate = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: Number(editingStockVal) }),
      });
      if (res.ok) {
        showToast('Stock level updated successfully!', 'success');
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock: Number(editingStockVal) } : p));
        setEditingProductId(null);
      } else {
        showToast('Failed to update stock.', 'error');
      }
    } catch (e) {
      showToast('An unexpected error occurred.', 'error');
    }
  };

  // Delete product handler
  const handleProductDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this quilted accessory?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Product successfully removed.', 'success');
        setProducts(prev => prev.filter(p => p._id !== productId));
      } else {
        showToast('Failed to delete product.', 'error');
      }
    } catch (e) {
      showToast('An unexpected error occurred.', 'error');
    }
  };

  // Add product handler
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newFabric || !newPrice || !newStock || !newDescription) {
      showToast('Please fill in all product details.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          category: newCategory,
          fabric: newFabric,
          price: Number(newPrice),
          stock: Number(newStock),
          images: [newImages],
          description: newDescription,
          dimensions: newDimensions,
          careInstructions: newCare,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Product added to drop catalog successfully!', 'success');
        setProducts(prev => [data.product, ...prev]);
        
        // Reset form
        setNewName('');
        setNewFabric('');
        setNewPrice('');
        setNewStock('');
        setNewDescription('');
        setNewDimensions('');
        setNewCare('');
        setShowAddForm(false);
      } else {
        showToast(data.error || 'Failed to create product.', 'error');
      }
    } catch (err) {
      showToast('An unexpected error occurred.', 'error');
    }
  };

  // Order status update handler
  const handleOrderStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingOrderId) return;

    try {
      const res = await fetch(`/api/orders/${updatingOrderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newOrderStatus,
          trackingNumber: newTracking,
          carrier: newCarrier,
        }),
      });
      if (res.ok) {
        showToast('Order fulfillment status updated successfully!', 'success');
        setOrders(prev => prev.map(o => o._id === updatingOrderId ? { 
          ...o, 
          orderStatus: newOrderStatus, 
          trackingNumber: newTracking, 
          carrier: newCarrier 
        } : o));
        setUpdatingOrderId(null);
        setNewTracking('');
        setNewCarrier('');
      } else {
        showToast('Failed to update order details.', 'error');
      }
    } catch (e) {
      showToast('An unexpected error occurred.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header title */}
      <div className="border-b border-brand-pink/40 pb-6 mb-10 text-center sm:text-left">
        <span className="font-script text-2xl text-brand-terracotta">Amuraa Studio</span>
        <h1 className="font-serif text-4xl font-semibold text-brand-dark mt-1">Admin Dashboard</h1>
        <p className="text-xs text-brand-dark/50 mt-1">Manage drop products, coordinate pre-orders, and monitor stocks.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-brand-pink/30 mb-8 overflow-x-auto gap-2">
        {([
          { id: 'dashboard', label: 'Overview', icon: BarChart3 },
          { id: 'products', label: 'Products Catalog', icon: Package },
          { id: 'orders', label: 'Order Lists', icon: ShoppingCart },
          { id: 'subscribers', label: 'Drop Subscribers', icon: Users },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap focus:outline-none ${
              adminTab === tab.id
                ? 'border-brand-terracotta text-brand-terracotta'
                : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* -------------------------------------------------------------
          TAB 1: OVERVIEW DASHBOARD
          ------------------------------------------------------------- */}
      {adminTab === 'dashboard' && (
        <div className="flex flex-col gap-10">
          
          {/* Dashboard stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white border border-brand-pink/30 rounded-3xl p-6 shadow-xs flex items-center gap-4">
              <div className="bg-brand-pink/60 p-4 rounded-2xl text-brand-terracotta">
                <ShoppingCart className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-brand-dark/50">Total Orders</p>
                <p className="text-2xl font-bold text-brand-dark mt-0.5">{totalOrdersCount}</p>
              </div>
            </div>

            <div className="bg-white border border-brand-pink/30 rounded-3xl p-6 shadow-xs flex items-center gap-4">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-emerald-600">
                <BarChart3 className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-brand-dark/50">Revenue Paid</p>
                <p className="text-2xl font-bold text-brand-dark mt-0.5">${totalRevenue}</p>
              </div>
            </div>

            <div className="bg-white border border-brand-pink/30 rounded-3xl p-6 shadow-xs flex items-center gap-4">
              <div className="bg-[#FFF5F5] border border-red-100 p-4 rounded-2xl text-red-500">
                <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-brand-dark/50">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-brand-dark mt-0.5">{lowStockCount}</p>
              </div>
            </div>

            <div className="bg-white border border-brand-pink/30 rounded-3xl p-6 shadow-xs flex items-center gap-4">
              <div className="bg-brand-blue p-4 rounded-2xl text-brand-accent">
                <Users className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-brand-dark/50">Drop Subscribers</p>
                <p className="text-2xl font-bold text-brand-dark mt-0.5">{subscribers.length}</p>
              </div>
            </div>

          </div>

          {/* Low Stock Products Alert Box */}
          {products.filter((p) => p.stock <= 5).length > 0 && (
            <div className="bg-[#FFF5F5] border border-red-100 rounded-3xl p-6 flex flex-col gap-4">
              <h3 className="font-serif text-lg font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Urgent Stock Restock Notices
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products
                  .filter((p) => p.stock <= 5)
                  .map((p) => (
                    <div key={p._id} className="bg-white border border-red-200/50 p-4 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-semibold text-brand-dark">{p.name}</h4>
                        <p className="text-[10px] text-brand-dark/50 mt-0.5">Print: {p.fabric}</p>
                      </div>
                      <span className={`font-bold px-3 py-1 rounded-full text-[10px] ${
                        p.stock === 0 ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
                      }`}>
                        {p.stock === 0 ? 'Sold Out' : `Only ${p.stock} left!`}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: PRODUCTS CATALOG MANAGER
          ------------------------------------------------------------- */}
      {adminTab === 'products' && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-2xl font-semibold text-brand-dark">Products Drop List ({products.length})</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-terracotta hover:bg-brand-terracotta/90 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-transform duration-200 shadow-xs"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddForm ? 'Close Editor' : 'Add New Design'}
            </button>
          </div>

          {/* Add Product form */}
          {showAddForm && (
            <form onSubmit={handleAddProductSubmit} className="bg-white border border-brand-pink/40 p-6 rounded-3xl flex flex-col gap-4 shadow-md max-w-3xl">
              <h4 className="font-serif text-lg font-semibold text-brand-dark border-b border-brand-pink/20 pb-2 mb-2">Create New Quilted Accessory</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Handmade Crossbody Bag"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs text-brand-dark focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs text-brand-dark focus:outline-none cursor-pointer"
                  >
                    <option value="Puffer Tote Bags">Puffer Tote Bags</option>
                    <option value="Heart Print Mini Bags">Heart Print Mini Bags</option>
                    <option value="Striped Ruffle-Strap Shoulder Bags">Striped Ruffle-Strap Shoulder Bags</option>
                    <option value="AirPod Bags / Small Pouches">AirPod Bags / Small Pouches</option>
                    <option value="Makeup Pouches">Makeup Pouches</option>
                    <option value="Indigo Block-Print Organizer Pouches">Indigo Block-Print Organizer Pouches</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Fabric Print Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mauve Polka Dot"
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Price"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Artisan Stock Qty</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Available count"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the quilted padding, ruffles, lining, and storage space..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-2xl px-4 py-3 text-xs text-brand-dark focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Dimensions details</label>
                  <input
                    type="text"
                    placeholder='12" H x 10" W x 3" D'
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Care Guidelines</label>
                  <input
                    type="text"
                    placeholder="Hand wash cold with mild detergent"
                    value={newCare}
                    onChange={(e) => setNewCare(e.target.value)}
                    className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest block mb-1">Product Photo URL</label>
                <input
                  type="text"
                  required
                  value={newImages}
                  onChange={(e) => setNewImages(e.target.value)}
                  className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2.5 text-xs font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-terracotta text-white rounded-full py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-brand-terracotta/95 transition-all mt-2"
              >
                Launch Product in Drop Catalog
              </button>
            </form>
          )}

          {/* List display */}
          <div className="bg-white border border-brand-pink/30 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-brand-dark">
                <thead className="bg-brand-pink/20 text-[10px] uppercase font-bold tracking-wider text-brand-dark/50 border-b border-brand-pink/10">
                  <tr>
                    <th className="py-4 px-6">Image</th>
                    <th className="py-4 px-6">Accessory Name</th>
                    <th className="py-4 px-6">Fabric / Print</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Stock Level</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-pink/10">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-brand-pink/5 transition-colors">
                      <td className="py-4 px-6">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-brand-cream border border-brand-pink/35">
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold">{p.name}</td>
                      <td className="py-4 px-6 italic text-brand-dark/70">{p.fabric}</td>
                      <td className="py-4 px-6 font-semibold text-brand-terracotta">${p.price}</td>
                      
                      {/* Interactive Stock management cell */}
                      <td className="py-4 px-6">
                        {editingProductId === p._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={editingStockVal}
                              onChange={(e) => setEditingStockVal(Number(e.target.value))}
                              className="w-16 bg-brand-cream border border-brand-pink rounded-full px-2 py-1 text-center font-bold"
                            />
                            <button
                              onClick={() => handleStockUpdate(p._id)}
                              className="p-1.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 focus:outline-none"
                              aria-label="Confirm"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="p-1.5 bg-slate-300 text-slate-700 rounded-full hover:bg-slate-400 focus:outline-none"
                              aria-label="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              p.stock === 0 
                                ? 'bg-red-50 text-red-500 border border-red-100' 
                                : p.stock <= 5 
                                ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'
                                : 'bg-brand-pink text-brand-terracotta border border-brand-pink/50'
                            }`}>
                              {p.stock} units
                            </span>
                            <button
                              onClick={() => {
                                setEditingProductId(p._id);
                                setEditingStockVal(p.stock);
                              }}
                              className="text-brand-dark/50 hover:text-brand-terracotta"
                              aria-label="Edit stock"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Deletions column */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleProductDelete(p._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: ORDER LISTS FULFILLMENT
          ------------------------------------------------------------- */}
      {adminTab === 'orders' && (
        <div className="flex flex-col gap-6">
          <h3 className="font-serif text-2xl font-semibold text-brand-dark">Customer Order Fulfillment ({orders.length})</h3>

          {/* Fulfill Edit Form popup */}
          {updatingOrderId && (
            <form onSubmit={handleOrderStatusUpdate} className="bg-white border border-brand-pink/40 p-5 rounded-3xl flex flex-col gap-4 shadow-md max-w-md">
              <h4 className="font-serif text-sm font-semibold text-brand-dark border-b border-brand-pink/20 pb-2">Update Shipping Details</h4>
              <p className="text-[10px] text-brand-dark/50 font-mono">Order: #{updatingOrderId.slice(-6).toUpperCase()}</p>
              
              <div>
                <label className="text-[9px] font-bold uppercase block mb-1">Status</label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value)}
                  className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Processing">Processing (Pre-ordering)</option>
                  <option value="Shipped">Shipped (On Way)</option>
                  <option value="Delivered">Delivered (Arrived)</option>
                </select>
              </div>

              {newOrderStatus === 'Shipped' && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[9px] font-bold uppercase block mb-1">Delivery Carrier</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FedEx, BlueDart, Delhivery"
                      value={newCarrier}
                      onChange={(e) => setNewCarrier(e.target.value)}
                      className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase block mb-1">Shipment Tracking Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TRAK987654321"
                      value={newTracking}
                      onChange={(e) => setNewTracking(e.target.value)}
                      className="w-full bg-brand-cream/30 border border-brand-pink/60 rounded-full px-4 py-2 text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setUpdatingOrderId(null)}
                  className="flex-1 bg-slate-100 text-slate-600 rounded-full py-2 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-brand-terracotta text-white rounded-full py-2 text-xs font-bold uppercase tracking-wider hover:bg-brand-terracotta/95"
                >
                  Save Dispatch
                </button>
              </div>
            </form>
          )}

          {/* Orders list table */}
          <div className="bg-white border border-brand-pink/30 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-brand-dark">
                <thead className="bg-brand-pink/20 text-[10px] uppercase font-bold tracking-wider text-brand-dark/50 border-b border-brand-pink/10">
                  <tr>
                    <th className="py-4 px-6">Code ID</th>
                    <th className="py-4 px-6">Buyer Email</th>
                    <th className="py-4 px-6">Items secured</th>
                    <th className="py-4 px-6">Amount paid</th>
                    <th className="py-4 px-6">Fulfillment</th>
                    <th className="py-4 px-6 text-right">Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-pink/10">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-brand-pink/5 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold uppercase text-brand-dark/80">
                        #{ord._id.slice(-6)}
                      </td>
                      <td className="py-4 px-6 font-semibold">{ord.email}</td>
                      <td className="py-4 px-6 max-w-xs truncate">
                        {ord.items.map((i, idx) => (
                          <span key={idx} className="block text-[10px] leading-tight">
                            {i.name} ({i.fabric}) x{i.quantity}
                          </span>
                        ))}
                      </td>
                      <td className="py-4 px-6 font-bold text-brand-terracotta">${ord.totalAmount}</td>
                      
                      {/* Payment & Fulfillment statuses */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block w-fit text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            ord.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                              : 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse'
                          }`}>
                            Paid: {ord.paymentStatus}
                          </span>
                          <span className={`inline-block w-fit text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-blue-50 border-blue-100 text-blue-600'
                              : 'bg-brand-pink border-brand-pink/60 text-brand-terracotta'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </div>
                      </td>

                      {/* Dispatch Trigger actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setUpdatingOrderId(ord._id);
                            setNewOrderStatus(ord.orderStatus);
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-terracotta hover:underline focus:outline-none"
                        >
                          <Send className="w-3 h-3" /> Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: DROP SUBSCRIBERS
          ------------------------------------------------------------- */}
      {adminTab === 'subscribers' && (
        <div className="flex flex-col gap-6 max-w-xl">
          <h3 className="font-serif text-2xl font-semibold text-brand-dark">Drop Newsletter List ({subscribers.length})</h3>

          <div className="bg-white border border-brand-pink/30 rounded-3xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-brand-dark">
              <thead className="bg-brand-pink/20 text-[10px] uppercase font-bold tracking-wider text-brand-dark/50 border-b border-brand-pink/10">
                <tr>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6 text-right">Date Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-pink/10">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-6 px-6 text-center text-xs text-brand-dark/40 italic">
                      No drop subscribers captured yet.
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-brand-pink/5 transition-colors">
                      <td className="py-4 px-6 font-semibold">{sub.email}</td>
                      <td className="py-4 px-6 text-right text-brand-dark/50 font-semibold">
                        {new Date(sub.createdAt || sub.subscribedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
