export default function Footer() {
  return (
    <footer
      className="w-full px-6 py-4 border-t flex justify-end"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <p className="text-xs" style={{ color: 'var(--muted)' }}>
        &copy; ahjusba 2026
      </p>
    </footer>
  );
}
