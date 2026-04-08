export default function OrdersPage({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">My Orders</h1>
        <div className="no-orders">
          <span>📦</span>
          <p style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>No orders yet</p>
          <p style={{ fontSize: 14 }}>Place your first order from the Menu!</p>
        </div>
      </div>
    );
  }

  const ORDER_STAGES = [
    { label: "Order Placed",      icon: "✅", status: "done"    },
    { label: "Preparing",         icon: "🍳", status: "done"    },
    { label: "Almost Ready",      icon: "⏳", status: "active"  },
    { label: "Ready for Pickup",  icon: "🔔", status: "pending" },
  ];

  function OrderStageTracker({ stages }) {
    return (
      <div className="status-track">
        {stages.map((s, i) => (
          <>
            <div className="stage-wrap" key={s.label}>
              <div className={`stage-icon-wrap ${s.status}`}>{s.icon}</div>
              <div className="stage-label">{s.label}</div>
            </div>
            {i < stages.length - 1 && <div className={`stage-line ${s.status === "done" ? "done" : ""}`} />}
          </>
        ))}
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>
      <p className="page-sub">{orders.length} order{orders.length > 1 ? "s" : ""} placed</p>
      <div className="orders-list">
        {[...orders].reverse().map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <div>
                <div className="order-id">#{order.id}</div>
                <div className="order-time">{order.time}</div>
              </div>
              <span className="order-method-badge">{order.method}</span>
            </div>
            <div className="order-items-row">
              {order.items.map((i) => (
                <span className="order-item-chip" key={i.name}>{i.emoji} {i.name} ×{i.qty}</span>
              ))}
            </div>
            <OrderStageTracker stages={ORDER_STAGES} />
            <div className="order-total" style={{ marginTop: 12 }}>Total: ₹{order.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}