'use client';
import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';

const vulnPatterns = [
  { name: 'SQL Injection', severity: 'critical', patterns: [/(?:'|\")?(?:or|and)\s+[\'\"]?\d+[\'\"]?\s*=\s*[\'\"]?\d+/i, /union\s+select/i, /drop\s+table/i, /;\s*--/i] },
  { name: 'Cross-Site Scripting (XSS)', severity: 'high', patterns: [/<script[^>]*>/i, /javascript:/i, /on\w+\s*=/i, /<svg[^>]*onload/i] },
  { name: 'Path Traversal', severity: 'high', patterns: [/\.\.\/|\.\.\\/i, /%2e%2e%2f|%2e%2e%5c/i, /\.\.%2f|\.\.%5c/i] },
  { name: 'Command Injection', severity: 'critical', patterns: [/[;&|`$]/, /\|\s*cat\s/i, /;\s*ls\s/i, /\$\(/] },
  { name: 'SSRF Indicators', severity: 'medium', patterns: [/127\.0\.0\.1|localhost/i, /169\.254\.169\.254/i, /file:\/\//i] }
];

export default function VulnScanner() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [scanned, setScanned] = useState(false);

  const scan = () => {
    if (!input.trim()) return;
    const findings: any[] = [];
    vulnPatterns.forEach(vuln => {
      vuln.patterns.forEach(pattern => {
        if (pattern.test(input)) {
          findings.push({ type: vuln.name, severity: vuln.severity, match: input.match(pattern)?.[0] || 'Pattern matched' });
        }
      });
    });
    const uniqueFindings = findings.filter((v, i, a) => a.findIndex(t => t.type === v.type) === i);
    setResults(uniqueFindings);
    setScanned(true);
  };

  const loadExample = (type: 'sqli' | 'xss' | 'traversal') => {
    if (type === 'sqli') setInput("admin' OR '1'='1' --");
    if (type === 'xss') setInput('<img src=x onerror=alert(document.cookie)>');
    if (type === 'traversal') setInput('../../../etc/passwd');
    setScanned(false);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white mb-2">Vulnerability Pattern Scanner</h1><p className="text-gray-400">Detect common vulnerability patterns in input strings using regex analysis.</p></div>
      <div className="cyber-panel p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-gray-500 py-2">Load example:</span>
          <button onClick={() => loadExample('sqli')} className="text-xs px-3 py-1 rounded bg-cyber-danger/20 text-cyber-danger hover:bg-cyber-danger/30 transition-colors">SQLi</button>
          <button onClick={() => loadExample('xss')} className="text-xs px-3 py-1 rounded bg-cyber-warning/20 text-cyber-warning hover:bg-cyber-warning/30 transition-colors">XSS</button>
          <button onClick={() => loadExample('traversal')} className="text-xs px-3 py-1 rounded bg-cyber-info/20 text-cyber-info hover:bg-cyber-info/30 transition-colors">Path Traversal</button>
        </div>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter input string to scan for vulnerability patterns..." className="cyber-input h-32 resize-none mb-4" />
        <button onClick={scan} className="cyber-btn w-full"><Search className="w-4 h-4" /> Scan Input</button>
      </div>
      {scanned && (
        <div className="cyber-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-cyber-primary" /> Scan Results</h3>
          {results.length === 0 ? (
            <div className="flex items-center gap-3 text-cyber-primary bg-cyber-primary/10 p-4 rounded border border-cyber-primary/30">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">No known vulnerability patterns detected in the input.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result, idx) => {
                const colorClass = result.severity === 'critical' ? 'severity-critical' : result.severity === 'high' ? 'severity-high' : 'severity-medium';
                return (
                  <div key={idx} className={`p-4 rounded border flex items-start gap-3 ${colorClass}`}>
                    <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">{result.type}</h4>
                      <p className="text-xs font-mono mt-1 opacity-80">Matched: <span className="font-bold">{result.match}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}