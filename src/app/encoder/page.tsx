'use client';

import { useState } from 'react';
import { ArrowRightLeft, Copy, Trash2 } from 'lucide-react';
import { base64Encode, base64Decode, urlEncode, urlDecode, hexEncode, hexDecode, copyToClipboard } from '@/lib/utils';

export default function EncoderDecoder() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [format, setFormat] = useState<'base64' | 'url' | 'hex' | 'html'>('base64');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    try {
      if (format === 'base64') {
        setOutput(mode === 'encode' ? base64Encode(input) : base64Decode(input));
      } else if (format === 'url') {
        setOutput(mode === 'encode' ? urlEncode(input) : urlDecode(input));
      } else if (format === 'hex') {
        setOutput(mode === 'encode' ? hexEncode(input) : hexDecode(input));
      } else if (format === 'html') {
        if (mode === 'encode') {
          setOutput(input.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] || m)));
        } else {
          const txt = document.createElement('textarea');
          txt.innerHTML = input;
          setOutput(txt.value);
        }
      }
    } catch (e: any) {
      setError('Invalid input for the selected format and mode.');
      setOutput('');
    }
  };

  const swap = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Multi-Format Encoder/Decoder</h1>
        <p className="text-gray-400">Convert data between Base64, URL, Hex, and HTML entity formats instantly.</p>
      </div>

      <div className="cyber-panel p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex bg-cyber-black rounded border border-cyber-border p-1">
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                mode === 'encode' ? 'bg-cyber-primary text-cyber-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                mode === 'decode' ? 'bg-cyber-primary text-cyber-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Decode
            </button>
          </div>

          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="cyber-input w-auto"
          >
            <option value="base64">Base64</option>
            <option value="url">URL Encoding</option>
            <option value="hex">Hexadecimal</option>
            <option value="html">HTML Entities</option>
          </select>

          <button onClick={swap} className="cyber-btn-secondary ml-auto">
            <ArrowRightLeft className="w-4 h-4" /> Swap Input/Output
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-cyber-primary">Input</label>
              <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="text-xs text-gray-500 hover:text-cyber-danger flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to process..."
              className="cyber-input h-64 font-mono text-sm resize-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-cyber-primary">Output</label>
              {output && (
                <button onClick={() => copyToClipboard(output)} className="text-xs text-cyber-secondary hover:underline flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copy
                </button>
              )}
            </div>
            <div className={`relative h-64 rounded border ${error ? 'border-cyber-danger bg-cyber-danger/5' : 'border-cyber-border bg-cyber-black'}`}>
              {error ? (
                <div className="absolute inset-0 flex items-center justify-center text-cyber-danger font-mono text-sm p-4 text-center">
                  {error}
                </div>
              ) : (
                <textarea
                  readOnly
                  value={output}
                  className="w-full h-full bg-transparent p-3 font-mono text-sm text-cyber-secondary resize-none focus:outline-none"
                  placeholder="Result will appear here..."
                />
              )}
            </div>
          </div>
        </div>

        <button onClick={process} className="cyber-btn mt-6 w-full justify-center text-lg py-3">
          Process Data
        </button>
      </div>
    </div>
  );
}