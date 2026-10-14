import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FLAGS: Record<number, string> = {
  1: 'flag{d3bug_3ndp0int_3xp0s3d}',
  2: 'flag{us3r_r3gist3r3d_succ3ss}',
  3: 'flag{jwt_p4yl04d_d3c0d3d}',
  4: 'flag{b0la_adm1n_d4ta_l3ak3d}',
  5: 'flag{m4ss_4ss1gnm3nt_pr1v_3sc}',
  6: 'flag{bfl4_d3l3te_w1th0ut_r0l3}',
  7: 'flag{p4ssw0rd_r3s3t_t4k30v3r}',
  8: 'flag{jwt_f0rg3d_w34k_s3cr3t}',
  9: 'flag{sql1_byp4ss_qu3ry_1nj3ct}',
  10: 'flag{r4t3_l1m1t_n0n_3x1st3nt}',
};

const DB_FILE = path.join(process.cwd(), 'submissions.json');

export async function POST(request: Request) {
  try {
    const { flag, level, studentId } = await request.json();
    const lvl = Number(level);
    const cleanFlag = typeof flag === 'string' ? flag.trim() : '';

    if (FLAGS[lvl] && FLAGS[lvl] === cleanFlag) {
      if (studentId) {
        let data: any = {};
        if (fs.existsSync(DB_FILE)) data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        if (!data[studentId]) data[studentId] = { flags: [], timestamp: new Date().toISOString() };
        if (!data[studentId].flags.includes(lvl)) {
          data[studentId].flags.push(lvl);
          data[studentId].lastUpdate = new Date().toISOString();
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
      }
      return NextResponse.json({ correct: true, level: lvl, message: 'FLAG ACCEPTED. SYSTEM COMPROMISED.' });
    }
    return NextResponse.json({ correct: false, message: 'INVALID FLAG.' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
