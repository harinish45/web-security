'use client';
import { useState } from 'react';
import { RefreshCw, Copy, CheckCircle } from 'lucide-react';

export default function EncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [format, setFormat] = useState<'base64' | 'url' | 'hex' | 'html' | 'rot13'>('base64');
  const [copied, setCopied] = useState(false);

  const process = () => {
    try {
      let result = '';
      if (mode === 'encode') {
        switch (format) {
          case 'base64': result = btoa(unescape(encodeURIComponent(input))); break;
          case 'url': result = encodeURIComponent(input); break;
          case 'hex': result = Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''); break;
          case 'html': result = input.replace(/[&<>"']/g, (c: any) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); break;
          case 'rot13': result = input.replace(/[a-zA-Z]/g, (c: any) => { const base = c <= 'Z' ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base); }); break;
        }
      } else {
        switch (format) {
          case 'base64': result = decodeURIComponent(escape(atob(input))); break;
          case 'url': result = decodeURIComponent(input); break;
          case 'hex': result = input.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || ''; break;
          case 'html': const textarea = document.createElement('textarea'); textarea.innerHTML = input; result = textarea.value; break;
          case 'rot13': result = input.replace(/[a-zA-Z]/g, (c: any) => { const base = c <= 'Z' ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base); }); break;
        }
      }
      setOutput(result);
    } catch (e) { setOutput('Error: Invalid input for selected format.'); }
  };

  const copyOutput = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white mb-2">Encoder / Decoder</h1><p className="text-gray-400">Multi-format text conversion with real-time processing.</p></div>
      <div className="cyber-panel p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex bg-cyber-black rounded-lg p-1 border border-cyber-border">
            <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${mode === 'encode' ? 'bg-cyber-primary text-cyber-black' : 'text-gray-400 hover:text-white'}`}>Encode</button>
            <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${mode === 'decode' ? 'bg-cyber-primary text-cyber-black' : 'text-gray-400 hover:text-white'}`}>Decode</button>
          </div>
          <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="cyber-input w-auto bg-cyber-black">
            <option value="base64">Base64</option>
            <option value="url">URL Encode</option>
            <option value="hex">Hexadecimal</option>
            <option value="html">HTML Entities</option>
            <option value="rot13">ROT13</option>
          </select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-mono text-cyber-secondary mb-2 block">INPUT</label>
            <textarea value={input} onChange={(e) => { setInput(e.target.value); }} onBlur={process} placeholder="Enter text to process..." className="cyber-input h-48 resize-none" />
          </div>
          <div className="relative">
            <label className="text-xs font-mono text-cyber-secondary mb-2 block">OUTPUT</label>
            <textarea value={output} readOnly className="cyber-input h-48 resize-none bg-cyber-black/50" />
            <button onClick={copyOutput} className="absolute top-8 right-2 p-2 hover:bg-cyber-border rounded transition-colors" title="Copy to clipboard">
              {copied ? <CheckCircle className="w-4 h-4 text-cyber-primary" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>
        <button onClick={process} className="cyber-btn mt-6 w-full"><RefreshCw className="w-4 h-4" /> Process</button>
      </div>
    </div>
  );
}