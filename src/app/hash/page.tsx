'use client';

import { useState } from 'react';
import { Hash, Copy, Shield, AlertTriangle } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import CryptoJS from 'crypto-js';

const COMMON_HASHES: Record<string, string> = {
  'e99a18c428cb38d5f260853678922e03': 'abc (MD5)',
  'a9993e364706816aba3e25717850c26c9cd0d89d': 'abc (SHA1)',
  'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad': 'abc (SHA256)',
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8': 'password (SHA256)',
  '098f6bcd4621d373cade4e832627b4f6': 'test (MD5)',
};

export default function HashAnalyzer() {
  const [input, setInput] = useState('');
  const [hashType, setHashType] = useState<'md5' | 'sha1' | 'sha256' | 'sha512'>('sha256');
  const [output, setOutput] = useState('');
  const [identified, setIdentified] = useState<string | null>(null);

  const generateHash = () => {
    if (!input) return;
    
    let hash = '';
    if (hashType === 'md5') hash = CryptoJS.MD5(input).toString();
    else if (hashType === 'sha1') hash = CryptoJS.SHA1(input).toString();
    else if (hashType === 'sha256') hash = CryptoJS.SHA256(input).toString();
    else if (hashType === 'sha512') hash = CryptoJS.SHA512(input).toString();
    
    setOutput(hash);
    setIdentified(COMMON_HASHES[hash.toLowerCase()] || null);
  };

  const identifyHash = () => {
    const len = input.length;
    if (len === 32) return 'Likely MD5 or NTLM';
    if (len === 40) return 'Likely SHA1';
    if (len === 64) return 'Likely SHA256';
    if (len === 128) return 'Likely SHA512';
    return 'Unknown format';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Hash Analyzer & Generator</h1>
        <p className="text-gray-400">Generate cryptographic hashes and identify unknown hash formats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="cyber-panel p-6">
          <h3 className="text-sm font-semibold text-cyber-primary mb-4 flex items-center gap-2">
            <Hash className="w-4 h-4" /> Hash Generator
          </h3>
          
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">Algorithm</label>
            <select 
              value={hashType} 
              onChange={(e) => setHashType(e.target.value as any)}
              className="cyber-input"
            >
              <option value="md5">MD5 (128-bit) - <span className="text-cyber-danger">Deprecated</span></option>
              <option value="sha1">SHA-1 (160-bit) - <span className="text-cyber-danger">Deprecated</span></option>
              <option value="sha256">SHA-256 (256-bit) - Recommended</option>
              <option value="sha512">SHA-512 (512-bit) - Recommended</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">Input String</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              className="cyber-input"
            />
          </div>

          <button onClick={generateHash} className="cyber-btn w-full justify-center mb-4">
            Generate Hash
          </button>

          {output && (
            <div className="bg-cyber-black border border-cyber-border rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase">Output</span>
                <button onClick={() => copyToClipboard(output)} className="p-1.5 hover:bg-cyber-border rounded">
                  <Copy className="w-4 h-4 text-cyber-primary" />
                </button>
              </div>
              <code className="block font-mono text-sm text-cyber-secondary break-all">{output}</code>
              {identified && (
                <div className="mt-3 p-2 bg-cyber-primary/10 border border-cyber-primary/30 rounded flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyber-primary" />
                  <span className="text-xs text-cyber-primary">Recognized: {identified}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="cyber-panel p-6">
          <h3 className="text-sm font-semibold text-cyber-primary mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Hash Identifier
          </h3>
          
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">Unknown Hash</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste hash to identify..."
              className="cyber-input font-mono"
            />
          </div>

          {input.length > 0 && (
            <div className="space-y-3">
              <div className="bg-cyber-black border border-cyber-border rounded p-4">
                <p className="text-xs text-gray-500 mb-1">Length</p>
                <p className="text-lg font-mono text-white">{input.length} characters</p>
              </div>
              
              <div className="bg-cyber-black border border-cyber-border rounded p-4">
                <p className="text-xs text-gray-500 mb-1">Probable Algorithm</p>
                <p className="text-lg font-mono text-cyber-secondary">{identifyHash()}</p>
              </div>

              <div className="bg-cyber-warning/10 border border-cyber-warning/30 rounded p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-cyber-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-cyber-warning">Security Notice</p>
                  <p className="text-xs text-gray-400 mt-1">
                    If this is a password hash, MD5 and SHA1 are considered cryptographically broken 
                    and should not be used for security purposes. Use bcrypt, Argon2, or PBKDF2 instead.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}