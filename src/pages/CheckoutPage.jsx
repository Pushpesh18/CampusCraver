import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MY_QR_CODE_URL = "/payment.jpeg"; // replace with your actual QR code image URL or keep it null to show placeholder

function QRCodeDisplay({ total }) {
  const [imageError, setImageError] = useState(false);

  if (!MY_QR_CODE_URL || imageError) {
    const pattern = [1,0,1,1,0, 0,1,0,0,1, 1,0,1,0,1, 0,1,1,0,0, 1,0,0,1,1];
    return (
      <div className="qr-placeholder">
        {pattern.map((v, i) => <div key={i} className={`qr-cell ${v ? "" : "empty"}`} />)}
      </div>
    );
  }

  return (
    <div className="qr-image-wrap">
      <img
        src={MY_QR_CODE_URL}
        alt="CampusCrave UPI QR code"
        className="qr-image"
        onError={() => setImageError(true)}
      />
      <p className="qr-hint">Scan this code with UPI app to pay ₹{total}</p>
      <small style={{ color: "var(--muted)", marginTop: 8, display: "block" }}>UPI ID: 8958549923@ptyes</small>
    </div>
  );
}

export default function CheckoutPage({ cart, onPay }) {
  const navigate = useNavigate();
  const [method, setMethod] = useState("UPI");

  const items = [
    { id: 1,  name: "Pizza",     emoji: "🍕", price: 120 },
    { id: 2,  name: "Burger",    emoji: "🍔", price: 80  },
    { id: 3,  name: "Sandwich",  emoji: "🥪", price: 70  },
    { id: 4,  name: "Pasta",     emoji: "🍝", price: 120 },
    { id: 5,  name: "Salad",     emoji: "🥗", price: 50  },
    { id: 6,  name: "Coffee",    emoji: "☕", price: 50  },
    { id: 7,  name: "Tea",       emoji: "🍵", price: 20  },
    { id: 8,  name: "Juice",     emoji: "🥤", price: 60  },
    { id: 9,  name: "Ice Cream", emoji: "🍦", price: 50  },
    { id: 10, name: "Samosa",    emoji: "🥟", price: 30  },
    { id: 11, name: "Fries",     emoji: "🍟", price: 60  },
    { id: 12, name: "Brownie",   emoji: "🍫", price: 70  },
  ].filter((i) => cart[i.id]);

  const total = items.reduce((s, i) => s + i.price * (cart[i.id] || 0), 0);

  const handlePay = () => {
    onPay(method);
  };

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>
      <p className="page-sub">Complete your order</p>

      <div className="cart-wrap">
        <div className="cart-items-list">
          <h3 style={{ marginBottom: 16, color: "var(--brown)" }}>Order Summary</h3>
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
                  <span className="cart-qty-num">×{qty}</span>
                </div>
                <span className="cart-item-total">₹{item.price * qty}</span>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="summary-title">Payment Details</div>
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

          <label style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6, display: "block" }}>Choose payment method</label>
          <select className="pay-method-select" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="UPI">UPI / QR Code (Recommended)</option>
            <option value="Cash">Cash on Pickup</option>
            <option value="Card">Card (Mock)</option>
          </select>

          {method === "UPI" && (
            <div className="qr-box">
              <QRCodeDisplay total={total} />
            </div>
          )}
          {method === "Cash" && (
            <div className="qr-box" style={{ textAlign: "center" }}>
              <span style={{ fontSize: 40 }}>💵</span>
              <p style={{ marginTop: 10, fontSize: 14, color: "var(--muted)" }}>Pay ₹{total} at the counter when your order is ready.</p>
            </div>
          )}
          {method === "Card" && (
            <div className="qr-box" style={{ textAlign: "center" }}>
              <span style={{ fontSize: 40 }}>💳</span>
              <p style={{ marginTop: 10, fontSize: 14, color: "var(--muted)" }}>Card payment will be processed at pickup.</p>
            </div>
          )}

          <button className="pay-btn" onClick={handlePay}>
            Confirm & Pay ₹{total}
          </button>
        </div>
      </div>
    </div>
  );
}