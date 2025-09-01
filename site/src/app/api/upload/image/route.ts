import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/actions/upload';

export async function POST(request: NextRequest) {
  try {
    // @>25@O5< 0CB5=B8D8:0F8N ?>;L7>20B5;O
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '5B 4>ABC?0' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const result = await uploadImage(formData);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('H81:0 API 703@C7:8 87>1@065=8O:', error);
    return NextResponse.json(
      { success: false, error: '=CB@5==OO >H81:0 A5@25@0' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Upload Image API endpoint' },
    { status: 200 }
  );
}