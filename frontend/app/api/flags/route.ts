import { NextResponse } from 'next/server';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { flag, level } = body;
    
    const targetLevel = Number(level);
    const cleanFlag = typeof flag === 'string' ? flag.trim() : '';

    if (!targetLevel || !cleanFlag) {
      return NextResponse.json({ 
        correct: false, 
        message: 'Level and Flag are required.' 
      }, { status: 400 });
    }

    const expectedFlag = FLAGS[targetLevel];

    if (expectedFlag && expectedFlag === cleanFlag) {
      return NextResponse.json({ 
        correct: true, 
        level: targetLevel, 
        message: 'FLAG ACCEPTED. SYSTEM COMPROMISED.' 
      });
    }
    
    return NextResponse.json({ 
      correct: false, 
      message: 'ACCESS DENIED. INVALID FLAG.' 
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ 
      correct: false, 
      error: 'Invalid request format' 
    }, { status: 400 });
  }
}
