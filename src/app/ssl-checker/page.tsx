'use client';
import { useState } from 'react';
import { Search, Lock, Calendar, AlertTriangle, Globe, Loader2 } from 'lucide-react';

export default function SSLChecker() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [certs, setCerts] = useState<any[]>([]);
  const [error, setError] = useState('');

  const checkSSL = async () => {
    if (!domain) return;
    setLoading(true);
    setError('');
    setCerts([]);
    try {
      const response = await fetch(`https://crt.sh/?q=${encodeURIComponent(domain)}&output=json`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      const uniqueCerts = Array.from(new Map(data.map((item: any) => [item.id, item])).values());
      setCerts(uniqueCerts.slice(0, 5));
    } catch (err) {
      setError('Failed to fetch certificate data. Ensure the domain is valid and has public CT logs.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const isExpired = (notAfter: string) => new Date(notAfter) < new Date();

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white mb-2">SSL/TLS Certificate Checker</h1><p className="text-gray-400">Query public Certificate Transparency logs to verify SSL certificates.</p></div>
      <div className="cyber-panel p-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" value={domain} onChange={(e) => setDomain(e.target.value.replace(/^https?:\/\//, '').replace(/\/$/, ''))} placeholder="example.com" className="cyber-input pl-10" onKeyDown={(e) => e.key === 'Enter' && checkSSL()} />
          </div>
          <button onClick={checkSSL} disabled={loading} className="cyber-btn px-8">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Check
          </button>
        </div>
      </div>
      {error && (
        <div className="cyber-panel p-4 border-cyber-danger bg-cyber-danger/10 flex items-center gap-3 text-cyber-danger">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-mono">{error}</span>
        </div>
      )}
      {certs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Recent Certificates</h3>
          {certs.map((cert: any, idx: number) => {
            const expired = isExpired(cert.not_after);
            return (
              <div key={idx} className="cyber-panel p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${expired ? 'bg-cyber-danger/20' : 'bg-cyber-primary/20'}`}>
                      <Lock className={`w-5 h-5 ${expired ? 'text-cyber-danger' : 'text-cyber-primary'}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold font-mono">{cert.name_value}</h4>
                      <p className="text-xs text-gray-500">Issuer: {cert.issuer_name?.match(/O=([^,]+)/)?.[1] || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-semibold ${expired ? 'bg-cyber-danger/20 text-cyber-danger' : 'bg-cyber-primary/20 text-cyber-primary'}`}>
                    {expired ? 'EXPIRED' : 'VALID'}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400"><Calendar className="w-4 h-4" /><span>Not Before: <span className="text-white font-mono">{formatDate(cert.not_before)}</span></span></div>
                  <div className="flex items-center gap-2 text-gray-400"><Calendar className="w-4 h-4" /><span>Not After: <span className={`font-mono ${expired ? 'text-cyber-danger' : 'text-white'}`}>{formatDate(cert.not_after)}</span></span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-cyber-border"><p className="text-xs text-gray-500 font-mono break-all">Serial: {cert.serial_number}</p></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}