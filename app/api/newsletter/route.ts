import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/dataService';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const subscriber = await addSubscriber(email);

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to Amuraa drops!',
      subscriber
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
