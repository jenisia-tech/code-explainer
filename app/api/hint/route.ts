import { NextRequest, NextResponse } from 'next/server';
import { generateHint } from '@/lib/services/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language = 'python', problemContext, step = 1, customApiKey } = body;

    const hint = await generateHint({
      code: code || '',
      language,
      problemContext,
      step: Number(step),
      customApiKey,
    });

    return NextResponse.json({
      success: true,
      hint,
    });
  } catch (error: any) {
    console.error('Hint API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate progressive hint' },
      { status: 500 }
    );
  }
}
