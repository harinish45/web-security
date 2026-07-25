'use client';

import { useState } from 'react';
import { Globe, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

export default function CORSTester() {
  const [url, setUrl] = useState('');
  const [origin, setOrigin] = useState('https://evil.com');
  const [method, setMethod] = useState('GET');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testCORS = async () => {
    setLoading(true);
    setResult(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method,
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': method,
        },
        mode: 'cors',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const acao = response.headers.get('Access-Control-Allow-Origin');
      const acam = response.headers.get('Access-Control-Allow-Methods');
      const acac = response.headers.get('Access-Control-Allow-Credentials');

      const vulns = [];
      if (acao === '*' && acac === 'true') {
        vulns.push('CRITICAL: Wildcard origin (*) with credentials allowed. This is a browser contradiction but indicates severe misconfiguration.');
      } else if (acao === origin) {
        vulns.push('HIGH: Server reflects the exact Origin header. Vulnerable to CSRF/data theft if credentials are included.');
      } else if (acao && acao !== 'null' && acao !== '*') {
        vulns.push('MEDIUM: Specific origin allowed. Verify if this is intended.');
      }

      if (!acao) {
        vulns.push('INFO: No CORS headers present. Browser will block cross-origin reads (safe by default).');
      }

      setResult({
        status: response.status,
        ok: response.ok,
        headers: {
          'Access-Control-Allow-Origin': acao || 'Not Set',
          'Access-Control-Allow-Methods': acam || 'Not Set',
          'Access-Control-Allow-Credentials': acac || 'Not Set',
        },
        vulns
      });
    } catch (error: any) {
      setResult({
        error: error.name === 'AbortError' ? 'Request timed out (5s)' : 'CORS preflight failed or network error. This often indicates the server does not allow the requested origin/method.',
        vulns: ['INFO: Request blocked. This is the expected secure behavior for unauthorized cross-origin requests.']
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">CORS Policy Tester</h1>
        <p className="text-gray-400">Test Cross-Origin Resource Sharing configurations. <span className="text-cyber-warning">Note: Browser security restrictions may block actual requests to external domains without proper server configuration.</span></p>
      </div>

      <div className="cyber-panel p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-cyber-primary mb-2 block">Target URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/data"
              className="cyber-input"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-cyber-primary mb-2 block">HTTP Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="cyber-input">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
              <option>OPTIONS</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-cyber-primary mb-2 block">Spoofed Origin</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="https://evil.com"
            className="cyber-input"
          />
        </div>

        <button 
          onClick={testCORS} 
          disabled={loading || !url}
          className="cyber-btn w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : 'Test CORS Configuration'}
        </button>
      </div>

      {result && (
        <div className="cyber-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyber-secondary" /> Test Results
          </h3>

          {result.error ? (
            <div className="bg-cyber-danger/10 border border-cyber-danger rounded p-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-cyber-danger mt-0.5" />
              <div>
                <p className="text-cyber-danger font-semibold">Request Failed</p>
                <p className="text-sm text-gray-400 mt-1">{result.error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(result.headers).map(([key, value]) => (
                  <div key={key} className="bg-cyber-black border border-cyber-border rounded p-3">
                    <p className="text-xs text-gray-500 font-mono mb-1">{key}</p>
                    <p className={`font-mono text-sm break-all ${
                      (value as string).includes('*') || (value as string).includes(origin) ? 'text-cyber-danger' : 'text-cyber-primary'
                    }`}>
                      {value as string}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white">Security Assessment</h4>
                {result.vulns.map((vuln: string, idx: number) => {
                  const isCritical = vuln.includes('CRITICAL');
                  const isHigh = vuln.includes('HIGH');
                  return (
                    <div key={idx} className={`p-3 rounded border flex items-start gap-3 ${
                      isCritical || isHigh ? 'bg-cyber-danger/10 border-cyber-danger text-cyber-danger' : 'bg-cyber-info/10 border-cyber-info text-cyber-info'
                    }`}>
                      {isCritical || isHigh ? <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" /> : <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                      <span className="text-sm font-mono">{vuln}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}