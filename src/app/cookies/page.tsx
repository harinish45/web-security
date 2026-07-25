'use client';
import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Cookie, Info } from 'lucide-react';

export default function CookieAnalyzer() {
  const [cookieString, setCookieString] = useState('');
  const [analysis, setAnalysis] = useState<any[]>([]);

  const analyze = () => {
    if (!cookieString.trim()) return;
    const cookies = cookieString.split(';').map(c => c.trim()).filter(c => c);
    const results = cookies.map(cookieStr => {
      const parts = cookieStr.split(';').map(p => p.trim());
      const [nameValue, ...attributes] = parts;
      const [name, value] = nameValue.split('=').map(p => p.trim());
      const flags = { secure: false, httponly: false, samesite: 'none' as string | 'none' | 'lax' | 'strict' };
      attributes.forEach(attr => {
        const lower = attr.toLowerCase();
        if (lower === 'secure') flags.secure = true;
        if (lower === 'httponly') flags.httponly = true;
        if (lower.startsWith('samesite=')) flags.samesite = attr.split('=')[1].toLowerCase();
      });
      const issues: any[] = [];
      if (!flags.secure) issues.push({ severity: 'high', msg: 'Missing Secure flag. Cookie can be transmitted over HTTP.' });
      if (!flags.httponly) issues.push({ severity: 'high', msg: 'Missing HttpOnly flag. Cookie is accessible via JavaScript (XSS risk).' });
      if (flags.samesite === 'none' && !flags.secure) issues.push({ severity: 'critical', msg: 'SameSite=None requires Secure flag in modern browsers.' });
      else if (flags.samesite === 'none') issues.push({ severity: 'medium', msg: 'SameSite=None allows cross-site requests. Ensure this is intended.' });
      else if (flags.samesite === 'lax') issues.push({ severity: 'low', msg: 'SameSite=Lax is good, but Strict is safer for sensitive cookies.' });
      return { name, value, flags, issues };
    });
    setAnalysis(results);
  };

  const loadExample = () => setCookieString('session_id=abc123xyz; user_pref=dark_mode; auth_token=secret123; SameSite=None');

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white mb-2">Cookie Security Analyzer</h1><p className="text-gray-400">Analyze cookie strings for missing security flags and misconfigurations.</p></div>
      <div className="cyber-panel p-6">
        <div className="flex justify-between items-center mb-4"><label className="text-sm font-semibold text-cyber-primary">Cookie String</label><button onClick={loadExample} className="text-xs text-cyber-secondary hover:underline font-mono">Load Example</button></div>
        <textarea value={cookieString} onChange={(e) => setCookieString(e.target.value)} placeholder="session_id=abc123; Secure; HttpOnly; SameSite=Strict" className="cyber-input h-32 resize-none" />
        <button onClick={analyze} className="cyber-btn mt-4 w-full">Analyze Cookies</button>
      </div>
      {analysis.length > 0 && (
        <div className="space-y-4">
          {analysis.map((cookie, idx) => (
            <div key={idx} className="cyber-panel p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-5 h-5 text-cyber-primary" />
                <h3 className="text-lg font-semibold text-white font-mono">{cookie.name}</h3>
                <span className="text-xs text-gray-500 font-mono truncate max-w-md">{cookie.value}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className={`p-3 rounded border flex items-center gap-2 ${cookie.flags.secure ? 'bg-cyber-primary/10 border-cyber-primary text-cyber-primary' : 'bg-cyber-danger/10 border-cyber-danger text-cyber-danger'}`}>
                  {cookie.flags.secure ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span className="text-sm font-semibold">Secure</span>
                </div>
                <div className={`p-3 rounded border flex items-center gap-2 ${cookie.flags.httponly ? 'bg-cyber-primary/10 border-cyber-primary text-cyber-primary' : 'bg-cyber-danger/10 border-cyber-danger text-cyber-danger'}`}>
                  {cookie.flags.httponly ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span className="text-sm font-semibold">HttpOnly</span>
                </div>
                <div className={`p-3 rounded border flex items-center gap-2 ${cookie.flags.samesite === 'strict' ? 'bg-cyber-primary/10 border-cyber-primary text-cyber-primary' : cookie.flags.samesite === 'lax' ? 'bg-cyber-warning/10 border-cyber-warning text-cyber-warning' : 'bg-cyber-danger/10 border-cyber-danger text-cyber-danger'}`}>
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-semibold">SameSite: {cookie.flags.samesite.toUpperCase()}</span>
                </div>
              </div>
              {cookie.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-cyber-warning mb-2">Security Issues:</h4>
                  {cookie.issues.map((issue: any, i: number) => (
                    <div key={i} className={`p-3 rounded border flex items-start gap-2 ${issue.severity === 'critical' ? 'severity-critical' : issue.severity === 'high' ? 'severity-high' : 'severity-medium'}`}>
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-mono">{issue.msg}</span>
                    </div>
                  ))}
                </div>
              )}
              {cookie.issues.length === 0 && (
                <div className="flex items-center gap-2 text-cyber-primary bg-cyber-primary/10 p-3 rounded border border-cyber-primary/30">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Cookie is properly configured with all recommended security flags.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}