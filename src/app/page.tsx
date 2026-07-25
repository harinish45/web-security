'use client';

import { Shield, Zap, Lock, Globe, Code, Terminal } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: FileTextIcon,
    title: 'HTTP Header Analyzer',
    desc: 'Validate security headers (CSP, HSTS, X-Frame-Options) and identify misconfigurations.',
    href: '/headers',
    color: 'text-cyber-primary'
  },
  {
    icon: KeyIcon,
    title: 'JWT Analyzer',
    desc: 'Decode, validate, and check for common JWT vulnerabilities (none alg, weak secrets).',
    href: '/jwt',
    color: 'text-cyber-secondary'
  },
  {
    icon: CodeIcon,
    title: 'Payload Generator',
    desc: 'Generate context-aware XSS, SQLi, and Command Injection payloads for testing.',
    href: '/payloads',
    color: 'text-cyber-warning'
  },
  {
    icon: RefreshCwIcon,
    title: 'Encoder/Decoder',
    desc: 'Multi-format conversion: Base64, URL, Hex, HTML entities with real-time preview.',
    href: '/encoder',
    color: 'text-cyber-info'
  },
  {
    icon: GlobeIcon,
    title: 'CORS Tester',
    desc: 'Simulate CORS requests to detect misconfigurations and credential leakage.',
    href: '/cors',
    color: 'text-cyber-danger'
  },
  {
    icon: SearchIcon,
    title: 'Vulnerability Scanner',
    desc: 'Pattern-based detection for SQLi, XSS, Path Traversal, and SSRF in input strings.',
    href: '/vuln-scanner',
    color: 'text-cyber-primary'
  }
];

// Icon components to avoid import issues
function FileTextIcon(props: any) { return <FileText {...props} />; }
function KeyIcon(props: any) { return <Key {...props} />; }
function CodeIcon(props: any) { return <Code {...props} />; }
function RefreshCwIcon(props: any) { return <RefreshCw {...props} />; }
function GlobeIcon(props: any) { return <Globe {...props} />; }
function SearchIcon(props: any) { return <Search {...props} />; }

import { FileText, Key, RefreshCw, Globe, Search } from 'lucide-react';

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
          <p className="text-gray-400 max-w-2xl text-lg mb-6">
            A comprehensive, 100% client-side suite for web security analysis, vulnerability detection, 
            and payload generation. No data leaves your browser.
          </p>
          <div className="flex gap-4">
            <Link href="/vuln-scanner" className="cyber-btn">
              <Zap className="w-4 h-4" /> Start Scanning
            </Link>
            <Link href="/payloads" className="cyber-btn-secondary">
              <Terminal className="w-4 h-4" /> Generate Payloads
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <Link key={idx} href={feature.href} className="cyber-panel p-6 hover:border-cyber-primary/50 transition-colors group">
            <div className={`w-12 h-12 rounded-lg bg-cyber-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
          </Link>
        ))}
      </div>

      <div className="cyber-panel p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-cyber-primary" />
          Privacy Guarantee
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-cyber-primary mt-1.5" />
            <span><strong className="text-white">Zero Network Requests:</strong> All processing happens locally in your browser.</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-cyber-primary mt-1.5" />
            <span><strong className="text-white">No Data Storage:</strong> Inputs are never logged, saved, or transmitted.</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-cyber-primary mt-1.5" />
            <span><strong className="text-white">Open Source:</strong> Fully auditable codebase on GitHub.</span>
          </div>
        </div>
      </div>
    </div>
  );
}