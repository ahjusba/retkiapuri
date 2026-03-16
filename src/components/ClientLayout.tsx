'use client';

import { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

const LINKS = [
  { href: '/', label: 'Retkilaskin' },
  { href: '/matkalista', label: 'Matkalista' },
  { href: '/tietoja', label: 'Tietoja' },
];

const menuStyles = {
  bmMenuWrap: {
    position: 'fixed' as const,
    height: '100%',
    top: '0',
    right: '0',
  },
  bmMenu: {
    background: '#1a3a14',
    padding: '5rem 1.25rem 2rem',
  },
  bmCrossButton: {
    height: '28px',
    width: '28px',
    top: '14px',
    right: '14px',
  },
  bmCross: {
    background: '#7ab87f',
  },
  bmItemList: {
    color: '#7ab87f',
    padding: '0.5rem 0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  bmItem: {
    outline: 'none',
  },
  bmOverlay: {
    background: 'rgba(0, 15, 0, 0.25)',
  },
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Slide-in menu */}
      <Menu
        right
        isOpen={isOpen}
        onStateChange={(s) => setIsOpen(s.isOpen)}
        customBurgerIcon={false}
        styles={menuStyles}
        width={260}
      >
        {LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              tabIndex={0}
              onClick={() => setIsOpen(false)}
              style={{
                display: 'block',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontFamily: 'Lusitana, serif',
                fontSize: '1.05rem',
                fontWeight: active ? 700 : 400,
                color: active ? '#d4edcc' : '#7ab87f',
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                textDecoration: 'none',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {label}
            </Link>
          );
        })}
      </Menu>

      {/* Page wrapper — blurs when menu is open */}
      <div
        style={{
          filter: isOpen ? 'blur(5px)' : 'none',
          transition: 'filter 0.3s ease',
          pointerEvents: isOpen ? 'none' : 'auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <header
          style={{
            background: 'var(--card)',
            borderBottom: '1px solid var(--border)',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            href="/"
            style={{
              color: 'var(--primary)',
              fontFamily: 'Lusitana, serif',
              fontSize: '1.15rem',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            🥾 Retkiapuri
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Avaa valikko"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.3rem 0.5rem',
              borderRadius: '0.375rem',
              color: 'var(--foreground)',
              fontSize: '1.5rem',
              lineHeight: 1,
            }}
          >
            ☰
          </button>
        </header>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

        <Footer />
      </div>
    </>
  );
}
