import { NextRequest, NextResponse } from 'next/server';
import { visualizeExecution } from '@/lib/services/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language = 'python', customApiKey } = body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Code is required to visualize' }, { status: 400 });
    }

    const steps = await visualizeExecution({
      code,
      language,
      customApiKey,
    });

    return NextResponse.json({
      success: true,
      steps,
    });
  } catch (error: any) {
    console.error('Visualize API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to visualize code execution' },
      { status: 500 }
    );
  }
}
