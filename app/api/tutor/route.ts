import { NextRequest, NextResponse } from 'next/server';
import { askTutor } from '@/lib/services/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, currentCode, language, error, currentTopic, practiceProblem, chatHistory, customApiKey } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const reply = await askTutor({
      query,
      currentCode,
      language,
      error,
      currentTopic,
      practiceProblem,
      chatHistory,
      customApiKey,
    });

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error('Tutor API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Tutor service unavailable' },
      { status: 500 }
    );
  }
}
