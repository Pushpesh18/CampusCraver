import { useState, useCallback, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from "./pages/CheckoutPage";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const now = () => new Date().toLocaleString("en-IN");

const MENU_INITIAL = [
  { id: 1,  name: "Pizza",     emoji: "🍕", desc: "Cheesy & delicious",   price: 120, category: "Food",      tag: "Popular",    available: true },
  { id: 2,  name: "Burger",    emoji: "🍔", desc: "Hot & crispy",         price: 80,  category: "Food",      tag: "Bestseller", available: true },
  { id: 3,  name: "Sandwich",  emoji: "🥪", desc: "Healthy and tasty",    price: 70,  category: "Food",                         available: true },
  { id: 4,  name: "Pasta",     emoji: "🍝", desc: "Italian delight",      price: 120, category: "Food",                         available: true },
  { id: 5,  name: "Salad",     emoji: "🥗", desc: "Fresh and crunchy",    price: 50,  category: "Food",      tag: "Healthy",    available: true },
  { id: 6,  name: "Coffee",    emoji: "☕", desc: "Rich & refreshing",    price: 50,  category: "Beverages", tag: "Popular",    available: true },
  { id: 7,  name: "Tea",       emoji: "🍵", desc: "Soothing beverage",    price: 20,  category: "Beverages",                    available: true },
  { id: 8,  name: "Juice",     emoji: "🥤", desc: "Freshly squeezed",     price: 60,  category: "Beverages",                    available: true },
  { id: 9,  name: "Ice Cream", emoji: "🍦", desc: "Sweet cold treat",     price: 50,  category: "Desserts",  tag: "New",        available: true },
  { id: 10, name: "Samosa",    emoji: "🥟", desc: "Crispy & spiced",      price: 30,  category: "Snacks",    tag: "Popular",    available: true },
  { id: 11, name: "Fries",     emoji: "🍟", desc: "Golden & crunchy",     price: 60,  category: "Snacks",                       available: true },
  { id: 12, name: "Brownie",   emoji: "🍫", desc: "Rich chocolate fudge", price: 70,  category: "Desserts",  tag: "New",        available: true },
];

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --amber:    #E8612C;
  --amber2:   #F4895F;
  --gold:     #FFB347;
  --cream:    #FFF8F0;
  --cream2:   #FFF1E0;
  --brown:    #3D1A00;
  --brown2:   #6B3A20;
  --muted:    #9A7060;
  --success:  #2D9E5F;
  --danger:   #E84343;
  --white:    #FFFFFF;
  --shadow:   0 4px 24px rgba(61,26,0,0.10);
  --shadow-lg:0 10px 40px rgba(61,26,0,0.15);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Outfit', sans-serif; background: var(--cream); color: var(--brown); }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--cream2); }
::-webkit-scrollbar-thumb { background: var(--amber2); border-radius: 4px; }

/* ── Login / Register Page ── */
.login-page {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #3D1A00 0%, #7B3B1A 50%, #E8612C 100%);
  position: relative; overflow: hidden;
}
.login-page::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 60% 40%, rgba(255,179,71,0.18) 0%, transparent 70%);
}
.login-card {
  position: relative;
  width: 460px; max-width: 95vw;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.35);
  text-align: center; color: white;
  max-height: 92vh; overflow-y: auto;
}
.login-card::-webkit-scrollbar { width: 4px; }
.login-card::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
.login-logo { font-size: 48px; margin-bottom: 6px; }
.login-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 800; margin-bottom: 4px; }
.login-sub { color: rgba(255,255,255,0.75); font-size: 14px; margin-bottom: 24px; }

/* Tabs */
.auth-tabs { display: flex; gap: 6px; margin-bottom: 20px; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 4px; }
.auth-tab {
  flex: 1; padding: 10px; border-radius: 10px; border: none;
  cursor: pointer; font-weight: 700; font-size: 14px;
  font-family: 'Outfit', sans-serif; transition: all .2s;
  background: transparent; color: rgba(255,255,255,0.6);
}
.auth-tab.active { background: linear-gradient(135deg, var(--gold), var(--amber)); color: var(--brown); }

/* Step indicator */
.step-indicator { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 20px; }
.step-dot {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; transition: all .3s;
}
.step-dot.done    { background: var(--success); color: white; }
.step-dot.active  { background: linear-gradient(135deg, var(--gold), var(--amber)); color: var(--brown); box-shadow: 0 0 0 4px rgba(255,179,71,0.25); }
.step-dot.pending { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.45); }
.step-line { width: 24px; height: 2px; background: rgba(255,255,255,0.15); border-radius: 1px; }
.step-line.done { background: var(--success); }
.step-label { font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 3px; }

