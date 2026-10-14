import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const { code, studentName } = await request.json();
    if (!studentName || !studentName.trim()) return NextResponse.json({ valid: false, message: 'Name required' }, { status: 400 });
    if (code === 'AICDAAPICTF') {
      const token = Buffer.from(`${studentName}:${Date.now()}`).toString('base64');
      return NextResponse.json({ valid: true, token, message: 'Access Granted' });
    }
    return NextResponse.json({ valid: false, message: 'ACCESS DENIED' }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
