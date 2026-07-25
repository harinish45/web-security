'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, FileText, Key, Code, RefreshCw, Globe, Search, Hash, Cookie, Lock, FileCheck, Terminal, Activity, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const navGroups = [
  { title: 'Dashboard', items: [{ name: 'Overview', href: '/', icon: Activity }] },
  {
    title: 'Analysis',
    items: [
      { name: 'HTTP Headers', href: '/headers', icon: FileText },
      { name: 'JWT Analyzer', href: '/jwt', icon: Key },
      { name: 'Cookie Security', href: '/cookies', icon: Cookie },
      { name: 'SSL Checker', href: '/ssl-checker', icon: Lock },
    ]
  },
  {
    title: 'Testing',
    items: [
      { name: 'Vuln Scanner', href: '/vuln-scanner', icon: Search },
      { name: 'Payload Generator', href: '/payloads', icon: Code },
      { name: 'CORS Tester', href: '/cors', icon: Globe },
      { name: 'Regex Tester', href: '/regex-tester', icon: FileCheck },
    ]
  },
  {
    title: 'Utilities',
    items: [
      { name: 'Encoder/Decoder', href: '/encoder', icon: RefreshCw },
      { name: 'Hash Generator', href: '/hash', icon: Hash },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ 'Dashboard': true, 'Analysis': true, 'Testing': true, 'Utilities': true });

  const toggleGroup = (title: string) => setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));

  return (
    <aside className="w-72 bg-cyber-panel border-r border-cyber-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-cyber-border">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-cyber-primary" />
          <div>
            <h1 className="font-bold text-lg text-cyber-primary tracking-tight font-mono">SEC-TOOLKIT</h1>
            <p className="text-xs text-gray-500 font-mono">v2.0.0 LIVE</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title}>
            <button onClick={() => toggleGroup(group.title)} className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-cyber-primary transition-colors">
              {group.title}
              {openGroups[group.title] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {openGroups[group.title] && (
              <div className="space-y-1 mt-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-cyber-primary/10 text-cyber-primary border-l-2 border-cyber-primary' : 'text-gray-400 hover:bg-cyber-black hover:text-cyber-secondary'}`}>
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-cyber-border">
        <div className="cyber-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse" />
            <span className="text-xs font-mono text-cyber-primary font-semibold">SYSTEM ONLINE</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">100% client-side execution. No data leaves your browser.</p>
        </div>
      </div>
    </aside>
  );
}