'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const LABS_DATA: Record<string, {
  level: number;
  title: string;
  owasp: string;
  theory: string;
  objective: string;
  flagHint: string;
  methodology: { step: string; hint: string; snippet?: string }[];
}> = {
  'debug-leak': {
    level: 1,
    title: 'Unauthenticated Data Exposure (Debug Leak)',
    owasp: 'API3: Excessive Data Exposure & API1: BOLA',
    theory: 'Modern microservices often leave development/diagnostic endpoints active in production. These endpoints often lack authentication filters and dump internal state or entire tables.',
    objective: 'Reconnaissance the user service to locate the hidden debug endpoint and extract credentials.',
    flagHint: 'flag{d3bug_...}',
    methodology: [
      { step: '1. Endpoint Discovery', hint: 'Inspect standard diagnostic endpoints such as /_debug, /metrics, or /actuator under the /users/v1 API path.' },
      { step: '2. Unauthenticated Inspection', hint: 'Send a plain GET request without Bearer headers to determine if the endpoint enforces access control.', snippet: 'GET /api/v1/users/_debug' }
    ]
  },
  'register': {
    level: 2,
    title: 'User Registration Analysis',
    owasp: 'API2: Broken Authentication',
    theory: 'Analyzing standard onboarding endpoints is key in API pentesting. Understanding expected parameters, validation logic, and responses reveals implementation patterns.',
    objective: 'Analyze the registration routine and onboard a clean user with unique credentials.',
    flagHint: 'flag{us3r_...}',
    methodology: [
      { step: '1. Content Negotiation', hint: 'Registration endpoints expect application/json payloads containing username, password, and email.' },
      { step: '2. Request Dispatch', hint: 'Submit a POST request to the registration path. Ensure both username and email are unique.', snippet: 'POST /api/v1/register\nContent-Type: application/json\n\n{"username":"<unique>","password":"<pass>","email":"<unique_email>"}' }
    ]
  },
  'jwt-token': {
    level: 3,
    title: 'JWT Capture & Token Inspection',
    owasp: 'API2: Broken Authentication',
    theory: 'JSON Web Tokens (JWT) are often assumed to be encrypted. In reality, standard JWS consists of base64url-encoded components (Header.Payload.Signature) which can be inspected by anyone.',
    objective: 'Authenticate against the API, intercept the token, and decode the payload segment.',
    flagHint: 'flag{jwt_p4y...}',
    methodology: [
      { step: '1. Obtain Authentication Token', hint: 'Send valid credentials to the login route via POST to receive the auth_token.' },
      { step: '2. Deconstruct the Token', hint: 'Split the token by the dot delimiter (.) and decode the second field (payload) using base64 decoding.', snippet: 'echo "<JWT>" | cut -d. -f2 | base64 -d' }
    ]
  },
  'bola': {
    level: 4,
    title: 'Broken Object Level Authorization (BOLA)',
    owasp: 'API1: Broken Object Level Authorization',
    theory: 'BOLA occurs when an API endpoint uses client-supplied identifiers to access objects on the server without verifying whether the authenticated user owns that resource.',
    objective: 'Using a valid non-admin student token, query the profile data belonging to user "admin".',
    flagHint: 'flag{b0la_...}',
    methodology: [
      { step: '1. Establish Low-Privilege Session', hint: 'Log in as a regular user (e.g. student) and copy the resulting bearer token.' },
      { step: '2. Parameter Tampering', hint: 'Target the user detail endpoint by substituting your username with the target (admin) in the path parameter.', snippet: 'GET /api/v1/users/admin\nAuthorization: Bearer <YOUR_STUDENT_TOKEN>' }
    ]
  },
  'mass-assignment': {
    level: 5,
    title: 'Mass Assignment (Privilege Escalation)',
    owasp: 'API3: Broken Object Property Level Authorization',
    theory: 'Software frameworks often bind request payloads directly to internal object models or database columns without an explicit parameter allowlist.',
    objective: 'Inject privileged attributes during account creation to register as an administrator.',
    flagHint: 'flag{m4ss_...}',
    methodology: [
      { step: '1. Schema Hypothesis', hint: 'Identify sensitive object attributes such as "admin", "role", or "is_admin" returned in user profiles.' },
      { step: '2. Payload Poisoning', hint: 'Include the privileged parameter in your registration JSON body.', snippet: 'POST /api/v1/register\n{"username":"...","password":"...","email":"...","admin":true}' }
    ]
  },
  'bfla': {
    level: 6,
    title: 'Broken Function Level Authorization (BFLA)',
    owasp: 'API5: Broken Function Level Authorization',
    theory: 'BFLA occurs when access control policies for sensitive actions (like DELETE or PUT) are either misconfigured or only enforced client-side in the UI.',
    objective: 'Invoke an administrative deletion function using a standard user authentication token.',
    flagHint: 'flag{bfl4_...}',
    methodology: [
      { step: '1. Method Enumeration', hint: 'Test administrative HTTP methods (DELETE) against resource paths.' },
      { step: '2. Role Bypass Verification', hint: 'Execute the action targeting an existing account while authenticating with a non-admin session.', snippet: 'DELETE /api/v1/users/<target_user>\nAuthorization: Bearer <NON_ADMIN_TOKEN>' }
    ]
  },
  'password-reset': {
    level: 7,
    title: 'Arbitrary Password Reset Takeover',
    owasp: 'API2: Broken Authentication',
    theory: 'Insecure state update endpoints that accept new credentials without checking current credentials or comparing token subject to the target path are vulnerable to account takeover.',
    objective: 'Forcefully change the password of the admin user and verify takeover by logging in.',
    flagHint: 'flag{p4ssw0rd_...}',
    methodology: [
      { step: '1. Abuse Password Modification', hint: 'Send a PUT request to the admin password sub-resource using your existing token.', snippet: 'PUT /api/v1/users/admin/password\n{"password":"<new_password>"}' },
      { step: '2. Verify Account Takeover', hint: 'Log in through the standard authentication route using username "admin" and your newly set password.' }
    ]
  },
  'jwt-forgery': {
    level: 8,
    title: 'JWT Forgery (Weak Signing Secret)',
    owasp: 'API2: Broken Authentication',
    theory: 'When symmetric algorithms like HS256 are used with predictable, short, or hardcoded secrets, attackers can compute valid signatures without access to the server.',
    objective: 'Craft an authenticated administrator JWT using the discovered secret and access the /me resource.',
    flagHint: 'flag{jwt_f0rg3d_...}',
    methodology: [
      { step: '1. Identify Secret', hint: 'Review leaked configs, source repositories, or dictionary attacks to uncover the HMAC secret.' },
      { step: '2. Craft & Sign Token', hint: 'Use Python PyJWT or jwt.io with the secret to forge a token with admin privileges.', snippet: 'jwt.encode({"username":"admin","admin":True,"exp":...}, "aicda_weak_secret", algorithm="HS256")' },
      { step: '3. Prove Identity', hint: 'Supply the forged token in the Authorization header to GET /me.' }
    ]
  },
  'sqli': {
    level: 9,
    title: 'SQL Injection via Path Parameter',
    owasp: 'API8: Security Misconfiguration / Injection',
    theory: 'When backend query builders concatenate URL path variables directly into SQL queries rather than using parameterized queries, syntax injection allows query restructuring.',
    objective: 'Inject a boolean SQL payload into the username lookup parameter to extract data.',
    flagHint: 'flag{sql1_...}',
    methodology: [
      { step: '1. Identify Injection Point', hint: 'The username lookup route accepts input directly into the query string.' },
      { step: '2. Payload Construction', hint: 'Craft a boolean TRUE bypass payload ensuring proper URL encoding for spaces and quotes.', snippet: 'GET /api/v1/users/admin%27%20OR%20%271%27=%271\nAuthorization: Bearer <TOKEN>' }
    ]
  },
  'rate-limit': {
    level: 10,
    title: 'Unrestricted Resource Consumption',
    owasp: 'API4: Unrestricted Resource Consumption',
    theory: 'Endpoints that perform database lookups without rate limits or concurrency controls allow automated attacks like credential stuffing and resource exhaustion.',
    objective: 'Demonstrate lack of throttling by sending a high volume of requests within a short timeframe.',
    flagHint: 'flag{r4t3_...}',
    methodology: [
      { step: '1. Select Endpoint', hint: 'Pick an authenticated user retrieval route (such as /api/v1/users).' },
      { step: '2. Automated Flood', hint: 'Use a bash loop or BurpSuite Intruder (Null Payloads) to generate over 50 rapid requests.', snippet: 'for i in $(seq 1 55); do curl -s <URL> -H "Authorization: Bearer <TOKEN>"; done' }
    ]
  }
};

