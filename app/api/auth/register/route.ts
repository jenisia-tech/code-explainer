import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { createFallbackUser } from '@/lib/fallback-auth';

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    let body: RegisterBody = { username: '', email: '', password: '' };

    if (rawBody) {
      try {
        body = JSON.parse(rawBody) as RegisterBody;
      } catch {
        const params = new URLSearchParams(rawBody);
        body = {
          username: params.get('username') ?? '',
          email: params.get('email') ?? '',
          password: params.get('password') ?? '',
        };
      }
    }

    const { username, email, password } = body;

    // Validation
    const errors: string[] = [];

    if (!username || username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    let user: any = null;

    try {
      await dbConnect();

      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
      });

      if (existingUser) {
        const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
        return NextResponse.json(
          { error: `User with this ${field} already exists` },
          { status: 409 }
        );
      }

      user = await User.create({
        username: username.trim(),
        email: email.toLowerCase(),
        password,
      });
    } catch (dbError) {
      console.warn('MongoDB unavailable, using fallback auth store.', dbError);
      user = await createFallbackUser({
        username,
        email,
        password,
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id ? user._id.toString() : user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `This ${field} is already taken` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}