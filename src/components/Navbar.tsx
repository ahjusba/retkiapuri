'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Retkilaskin' },
  { href: '/matkalista', label: 'Matkalista' },
  { href: '/tietoja', label: 'Tietoja' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="w-full px-6 py-4 flex items-center gap-6 border-b"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <span
        className="text-lg font-bold mr-4 tracking-tight"
        style={{ color: 'var(--primary)', fontFamily: 'Lusitana, serif' }}
      >
        🥾 Retkiapuri
      </span>

      {links.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="text-sm font-medium transition-colors pb-0.5"
            style={{
              color: active ? 'var(--primary)' : 'var(--muted)',
              borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
