import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Layout({ children, cartCount, onLogout, isAdmin }) {
  const location = useLocation();
  const navigate = useNavigate();

  const TABS = [
    { key: "/menu",    label: "Menu",   icon: "🍔", path: "/menu" },
    { key: "/cart",    label: "Cart",   icon: "🛒", path: "/cart" },
    { key: "/orders",  label: "Orders", icon: "📦", path: "/orders" },
    ...(isAdmin ? [{ key: "/admin", label: "Admin", icon: "📊", path: "/admin" }] : []),
  ];

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <span>🍽️</span> CampusCraver
        </div>
        <nav className="header-nav">
          {TABS.map((t) => (
            <Link
              key={t.key}
              to={t.path}
              className={`nav-btn ${location.pathname === t.path ? "active" : ""}`}
              style={{ position: "relative", textDecoration: "none" }}
            >
              {t.icon} <span>{t.label}</span>
              {t.key === "/cart" && cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
          ))}
          <button className="logout-btn" onClick={onLogout}>⬅ Logout</button>
        </nav>
      </header>

      {/* Page Content */}
      {children}

      {/* Footer */}
      <footer className="app-footer">CampusCraver © 2025 by Pushpesh &nbsp;·&nbsp; Powered by React</footer>
    </>
  );
}