export default function SubLabPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const lab = LABS_DATA[slug];
  const [tab, setTab] = useState<'theory' | 'methodology' | 'objective'>('methodology');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!lab) {
    return (
      <div className="min-h-screen bg-black text-[#00ff41] p-6 sm:p-12 font-mono text-center flex flex-col items-center justify-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-widest text-red-500">404 // LAB MODULE NOT FOUND</h1>
        <Link href="/labs" className="underline mt-4 text-xs sm:text-sm text-[#00ffff] hover:text-white">
          &larr; Return to Missions
        </Link>
      </div>
    );
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-[#00ff41] font-mono px-3 py-4 sm:px-6 sm:py-8">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/labs" className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#00ffff] hover:underline">
            &larr; MISSION HUB
          </Link>
          <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">
            AICDA DEFENCE LABS
          </span>
        </div>

        {/* Title Card */}
        <div className="border border-[#00ff4144] bg-[#050505] p-4 sm:p-6 rounded-lg shadow-[0_0_20px_#00ff4115]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <span className="px-2.5 py-0.5 bg-[#00ff41] text-black font-extrabold text-[11px] sm:text-xs rounded">
              LEVEL {lab.level}
            </span>
            <span className="text-[10px] sm:text-xs text-[#00ffff] border border-[#00ffff44] px-2 py-0.5 rounded">
              {lab.owasp}
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-wide break-words">
            {lab.title}
          </h1>
        </div>

        {/* Tabs - Fully Mobile Responsive */}
        <div className="flex border-b border-[#00ff4133] overflow-x-auto gap-1 sm:gap-2 pb-1 scrollbar-none">
          {(['theory', 'methodology', 'objective'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                tab === t
                  ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff4111]'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t === 'theory' && '📖 Theory'}
              {t === 'methodology' && '🎯 Pentest Steps'}
              {t === 'objective' && '🏁 Objective'}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="border border-[#00ff4133] bg-[#050505] p-4 sm:p-6 rounded-lg min-h-[280px]">
          {tab === 'theory' && (
            <div className="space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-[#00ffff] tracking-wide">
                SECURITY ARCHITECTURE & VULNERABILITY CONTEXT
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {lab.theory}
              </p>
            </div>
          )}

          {tab === 'methodology' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#00ffff] tracking-wide">
                  ATTACK SURFACE & METHODOLOGY
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                  Analyze the endpoint constraints and craft your requests manually via BurpSuite or terminal.
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {lab.methodology.map((m, idx) => (
                  <div key={idx} className="border border-[#00ff4122] bg-[#080808] p-3 sm:p-4 rounded">
                    <h3 className="text-xs sm:text-sm font-bold text-[#00ff41] mb-1">
                      {m.step}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 mb-2 leading-relaxed">
                      {m.hint}
                    </p>
                    {m.snippet && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between bg-[#020202] px-3 py-1 border border-b-0 border-[#00ff4122] text-[10px] text-gray-400">
                          <span>SPECIFICATION HINT</span>
                          <button
                            onClick={() => handleCopy(m.snippet!, idx)}
                            className="text-[#00ffff] hover:text-[#00ff41] transition-colors"
                          >
                            {copiedIndex === idx ? 'COPIED!' : 'COPY'}
                          </button>
                        </div>
                        <pre className="bg-[#020202] border border-[#00ff4122] p-2.5 sm:p-3 text-[11px] sm:text-xs text-[#00ff41] overflow-x-auto whitespace-pre-wrap font-mono">
                          {m.snippet}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'objective' && (
            <div className="space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-[#00ffff] tracking-wide">
                CHALLENGE OBJECTIVE
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {lab.objective}
              </p>
              <div className="p-3 sm:p-4 border border-[#00ffff33] bg-[#001111] rounded-lg mt-4">
                <span className="text-[11px] sm:text-xs text-[#00ffff] font-bold block mb-1">
                  EXPECTED FLAG FORMAT:
                </span>
                <code className="text-xs sm:text-sm text-[#00ff41] tracking-wider break-all">
                  {lab.flagHint}
                </code>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
