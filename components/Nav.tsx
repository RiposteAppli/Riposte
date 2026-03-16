import Link from "next/link"

const items = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/leaderboard", icon: "🏆", label: "Leaderboard" },
  { href: "/settings", icon: "⚙️", label: "Settings" },
  { href: "/reports", icon: "🚩", label: "Reports" },
]

export default function Nav() {
  return (
    <aside className="left-column">
      <div className="nav-brand">
        <div className="nav-logo">R</div>
        <span>Riposte</span>
      </div>

      <nav className="nav-list">
        {items.map((item, index) => (
          <Link
            key={`${item.href}-${index}`}
            href={item.href}
            className={`nav-item ${index === 0 ? "nav-item-active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="nav-cta">
        <Link href="/" className="nav-button" style={{ display: "block", textAlign: "center" }}>
          <span>Enter Arena</span>
        </Link>
      </div>

      <div className="nav-user">
        <div className="avatar">N</div>
        <div className="user-meta">
          <div className="user-name">名無しのRiposter</div>
          <div className="user-handle">@anon</div>
        </div>
      </div>
    </aside>
  )
}