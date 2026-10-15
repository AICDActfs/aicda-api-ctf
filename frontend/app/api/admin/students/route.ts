import { NextResponse } from 'next/server';

// Serverless-safe fallback for admin listing
export async function GET() {
  return NextResponse.json({ students: [] });
}
