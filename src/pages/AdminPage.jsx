import { useState } from "react";

export default function AdminPage({ orders, isAdmin, menuItems, onAddItem, onToggleAvailability, onRemoveItem }) {
  const [newItem, setNewItem] = useState({ name: "", emoji: "", desc: "", price: "", category: "Food", tag: "", available: true });

  if (!isAdmin) {
    return (
      <div className="page">
        <h1 className="page-title">Admin Panel</h1>
        <div className="no-orders">
          <span>🔒</span>
          <p style={{ fontWeight: 600, fontSize: 18 }}>Access Denied</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>Login as <b>admin / admin123</b> to view this panel.</p>
        </div>
      </div>
    );
  }

  const totalRevenue  = orders.reduce((s, o) => s + o.total, 0);
  const totalItems    = orders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0);
  const methodCounts  = orders.reduce((acc, o) => { acc[o.method] = (acc[o.method] || 0) + 1; return acc; }, {});
  const topMethod     = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  return (
    <div className="page">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-sub">Live overview of canteen orders</p>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-val">{orders.length}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-val">₹{totalRevenue}</div>
          <div className="stat-label">Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-val">{totalItems}</div>
          <div className="stat-label">Items Sold</div>
        </div>
      </div>

      <div className="admin-menu-manager">
        <h2 style={{ marginTop: 24 }}>Menu Management</h2>
        <div className="admin-add-menu">
          <input type="text" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} />
          <input type="text" placeholder="Emoji" value={newItem.emoji} onChange={(e) => setNewItem((p) => ({ ...p, emoji: e.target.value }))} />
          <input type="text" placeholder="Description" value={newItem.desc} onChange={(e) => setNewItem((p) => ({ ...p, desc: e.target.value }))} />
          <input type="number" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem((p) => ({ ...p, price: Number(e.target.value) }))} />
          <input type="text" placeholder="Category" value={newItem.category} onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))} />
          <input type="text" placeholder="Tag" value={newItem.tag} onChange={(e) => setNewItem((p) => ({ ...p, tag: e.target.value }))} />
          <button onClick={() => {
            if (!newItem.name || !newItem.price || !newItem.emoji) return;
            onAddItem(newItem);
            setNewItem({ name: "", emoji: "", desc: "", price: "", category: "Food", tag: "", available: true });
          }}>Add Menu Item</button>
        </div>

        <div className="admin-menu-list">
          {menuItems.map((item) => (
            <div className="admin-menu-row" key={item.id}>
              <span>{item.emoji} {item.name}</span>
              <span>₹{item.price}</span>
              <span>{item.category}</span>
              <span>{item.available ? "Available" : "Unavailable"}</span>
              <button onClick={() => onToggleAvailability(item.id)}>{item.available ? "Mark Unavailable" : "Mark Available"}</button>
              <button onClick={() => onRemoveItem(item.id)}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="admin-no-orders">No orders yet — waiting for first customer!</div>
      ) : (
        <div className="admin-orders-table">
          <div className="admin-table-header">
            <span>Order ID</span>
            <span>Items</span>
            <span>Method</span>
            <span>Total</span>
          </div>
          {[...orders].reverse().map((order) => (
            <div className="admin-table-row" key={order.id}>
              <span style={{ fontWeight: 700, color: "var(--amber)" }}>#{order.id}</span>
              <span style={{ color: "var(--muted)", fontSize: 13 }}>
                {order.items.map((i) => `${i.name}×${i.qty}`).join(", ")}
              </span>
              <span>
                <span className="order-method-badge">{order.method}</span>
              </span>
              <span style={{ fontWeight: 700 }}>₹{order.total}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}