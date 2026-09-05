import { NextRequest, NextResponse } from 'next/server';
import { executeCode } from '@/lib/services/execution';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language = 'javascript', stdin = '' } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code content is required' }, { status: 400 });
    }

    const result = await executeCode(code, language, stdin);

    return NextResponse.json({
      success: result.success,
      output: result.output,
      error: result.error,
      executionTimeMs: result.executionTimeMs,
      exitCode: result.exitCode,
    });
  } catch (error: any) {
    console.error('Execute API error:', error);
    return NextResponse.json(
      {
        success: false,
        output: '',
        error: error?.message || 'Execution failed',
        executionTimeMs: 0,
        exitCode: 1,
      },
      { status: 500 }
    );
  }
}
