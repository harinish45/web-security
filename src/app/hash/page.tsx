'use client';
import { useState } from 'react';
import { Hash, Copy, CheckCircle, Shield } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const generateHashes = async () => {
    if (!input) {
      setHashes({});
      return;
    }

    // Web Crypto API for SHA-256 and SHA-512
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    
    const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
    const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
    
    const sha256 = Array.from(new Uint8Array(sha256Buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    const sha512 = Array.from(new Uint8Array(sha512Buffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    // CryptoJS for MD5 and SHA1
    const md5 = CryptoJS.MD5(input).toString();
    const sha1 = CryptoJS.SHA1(input).toString();

    setHashes({
      'MD5': md5,
      'SHA-1': sha1,
      'SHA-256': sha256,
      'SHA-512': sha512
    });
  };

  const copyHash = (algo: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(algo);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Hash Generator</h1>
        <p className="text-gray-400">Generate cryptographic hashes using Web Crypto API (SHA-256/512) and CryptoJS (MD5/SHA1).</p>
      </div>

      <div className="cyber-panel p-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-cyber-secondary mb-2 block">INPUT STRING</label>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); }}
              onBlur={generateHashes}
              placeholder="Enter text to hash..."
              className="cyber-input h-24 resize-none"
            />
          </div>
          <button onClick={generateHashes} className="cyber-btn w-full">
            <Hash className="w-4 h-4" /> Generate Hashes
          </button>
        </div>
      </div>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-4">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="cyber-panel p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyber-primary" />
                  <span className="text-sm font-semibold text-white font-mono">{algo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${algo === 'MD5' || algo === 'SHA-1' ? 'bg-cyber-warning/20 text-cyber-warning' : 'bg-cyber-primary/20 text-cyber-primary'}`}>
                    {algo === 'MD5' || algo === 'SHA-1' ? 'Legacy' : 'Secure'}
                  </span>
                </div>
                <button
                  onClick={() => copyHash(algo, hash)}
                  className="p-2 hover:bg-cyber-border rounded transition-colors"
                  title="Copy to clipboard"
                >
                  {copied === algo ? <CheckCircle className="w-4 h-4 text-cyber-primary" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
              <code className="text-xs font-mono text-cyber-secondary block bg-cyber-black p-3 rounded border border-cyber-border break-all">
                {hash}
              </code>
            </div>
          ))}
        </div>
      )}

      <div className="cyber-panel p-4 border-cyber-info/30 bg-cyber-info/5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-cyber-info flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-cyber-info mb-1">Security Note</h4>
            <p className="text-xs text-gray-400">
              MD5 and SHA-1 are considered cryptographically broken and unsuitable for further use in security applications. 
              Use SHA-256 or SHA-512 for password hashing (with salt) or data integrity verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}