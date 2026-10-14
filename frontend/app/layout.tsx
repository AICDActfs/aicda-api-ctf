import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://aicda-api-ctf.vercel.app'),
  title: "AICDA API CTF",
  description: "AICDA - Anonymous India Cyber Defence Academy | API Security Training Lab",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "AICDA API CTF — Anonymous India Cyber Defence Academy",
    description: "API Security Training Lab // Knowledge is Free",
    url: "https://aicda-api-ctf.vercel.app",
    siteName: "AICDA CTF",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "AICDA Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AICDA API CTF",
    description: "API Security Training Lab // Knowledge is Free",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-matrix-green min-h-screen flex flex-col">

        {/* ═══════════════════════ HEADER ═══════════════════════ */}
        <header
          style={{
            background: "linear-gradient(90deg, #000000 0%, #0a0a0a 40%, #001a00 100%)",
            borderBottom: "1px solid #00ff4133",
            boxShadow: "0 0 30px #00ff4122",
          }}
          className="w-full z-50 sticky top-0"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Logo */}
            <div
              style={{
                border: "2px solid #00ff41",
                borderRadius: "50%",
                boxShadow: "0 0 18px #00ff4166, 0 0 40px #00ff4122",
                padding: "3px",
                background: "#000",
                flexShrink: 0,
              }}
            >
              <Image
                src="/logo.jpg"
                alt="AICDA Logo"
                width={58}
                height={58}
                style={{ borderRadius: "50%", display: "block" }}
                priority
              />
            </div>

            {/* Title block */}
            <div className="flex flex-col">
              <span
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "#00ff41",
                  textShadow: "0 0 10px #00ff41, 0 0 24px #00ff4188",
                  lineHeight: 1.2,
                }}
              >
                AICDA — Anonymous India Cyber Defence Academy
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.25em",
                  color: "#00ffff99",
                  marginTop: "2px",
                }}
              >
                ◈ API SECURITY CTF LAB &nbsp;|&nbsp; KNOWLEDGE IS FREE
              </span>
            </div>

            {/* Right badge */}
            <div className="ml-auto hidden sm:flex items-center gap-2">
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  color: "#00ff41",
                  border: "1px solid #00ff4155",
                  borderRadius: "4px",
                  padding: "3px 10px",
                  background: "#00ff4108",
                  boxShadow: "0 0 8px #00ff4122",
                }}
              >
                ▶ LIVE
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "#00ffff88",
                }}
              >
                CTF IN PROGRESS
              </span>
            </div>
          </div>

          {/* Animated green scan line */}
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, #00ff41 50%, transparent 100%)",
              animation: "scanline 3s linear infinite",
              opacity: 0.7,
            }}
          />
        </header>

        {/* ═══════════════════════ MAIN CONTENT ═══════════════════════ */}
        <main className="flex-1">
          {children}
        </main>

        {/* ═══════════════════════ FOOTER ═══════════════════════ */}
        <footer
          style={{
            background: "linear-gradient(90deg, #000000 0%, #001a00 50%, #000000 100%)",
            borderTop: "1px solid #00ff4133",
            boxShadow: "0 0 30px #00ff4111",
          }}
        >
          {/* Top divider */}
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, #00ff41 50%, transparent 100%)",
              opacity: 0.4,
            }}
          />

          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

              {/* Left — Logo + name */}
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.jpg"
                  alt="AICDA Logo"
                  width={38}
                  height={38}
                  style={{
                    borderRadius: "50%",
                    border: "1px solid #00ff4155",
                    boxShadow: "0 0 10px #00ff4144",
                  }}
                />
                <div className="flex flex-col">
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "#00ff41",
                      textShadow: "0 0 8px #00ff4188",
                      letterSpacing: "0.08em",
                    }}
                  >
                    AICDA — Anonymous India Cyber Defence Academy
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                      color: "#00ffff66",
                      letterSpacing: "0.2em",
                      marginTop: "1px",
                    }}
                  >
                    KNOWLEDGE IS FREE. WE ARE ANONYMOUS. WE ARE LEGION.
                  </span>
                </div>
              </div>

              {/* Right — copyright */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem",
                  color: "#00ff4155",
                  letterSpacing: "0.15em",
                  textAlign: "right",
                }}
              >
                <div>© {new Date().getFullYear()} AICDA. ALL RIGHTS RESERVED.</div>
                <div style={{ color: "#00ffff44", marginTop: "2px" }}>
                  FOR EDUCATIONAL PURPOSES ONLY
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Scanline keyframe */}
        <style>{`
          @keyframes scanline {
            0%   { background-position: -100% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </body>
    </html>
  );
}
