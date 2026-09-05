import { NextRequest, NextResponse } from 'next/server';
import { debugCode } from '@/lib/services/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language = 'python', errorContext, customApiKey } = body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Code is required to debug' }, { status: 400 });
    }

    const debugResult = await debugCode({
      code,
      language,
      errorContext,
      customApiKey,
    });

    return NextResponse.json({
      success: true,
      debug: debugResult,
    });
  } catch (error: any) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to debug code' },
      { status: 500 }
    );
  }
}
