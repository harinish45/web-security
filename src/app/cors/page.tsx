'use client';
import { useState } from 'react';
import { Globe, AlertTriangle, CheckCircle, XCircle, Info, Loader2 } from 'lucide-react';

export default function CORSTester() {
  const [targetUrl, setTargetUrl] = useState('');
  const [origin, setOrigin] = useState('https://evil.com');
  const [method, setMethod] = useState('GET');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const testCORS = async () => {
    if (!targetUrl) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(targetUrl, {
        method: method,
        mode: 'cors',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': method,
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const corsHeaders = {
        allowOrigin: response.headers.get('access-control-allow-origin'),
        allowMethods: response.headers.get('access-control-allow-methods'),
        allowHeaders: response.headers.get('access-control-allow-headers'),
        allowCredentials: response.headers.get('access-control-allow-credentials'),
        exposeHeaders: response.headers.get('access-control-expose-headers')
      };

      setResult({
        status: response.status,
        statusText: response.statusText,
        headers: corsHeaders,
        success: true
      });
    } catch (err: any) {
      setResult({
        success: false,
        error: err.name === 'AbortError' ? 'Request timed out (5s)' : err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setTargetUrl('https://httpbin.org/get');
    setOrigin('https://example.com');
    setMethod('GET');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">CORS Tester</h1>
        <p className="text-gray-400">Simulate cross-origin requests to detect CORS misconfigurations. <span className="text-cyber-warning">Note: Browser CORS policies apply.</span></p>
      </div>

      <div className="cyber-panel p-6">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-semibold text-cyber-primary">Test Configuration</label>
          <button onClick={loadExample} className="text-xs text-cyber-secondary hover:underline font-mono">Load Example</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Target URL</label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://api.example.com/data"
              className="cyber-input"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Origin</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="https://evil.com"
              className="cyber-input"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="cyber-input"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="OPTIONS">OPTIONS</option>
            </select>
          </div>
        </div>
        <button onClick={testCORS} disabled={loading} className="cyber-btn w-full">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
          Test CORS
        </button>
      </div>

      {error && (
        <div className="cyber-panel p-4 border-cyber-danger bg-cyber-danger/10 flex items-center gap-3 text-cyber-danger">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-mono">{error}</span>
        </div>
      )}

      {result && (
        <div className="cyber-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Response Analysis</h3>
          {result.success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyber-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Request Successful (Status: {result.status})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.headers).map(([key, value]: [string, any]) => (
                  <div key={key} className="p-3 rounded bg-cyber-black border border-cyber-border">
                    <div className="text-xs text-gray-500 font-mono mb-1 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className={`text-sm font-mono break-all ${value ? 'text-cyber-secondary' : 'text-gray-600'}`}>
                      {value || 'Not Set'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded bg-cyber-warning/10 border border-cyber-warning/30 flex items-start gap-3">
                <Info className="w-5 h-5 text-cyber-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-cyber-warning mb-1">CORS Analysis</h4>
                  <p className="text-xs text-gray-400">
                    {result.headers.allowOrigin === '*' 
                      ? '⚠️ WARNING: Access-Control-Allow-Origin is set to "*". This allows any origin to read the response. If credentials are involved, this is a severe misconfiguration.'
                      : result.headers.allowOrigin === origin
                      ? '✅ The server explicitly allows your test origin. Ensure this is intended and not vulnerable to Origin reflection.'
                      : 'ℹ️ The server returned a specific origin or no CORS headers. This is generally secure, but verify the expected behavior.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-cyber-danger">
              <XCircle className="w-5 h-5" />
              <div>
                <span className="font-semibold block">Request Blocked or Failed</span>
                <span className="text-sm font-mono text-gray-400">{result.error}</span>
                <p className="text-xs text-gray-500 mt-2">This is expected if the server does not allow your origin, or if the browser blocked the request due to CORS policy.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}