.login-input {
  width: 100%; padding: 12px 16px; margin-bottom: 10px;
  border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.12); color: white;
  font-size: 14px; font-family: 'Outfit', sans-serif; outline: none;
  transition: border-color .2s;
}
.login-input::placeholder { color: rgba(255,255,255,0.5); }
.login-input:focus { border-color: var(--gold); }
.login-input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 0; }
.login-input-row .login-input { margin-bottom: 0; }

.login-btn {
  width: 100%; padding: 13px; margin-top: 10px;
  border-radius: 14px; border: none;
  background: linear-gradient(135deg, var(--gold), var(--amber));
  color: var(--brown); font-size: 15px; font-weight: 700;
  cursor: pointer; transition: transform .15s, box-shadow .15s;
  font-family: 'Outfit', sans-serif; min-height: 48px;
}
.login-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,97,44,0.4); }
.login-btn:active { transform: scale(.98); }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
.login-hint { margin-top: 16px; font-size: 12px; color: rgba(255,255,255,0.45); }

/* Photo upload */
.photo-upload-wrap { display: flex; flex-direction: column; align-items: center; margin-bottom: 16px; }
.photo-circle {
  width: 76px; height: 76px; border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; margin-bottom: 8px; cursor: pointer;
  transition: border-color .2s;
}
.photo-circle:hover { border-color: var(--gold); }
.photo-circle img { width: 100%; height: 100%; object-fit: cover; }
.photo-circle span { font-size: 30px; }
.photo-upload-label {
  font-size: 11px; color: rgba(255,255,255,0.55);
  padding: 4px 14px; border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.2); cursor: pointer;
  transition: all .2s;
}
.photo-upload-label:hover { border-color: var(--gold); color: var(--gold); }

/* OTP input */
.otp-hint { color: rgba(255,255,255,0.65); font-size: 13px; margin-bottom: 14px; line-height: 1.5; }
.otp-input {
  width: 100%; padding: 16px; margin-bottom: 10px;
  border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.12); color: white;
  font-size: 28px; font-family: 'Outfit', sans-serif; outline: none;
  text-align: center; letter-spacing: 10px; font-weight: 700;
  transition: border-color .2s;
}
.otp-input:focus { border-color: var(--gold); }
.resend-btn {
  background: none; border: none; color: rgba(255,255,255,0.5);
  font-size: 12px; cursor: pointer; margin-top: 4px;
  font-family: 'Outfit', sans-serif; text-decoration: underline;
  transition: color .2s;
}
.resend-btn:hover { color: var(--gold); }

/* Error box */
.auth-error {
  background: rgba(232,67,67,0.2); border: 1px solid rgba(232,67,67,0.4);
  border-radius: 10px; padding: 10px 14px; margin-bottom: 12px;
  font-size: 13px; color: #ffaaaa; text-align: left;
}

/* ── Loading ── */
.loading-screen {
  position: fixed; inset: 0; z-index: 999;
  background: var(--cream);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;
}
.spinner {
  width: 52px; height: 52px;
  border: 5px solid rgba(232,97,44,0.15);
  border-top-color: var(--amber);
  border-radius: 50%; animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { color: var(--muted); font-size: 15px; }

/* ── Header ── */
.app-header {
  background: linear-gradient(90deg, var(--brown) 0%, var(--brown2) 100%);
  color: white; padding: 0 24px;
  display: flex; align-items: center; justify-content: space-between;
  height: 64px; position: sticky; top: 0; z-index: 100;
  box-shadow: 0 2px 16px rgba(0,0,0,0.25);
}
.header-brand {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700;
}
.header-nav { display: flex; gap: 4px; }
.nav-btn {
  padding: 7px 14px; border-radius: 10px; border: none; cursor: pointer;
  font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
  background: transparent; color: rgba(255,255,255,0.75);
  transition: background .2s, color .2s; position: relative;
  min-height: 44px; display: flex; align-items: center; justify-content: center;
}
.nav-btn:hover   { background: rgba(255,255,255,0.12); color: white; }
.nav-btn.active  { background: var(--amber); color: white; }
.cart-badge {
  position: absolute; top: 3px; right: 6px;
  background: var(--gold); color: var(--brown);
  font-size: 10px; font-weight: 800;
  width: 17px; height: 17px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.logout-btn {
  padding: 7px 14px; border-radius: 10px; border: none; cursor: pointer;
  background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.75);
  font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
  transition: background .2s; min-height: 44px;
}
.logout-btn:hover { background: rgba(255,80,80,0.3); color: white; }

/* ── Page wrapper ── */
.page { max-width: 1140px; margin: 0 auto; padding: 28px 20px 60px; }
.page-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 800; margin-bottom: 6px; color: var(--brown); }
.page-sub { color: var(--muted); font-size: 14px; margin-bottom: 28px; }

