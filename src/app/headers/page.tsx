'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Copy } from 'lucide-react';
import { getSeverityClass, copyToClipboard } from '@/lib/utils';

const SECURITY_HEADERS = [
  {
    name: 'Strict-Transport-Security',
    desc: 'Forces HTTPS connections',
    check: (val: string) => val.includes('max-age=') && parseInt(val.match(/max-age=(\d+)/)?.[1] || '0') >= 31536000,
    fix: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'
  },
  {
    name: 'Content-Security-Policy',
    desc: 'Prevents XSS and data injection',
    check: (val: string) => val.includes("default-src 'self'") || val.includes('frame-ancestors'),
    fix: "Content-Security-Policy: default-src 'self'; script-src 'self'"
  },
  {
    name: 'X-Frame-Options',
    desc: 'Prevents clickjacking',
    check: (val: string) => val.toUpperCase() === 'DENY' || val.toUpperCase() === 'SAMEORIGIN',
    fix: 'X-Frame-Options: DENY'
  },
  {
    name: 'X-Content-Type-Options',
    desc: 'Prevents MIME sniffing',
    check: (val: string) => val.toLowerCase() === 'nosniff',
    fix: 'X-Content-Type-Options: nosniff'
  },
  {
    name: 'Referrer-Policy',
    desc: 'Controls referrer information',
    check: (val: string) => ['no-referrer', 'strict-origin-when-cross-origin', 'same-origin'].includes(val.toLowerCase()),
    fix: 'Referrer-Policy: strict-origin-when-cross-origin'
  },
  {
    name: 'Permissions-Policy',
    desc: 'Controls browser features',
    check: (val: string) => val.includes('geometric=()') || val.includes('camera=()'),
    fix: 'Permissions-Policy: geolocation=(), camera=(), microphone=()'
  }
];

export default function HeadersAnalyzer() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const analyze = () => {
    const lines = input.split('\n').filter(l => l.includes(':'));
    const headers: Record<string, string> = {};
    lines.forEach(line => {
      const [key, ...valParts] = line.split(':');
      if (key && valParts.length) {
        headers[key.trim().toLowerCase()] = valParts.join(':').trim();
      }
    });

    const analysis = SECURITY_HEADERS.map(header => {
      const val = headers[header.name.toLowerCase()];
      const present = !!val;
      const valid = present && header.check(val);
      return {
        ...header,
        present,
        valid,
        value: val || 'Missing'
      };
    });

    setResults(analysis);
  };

  const loadExample = () => {
    setInput(`HTTP/1.1 200 OK
Date: Mon, 25 Jul 2026 12:00:00 GMT
Server: nginx/1.18.0
Content-Type: text/html; charset=UTF-8
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">HTTP Security Header Analyzer</h1>
        <p className="text-gray-400">Paste raw HTTP response headers to analyze security posture.</p>
      </div>

      <div className="cyber-panel p-6">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-semibold text-cyber-primary">Raw HTTP Headers</label>
          <button onClick={loadExample} className="text-xs text-cyber-secondary hover:underline">Load Example</button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste headers here...\nContent-Type: text/html\nX-Frame-Options: DENY"
          className="cyber-input h-48 font-mono text-xs resize-none"
        />
        <button onClick={analyze} className="cyber-btn mt-4 w-full justify-center">
          Analyze Headers
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Analysis Results</h2>
          {results.map((r, idx) => (
            <div key={idx} className={`cyber-panel p-4 border-l-4 ${r.valid ? 'border-l-cyber-primary' : r.present ? 'border-l-cyber-warning' : 'border-l-cyber-danger'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {r.valid ? (
                    <CheckCircle className="w-5 h-5 text-cyber-primary mt-0.5" />
                  ) : r.present ? (
                    <AlertTriangle className="w-5 h-5 text-cyber-warning mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-cyber-danger mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-mono font-semibold text-white">{r.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{r.desc}</p>
                    <div className="mt-2 font-mono text-xs bg-cyber-black p-2 rounded border border-cyber-border">
                      <span className="text-gray-500">Current: </span>
                      <span className={r.valid ? 'text-cyber-primary' : 'text-cyber-danger'}>{r.value}</span>
                    </div>
                    {!r.valid && (
                      <div className="mt-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-cyber-secondary" />
                        <span className="text-xs text-cyber-secondary font-mono">Recommended: {r.fix}</span>
                        <button 
                          onClick={() => copyToClipboard(r.fix)}
                          className="ml-2 p-1 hover:bg-cyber-border rounded"
                          title="Copy"
                        >
                          <Copy className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}