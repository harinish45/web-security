# 🛡️ Web Security Toolkit

A comprehensive, 100% client-side suite for web security analysis, vulnerability detection, and payload generation. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### 🔍 Analysis Tools
- **HTTP Header Analyzer**: Validate security headers (CSP, HSTS, X-Frame-Options) via live fetch or paste mode.
- **JWT Analyzer**: Decode, validate, and detect common JWT vulnerabilities (none alg, weak secrets, expired tokens).
- **Cookie Security Analyzer**: Analyze cookie strings for missing Secure, HttpOnly, and SameSite flags.
- **SSL/TLS Checker**: Live SSL certificate validation using public Certificate Transparency logs (crt.sh API).

### 🧪 Testing Tools
- **Vulnerability Pattern Scanner**: Real-time regex-based detection for SQLi, XSS, Path Traversal, Command Injection, and SSRF.
- **Payload Generator**: Context-aware payload generation for XSS, SQLi, Command Injection, SSRF, and XXE.
- **CORS Tester**: Simulate CORS preflight and actual requests to detect misconfigurations.
- **Regex Tester**: Test security regex patterns against input strings.

### 🛠️ Utilities
- **Encoder/Decoder**: Multi-format conversion (Base64, URL, Hex, HTML Entities, ROT13) with real-time preview.
- **Hash Generator**: Real cryptographic hashing via Web Crypto API (SHA-256, SHA-512) and crypto-js (MD5, SHA1).

## 🛡️ Privacy & Security Guarantee

- **Zero Network Requests**: All processing happens locally in your browser via Web Crypto API (except SSL Checker which uses public CT logs).
- **No Data Storage**: Inputs are never logged, saved, or transmitted to any server.
- **Open Source**: Fully auditable codebase. Clone and run locally with zero configuration.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/harinish45/web-security.git

# 2. Navigate to the project directory
cd web-security

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Cryptography**: Web Crypto API, crypto-js, jsrsasign

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── headers/page.tsx      # HTTP Header Analyzer
│   ├── jwt/page.tsx          # JWT Analyzer
│   ├── cookies/page.tsx      # Cookie Security Analyzer
│   ├── ssl-checker/page.tsx  # SSL/TLS Certificate Checker
│   ├── vuln-scanner/page.tsx # Vulnerability Pattern Scanner
│   ├── payloads/page.tsx     # Payload Generator
│   ├── encoder/page.tsx      # Encoder/Decoder
│   └── hash/page.tsx         # Hash Generator
├── components/
│   └── layout/
│       └── Sidebar.tsx       # Navigation sidebar
└── lib/
    └── utils.ts              # Utility functions
```

## ⚠️ Disclaimer

This toolkit is designed for **educational purposes and authorized security testing only**. Unauthorized use against systems you do not own or have explicit permission to test is illegal. The authors are not responsible for any misuse of this software.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for the security community.