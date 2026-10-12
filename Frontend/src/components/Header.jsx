import { NavLink } from "react-router-dom";

const links = [
  { to: "/search", label: "Search", icon: "⌕" },
  { to: "/files", label: "All documents", icon: "▤" },
  { to: "/upload", label: "Upload files", icon: "↑" },
];

export default function Header() {
  return (
    <aside className="app-sidebar">
      <NavLink to="/search" className="brand-lockup">
        <span className="brand-mark">K</span>
        <span className="brand-copy"><strong>KnowSpace</strong><small>DOCUMENT WORKSPACE</small></span>
      </NavLink>
      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            <span className="nav-icon" aria-hidden="true">{link.icon}</span>
            <span>{link.label}</span>
            {link.to === "/upload" && <span className="nav-plus">+</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip-icon">✦</div>
        <strong>Find knowledge faster</strong>
        <p>Keep your team's documents in one searchable place.</p>
        <span className="sidebar-version">INTERNAL DOCUMENT SEARCH</span>
      </div>
    </aside>
  );
}
