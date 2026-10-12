import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { useEffect, useState } from "react";

export default function MainComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get("q") || "");

  useEffect(() => {
    setQuery(new URLSearchParams(location.search).get("q") || "");
  }, [location.pathname, location.search]);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  const pageTitle = location.pathname.startsWith("/upload") ? "Upload files" : location.pathname.startsWith("/files") ? "Your documents" : "Document search";

  return (
    <div className="app-shell">
      <Header />
      <div className="app-main-column">
        <header className="topbar">
          <div className="topbar-heading">
            <span className="eyebrow">YOUR WORKSPACE</span>
            <h1>{pageTitle}</h1>
          </div>
          <form className="global-search" onSubmit={handleSearch} role="search">
            <span className="search-glyph" aria-hidden="true">⌕</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search all documents" placeholder="Search documents, keywords, tags…" />
            <kbd>↵</kbd>
            <button type="submit">Search</button>
          </form>
        </header>
        <main className="page-content"><Outlet /></main>
        <footer className="app-footer"><span>KnowSpace <span className="footer-dot">•</span> Internal document search</span><span>Built for faster knowledge discovery</span></footer>
      </div>
    </div>
  );
}
