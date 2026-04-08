import { useState } from "react";

const CATEGORIES = ["All", "Food", "Beverages", "Snacks", "Desserts"];

export default function MenuPage({ menuItems, cart, onAdd, onRemove }) {
  const [search, setSearch]   = useState("");
  const [cat, setCat]         = useState("All");

  const filtered = menuItems.filter((item) => {
    if (!item.available) return false;
    const matchCat  = cat === "All" || item.category === cat;
    const matchSrch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrch;
  });

  return (
    <div className="page">
      <h1 className="page-title">Today's Menu</h1>
      <p className="page-sub">{menuItems.filter((item) => item.available).length} items available · Fast & Fresh</p>

      <div className="menu-controls">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search food…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {CATEGORIES.map((c) => (
          <button key={c} className={`cat-btn ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span>🔍</span>
            <p>No items found for "<b>{search}</b>"</p>
          </div>
        ) : (
          filtered.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div className="menu-card" key={item.id}>
                <div className="card-emoji-wrap">
                  {item.emoji}
                  {item.tag && <div className={`card-tag ${item.tag}`}>{item.tag}</div>}
                </div>
                <div className="card-body">
                  <div className="card-name">{item.name}</div>
                  <div className="card-desc">{item.desc}</div>
                  <div className="card-price">₹{item.price}</div>
                  <div className="qty-row">
                    <button className="qty-btn" onClick={() => onRemove(item.id)} disabled={qty === 0} style={{ opacity: qty === 0 ? 0.35 : 1 }}>−</button>
                    <span className="qty-num">{qty}</span>
                    <button className="qty-btn" onClick={() => onAdd(item)}>+</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}