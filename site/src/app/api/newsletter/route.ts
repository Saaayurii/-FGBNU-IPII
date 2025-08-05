import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '@/actions/newsletter';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('5:>@@5:B=K9 email 04@5A'),
  action: z.enum(['subscribe', 'unsubscribe']).optional().default('subscribe')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 0;840F8O 2E>4=KE 40==KE
    const validation = subscribeSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: '525@=K5 40==K5',
          details: validation.error.issues
        },
        { status: 400 }
      );
    }

    const { email, action } = validation.data;

    let result;
    
    if (action === 'subscribe') {
      result = await subscribeToNewsletter(email);
    } else {
      result = await unsubscribeFromNewsletter(email);
    }

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('H81:0 API newsletter:', error);
    return NextResponse.json(
      { success: false, error: '=CB@5==OO >H81:0 A5@25@0' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Newsletter API endpoint',
      usage: {
        method: 'POST',
        body: {
          email: 'string (required)',
          action: 'subscribe | unsubscribe (optional, default: subscribe)'
        }
      }
    },
    { status: 200 }
  );
}

// >445@6:0 CORS 4;O 2=5H=8E 70?@>A>2 (5A;8 =C6=>)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}