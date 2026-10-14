import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'submissions.json');

export async function GET() {
  try {
    if (!fs.existsSync(DB_FILE)) return NextResponse.json({ students: [] });
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const students = Object.keys(data).map(studentId => ({
      name: studentId,
      solvedCount: data[studentId].flags ? data[studentId].flags.length : 0,
      solvedFlags: data[studentId].flags || [],
      lastActive: data[studentId].lastUpdate || data[studentId].timestamp
    }));
    return NextResponse.json({ students });
  } catch (e) {
    return NextResponse.json({ students: [] });
  }
}
