import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aicda-api-ctf.onrender.com';
    const res = await fetch(`${apiUrl}/api/v1/admin/students`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({ students: [] });
  } catch (e) {
    return NextResponse.json({ students: [] });
  }
}
