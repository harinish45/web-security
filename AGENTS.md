# AGENTS & Autonomous Tool Conventions

## Project Rules & Architecture Invariants

1. **Architecture & Framework:**
   - Next.js 14 App Router (`src/app/`).
   - TypeScript with strict typing.
   - Tailwind CSS for responsive styling.
   - Lucide React for iconography.

2. **Security & Privacy Invariants:**
   - Do NOT send user inputs, JWTs, cookie headers, or payloads to external telemetry endpoints.
   - Use browser native `window.crypto.subtle` for modern cryptographic hashing.
   - Any external requests (e.g. SSL cert query to crt.sh) must be explicit and opt-in.
