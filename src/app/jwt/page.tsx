'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Copy, Shield, ShieldAlert } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

export default function JWTAnalyzer() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<any>(null);
  const [vulnerabilities, setVulnerabilities] = useState<string[]>([]);

  const analyzeJWT = () => {
    setVulnerabilities([]);
    setDecoded(null);

    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      alert('Invalid JWT format. Must have 3 parts separated by dots.');
      return;
    }

    try {
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      setDecoded({ header, payload, signature: parts[2] });

      const vulns: string[] = [];
      
      // Check for 'none' algorithm
      if (header.alg?.toLowerCase() === 'none') {
        vulns.push('CRITICAL: Algorithm is "none". Token can be forged without a signature.');
      }
      
      // Check for symmetric algorithm with public claims
      if (header.alg?.startsWith('HS') && payload.iss?.includes('public')) {
        vulns.push('HIGH: HS256 used with potentially public issuer. Secret might be guessable.');
      }
      
      // Check expiration
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        if (expDate < new Date()) {
          vulns.push('MEDIUM: Token is expired.');
        } else {
          const daysLeft = (payload.exp * 1000 - Date.now()) / (1000 * 60 * 60 * 24);
          if (daysLeft > 30) {
            vulns.push('LOW: Token has a very long validity period (>30 days).');
          }
        }
      } else {
        vulns.push('MEDIUM: No expiration (exp) claim. Token never expires.');
      }
      
      // Check for missing issued at
      if (!payload.iat) {
        vulns.push('LOW: Missing "iat" (issued at) claim.');
      }

      // Check for sensitive data in payload
      const sensitiveKeys = ['password', 'secret', 'credit_card', 'ssn', 'api_key'];
      const payloadKeys = Object.keys(payload).map(k => k.toLowerCase());
      const foundSensitive = sensitiveKeys.filter(k => payloadKeys.some(pk => pk.includes(k)));
      if (foundSensitive.length > 0) {
        vulns.push(`HIGH: Sensitive data found in payload: ${foundSensitive.join(', ')}`);
      }

      setVulnerabilities(vulns);
    } catch (e) {
      alert('Failed to decode JWT. Ensure it is a valid Base64URL encoded token.');
    }
  };

  const loadExample = () => {
    setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">JWT Analyzer</h1>
        <p className="text-gray-400">Decode JSON Web Tokens and detect common security misconfigurations.</p>
      </div>

      <div className="cyber-panel p-6">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-semibold text-cyber-primary">JWT Token</label>
          <button onClick={loadExample} className="text-xs text-cyber-secondary hover:underline">Load Example</button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="cyber-input h-32 font-mono text-xs resize-none"
        />
        <button onClick={analyzeJWT} className="cyber-btn mt-4 w-full justify-center">
          Analyze Token
        </button>
      </div>

      {decoded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="cyber-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyber-primary" /> Decoded Payload
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono text-cyber-secondary mb-2">HEADER</h4>
                <pre className="bg-cyber-black p-3 rounded border border-cyber-border text-xs font-mono text-cyber-primary overflow-x-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-xs font-mono text-cyber-secondary mb-2">PAYLOAD</h4>
                <pre className="bg-cyber-black p-3 rounded border border-cyber-border text-xs font-mono text-cyber-primary overflow-x-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="text-xs font-mono text-cyber-secondary mb-2">SIGNATURE</h4>
                <div className="flex items-center gap-2">
                  <code className="bg-cyber-black p-2 rounded border border-cyber-border text-xs font-mono text-gray-400 flex-1 truncate">
                    {decoded.signature}
                  </code>
                  <button onClick={() => copyToClipboard(decoded.signature)} className="p-2 hover:bg-cyber-border rounded">
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="cyber-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyber-danger" /> Vulnerability Assessment
            </h3>
            {vulnerabilities.length === 0 ? (
              <div className="flex items-center gap-3 text-cyber-primary bg-cyber-primary/10 p-4 rounded border border-cyber-primary/30">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">No obvious vulnerabilities detected. Token appears well-configured.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {vulnerabilities.map((vuln, idx) => {
                  const isCritical = vuln.includes('CRITICAL');
                  const isHigh = vuln.includes('HIGH');
                  const isMedium = vuln.includes('MEDIUM');
                  return (
                    <div key={idx} className={`p-3 rounded border flex items-start gap-3 ${
                      isCritical ? 'bg-cyber-danger/10 border-cyber-danger text-cyber-danger' :
                      isHigh ? 'bg-orange-500/10 border-orange-500 text-orange-500' :
                      isMedium ? 'bg-cyber-warning/10 border-cyber-warning text-cyber-warning' :
                      'bg-cyber-info/10 border-cyber-info text-cyber-info'
                    }`}>
                      {isCritical || isHigh ? <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                      <span className="text-sm font-mono">{vuln}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}