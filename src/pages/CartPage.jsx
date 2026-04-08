import { useNavigate } from "react-router-dom";

export default function CartPage({ cart, onAdd, onRemove }) {
  const navigate = useNavigate();
  const items = [
    { id: 1,  name: "Pizza",     emoji: "🍕", desc: "Cheesy & delicious",   price: 120 },
    { id: 2,  name: "Burger",    emoji: "🍔", desc: "Hot & crispy",         price: 80  },
    { id: 3,  name: "Sandwich",  emoji: "🥪", desc: "Healthy and tasty",    price: 70  },
    { id: 4,  name: "Pasta",     emoji: "🍝", desc: "Italian delight",      price: 120 },
    { id: 5,  name: "Salad",     emoji: "🥗", desc: "Fresh and crunchy",    price: 50  },
    { id: 6,  name: "Coffee",    emoji: "☕", desc: "Rich & refreshing",    price: 50  },
    { id: 7,  name: "Tea",       emoji: "🍵", desc: "Soothing beverage",    price: 20  },
    { id: 8,  name: "Juice",     emoji: "🥤", desc: "Freshly squeezed",     price: 60  },
    { id: 9,  name: "Ice Cream", emoji: "🍦", desc: "Sweet cold treat",     price: 50  },
    { id: 10, name: "Samosa",    emoji: "🥟", desc: "Crispy & spiced",      price: 30  },
    { id: 11, name: "Fries",     emoji: "🍟", desc: "Golden & crunchy",     price: 60  },
    { id: 12, name: "Brownie",   emoji: "🍫", desc: "Rich chocolate fudge", price: 70  },
  ].filter((i) => cart[i.id]);

  const total = items.reduce((s, i) => s + i.price * (cart[i.id] || 0), 0);
  const itemCount = Object.values(cart).reduce((s, v) => s + v, 0);

  if (items.length === 0) {
    return (
      <div className="page">
        <h1 className="page-title">Your Cart</h1>
        <div className="cart-empty-state">
          <span>🛒</span>
          <p style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Your cart is empty</p>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Go to the Menu tab and add something delicious!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Your Cart</h1>
      <p className="page-sub">{itemCount} item{itemCount > 1 ? "s" : ""} selected</p>

      <div className="cart-wrap">
        <div className="cart-items-list">
          {items.map((item) => {
            const qty = cart[item.id];
            return (
              <div className="cart-item-card" key={item.id}>
                <span className="cart-item-emoji">{item.emoji}</span>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price} each</div>
                </div>
                <div className="cart-item-controls">
                  <button className="cart-qty-btn" onClick={() => onRemove(item.id)}>−</button>
                  <span className="cart-qty-num">{qty}</span>
                  <button className="cart-qty-btn" onClick={() => onAdd(item)}>+</button>
                </div>
                <span className="cart-item-total">₹{item.price * qty}</span>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="summary-title">Order Summary</div>
          {items.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>{item.name} × {cart[item.id]}</span>
              <span>₹{item.price * cart[item.id]}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Convenience fee</span><span>₹0</span>
          </div>
          <div className="summary-total">
            <span>Total</span><span>₹{total}</span>
          </div>
          <button className="pay-btn" onClick={() => navigate("/checkout")}>
            Proceed to Pay ₹{total}
          </button>
        </div>
      </div>
    </div>
  );
}