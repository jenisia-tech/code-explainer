import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken, setTokenCookie } from '@/lib/auth';
import {
  findFallbackUserByEmail,
  verifyFallbackPassword,
} from '@/lib/fallback-auth';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let body: { email?: string; password?: string } = {};

    if (rawBody) {
      try {
        body = JSON.parse(rawBody) as { email?: string; password?: string };
      } catch {
        const params = new URLSearchParams(rawBody);
        body = {
          email: params.get('email') ?? undefined,
          password: params.get('password') ?? undefined,
        };
      }
    }

    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    let user: any = null;

    try {
      await dbConnect();
      user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    } catch (dbError) {
      console.warn('MongoDB unavailable, using fallback auth store.', dbError);
      user = await findFallbackUserByEmail(email);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = user.comparePassword
      ? await user.comparePassword(password)
      : await verifyFallbackPassword(user, password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user._id ? user._id.toString() : user.id,
      email: user.email,
      username: user.username,
    });

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id ? user._id.toString() : user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    );

    setTokenCookie(response, token);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}