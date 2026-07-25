'use client';

import { Shield, Zap, Lock, Code, Terminal, CheckCircle, FileText, Key, RefreshCw, Globe, Search, Cookie } from 'lucide-react';
import Link from 'next/link';

const features = [
  { icon: FileText, title: 'HTTP Header Analyzer', desc: 'Validate security headers (CSP, HSTS, X-Frame-Options) via live fetch or paste mode.', href: '/headers', color: 'text-cyber-primary' },
  { icon: Key, title: 'JWT Analyzer', desc: 'Decode, validate, and detect common JWT vulnerabilities (none alg, weak secrets, expired).', href: '/jwt', color: 'text-cyber-secondary' },
  { icon: Code, title: 'Payload Generator', desc: 'Generate context-aware XSS, SQLi, Command Injection, SSRF, and XXE payloads.', href: '/payloads', color: 'text-cyber-warning' },
  { icon: RefreshCw, title: 'Encoder/Decoder', desc: 'Multi-format conversion: Base64, URL, Hex, HTML entities, ROT13 with real-time preview.', href: '/encoder', color: 'text-cyber-info' },
  { icon: Globe, title: 'CORS Tester', desc: 'Simulate CORS preflight and actual requests to detect misconfigurations.', href: '/cors', color: 'text-cyber-danger' },
  { icon: Search, title: 'Vulnerability Scanner', desc: 'Pattern-based detection for SQLi, XSS, Path Traversal, and Command Injection.', href: '/vuln-scanner', color: 'text-cyber-primary' },
  { icon: Cookie, title: 'Cookie Analyzer', desc: 'Analyze cookie strings for Secure, HttpOnly, SameSite flags and domain scope.', href: '/cookies', color: 'text-cyber-secondary' },
  { icon: Lock, title: 'SSL Checker', desc: 'Live SSL/TLS certificate validation using public Certificate Transparency logs.', href: '/ssl-checker', color: 'text-cyber-warning' }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="cyber-panel p-8 relative">
        <div className="scanline" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-cyber-primary" />
            <h1 className="text-3xl font-bold text-white">Web Security Toolkit</h1>
          </div>
          <p className="text-gray-400 max-w-2xl text-lg mb-6 leading-relaxed">
            A comprehensive, 100% client-side suite for web security analysis, vulnerability detection, and payload generation. Real cryptographic operations via Web Crypto API.
          </p>
          <div className="flex gap-4">
            <Link href="/vuln-scanner" className="cyber-btn"><Zap className="w-4 h-4" /> Start Scanning</Link>
            <Link href="/payloads" className="cyber-btn-secondary"><Terminal className="w-4 h-4" /> Generate Payloads</Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <Link key={idx} href={feature.href} className="cyber-panel p-6 hover:border-cyber-primary/50 transition-all group">
            <div className={`w-12 h-12 rounded-lg bg-cyber-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
          </Link>
        ))}
      </div>
      <div className="cyber-panel p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-cyber-primary" /> Privacy & Security Guarantee</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
          <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-cyber-primary mt-0.5 flex-shrink-0" /><span><strong className="text-white block mb-1">Zero Network Requests</strong> All processing happens locally in your browser via Web Crypto API.</span></div>
          <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-cyber-primary mt-0.5 flex-shrink-0" /><span><strong className="text-white block mb-1">No Data Storage</strong> Inputs are never logged, saved, or transmitted to any server.</span></div>
          <div className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-cyber-primary mt-0.5 flex-shrink-0" /><span><strong className="text-white block mb-1">Open Source</strong> Fully auditable codebase. Clone and run locally with zero configuration.</span></div>
        </div>
      </div>
    </div>
  );
}