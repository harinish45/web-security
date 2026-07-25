'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  FileText, 
  Key, 
  Code, 
  RefreshCw, 
  Globe, 
  Search, 
  Hash,
  Terminal
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Shield },
  { name: 'HTTP Headers', href: '/headers', icon: FileText },
  { name: 'JWT Analyzer', href: '/jwt', icon: Key },
  { name: 'Payload Generator', href: '/payloads', icon: Code },
  { name: 'Encoder/Decoder', href: '/encoder', icon: RefreshCw },
  { name: 'CORS Tester', href: '/cors', icon: Globe },
  { name: 'Vuln Scanner', href: '/vuln-scanner', icon: Search },
  { name: 'Hash Analyzer', href: '/hash', icon: Hash },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-cyber-dark border-r border-cyber-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-cyber-border">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-cyber-primary" />
          <div>
            <h1 className="font-bold text-lg text-cyber-primary tracking-tight">SEC-TOOLKIT</h1>
            <p className="text-xs text-gray-500 font-mono">v2.0.0 LIVE</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyber-primary/10 text-cyber-primary border-l-2 border-cyber-primary'
                  : 'text-gray-400 hover:bg-cyber-panel hover:text-cyber-secondary'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-cyber-border">
        <div className="cyber-panel p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse" />
            <span className="text-xs font-mono text-cyber-primary">SYSTEM ONLINE</span>
          </div>
          <p className="text-xs text-gray-500">All engines operational. 100% client-side execution.</p>
        </div>
      </div>
    </aside>
  );
}