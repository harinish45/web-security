'use client';
import { useState } from 'react';
import { FileCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const securityRegexes = [
  { name: 'Email Validation', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', description: 'Standard email format' },
  { name: 'Strong Password', pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: 'Min 8 chars, 1 upper, 1 lower, 1 number, 1 special' },
  { name: 'IPv4 Address', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', description: 'Valid IPv4 format' },
  { name: 'URL Validation', pattern: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$', description: 'HTTP/HTTPS URL format' },
  { name: 'SQL Injection Pattern', pattern: '(?i)(\\b(?:select|insert|update|delete|drop|union|exec|execute)\\b)', description: 'Detects common SQL keywords' },
  { name: 'XSS Pattern', pattern: '(?i)(<script|javascript:|on\\w+\\s*=)', description: 'Detects common XSS vectors' }
];

export default function RegexTester() {
  const [testString, setTestString] = useState('');
  const [customRegex, setCustomRegex] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const testRegex = () => {
    const findings: any[] = [];
    
    // Test against predefined security regexes
    securityRegexes.forEach(regex => {
      try {
        const pattern = new RegExp(regex.pattern);
        const isMatch = pattern.test(testString);
        findings.push({
          name: regex.name,
          description: regex.description,
          match: isMatch,
          pattern: regex.pattern
        });
      } catch (e) {
        // Skip invalid regex
      }
    });

    // Test custom regex if provided
    if (customRegex.trim()) {
      try {
        const pattern = new RegExp(customRegex);
        const isMatch = pattern.test(testString);
        const matches = testString.match(pattern);
        findings.push({
          name: 'Custom Regex',
          description: 'User-defined pattern',
          match: isMatch,
          pattern: customRegex,
          matches: matches
        });
      } catch (e: any) {
        findings.push({
          name: 'Custom Regex',
          description: 'Invalid regular expression',
          match: false,
          pattern: customRegex,
          error: e.message
        });
      }
    }

    setResults(findings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Regex Tester</h1>
        <p className="text-gray-400">Test input strings against common security regex patterns or your own custom patterns.</p>
      </div>

      <div className="cyber-panel p-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-cyber-secondary mb-2 block">TEST STRING</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter string to test..."
              className="cyber-input h-24 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-cyber-secondary mb-2 block">CUSTOM REGEX (Optional)</label>
            <input
              type="text"
              value={customRegex}
              onChange={(e) => setCustomRegex(e.target.value)}
              placeholder="^[a-zA-Z0-9]+$"
              className="cyber-input"
            />
          </div>
          <button onClick={testRegex} className="cyber-btn w-full">
            <FileCheck className="w-4 h-4" /> Test Patterns
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="cyber-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
          <div className="space-y-3">
            {results.map((result, idx) => (
              <div key={idx} className="p-4 rounded border border-cyber-border bg-cyber-black">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {result.match ? <CheckCircle className="w-4 h-4 text-cyber-primary" /> : <XCircle className="w-4 h-4 text-gray-500" />}
                    <span className="text-sm font-semibold text-white">{result.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-mono ${result.match ? 'bg-cyber-primary/20 text-cyber-primary' : 'bg-gray-800 text-gray-400'}`}>
                    {result.match ? 'MATCH' : 'NO MATCH'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{result.description}</p>
                <code className="text-xs font-mono text-cyber-secondary block bg-cyber-panel p-2 rounded break-all">
                  {result.pattern}
                </code>
                {result.error && (
                  <div className="mt-2 flex items-center gap-2 text-cyber-danger text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{result.error}</span>
                  </div>
                )}
                {result.matches && result.matches.length > 0 && (
                  <div className="mt-2 text-xs">
                    <span className="text-gray-400">Matches: </span>
                    <span className="text-cyber-primary font-mono">{result.matches.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}