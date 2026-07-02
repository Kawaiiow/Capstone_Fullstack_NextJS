const navItems = [
  { label: 'dashboard', href: '/dashboard' },
  { label: 'rooms', href: '/rooms' },
  { label: 'my bookings', href: '/bookings' },
  { label: 'notifications', href: '/notifications' },
]

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted text-navy flex flex-col justify-between p-6">
        <div>
          <h2 className="text-xl font-sans font-bold mb-10">U U BOR</h2>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-navy hover:bg-border/60 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <a href="/settings" className="text-navy/60 text-sm">settings</a>
      </aside>

      <main className="flex-1 bg-white">{children}</main>
    </div>
  )
}