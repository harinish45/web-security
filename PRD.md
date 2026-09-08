# Product Requirements Document (PRD)

## Project: Web Security Toolkit (`web-security`)

### 1. Vision & Purpose
A zero-server-leakage, client-side web application security workbench designed for bug bounty hunters, application security engineers, and developers to analyze HTTP security headers, decode JWTs, verify SSL/TLS certificates, and generate vulnerability payloads locally.

### 2. Functional Requirements
- **FR-1: HTTP Security Header Auditor**
  - Parse response headers: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
  - Score posture (A+ through F) with remediation advice.
- **FR-2: JWT Security Inspector**
  - Decode header, payload, and signature without external network roundtrips.
  - Vulnerability detection: `alg: "none"` exploit, weak HMAC keys, and token expiry (`exp`).
- **FR-3: Cookie Security Analyzer**
  - Inspect `Set-Cookie` directives for `Secure`, `HttpOnly`, `SameSite=Strict/Lax/None` compliance.
- **FR-4: Context-Aware Payload Generator**
  - XSS (HTML body, attribute, script tag, URL parameter contexts).
  - SQLi (Authentication bypass, error-based, union-based, blind time-based).
  - SSRF (Localhost bypasses, cloud metadata IP obfuscation).
- **FR-5: Cryptographic Encoders & Hash Verifiers**
  - Multi-layer encoding: Base64, URL, Hex, HTML Entities, ROT13.
  - Web Crypto API hashing: SHA-256, SHA-384, SHA-512, MD5.

### 3. Non-Functional Requirements
- **NFR-1: Client-Side Confidentiality:** Zero external network telemetry during token inspection or payload drafting.
- **NFR-2: Responsiveness:** Instant calculation on keyup for encoders and regex tests.