/* ── Search & filters ── */
.menu-controls { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; align-items: center; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-input {
  width: 100%; padding: 11px 16px 11px 40px;
  border-radius: 12px; border: 1.5px solid #EDD5C0;
  background: white; font-size: 14px; font-family: 'Outfit', sans-serif;
  outline: none; transition: border-color .2s; color: var(--brown);
}
.search-input:focus { border-color: var(--amber); }
.search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 16px; }
.cat-btn {
  padding: 9px 18px; border-radius: 20px; border: 1.5px solid #EDD5C0;
  background: white; color: var(--brown2); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .2s; font-family: 'Outfit', sans-serif; min-height: 44px;
}
.cat-btn:hover  { border-color: var(--amber); color: var(--amber); }
.cat-btn.active { background: var(--amber); border-color: var(--amber); color: white; }

/* ── Menu grid ── */
.menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
.menu-card { background: white; border-radius: 18px; overflow: hidden; box-shadow: var(--shadow); transition: transform .2s, box-shadow .2s; display: flex; flex-direction: column; }
.menu-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.card-emoji-wrap { height: 130px; background: linear-gradient(135deg, var(--cream2), #FFE8CC); display: flex; align-items: center; justify-content: center; font-size: 60px; position: relative; }
.card-tag { position: absolute; top: 10px; right: 10px; background: var(--amber); color: white; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }
.card-tag.Healthy    { background: var(--success); }
.card-tag.New        { background: #7B5EA7; }
.card-tag.Bestseller { background: var(--brown2); }
.card-body { padding: 14px 16px; flex: 1; display: flex; flex-direction: column; }
.card-name  { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.card-desc  { color: var(--muted); font-size: 13px; flex: 1; }
.card-price { font-size: 18px; font-weight: 700; color: var(--amber); margin: 8px 0 12px; }
.qty-row  { display: flex; align-items: center; gap: 10px; justify-content: center; }
.qty-btn  { width: 34px; height: 34px; border-radius: 10px; border: none; background: var(--amber); color: white; font-size: 20px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform .1s, background .2s; min-width: 44px; min-height: 44px; }
.qty-btn:hover  { background: var(--amber2); }
.qty-btn:active { transform: scale(.9); }
.qty-num { font-weight: 700; font-size: 16px; min-width: 28px; text-align: center; }

/* ── Empty state ── */
.empty-state { grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--muted); }
.empty-state span { font-size: 52px; display: block; margin-bottom: 12px; }

/* ── Cart ── */
.cart-wrap { display: flex; gap: 24px; align-items: flex-start; }
.cart-items-list { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.cart-item-card { background: white; border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 14px; box-shadow: var(--shadow); }
.cart-item-emoji { font-size: 36px; }
.cart-item-info { flex: 1; }
.cart-item-name  { font-weight: 700; font-size: 16px; }
.cart-item-price { color: var(--muted); font-size: 13px; }
.cart-item-controls { display: flex; align-items: center; gap: 8px; }
.cart-qty-btn { width: 30px; height: 30px; border-radius: 8px; border: none; background: var(--cream2); color: var(--brown); font-size: 17px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s; min-width: 44px; min-height: 44px; }
.cart-qty-btn:hover { background: var(--amber); color: white; }
.cart-qty-num  { font-weight: 700; min-width: 22px; text-align: center; }
.cart-item-total { font-weight: 700; color: var(--amber); font-size: 16px; min-width: 56px; text-align: right; }
.cart-remove { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 18px; transition: color .2s; }
.cart-remove:hover { color: var(--danger); }

.cart-summary { width: 300px; background: white; border-radius: 18px; padding: 22px; box-shadow: var(--shadow); position: sticky; top: 84px; }
.summary-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; margin-bottom: 16px; }
.summary-row   { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: var(--muted); }
.summary-total { display: flex; justify-content: space-between; font-weight: 800; font-size: 18px; border-top: 2px dashed #EDD5C0; padding-top: 12px; margin-top: 4px; }
.pay-btn { width: 100%; padding: 14px; margin-top: 16px; border-radius: 14px; border: none; background: linear-gradient(135deg, var(--success), #1e7a48); color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform .15s, box-shadow .15s; font-family: 'Outfit', sans-serif; min-height: 48px; }
.pay-btn:hover  { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,158,95,0.35); }
.pay-btn:active { transform: scale(.98); }
.pay-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
.cart-empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
.cart-empty-state span { font-size: 56px; display: block; margin-bottom: 16px; }

/* ── Orders ── */
.orders-list { display: flex; flex-direction: column; gap: 20px; }
.order-card   { background: white; border-radius: 18px; padding: 20px 24px; box-shadow: var(--shadow); }
.order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.order-id     { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; }
.order-time   { color: var(--muted); font-size: 12px; }
.order-method-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; background: var(--cream2); color: var(--brown2); }
.order-items-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.order-item-chip { background: var(--cream2); border-radius: 8px; padding: 5px 10px; font-size: 13px; font-weight: 500; }
.order-total { font-weight: 800; font-size: 18px; color: var(--amber); text-align: right; }
.status-track { display: flex; align-items: center; gap: 0; margin-top: 16px; }
.stage-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.stage-icon-wrap { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2.5px solid #EDD5C0; background: white; transition: all .3s; }
.stage-icon-wrap.done   { border-color: var(--success); background: #E6F9EF; }
.stage-icon-wrap.active { border-color: var(--gold); background: #FFF6E0; box-shadow: 0 0 0 4px rgba(255,179,71,0.25); }
.stage-label { font-size: 10px; color: var(--muted); text-align: center; font-weight: 500; margin-top: 2px; }
.stage-line { flex: 1; height: 2px; background: #EDD5C0; margin-bottom: 20px; }
.stage-line.done { background: var(--success); }
.no-orders { text-align: center; padding: 60px; color: var(--muted); }
.no-orders span { font-size: 56px; display: block; margin-bottom: 16px; }

/* ── Admin ── */
.admin-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 28px; }
.stat-card  { background: white; border-radius: 16px; padding: 20px; box-shadow: var(--shadow); text-align: center; }
.stat-icon  { font-size: 32px; margin-bottom: 6px; }
.stat-val   { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 800; color: var(--amber); }
.stat-label { color: var(--muted); font-size: 13px; margin-top: 2px; }
.admin-orders-table { background: white; border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); }
.admin-table-header { display: grid; grid-template-columns: 1fr 2fr 1fr 1fr; padding: 14px 20px; background: var(--brown); color: white; font-size: 13px; font-weight: 700; }
.admin-table-row    { display: grid; grid-template-columns: 1fr 2fr 1fr 1fr; padding: 14px 20px; border-bottom: 1px solid #F5E8DC; font-size: 14px; align-items: center; }
.admin-menu-manager { background: white; border-radius: 16px; padding: 18px; box-shadow: var(--shadow); margin-bottom: 20px; }
.admin-add-menu { display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); align-items: center; margin-bottom: 14px; }
.admin-add-menu input  { padding: 8px 10px; border: 1px solid #E0C7B0; border-radius: 10px; }
.admin-add-menu button { grid-column: span 1; padding: 10px 14px; border-radius: 10px; border: none; background: var(--amber); color: white; cursor: pointer; }
.admin-menu-list { display: flex; flex-direction: column; gap: 10px; }
.admin-menu-row  { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto auto; gap: 8px; align-items: center; background: #FFF8F0; border: 1px solid #F1D8C2; border-radius: 10px; padding: 10px; }
.admin-menu-row button { padding: 6px 8px; border-radius: 8px; border: 1px solid #D9A47A; font-size: 12px; cursor: pointer; }
.admin-menu-row button:nth-child(5) { background: #E3B87C; }
.admin-menu-row button:nth-child(6) { background: #E84343; color: white; border-color: #D93C42; }
.admin-table-row:last-child  { border-bottom: none; }
.admin-table-row:nth-child(even) { background: #FFFAF5; }
.admin-no-orders { text-align: center; padding: 40px; color: var(--muted); }

/* ── Modals / Overlays ── */
.overlay { position: fixed; inset: 0; z-index: 200; background: rgba(61,26,0,0.55); display: flex; align-items: center; justify-content: center; animation: fadeIn .2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-box { background: white; border-radius: 22px; padding: 32px; width: 380px; max-width: 95vw; box-shadow: 0 24px 60px rgba(0,0,0,0.3); animation: slideUp .25s ease; }
@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; margin-bottom: 6px; }
.modal-sub   { color: var(--muted); font-size: 14px; margin-bottom: 20px; }
.pay-method-select { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #EDD5C0; font-size: 15px; font-family: 'Outfit', sans-serif; color: var(--brown); outline: none; cursor: pointer; }
.pay-method-select:focus { border-color: var(--amber); }
.qr-box { margin: 18px 0; text-align: center; background: var(--cream2); border-radius: 14px; padding: 20px; }
.qr-image-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.qr-image { width: min(240px, 100%); max-width: 260px; border: 2px solid var(--brown); border-radius: 12px; }
.qr-placeholder { width: 140px; height: 140px; margin: 0 auto 10px; border: 3px solid var(--brown); border-radius: 12px; display: grid; grid-template-columns: repeat(5,1fr); padding: 10px; gap: 3px; }
.qr-cell { background: var(--brown); border-radius: 2px; }
.qr-cell.empty { background: transparent; }
.qr-hint { font-size: 12px; color: var(--muted); }
.modal-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.modal-pay-btn { padding: 14px; border-radius: 14px; border: none; background: linear-gradient(135deg, var(--amber), var(--amber2)); color: white; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'Outfit', sans-serif; transition: transform .15s; display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; }
.modal-pay-btn:hover { transform: translateY(-2px); }
.modal-cancel-btn { padding: 12px; border-radius: 14px; border: 1.5px solid #EDD5C0; background: white; color: var(--muted); font-size: 15px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; min-height: 48px; }
.modal-cancel-btn:hover { background: var(--cream2); }
.processing-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.75); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: white; }
.processing-spinner { width: 60px; height: 60px; border: 6px solid rgba(255,255,255,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin .8s linear infinite; }
.processing-text { font-size: 18px; font-weight: 600; }
.success-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.65); display: flex; align-items: center; justify-content: center; }
.success-box   { background: white; border-radius: 24px; padding: 40px 36px; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,0.3); animation: slideUp .3s ease; }
.success-icon  { font-size: 64px; display: block; margin-bottom: 16px; animation: pop .5s ease; }
@keyframes pop { 0%{transform:scale(0)} 70%{transform:scale(1.15)} 100%{transform:scale(1)} }
.success-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 800; color: var(--success); margin-bottom: 8px; }
.success-id    { color: var(--muted); font-size: 14px; margin-bottom: 24px; }
.ok-btn { padding: 12px 32px; border-radius: 14px; border: none; background: var(--success); color: white; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'Outfit', sans-serif; min-height: 48px; }

/* receipt */
.receipt-modal-box { background: white; border-radius: 20px; width: 400px; max-width: 95vw; box-shadow: 0 24px 60px rgba(0,0,0,0.3); animation: slideUp .25s ease; max-height: 90vh; overflow-y: auto; }
.receipt-header { background: var(--brown); color: white; padding: 24px 28px; border-radius: 20px 20px 0 0; }
.receipt-title  { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.receipt-meta   { font-size: 12px; color: rgba(255,255,255,0.65); }
.receipt-body   { padding: 20px 28px; }
.receipt-row    { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #EDD5C0; font-size: 14px; }
.receipt-total  { display: flex; justify-content: space-between; padding-top: 14px; font-weight: 800; font-size: 18px; color: var(--amber); }
.receipt-actions   { display: flex; gap: 10px; padding: 16px 28px 24px; }
.receipt-print-btn { flex: 1; padding: 12px; border-radius: 12px; border: none; background: var(--brown); color: white; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Outfit', sans-serif; min-height: 48px; }
.receipt-close-btn { flex: 1; padding: 12px; border-radius: 12px; border: 1.5px solid #EDD5C0; background: white; color: var(--muted); font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; min-height: 48px; }

/* ── Toast ── */
.toast-container { position: fixed; bottom: 28px; right: 28px; z-index: 999; display: flex; flex-direction: column; gap: 10px; }
.toast { background: var(--brown); color: white; padding: 14px 20px; border-radius: 14px; font-size: 14px; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 10px; animation: slideInRight .3s ease; max-width: 300px; }
.toast.success { background: var(--success); }
.toast.error   { background: var(--danger); }
@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* ── Footer ── */
.app-footer { text-align: center; padding: 20px; color: var(--muted); font-size: 13px; border-top: 1px solid #EDD5C0; margin-top: 40px; }

/* ── Print ── */
@media print { body > *:not(.receipt-print-target) { display: none !important; } }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .menu-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
  .cart-summary { width: 280px; }
}
@media (max-width: 768px) {
  .app-header { padding: 0 16px; height: 56px; }
  .header-brand { font-size: 18px; }
  .header-nav { gap: 2px; }
  .nav-btn { padding: 6px 10px; font-size: 13px; }
  .logout-btn { padding: 6px 12px; font-size: 13px; }
  .page { padding: 20px 16px 50px; }
  .menu-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
  .menu-card { border-radius: 16px; }
  .card-emoji-wrap { height: 110px; font-size: 50px; }
  .card-body { padding: 12px 14px; }
  .card-name { font-size: 16px; }
  .card-price { font-size: 16px; }
  .qty-btn { width: 32px; height: 32px; font-size: 18px; }
  .cart-wrap { flex-direction: column; gap: 20px; }
  .cart-summary { width: 100%; position: static; order: -1; }
  .cart-item-card { padding: 12px 14px; flex-wrap: wrap; gap: 12px; }
  .cart-item-controls { order: 2; flex: 1; justify-content: center; }
  .cart-item-total { order: 3; min-width: auto; text-align: center; }
  .modal-box { width: 95vw; max-width: 360px; padding: 24px; }
  .login-card { width: 92vw; padding: 28px 20px; }
  .login-input-row { grid-template-columns: 1fr; }
  .receipt-modal-box { width: 95vw; max-width: 360px; }
  .admin-stats { grid-template-columns: 1fr; }
  .admin-table-header, .admin-table-row { grid-template-columns: 1fr 1fr; font-size: 13px; }
  .admin-table-header > :nth-child(2), .admin-table-row > :nth-child(2) { display: none; }
}
@media (max-width: 480px) {
  .header-nav .nav-btn span { display: none; }
  .header-nav { gap: 1px; }
  .nav-btn { padding: 6px 8px; min-width: 44px; }
  .logout-btn { padding: 6px 10px; }
  .page-title { font-size: 24px; }
  .menu-controls { flex-direction: column; gap: 12px; align-items: stretch; }
  .search-wrap { flex: none; min-width: auto; }
  .cat-btn { flex: 1; padding: 8px 12px; font-size: 12px; }
  .menu-grid { grid-template-columns: 1fr; gap: 12px; }
  .menu-card { max-width: 100%; }
  .card-emoji-wrap { height: 120px; font-size: 55px; }
  .cart-item-card { flex-direction: column; align-items: center; text-align: center; }
  .cart-item-info { text-align: center; }
  .cart-item-controls { order: unset; justify-content: center; margin-top: 8px; }
  .cart-item-total { order: unset; margin-top: 8px; }
  .order-card { padding: 16px 18px; }
  .order-items-row { flex-wrap: wrap; gap: 6px; }
  .order-item-chip { font-size: 12px; padding: 4px 8px; }
  .toast { max-width: 280px; font-size: 13px; padding: 12px 16px; }
  .modal-box { padding: 20px; }
  .modal-title { font-size: 20px; }
  .success-box { padding: 32px 24px; }
  .success-title { font-size: 22px; }
}
`;

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */

function StyleInjector() {
  const [cssInjected, setCssInjected] = useState(false);
  if (!cssInjected) {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    setCssInjected(true);
  }
  return null;
}

function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || ""}`}>
          <span>{t.icon}</span> {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOGIN / REGISTER PAGE
───────────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login");

  // ── Login state ──
  const [lUser, setLUser]   = useState("");
  const [lPass, setLPass]   = useState("");

  // ── Register state ──
  const [step, setStep]             = useState(1);   // 1=details, 2=otp, 3=credentials
  const [fullName, setFullName]     = useState("");
  const [phone, setPhone]           = useState("");
  const [email, setEmail]           = useState("");
  const [college, setCollege]       = useState("");
  const [course, setCourse]         = useState("");
  const [username, setUsername]     = useState("");
  const [password, setPassword]     = useState("");
  const [photo, setPhoto]           = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [otp, setOtp]               = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const clearError = () => setError("");

  const switchTab = (t) => {
    setTab(t);
    setError("");
    setStep(1);
  };

  // Photo picker
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  // ── Login handler ──
  const handleLogin = async () => {
    if (!lUser || !lPass) return setError("Please fill in both fields.");
    clearError();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: lUser, password: lPass }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Invalid credentials");
      localStorage.setItem("token", data.token);
      onLogin(lUser, null, data.role);
    } catch {
      setError("Server error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  // ── Register Step 1: Send OTP ──
  const handleSendOtp = async () => {
    if (!fullName || !phone || !email || !college || !course)
      return setError("Please fill in all fields.");
    if (!/\S+@\S+\.\S+/.test(email))
      return setError("Please enter a valid email address.");
    clearError();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to send OTP");
      setStep(2);
    } catch {
      setError("Server error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  // ── Register Step 2: Verify OTP ──
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) return setError("Enter the 6-digit OTP.");
    clearError();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Invalid OTP");
      setStep(3);
    } catch {
      setError("Server error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  // ── Register Step 3: Complete registration ──
  const handleRegister = async () => {
    if (!username || !password) return setError("Username and password are required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    clearError();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("fullName", fullName);
      formData.append("phone",    phone);
      formData.append("email",    email);
      formData.append("college",  college);
      formData.append("course",   course);
      formData.append("otp",      otp);
      if (photo) formData.append("photo", photo);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Registration failed");
      localStorage.setItem("token", data.token);
      onLogin(username, null, data.role);
    } catch {
      setError("Server error. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["Details", "OTP", "Account"];

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🍽️</div>
        <h1 className="login-title">CampusCraver</h1>
        <p className="login-sub">Your campus canteen, simplified</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => switchTab("login")}>
            Login
          </button>
          <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => switchTab("register")}>
            Register
          </button>
        </div>

        {/* Error */}
        {error && <div className="auth-error">⚠️ {error}</div>}

        {/* ── LOGIN FORM ── */}
        {tab === "login" && (
          <>
            <input
              className="login-input" placeholder="Username"
              value={lUser} onChange={(e) => setLUser(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <input
              className="login-input" placeholder="Password" type="password"
              value={lPass} onChange={(e) => setLPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in…" : "Login →"}
            </button>
            <p className="login-hint">Admin: <b>admin</b> / <b>admin123</b></p>
          </>
        )}

        {/* ── REGISTER FORM ── */}
        {tab === "register" && (
          <>
            {/* Step indicator */}
            <div className="step-indicator">
              {stepLabels.map((label, i) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className={`step-dot ${step > i + 1 ? "done" : step === i + 1 ? "active" : "pending"}`}>
                      {step > i + 1 ? "✓" : i + 1}
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={`step-line ${step > i + 1 ? "done" : ""}`} />
                    )}
                  </div>
                  <span className="step-label">{label}</span>
                </div>
              ))}
            </div>

            {/* ── Step 1: Personal Details ── */}
            {step === 1 && (
              <>
                {/* Photo upload */}
                <div className="photo-upload-wrap">
                  <label htmlFor="photo-input">
                    <div className="photo-circle">
                      {photoPreview
                        ? <img src={photoPreview} alt="preview" />
                        : <span>👤</span>}
                    </div>
                  </label>
                  <label htmlFor="photo-input" className="photo-upload-label">
                    {photo ? "Change Photo" : "Upload Photo"}
                  </label>
                  <input
                    id="photo-input" type="file" accept="image/*"
                    onChange={handlePhotoChange} style={{ display: "none" }}
                  />
                </div>

                <input className="login-input" placeholder="Full Name"
                  value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <input className="login-input" placeholder="Phone Number" type="tel"
                  value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input className="login-input" placeholder="Email Address" type="email"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="login-input-row">
                  <input className="login-input" placeholder="College Name"
                    value={college} onChange={(e) => setCollege(e.target.value)} />
                  <input className="login-input" placeholder="Course (e.g. B.Tech CSE)"
                    value={course} onChange={(e) => setCourse(e.target.value)} />
                </div>

                <button className="login-btn" onClick={handleSendOtp} disabled={loading}>
                  {loading ? "Sending OTP…" : "Send OTP to Email →"}
                </button>
              </>
            )}

            {/* ── Step 2: OTP Verification ── */}
            {step === 2 && (
              <>
                <p className="otp-hint">
                  We sent a 6-digit OTP to<br />
                  <b style={{ color: "var(--gold)" }}>{email}</b>
                </p>
                <input
                  className="otp-input" placeholder="• • • • • •"
                  value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6} inputMode="numeric"
                />
                <button className="login-btn" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? "Verifying…" : "Verify OTP →"}
                </button>
                <button className="resend-btn" onClick={handleSendOtp} disabled={loading}>
                  Resend OTP
                </button>
              </>
            )}

            {/* ── Step 3: Username & Password ── */}
            {step === 3 && (
              <>
                <p className="otp-hint" style={{ color: "rgba(255,255,255,0.8)" }}>
                  ✅ Email verified! Set your login credentials.
                </p>
                <input className="login-input" placeholder="Choose a username"
                  value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="login-input" placeholder="Choose a password (min 6 chars)"
                  type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
                <button className="login-btn" onClick={handleRegister} disabled={loading}>
                  {loading ? "Creating account…" : "Create Account 🎉"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p className="loading-text">Setting up your canteen experience…</p>
    </div>
  );
}

function ProcessingOverlay() {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p className="loading-text">Processing your payment…</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function SmartCanteen() {
  const [phase, setPhase]         = useState("login");
  const [isAdmin, setIsAdmin]     = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [cart, setCart]       = useState({});
  const [orders, setOrders]   = useState([]);
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem("canteenMenu");
    return saved ? JSON.parse(saved) : MENU_INITIAL;
  });

  const [processing, setProcessing]     = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [toasts, setToasts]             = useState([]);

  const navigate = useNavigate();

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("canteenOrders");
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem("canteenOrders", JSON.stringify(orders));
  }, [orders]);

  // Save menu to localStorage
  useEffect(() => {
    localStorage.setItem("canteenMenu", JSON.stringify(menuItems));
  }, [menuItems]);

  // Toast helper
  const addToast = useCallback((msg, icon = "✅", type = "") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, icon, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  // Admin menu management
  const addMenuItem = (item) => {
    setMenuItems((prev) => {
      const nextId = Math.max(0, ...prev.map((i) => i.id)) + 1;
      const newItem = { ...item, id: nextId, available: true };
      addToast(`Added ${item.name} to menu`, item.emoji);
      return [...prev, newItem];
    });
  };

  const toggleMenuAvailability = (id) => {
    setMenuItems((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, available: !i.available } : i);
      const item = prev.find((i) => i.id === id);
      if (item) addToast(`${item.name} is now ${item.available ? "unavailable" : "available"}`, item.emoji);
      return updated;
    });
  };

  const removeMenuItem = (id) => {
    const item = menuItems.find((i) => i.id === id);
    if (item) addToast(`${item.name} removed from menu`, item.emoji);
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
  };

  /* ── Login / Register handler ── */
  const handleLogin = async (usernameOrEmail, pass, roleOverride = null) => {
    // Called from register flow — token already saved, role passed directly
    if (roleOverride !== null) {
      setUserEmail(usernameOrEmail);
      setIsAdmin(roleOverride === "admin");
      setPhase("loading");
      setTimeout(() => setPhase("app"), 1400);
      return;
    }
    // Normal login flow
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameOrEmail, password: pass }),
      });
      if (!res.ok) { alert("Invalid credentials"); return; }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setUserEmail(usernameOrEmail);
      setIsAdmin(data.role === "admin");
      setPhase("loading");
      setTimeout(() => setPhase("app"), 1400);
    } catch {
      alert("Server error, try again");
    }
  };

  const handleLogout = () => {
    setPhase("login");
    setCart({});
    setOrders([]);
    setIsAdmin(false);
    setUserEmail("");
    localStorage.removeItem("canteenOrders");
    localStorage.removeItem("token");
  };

  /* Cart */
  const addToCart = (item) => {
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    addToast(`${item.name} added to cart`, item.emoji);
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const qty = (prev[id] || 0) - 1;
      if (qty <= 0) { const { [id]: _, ...rest } = prev; return rest; }
      return { ...prev, [id]: qty };
    });
  };

  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

  /* Payment */
  const handlePay = async (method) => {
    setProcessing(true);
    try {
      const items = menuItems
        .filter((i) => i.available && cart[i.id])
        .map((i) => ({ name: i.name, emoji: i.emoji, qty: cart[i.id], price: i.price }));
      const total = items.reduce((s, i) => s + i.price * i.qty, 0);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ method, items, total }),
      });

      const newOrder = await res.json();
      setOrders((prev) => [...prev, newOrder]);
      setSuccessOrder(newOrder);
      setCart({});
    } catch {
      alert("Order failed, try again");
    } finally {
      setProcessing(false);
    }
  };

  /* Render */
  if (phase === "login")   return <><StyleInjector /><LoginPage onLogin={handleLogin} /></>;
  if (phase === "loading") return <><StyleInjector /><LoadingScreen /></>;

  return (
    <>
      <StyleInjector />

      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/menu" element={
          <Layout cartCount={cartCount} onLogout={handleLogout} isAdmin={isAdmin}>
            <MenuPage menuItems={menuItems} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
          </Layout>
        } />
        <Route path="/cart" element={
          <Layout cartCount={cartCount} onLogout={handleLogout} isAdmin={isAdmin}>
            <CartPage cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
          </Layout>
        } />
        <Route path="/checkout" element={
          <Layout cartCount={cartCount} onLogout={handleLogout} isAdmin={isAdmin}>
            <CheckoutPage cart={cart} onPay={handlePay} />
          </Layout>
        } />
        <Route path="/orders" element={
          <Layout cartCount={cartCount} onLogout={handleLogout} isAdmin={isAdmin}>
            <OrdersPage orders={orders} />
          </Layout>
        } />
        <Route path="/admin" element={
          <Layout cartCount={cartCount} onLogout={handleLogout} isAdmin={isAdmin}>
            {isAdmin ? (
              <AdminPage
                orders={orders}
                isAdmin={isAdmin}
                menuItems={menuItems}
                onAddItem={addMenuItem}
                onToggleAvailability={toggleMenuAvailability}
                onRemoveItem={removeMenuItem}
              />
            ) : (
              <Navigate to="/menu" replace />
            )}
          </Layout>
        } />
      </Routes>

      {/* Overlays */}
      {processing && <ProcessingOverlay />}
      {successOrder && (
        <div className="success-overlay">
          <div className="success-box">
            <span className="success-icon">✅</span>
            <div className="success-title">Payment Successful!</div>
            <div className="success-id">
              Order #{successOrder.id} placed · ₹{successOrder.total} paid via {successOrder.method}
            </div>
            <button className="ok-btn" onClick={() => { setSuccessOrder(null); navigate("/orders"); }}>
              View My Orders
            </button>
          </div>
        </div>
      )}

      {/* Toasts */}
      <Toast toasts={toasts} />
    </>
  );
}