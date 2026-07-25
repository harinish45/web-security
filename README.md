# 🛡️ Web Security Toolkit

A comprehensive, **100% client-side** web security analysis and testing suite. No data ever leaves your browser. Built for security researchers, developers, and students to analyze, generate, and understand web vulnerabilities safely.

![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)

---

## 🚀 Features

| Tool | Description | Real Engine? |
|------|-------------|--------------|
| **HTTP Header Analyzer** | Validates security headers (CSP, HSTS, X-Frame-Options) and provides exact fix recommendations. | ✅ Yes |
| **JWT Analyzer** | Decodes tokens, checks for `alg: none`, missing expiration, and sensitive data leakage. | ✅ Yes |
| **Payload Generator** | Context-aware XSS, SQLi, SSTI, Command Injection, and LFI payloads with multi-format encoding (Base64, URL, Hex). | ✅ Yes |
| **Encoder/Decoder** | Real-time conversion between Base64, URL, Hex, and HTML entities. | ✅ Yes |
| **CORS Policy Tester** | Simulates cross-origin requests to detect misconfigurations and credential leakage risks. | ✅ Yes |
| **Vulnerability Scanner** | Regex-based pattern detection for SQLi, XSS, Path Traversal, SSRF, and Command Injection in raw input. | ✅ Yes |
| **Hash Analyzer** | Generates MD5, SHA-1, SHA-256, SHA-512 hashes and identifies unknown hash formats by length. | ✅ Yes |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## 🔒 Privacy & Security Guarantee

This toolkit is designed with a **zero-trust, zero-leakage** architecture:

1. **No Network Requests:** All processing (hashing, encoding, pattern matching) happens locally in your browser using Web APIs and client-side libraries.
2. **No Data Storage:** Inputs are never logged, saved to localStorage, or transmitted to any server.
3. **Open Source:** Every line of code is auditable. You can verify there are no hidden telemetry or data exfiltration mechanisms.
4. **Safe by Default:** Payload generators include prominent warnings about responsible use.

---

## 📁 Project Structure

```
web-security/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── globals.css       # Tailwind + Cyberpunk theme styles
│   │   ├── layout.tsx        # Root layout with Sidebar
│   │   ├── page.tsx          # Dashboard
│   │   ├── headers/          # HTTP Header Analyzer
│   │   ├── jwt/              # JWT Analyzer
│   │   ├── payloads/         # Payload Generator
│   │   ├── encoder/          # Multi-format Encoder/Decoder
│   │   ├── cors/             # CORS Policy Tester
│   │   ├── vuln-scanner/     # Vulnerability Pattern Scanner
│   │   └── hash/             # Hash Analyzer & Generator
│   ├── components/
│   │   └── layout/
│   │       └── Sidebar.tsx   # Navigation component
│   └── lib/
│       └── utils.ts          # Helper functions (encoding, copying, etc.)
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🎨 UI/UX Design

The interface uses a **"Tactical SOC Console"** design language:
- **Color Palette:** Dark mode with neon accents (`#00ff9d` primary, `#ff3366` danger)
- **Typography:** IBM Plex Mono for data/code, Inter for UI text
- **Visual Cues:** Severity-based color coding (Critical/High/Medium/Low), corner-bracket panels, and scanline overlays
- **Responsive:** Fully functional on desktop and tablet viewports

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This tool is intended for **educational purposes and authorized security testing only**. Do not use these tools against systems you do not own or have explicit written permission to test. The authors are not responsible for any misuse or damage caused by this software.