import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/dataService';
import { getAuthUser, isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    let orders;
    if (authUser.role === 'admin') {
      // Admin sees all orders
      orders = await getOrders();
    } else {
      // Normal user sees their own orders
      orders = await getOrders(authUser.userId);
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shippingAddress, totalAmount, email, paymentIntentId, paymentMethod } = body;

    if (!items || !shippingAddress || !totalAmount || !email) {
      return NextResponse.json(
        { error: 'Missing required order details' },
        { status: 400 }
      );
    }

    const authUser = getAuthUser(req);

    // Create the order. Decrementing stock is handled atomically in dataService.
    const newOrder = await createOrder({
      user: authUser ? authUser.userId : null, // Null for guest checkout
      email,
      items,
      shippingAddress,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'Stripe',
      paymentStatus: paymentMethod === 'Mock' ? 'Paid' : 'Pending', // Mark paid immediately if testing mock payment
      paymentIntentId: paymentIntentId || '',
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 400 }
    );
  }
}
