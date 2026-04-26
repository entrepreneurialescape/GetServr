import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";

/* ═══════════════════════════════════════════════════════════════
   RESTAURANT AI OS  — Complete All-in-One Platform
   Modules: AI Agent · Orders · Kitchen · CRM · Analytics · Settings
   Built with Claude AI + Recharts + React
═══════════════════════════════════════════════════════════════ */

// ── Google Fonts ──────────────────────────────────────────────
const FontLink = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
);

// ── Design Tokens ─────────────────────────────────────────────
const T = {
  bg: "#0a0b0d",
  surface: "#111316",
  card: "#16181d",
  border: "rgba(255,255,255,0.07)",
  accent: "#FF5C28",
  accent2: "#FFB547",
  accent3: "#3ECFCF",
  green: "#2EE085",
  red: "#FF4560",
  text: "#F0F0F0",
  muted: "#666",
  dim: "#999",
};

const PIE_COLORS = ["#FF5C28", "#FFB547", "#3ECFCF", "#2EE085", "#A78BFA", "#F472B6"];

// ── Shared CSS ─────────────────────────────────────────────────
const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${T.bg};font-family:'DM Sans',sans-serif;color:${T.text};overflow-x:hidden;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:#333;border-radius:4px;}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
  @keyframes slideIn{from{transform:translateY(12px);opacity:0;}to{transform:translateY(0);opacity:1;}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes ping{0%{transform:scale(1);opacity:1;}100%{transform:scale(2);opacity:0;}}
  .slide-in{animation:slideIn .35s ease forwards;}
  .pulse-dot{animation:pulse 1.5s infinite;}
`;

// ═══════════════════════════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════════════════════════
const MENU_ITEMS = [
  { id: 1, name: "Signature Smash Burger", price: 14.99, cat: "Mains", emoji: "🍔", popular: true, cost: 4.5, upsells: [4, 6, 7] },
  { id: 2, name: "Truffle Margherita", price: 18.99, cat: "Mains", emoji: "🍕", popular: true, cost: 5.2, upsells: [5, 6, 8] },
  { id: 3, name: "Crispy Caesar Salad", price: 11.99, cat: "Starters", emoji: "🥗", popular: false, cost: 2.8, upsells: [1, 2] },
  { id: 4, name: "Loaded Truffle Fries", price: 8.99, cat: "Sides", emoji: "🍟", popular: true, cost: 1.9, upsells: [6, 7] },
  { id: 5, name: "Rosemary Garlic Bread", price: 5.99, cat: "Sides", emoji: "🥖", popular: false, cost: 1.1, upsells: [6] },
  { id: 6, name: "House Craft Lemonade", price: 4.99, cat: "Drinks", emoji: "🍋", popular: true, cost: 0.8, upsells: [] },
  { id: 7, name: "Chocolate Lava Cake", price: 9.99, cat: "Desserts", emoji: "🍫", popular: true, cost: 2.2, upsells: [] },
  { id: 8, name: "Atlantic Grilled Salmon", price: 24.99, cat: "Mains", emoji: "🐟", popular: false, cost: 8.5, upsells: [3, 6] },
  { id: 9, name: "Buffalo Wings", price: 13.99, cat: "Starters", emoji: "🍗", popular: true, cost: 3.8, upsells: [4, 6] },
  { id: 10, name: "Mango Cheesecake", price: 8.49, cat: "Desserts", emoji: "🥭", popular: false, cost: 2.0, upsells: [] },
];

const INITIAL_ORDERS = [
  { id: "ORD-001", table: 3, items: [{ ...MENU_ITEMS[0], qty: 2 }, { ...MENU_ITEMS[5], qty: 2 }], status: "preparing", time: "12:34", total: 39.96, customer: "Walk-in", channel: "dine-in", note: "" },
  { id: "ORD-002", table: 7, items: [{ ...MENU_ITEMS[1], qty: 1 }, { ...MENU_ITEMS[3], qty: 1 }], status: "ready", time: "12:28", total: 27.98, customer: "Maria S.", channel: "dine-in", note: "No onions" },
  { id: "ORD-003", table: 1, items: [{ ...MENU_ITEMS[7], qty: 1 }, { ...MENU_ITEMS[2], qty: 1 }], status: "delivered", time: "12:15", total: 36.98, customer: "James T.", channel: "dine-in", note: "" },
  { id: "ORD-004", table: 0, items: [{ ...MENU_ITEMS[4], qty: 3 }], status: "new", time: "12:41", total: 17.97, customer: "Phone Order", channel: "phone", note: "Extra sauce" },
  { id: "ORD-005", table: 0, items: [{ ...MENU_ITEMS[8], qty: 2 }, { ...MENU_ITEMS[6], qty: 2 }], status: "preparing", time: "12:38", total: 47.96, customer: "Online #82", channel: "online", note: "" },
];

const INITIAL_CUSTOMERS = [
  { id: "C001", name: "Maria Santos", phone: "555-0101", email: "maria@email.com", visits: 12, spent: 487.50, lastVisit: "2 days ago", tags: ["VIP", "Regular"], notes: "Allergic to nuts" },
  { id: "C002", name: "James Thompson", phone: "555-0182", email: "james@email.com", visits: 7, spent: 312.00, lastVisit: "1 week ago", tags: ["Regular"], notes: "Prefers window seat" },
  { id: "C003", name: "Aisha Patel", phone: "555-0234", email: "aisha@email.com", visits: 3, spent: 98.00, lastVisit: "3 weeks ago", tags: ["New"], notes: "" },
  { id: "C004", name: "Carlos Rivera", phone: "555-0319", email: "carlos@email.com", visits: 21, spent: 890.75, lastVisit: "Yesterday", tags: ["VIP", "Top Spender"], notes: "Birthday in June" },
  { id: "C005", name: "Sophie Chen", phone: "555-0401", email: "sophie@email.com", visits: 5, spent: 201.25, lastVisit: "4 days ago", tags: ["Regular"], notes: "Vegetarian" },
];

const CALLS_LOG = [
  { id: 1, time: "12:41", caller: "Unknown", duration: "2:14", status: "completed", outcome: "Order placed $17.97", upsell: true },
  { id: 2, time: "12:09", caller: "Maria Santos", duration: "1:33", status: "completed", outcome: "Reservation: Sat 7pm, 4 guests", upsell: false },
  { id: 3, time: "11:52", caller: "Unknown", duration: "0:48", status: "completed", outcome: "Menu inquiry — no order", upsell: false },
  { id: 4, time: "11:30", caller: "Carlos Rivera", duration: "3:05", status: "completed", outcome: "Order placed $52.45 — upsold dessert", upsell: true },
];

const WEEKLY_REVENUE = [
  { day: "Mon", revenue: 1820, orders: 28 }, { day: "Tue", revenue: 2140, orders: 34 },
  { day: "Wed", revenue: 1950, orders: 31 }, { day: "Thu", revenue: 2680, orders: 42 },
  { day: "Fri", revenue: 3920, orders: 61 }, { day: "Sat", revenue: 4210, orders: 67 },
  { day: "Sun", revenue: 2847, orders: 47 },
];

const CATEGORY_DATA = [
  { name: "Mains", value: 48 }, { name: "Sides", value: 22 }, { name: "Drinks", value: 15 },
  { name: "Starters", value: 10 }, { name: "Desserts", value: 5 },
];

const CHANNEL_DATA = [
  { name: "Dine-in", value: 54 }, { name: "Online", value: 29 }, { name: "Phone", value: 17 },
];

const HOURLY_DATA = [
  { h: "11am", orders: 4 }, { h: "12pm", orders: 14 }, { h: "1pm", orders: 18 }, { h: "2pm", orders: 9 },
  { h: "3pm", orders: 5 }, { h: "4pm", orders: 6 }, { h: "5pm", orders: 11 }, { h: "6pm", orders: 20 },
  { h: "7pm", orders: 24 }, { h: "8pm", orders: 19 }, { h: "9pm", orders: 10 },
];

// ═══════════════════════════════════════════════════════════════
// AI ENGINE (Claude API)
// ═══════════════════════════════════════════════════════════════
const ARIA_SYSTEM = `You are ARIA (AI Restaurant Intelligence Assistant) — a professional, warm AI agent for a restaurant management platform.

You handle:

1. CUSTOMER ORDERS — Take orders, suggest combos, upsell naturally. Menu:
${MENU_ITEMS.map(m => `  • ${m.name} $${m.price} [${m.cat}]`).join("\n")}
Always suggest complementary items (e.g., fries + drink with burgers). Confirm orders with a summary and total.

2. RESERVATIONS — Ask: name, party size, date, time, special requests.

3. BUSINESS INSIGHTS — Today: $2,847 revenue, 47 orders, 73% upsell rate, 4.8★ satisfaction, 12 calls handled.

4. STAFF HELP — Answer menu questions, allergy info, specials, kitchen status.

5. UPSELLING SCRIPTS — You proactively mention: "Would you like to add our Loaded Truffle Fries? They pair perfectly!" or "Our Chocolate Lava Cake is fresh out of the oven — can I add one?"

Rules: Be concise. Use emojis occasionally. Never make up prices. Always confirm orders. If uncertain, ask for clarification.`;

async function askARIA(messages) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1000,
        system: ARIA_SYSTEM,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("") || "Connection error — please retry.";
  } catch {
    return "⚠️ Network error. Please check your connection.";
  }
}

// ═══════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════
const Card = ({ children, style = {}, className = "" }) => (
  <div className={className} style={{
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius: 16, padding: 20, ...style,
  }}>{children}</div>
);

const Badge = ({ label, color = T.accent }) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600,
    letterSpacing: 0.5, textTransform: "uppercase",
  }}>{label}</span>
);

const Btn = ({ children, onClick, variant = "primary", style = {}, disabled = false }) => {
  const styles = {
    primary: { background: T.accent, color: "#fff" },
    secondary: { background: "rgba(255,255,255,0.06)", color: T.text, border: `1px solid ${T.border}` },
    success: { background: T.green, color: "#0a0b0d" },
    ghost: { background: "transparent", color: T.dim, border: `1px solid ${T.border}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant], borderRadius: 10, padding: "8px 18px",
      fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      border: "none", transition: "all .2s", opacity: disabled ? 0.5 : 1,
      ...style,
    }}>{children}</button>
  );
};

const Input = ({ value, onChange, placeholder, style = {}, multiline = false }) => {
  const shared = {
    background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`,
    borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 13,
    outline: "none", width: "100%", fontFamily: "'DM Sans', sans-serif", ...style,
  };
  return multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      rows={3} style={{ ...shared, resize: "vertical" }} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={shared} />;
};

const StatCard = ({ icon, label, value, sub, color = T.accent, trend }) => (
  <Card style={{ flex: 1, minWidth: 150 }}>
    <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>{value}</div>
    <div style={{ color: T.text, fontWeight: 600, fontSize: 13, marginTop: 3 }}>{label}</div>
    {sub && <div style={{ color: T.muted, fontSize: 11, marginTop: 4 }}>{sub}</div>}
    {trend && <div style={{ color: T.green, fontSize: 11, marginTop: 4 }}>↑ {trend}</div>}
  </Card>
);

// ═══════════════════════════════════════════════════════════════
// MODULE: AI AGENT
// ═══════════════════════════════════════════════════════════════
function ModuleAIAgent() {
  const [mode, setMode] = useState("customer"); // customer | owner | staff
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const bottomRef = useRef(null);
  const timerRef = useRef(null);

  const MODES = {
    customer: { label: "Customer Portal", color: T.accent, greeting: "👋 Hi! I'm ARIA, your AI dining assistant. I can take your order, book a table, or answer any questions. How can I help?" },
    owner: { label: "Owner Assistant", color: T.accent2, greeting: "📊 Good day! I'm ARIA, your business intelligence assistant. Ask me about revenue, orders, customer trends, or operational insights." },
    staff: { label: "Staff Helper", color: T.accent3, greeting: "🍽️ Hey! I'm ARIA, your on-shift assistant. Need help with the menu, allergens, specials, or order questions?" },
  };

  useEffect(() => {
    setMessages([{ role: "assistant", content: MODES[mode].greeting }]);
  }, [mode]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => setCallTime(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setCallTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [callActive]);

  const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const send = useCallback(async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const userMsg = { role: "user", content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    const reply = await askARIA(updated);
    setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  }, [input, messages, loading]);

  const QUICK = {
    customer: ["What's on the menu?", "Book a table for 4", "Order a Signature Burger + Fries", "What are today's specials?"],
    owner: ["Today's revenue summary", "Which items sell most?", "Upsell rate this week", "Top customers by spend"],
    staff: ["What's gluten-free?", "Current wait time?", "What's the special today?", "Is the salmon fresh?"],
  };

  return (
    <div style={{ display: "flex", gap: 20, height: "calc(100vh - 120px)" }}>
      {/* Left — Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Mode selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {Object.entries(MODES).map(([k, v]) => (
            <button key={k} onClick={() => setMode(k)} style={{
              background: mode === k ? v.color : "rgba(255,255,255,0.04)",
              color: mode === k ? "#fff" : T.dim, border: `1px solid ${mode === k ? v.color : T.border}`,
              borderRadius: 10, padding: "7px 16px", fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all .2s",
            }}>{v.label}</button>
          ))}
        </div>

        {/* Chat window */}
        <Card style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} className="slide-in" style={{
              display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}>
              {m.role === "assistant" && (
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: MODES[mode].color,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                  marginRight: 10, flexShrink: 0, marginTop: 4
                }}>🤖</div>
              )}
              <div style={{
                background: m.role === "user" ? T.accent : "rgba(255,255,255,0.06)",
                color: T.text, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "11px 16px", fontSize: 13, lineHeight: 1.6, maxWidth: "75%",
                whiteSpace: "pre-wrap",
              }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: MODES[mode].color,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
              }}>🤖</div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "18px 18px 18px 4px", padding: "11px 16px" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%", background: T.muted,
                    animation: `pulse 1.2s ${i * 0.2}s infinite`,
                  }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </Card>

        {/* Quick replies */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
          {QUICK[mode].map((q, i) => (
            <button key={i} onClick={() => send(q)} style={{
              background: "rgba(255,255,255,0.04)", color: T.dim, border: `1px solid ${T.border}`,
              borderRadius: 20, padding: "5px 13px", fontSize: 11, cursor: "pointer",
            }}>{q}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message or question..." style={{
              flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`,
              borderRadius: 12, padding: "12px 16px", color: T.text, fontSize: 13,
              outline: "none", fontFamily: "'DM Sans',sans-serif",
            }} />
          <Btn onClick={() => send()} disabled={loading} style={{ padding: "12px 20px" }}>Send ↑</Btn>
        </div>
      </div>

      {/* Right — Call Simulator + Stats */}
      <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* AI Call Agent */}
        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>📞 AI Call Agent</div>
          <div style={{
            background: callActive ? "rgba(46,224,133,0.1)" : "rgba(255,92,40,0.1)",
            border: `1px solid ${callActive ? T.green : T.accent}44`,
            borderRadius: 12, padding: 16, textAlign: "center", marginBottom: 14,
          }}>
            {callActive ? (
              <>
                <div style={{ color: T.green, fontWeight: 700, fontSize: 13 }}>● LIVE CALL</div>
                <div style={{
                  fontSize: 28, fontWeight: 800, fontFamily: "'Syne',sans-serif",
                  color: T.green, margin: "8px 0"
                }}>{fmtTime(callTime)}</div>
                <div style={{ color: T.muted, fontSize: 11 }}>ARIA handling automatically</div>
              </>
            ) : (
              <>
                <div style={{ color: T.muted, fontSize: 12 }}>Agent Status</div>
                <div style={{ color: T.green, fontWeight: 700, fontSize: 14, margin: "6px 0" }}>● ONLINE</div>
                <div style={{ color: T.muted, fontSize: 11 }}>Ready to receive calls</div>
              </>
            )}
          </div>
          <Btn onClick={() => setCallActive(p => !p)} variant={callActive ? "secondary" : "success"} style={{ width: "100%" }}>
            {callActive ? "⬛ End Simulation" : "▶ Simulate Incoming Call"}
          </Btn>
        </Card>

        {/* Today's AI Stats */}
        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Today's AI Stats</div>
          {[
            { label: "Calls Handled", value: "12", icon: "📞" },
            { label: "Orders via AI", value: "8", icon: "🛒" },
            { label: "Upsell Rate", value: "73%", icon: "📈" },
            { label: "Avg Handle Time", value: "1:47", icon: "⏱" },
            { label: "Customer Rating", value: "4.9★", icon: "⭐" },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none"
            }}>
              <div style={{ color: T.dim, fontSize: 12 }}>{s.icon} {s.label}</div>
              <div style={{ fontWeight: 700, color: T.text, fontSize: 13 }}>{s.value}</div>
            </div>
          ))}
        </Card>

        {/* Recent Calls */}
        <Card style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Recent Calls</div>
          {CALLS_LOG.map(c => (
            <div key={c.id} style={{ padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{c.time} — {c.caller}</div>
                {c.upsell && <Badge label="Upsold" color={T.green} />}
              </div>
              <div style={{ color: T.muted, fontSize: 11, marginTop: 3 }}>{c.duration} · {c.outcome}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE: ORDER MANAGEMENT
// ═══════════════════════════════════════════════════════════════
function ModuleOrders({ orders, setOrders }) {
  const [filter, setFilter] = useState("all");
  const [newOrder, setNewOrder] = useState({ table: "", customer: "", channel: "dine-in", items: [], note: "" });
  const [showNew, setShowNew] = useState(false);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  const STATUS_NEXT = { new: "preparing", preparing: "ready", ready: "delivered" };
  const STATUS_COLOR = { new: T.accent, preparing: T.accent2, ready: T.accent3, delivered: T.green, cancelled: T.red };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const advance = (id) => setOrders(prev => prev.map(o =>
    o.id === id && STATUS_NEXT[o.status] ? { ...o, status: STATUS_NEXT[o.status] } : o
  ));

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      return ex ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = () => {
    if (!cart.length) return;
    const id = `ORD-${String(orders.length + 1).padStart(3, "0")}`;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setOrders(prev => [...prev, {
      id, table: parseInt(newOrder.table) || 0, items: [...cart],
      status: "new", time, total: cartTotal,
      customer: newOrder.customer || "Walk-in",
      channel: newOrder.channel, note: newOrder.note,
    }]);
    setCart([]); setNewOrder({ table: "", customer: "", channel: "dine-in", items: [], note: "" }); setShowNew(false);
  };

  return (
    <div style={{ display: "flex", gap: 20, height: "calc(100vh - 120px)" }}>
      {/* Order List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {["all", "new", "preparing", "ready", "delivered"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              background: filter === s ? (STATUS_COLOR[s] || T.accent) : "rgba(255,255,255,0.04)",
              color: filter === s ? "#fff" : T.dim, border: `1px solid ${filter === s ? (STATUS_COLOR[s] || T.accent) : T.border}`,
              borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer", textTransform: "capitalize",
            }}>{s === "all" ? "All Orders" : s}</button>
          ))}
          <div style={{ marginLeft: "auto" }}>
            <Btn onClick={() => setShowNew(p => !p)} style={{ background: T.accent }}>+ New Order</Btn>
          </div>
        </div>

        {/* Order cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
          {filtered.map(order => (
            <Card key={order.id} style={{ borderLeft: `3px solid ${STATUS_COLOR[order.status]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}>{order.id}</div>
                  <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>
                    {order.channel === "dine-in" ? `🪑 Table ${order.table}` : order.channel === "phone" ? "📞 Phone" : "🌐 Online"} · {order.time} · {order.customer}
                  </div>
                </div>
                <Badge label={order.status} color={STATUS_COLOR[order.status]} />
              </div>
              {order.items.map((it, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", color: T.dim, fontSize: 12, padding: "3px 0" }}>
                  <span>{it.emoji} {it.name} ×{it.qty}</span>
                  <span>${(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
              {order.note && <div style={{ marginTop: 8, color: T.accent2, fontSize: 11 }}>📝 {order.note}</div>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: T.accent, fontSize: 17 }}>
                  ${order.total.toFixed(2)}
                </div>
                {STATUS_NEXT[order.status] && (
                  <Btn onClick={() => advance(order.id)} variant="secondary" style={{ fontSize: 11, padding: "5px 12px" }}>
                    Mark {STATUS_NEXT[order.status]} →
                  </Btn>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* New Order Panel */}
      {showNew && (
        <Card style={{ width: 320, overflowY: "auto", flexShrink: 0 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>New Order</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <Input value={newOrder.table} onChange={v => setNewOrder(p => ({ ...p, table: v }))} placeholder="Table #" style={{ width: "50%" }} />
            <Input value={newOrder.customer} onChange={v => setNewOrder(p => ({ ...p, customer: v }))} placeholder="Customer" style={{ width: "50%" }} />
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {["dine-in", "phone", "online"].map(ch => (
              <button key={ch} onClick={() => setNewOrder(p => ({ ...p, channel: ch }))} style={{
                flex: 1, background: newOrder.channel === ch ? T.accent + "22" : "rgba(255,255,255,0.04)",
                color: newOrder.channel === ch ? T.accent : T.dim,
                border: `1px solid ${newOrder.channel === ch ? T.accent + "44" : T.border}`,
                borderRadius: 8, padding: "6px 0", fontSize: 11, cursor: "pointer", textTransform: "capitalize",
              }}>{ch}</button>
            ))}
          </div>

          {/* Menu */}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menu..." style={{
            width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`,
            borderRadius: 8, padding: "8px 12px", color: T.text, fontSize: 12, outline: "none",
            marginBottom: 10, fontFamily: "'DM Sans',sans-serif",
          }} />
          <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 12 }}>
            {MENU_ITEMS.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map(m => (
              <div key={m.id} onClick={() => addToCart(m)} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
                background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`,
                transition: "all .15s",
              }}>
                <span style={{ fontSize: 12 }}>{m.emoji} {m.name}</span>
                <span style={{ color: T.accent, fontSize: 12, fontWeight: 700 }}>${m.price}</span>
              </div>
            ))}
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div style={{ background: "rgba(255,92,40,0.07)", borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 8, color: T.accent }}>🛒 Cart</div>
              {cart.map(it => (
                <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.dim, padding: "3px 0" }}>
                  <span>{it.emoji} {it.name} ×{it.qty}</span>
                  <span>${(it.price * it.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <span>Total</span><span style={{ color: T.accent }}>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          <Input value={newOrder.note} onChange={v => setNewOrder(p => ({ ...p, note: v }))} placeholder="Special instructions..." multiline />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Btn onClick={() => setShowNew(false)} variant="ghost" style={{ flex: 1 }}>Cancel</Btn>
            <Btn onClick={placeOrder} variant="success" style={{ flex: 2 }} disabled={!cart.length}>Place Order ✓</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE: KITCHEN DISPLAY
// ═══════════════════════════════════════════════════════════════
function ModuleKitchen({ orders, setOrders }) {
  const active = orders.filter(o => ["new", "preparing"].includes(o.status));
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 30000); return () => clearInterval(t); }, []);

  const age = (time) => {
    const [h, m] = time.split(":").map(Number);
    const now = new Date();
    return (now.getHours() - h) * 60 + (now.getMinutes() - m);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20 }}>🍳 Kitchen Display System</div>
        <div style={{ color: T.green, fontSize: 13, fontWeight: 600 }}>
          <span className="pulse-dot" style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: T.green, marginRight: 6 }} />
          {active.length} Active Ticket{active.length !== 1 ? "s" : ""}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {active.length === 0 && (
          <div style={{ color: T.muted, gridColumn: "1/-1", textAlign: "center", padding: 60, fontSize: 14 }}>
            ✅ All caught up — no active tickets
          </div>
        )}
        {active.map(o => {
          const mins = age(o.time);
          const urgent = mins > 15;
          const warn = mins > 10;
          return (
            <Card key={o.id} style={{
              borderTop: `3px solid ${urgent ? T.red : warn ? T.accent2 : T.accent3}`,
              position: "relative",
            }}>
              {urgent && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 18 }}>🚨</div>}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16 }}>{o.id}</div>
                  <div style={{ color: T.muted, fontSize: 11 }}>
                    {o.channel === "dine-in" ? `Table ${o.table}` : o.channel === "phone" ? "Phone" : "Online"} · {o.customer}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: urgent ? T.red : warn ? T.accent2 : T.green, fontWeight: 700, fontSize: 14 }}>
                    {mins < 1 ? "Just in" : `${mins}m ago`}
                  </div>
                  <Badge label={o.status} color={o.status === "new" ? T.accent : T.accent2} />
                </div>
              </div>
              {o.items.map((it, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px", marginBottom: 6,
                  fontSize: 14, display: "flex", justifyContent: "space-between",
                }}>
                  <span>{it.emoji} <strong>{it.name}</strong></span>
                  <span style={{ color: T.accent, fontWeight: 700 }}>×{it.qty}</span>
                </div>
              ))}
              {o.note && <div style={{ color: T.accent2, fontSize: 12, marginTop: 8 }}>📝 {o.note}</div>}
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                {o.status === "new" && (
                  <Btn onClick={() => setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "preparing" } : x))}
                    style={{ flex: 1, background: T.accent2, color: "#1a1a1a" }}>Start Cooking →</Btn>
                )}
                {o.status === "preparing" && (
                  <Btn onClick={() => setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "ready" } : x))}
                    variant="success" style={{ flex: 1 }}>Mark Ready ✓</Btn>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE: CRM
// ═══════════════════════════════════════════════════════════════
function ModuleCRM() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newC, setNewC] = useState({ name: "", phone: "", email: "", notes: "" });

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const addCustomer = () => {
    if (!newC.name) return;
    setCustomers(prev => [...prev, {
      id: `C${String(prev.length + 1).padStart(3, "0")}`,
      ...newC, visits: 0, spent: 0, lastVisit: "Never", tags: ["New"]
    }]);
    setNewC({ name: "", phone: "", email: "", notes: "" }); setShowAdd(false);
  };

  const TAG_COLOR = { VIP: "#FFD700", Regular: T.accent3, New: T.green, "Top Spender": T.accent2 };

  return (
    <div style={{ display: "flex", gap: 20, height: "calc(100vh - 120px)" }}>
      {/* Customer List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search customers..."
            style={{
              flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif"
            }} />
          <Btn onClick={() => setShowAdd(p => !p)}>+ Add Customer</Btn>
        </div>

        {showAdd && (
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontFamily: "'Syne',sans-serif", marginBottom: 12 }}>New Customer</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <Input value={newC.name} onChange={v => setNewC(p => ({ ...p, name: v }))} placeholder="Full Name *" />
              <Input value={newC.phone} onChange={v => setNewC(p => ({ ...p, phone: v }))} placeholder="Phone" />
              <Input value={newC.email} onChange={v => setNewC(p => ({ ...p, email: v }))} placeholder="Email" style={{ gridColumn: "1/-1" }} />
              <Input value={newC.notes} onChange={v => setNewC(p => ({ ...p, notes: v }))} placeholder="Notes (allergies, preferences...)" style={{ gridColumn: "1/-1" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => setShowAdd(false)} variant="ghost">Cancel</Btn>
              <Btn onClick={addCustomer} variant="success">Save Customer ✓</Btn>
            </div>
          </Card>
        )}

        {/* Stats row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Total Customers", value: customers.length, color: T.accent },
            { label: "VIP Members", value: customers.filter(c => c.tags.includes("VIP")).length, color: "#FFD700" },
            { label: "Total Revenue", value: `$${customers.reduce((s, c) => s + c.spent, 0).toFixed(0)}`, color: T.green },
            { label: "Avg Visits", value: (customers.reduce((s, c) => s + c.visits, 0) / customers.length).toFixed(1), color: T.accent3 },
          ].map((s, i) => (
            <Card key={i} style={{ flex: 1, textAlign: "center", padding: 14 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: "'Syne',sans-serif" }}>{s.value}</div>
              <div style={{ color: T.muted, fontSize: 11, marginTop: 3 }}>{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${T.border}` }}>
                {["Customer", "Contact", "Visits", "Spent", "Last Visit", "Tags"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left", fontSize: 11, color: T.muted,
                    fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} onClick={() => setSelected(c)} style={{
                  borderBottom: `1px solid ${T.border}`, cursor: "pointer",
                  background: selected?.id === c.id ? "rgba(255,92,40,0.08)" : "transparent",
                  transition: "background .15s",
                }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                  <td style={{ padding: "12px 16px", color: T.muted, fontSize: 12 }}>{c.phone}</td>
                  <td style={{ padding: "12px 16px", color: T.text, fontSize: 13 }}>{c.visits}</td>
                  <td style={{ padding: "12px 16px", color: T.green, fontWeight: 700, fontSize: 13 }}>${c.spent.toFixed(2)}</td>
                  <td style={{ padding: "12px 16px", color: T.muted, fontSize: 12 }}>{c.lastVisit}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {c.tags.map(t => <Badge key={t} label={t} color={TAG_COLOR[t] || T.dim} />)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Customer Detail */}
      {selected && (
        <Card style={{ width: 300, flexShrink: 0, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16 }}>{selected.name}</div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 18 }}>×</button>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }}>
            {selected.tags.map(t => <Badge key={t} label={t} color={TAG_COLOR[t] || T.dim} />)}
          </div>
          {[
            { label: "📞 Phone", value: selected.phone },
            { label: "✉️ Email", value: selected.email },
            { label: "🗓 Last Visit", value: selected.lastVisit },
          ].map(f => (
            <div key={f.label} style={{ padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ color: T.muted, fontSize: 11, marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 13 }}>{f.value}</div>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
            <div style={{ background: "rgba(255,92,40,0.1)", borderRadius: 10, padding: 14, textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.accent }}>{selected.visits}</div>
              <div style={{ color: T.muted, fontSize: 11 }}>Visits</div>
            </div>
            <div style={{ background: "rgba(46,224,133,0.1)", borderRadius: 10, padding: 14, textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.green }}>${selected.spent}</div>
              <div style={{ color: T.muted, fontSize: 11 }}>Total Spent</div>
            </div>
          </div>
          {selected.notes && (
            <div style={{ background: "rgba(255,181,71,0.08)", border: `1px solid ${T.accent2}22`, borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <div style={{ color: T.accent2, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>NOTES</div>
              <div style={{ fontSize: 13, color: T.dim }}>{selected.notes}</div>
            </div>
          )}
          <Btn variant="secondary" style={{ width: "100%", marginBottom: 8 }}>Send Promo Message</Btn>
          <Btn style={{ width: "100%", background: T.accent }}>Create Reservation</Btn>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE: ANALYTICS
// ═══════════════════════════════════════════════════════════════
function ModuleAnalytics() {
  const [period, setPeriod] = useState("week");

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ color: T.muted, fontSize: 11, marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, fontWeight: 700, fontSize: 13 }}>
            {p.name}: {typeof p.value === "number" && p.name?.toLowerCase().includes("revenue") ? `$${p.value.toLocaleString()}` : p.value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ overflowY: "auto", height: "calc(100vh - 120px)" }}>
      {/* KPIs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard icon="💰" label="Today's Revenue" value="$2,847" sub="↑ 12% vs yesterday" color={T.green} trend="12% vs yesterday" />
        <StatCard icon="🛒" label="Orders Today" value="47" sub="Avg $60.58 each" color={T.accent} />
        <StatCard icon="📈" label="Upsell Rate" value="73%" sub="AI-driven" color={T.accent2} />
        <StatCard icon="⭐" label="Satisfaction" value="4.8★" sub="Based on 31 reviews" color="#FFD700" />
        <StatCard icon="🔄" label="Table Turnover" value="3.2×" sub="Per shift" color={T.accent3} />
        <StatCard icon="👥" label="New Customers" value="8" sub="This week" color="#A78BFA" />
      </div>

      {/* Revenue Chart */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16 }}>Revenue & Orders</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["week", "month"].map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                background: period === p ? T.accent : "rgba(255,255,255,0.04)",
                color: period === p ? "#fff" : T.dim,
                border: `1px solid ${period === p ? T.accent : T.border}`,
                borderRadius: 8, padding: "4px 12px", fontSize: 11, cursor: "pointer", textTransform: "capitalize",
              }}>{p}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={WEEKLY_REVENUE}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.accent3} stopOpacity={0.3} />
                <stop offset="95%" stopColor={T.accent3} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke={T.accent} fill="url(#rev)" strokeWidth={2} />
            <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke={T.accent3} fill="url(#ord)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
        {[
          { title: "Sales by Category", data: CATEGORY_DATA },
          { title: "Order Channels", data: CHANNEL_DATA },
          { title: "Revenue Split", data: [{ name: "Food", value: 72 }, { name: "Drinks", value: 18 }, { name: "Desserts", value: 10 }] },
        ].map((chart, ci) => (
          <Card key={ci}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{chart.title}</div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={chart.data} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value" paddingAngle={3}>
                  {chart.data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: T.muted }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        ))}
      </div>

      {/* Hourly + Top Items */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Orders by Hour</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={HOURLY_DATA}>
              <XAxis dataKey="h" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="Orders" fill={T.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Top Menu Items</div>
          {[
            { name: "Signature Smash Burger", orders: 89, rev: 1333 },
            { name: "Loaded Truffle Fries", orders: 72, rev: 647 },
            { name: "Truffle Margherita", orders: 61, rev: 1158 },
            { name: "Buffalo Wings", orders: 54, rev: 755 },
            { name: "Craft Lemonade", orders: 91, rev: 454 },
          ].map((item, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>#{i + 1} {item.name}</span>
                <span style={{ color: T.green, fontSize: 12, fontWeight: 700 }}>${item.rev}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 4 }}>
                <div style={{ height: 4, borderRadius: 4, background: PIE_COLORS[i], width: `${(item.orders / 91) * 100}%` }} />
              </div>
              <div style={{ color: T.muted, fontSize: 10, marginTop: 3 }}>{item.orders} orders</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE: MENU MANAGER
// ═══════════════════════════════════════════════════════════════
function ModuleMenu() {
  const [items, setItems] = useState(MENU_ITEMS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", cat: "Mains", emoji: "🍽", cost: "" });
  const cats = [...new Set(items.map(i => i.cat))];

  const save = () => {
    if (!form.name || !form.price) return;
    setItems(prev => [...prev, {
      id: prev.length + 1, name: form.name, price: parseFloat(form.price),
      cat: form.cat, emoji: form.emoji, cost: parseFloat(form.cost) || 0,
      popular: false, upsells: [],
    }]);
    setForm({ name: "", price: "", cat: "Mains", emoji: "🍽", cost: "" }); setShowForm(false);
  };

  return (
    <div style={{ overflowY: "auto", height: "calc(100vh - 120px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20 }}>🍽 Menu Management</div>
        <Btn onClick={() => setShowForm(p => !p)}>+ Add Item</Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontFamily: "'Syne',sans-serif", marginBottom: 14 }}>New Menu Item</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            <Input value={form.emoji} onChange={v => setForm(p => ({ ...p, emoji: v }))} placeholder="Emoji" />
            <Input value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="Item Name *" style={{ gridColumn: "span 2" }} />
            <select value={form.cat} onChange={e => setForm(p => ({ ...p, cat: e.target.value }))} style={{
              background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: 10,
              padding: "10px 14px", color: T.text, fontSize: 13, outline: "none",
            }}>
              {["Mains", "Starters", "Sides", "Drinks", "Desserts"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Input value={form.price} onChange={v => setForm(p => ({ ...p, price: v }))} placeholder="Sale Price $" />
            <Input value={form.cost} onChange={v => setForm(p => ({ ...p, cost: v }))} placeholder="Cost $" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => setShowForm(false)} variant="ghost">Cancel</Btn>
            <Btn onClick={save} variant="success">Add to Menu ✓</Btn>
          </div>
        </Card>
      )}

      {cats.map(cat => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, color: T.accent, marginBottom: 12, letterSpacing: 0.5 }}>
            — {cat.toUpperCase()}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
            {items.filter(i => i.cat === cat).map(item => {
              const margin = item.cost ? ((item.price - item.cost) / item.price * 100).toFixed(0) : null;
              return (
                <Card key={item.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 28 }}>{item.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                        {item.popular && <Badge label="Popular" color={T.accent2} />}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, color: T.accent, fontSize: 16, fontFamily: "'Syne',sans-serif" }}>${item.price}</div>
                      {margin && <div style={{ color: T.green, fontSize: 11 }}>{margin}% margin</div>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="ghost" style={{ flex: 1, fontSize: 11, padding: "5px 0" }}>Edit</Btn>
                    <Btn onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, popular: !i.popular } : i))}
                      variant={item.popular ? "secondary" : "ghost"} style={{ flex: 1, fontSize: 11, padding: "5px 0" }}>
                      {item.popular ? "★ Featured" : "☆ Feature"}
                    </Btn>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE: SETTINGS / INTEGRATIONS
// ═══════════════════════════════════════════════════════════════
function ModuleSettings() {
  const [restaurant, setRestaurant] = useState({
    name: "The Golden Fork", phone: "555-0100", address: "123 Main St", timezone: "EST",
    tables: 12, currency: "USD",
  });
  const [integrations, setIntegrations] = useState([
    { id: 1, name: "AI Call Agent", desc: "ARIA phone answering & sales", icon: "📞", active: true, plan: "included" },
    { id: 2, name: "Online Ordering", desc: "Website & app order integration", icon: "🌐", active: true, plan: "included" },
    { id: 3, name: "DoorDash Connect", desc: "3rd party delivery sync", icon: "🚗", active: false, plan: "addon" },
    { id: 4, name: "Uber Eats Sync", desc: "Uber Eats menu & order sync", icon: "🍱", active: false, plan: "addon" },
    { id: 5, name: "POS Integration", desc: "Square / Toast / Clover sync", icon: "💳", active: true, plan: "included" },
    { id: 6, name: "Email Marketing", desc: "Automated campaigns & promos", icon: "✉️", active: false, plan: "addon" },
    { id: 7, name: "SMS Notifications", desc: "Order updates to customers by SMS", icon: "💬", active: true, plan: "included" },
    { id: 8, name: "Loyalty Program", desc: "Points & rewards management", icon: "🎁", active: false, plan: "addon" },
    { id: 9, name: "Staff Scheduling", desc: "Roster & payroll tracking", icon: "👥", active: false, plan: "addon" },
    { id: 10, name: "Inventory Tracking", desc: "Stock levels & auto-reorder alerts", icon: "📦", active: false, plan: "addon" },
    { id: 11, name: "Google Reviews AI", desc: "Auto-respond to Google reviews", icon: "⭐", active: false, plan: "addon" },
    { id: 12, name: "Custom Webhook", desc: "Connect any external API or service", icon: "🔗", active: false, plan: "developer" },
  ]);

  const toggle = id => setIntegrations(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));

  const PLAN_COLOR = { included: T.green, addon: T.accent2, developer: T.accent3 };

  return (
    <div style={{ overflowY: "auto", height: "calc(100vh - 120px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Restaurant Profile */}
        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 18 }}>🏪 Restaurant Profile</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Restaurant Name", key: "name" },
              { label: "Phone Number", key: "phone" },
              { label: "Address", key: "address" },
              { label: "Number of Tables", key: "tables" },
            ].map(f => (
              <div key={f.key}>
                <div style={{ color: T.muted, fontSize: 11, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
                <Input value={restaurant[f.key]} onChange={v => setRestaurant(p => ({ ...p, [f.key]: v }))} placeholder={f.label} />
              </div>
            ))}
            <Btn variant="success" style={{ marginTop: 4 }}>Save Changes ✓</Btn>
          </div>
        </Card>

        {/* System Info */}
        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 18 }}>🤖 AI System Status</div>
          {[
            { label: "ARIA Voice Agent", status: "Online", color: T.green },
            { label: "Order Processing AI", status: "Active", color: T.green },
            { label: "Upsell Engine", status: "Active", color: T.green },
            { label: "CRM Intelligence", status: "Active", color: T.green },
            { label: "Analytics Engine", status: "Running", color: T.green },
            { label: "API Health", status: "100%", color: T.green },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: i < 5 ? `1px solid ${T.border}` : "none"
            }}>
              <span style={{ fontSize: 13 }}>{s.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} className="pulse-dot" />
                <span style={{ color: s.color, fontSize: 12, fontWeight: 600 }}>{s.status}</span>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: 14, background: "rgba(255,92,40,0.08)", border: `1px solid ${T.accent}22`, borderRadius: 12 }}>
            <div style={{ color: T.accent, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>🔌 Add Future Features</div>
            <div style={{ color: T.muted, fontSize: 12 }}>
              This platform is built modular — new modules can be plugged in without rebuilding. Contact support to unlock any addon.
            </div>
          </div>
        </Card>
      </div>

      {/* Integrations */}
      <Card style={{ marginTop: 20 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 18 }}>🔌 Integrations & Addons</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
          {integrations.map(intg => (
            <div key={intg.id} style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${intg.active ? T.accent + "44" : T.border}`,
              borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 24 }}>{intg.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{intg.name}</div>
                    <div style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>{intg.desc}</div>
                  </div>
                </div>
                <Badge label={intg.plan} color={PLAN_COLOR[intg.plan]} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: intg.active ? T.green : T.muted }}>
                  {intg.active ? "● Active" : "○ Inactive"}
                </span>
                <div onClick={() => toggle(intg.id)} style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: intg.active ? T.accent : "rgba(255,255,255,0.1)",
                  position: "relative", cursor: "pointer", transition: "background .3s",
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3, left: intg.active ? 21 : 3,
                    transition: "left .3s",
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODULE: CUSTOMER TRACKER (Order Tracking for Customers)
// ═══════════════════════════════════════════════════════════════
function ModuleTracker({ orders }) {
  const [orderId, setOrderId] = useState("");
  const [found, setFound] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const STEPS = ["new", "preparing", "ready", "delivered"];
  const STEP_LABELS = { new: "Order Received", preparing: "Being Prepared", ready: "Ready to Serve", delivered: "Delivered" };
  const STEP_ICON = { new: "✅", preparing: "👨‍🍳", ready: "🔔", delivered: "🎉" };

  const search = () => {
    const o = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase().trim());
    setFound(o || null);
    setNotFound(!o);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>
          Track Your Order
        </div>
        <div style={{ color: T.muted, fontSize: 14 }}>Enter your order ID to see real-time status</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input value={orderId} onChange={e => setOrderId(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
          placeholder="e.g. ORD-001" style={{
            flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`,
            borderRadius: 12, padding: "14px 18px", color: T.text, fontSize: 15, outline: "none",
            fontFamily: "'DM Sans',sans-serif",
          }} />
        <Btn onClick={search} style={{ padding: "14px 24px", fontSize: 14 }}>Track →</Btn>
      </div>

      {/* Demo orders */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        <span style={{ color: T.muted, fontSize: 12 }}>Try:</span>
        {orders.slice(0, 4).map(o => (
          <button key={o.id} onClick={() => { setOrderId(o.id); setFound(o); setNotFound(false); }} style={{
            background: "rgba(255,255,255,0.04)", color: T.dim, border: `1px solid ${T.border}`,
            borderRadius: 20, padding: "3px 12px", fontSize: 12, cursor: "pointer",
          }}>{o.id}</button>
        ))}
      </div>

      {notFound && (
        <Card style={{ textAlign: "center", padding: 30 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
          <div style={{ fontWeight: 600 }}>Order not found</div>
          <div style={{ color: T.muted, fontSize: 13, marginTop: 6 }}>Please check your order ID and try again</div>
        </Card>
      )}

      {found && (
        <Card className="slide-in">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20 }}>{found.id}</div>
              <div style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>{found.customer} · {found.time}</div>
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.accent }}>${found.total.toFixed(2)}</div>
          </div>

          {/* Progress */}
          <div style={{ position: "relative", margin: "24px 0 32px" }}>
            <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 3, position: "absolute", top: 20, left: "10%", width: "80%" }} />
            <div style={{
              height: 3, background: T.accent, borderRadius: 3, position: "absolute", top: 20, left: "10%",
              width: `${(STEPS.indexOf(found.status) / 3) * 80}%`, transition: "width 1s ease",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
              {STEPS.map((step, i) => {
                const done = STEPS.indexOf(found.status) >= i;
                const current = found.status === step;
                return (
                  <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%",
                      background: done ? T.accent : "rgba(255,255,255,0.08)",
                      border: current ? `3px solid ${T.accent}` : "3px solid transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                      transition: "all .5s", marginBottom: 8,
                      boxShadow: current ? `0 0 20px ${T.accent}66` : "none",
                    }}>{STEP_ICON[step]}</div>
                    <div style={{ fontSize: 11, color: done ? T.text : T.muted, fontWeight: done ? 600 : 400, textAlign: "center" }}>
                      {STEP_LABELS[step]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
            <div style={{ color: T.muted, fontSize: 11, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Your Order</div>
            {found.items.map((it, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", padding: "8px 0",
                borderBottom: i < found.items.length - 1 ? `1px solid ${T.border}` : "none", fontSize: 14
              }}>
                <span>{it.emoji} {it.name} ×{it.qty}</span>
                <span style={{ color: T.accent, fontWeight: 600 }}>${(it.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
            {found.note && <div style={{ color: T.accent2, fontSize: 12, marginTop: 10 }}>📝 Note: {found.note}</div>}
          </div>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
const NAV = [
  { id: "agent", label: "AI Agent", icon: "🤖" },
  { id: "orders", label: "Orders", icon: "🛒" },
  { id: "kitchen", label: "Kitchen", icon: "🍳" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "crm", label: "CRM", icon: "👥" },
  { id: "menu", label: "Menu", icon: "🍽" },
  { id: "tracker", label: "Order Track", icon: "📍" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export default function App() {
  const [page, setPage] = useState("agent");
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    setNewOrderCount(orders.filter(o => o.status === "new").length);
  }, [orders]);

  const PAGES = {
    agent: <ModuleAIAgent />,
    orders: <ModuleOrders orders={orders} setOrders={setOrders} />,
    kitchen: <ModuleKitchen orders={orders} setOrders={setOrders} />,
    analytics: <ModuleAnalytics />,
    crm: <ModuleCRM />,
    menu: <ModuleMenu />,
    tracker: <ModuleTracker orders={orders} />,
    settings: <ModuleSettings />,
  };

  return (
    <>
      <FontLink />
      <style>{css}</style>
      <div style={{ display: "flex", height: "100vh", background: T.bg, overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: 220, background: T.surface, borderRight: `1px solid ${T.border}`,
          display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: -0.5 }}>
              <span style={{ color: T.accent }}>■</span> RestaurantAI OS
            </div>
            <div style={{ color: T.muted, fontSize: 10, marginTop: 4, letterSpacing: 1 }}>ALL-IN-ONE PLATFORM</div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                width: "100%", textAlign: "left", display: "flex", alignItems: "center",
                gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 2, border: "none",
                background: page === n.id ? `${T.accent}18` : "transparent",
                color: page === n.id ? T.accent : T.dim,
                fontSize: 13, fontWeight: page === n.id ? 600 : 400,
                cursor: "pointer", transition: "all .2s", fontFamily: "'DM Sans',sans-serif",
                position: "relative",
              }}>
                <span style={{ fontSize: 16 }}>{n.icon}</span>
                {n.label}
                {n.id === "orders" && newOrderCount > 0 && (
                  <span style={{
                    marginLeft: "auto", background: T.accent, color: "#fff",
                    borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{newOrderCount}</span>
                )}
                {n.id === "kitchen" && orders.filter(o => o.status === "new").length > 0 && (
                  <span style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: T.red }} className="pulse-dot" />
                )}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green }} className="pulse-dot" />
              <div style={{ fontSize: 11, color: T.muted }}>All systems online</div>
            </div>
            <div style={{ color: T.muted, fontSize: 10, marginTop: 6 }}>v1.0 · The Golden Fork</div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Top bar */}
          <div style={{
            height: 56, borderBottom: `1px solid ${T.border}`, display: "flex",
            alignItems: "center", justifyContent: "space-between", padding: "0 24px",
            background: T.surface, flexShrink: 0,
          }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}>
              {NAV.find(n => n.id === page)?.icon} {NAV.find(n => n.id === page)?.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ color: T.muted, fontSize: 12 }}>
                {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: T.accent,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13
                }}>👤</div>
                <span style={{ fontSize: 12, color: T.dim }}>Owner</span>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {PAGES[page]}
          </div>
        </div>
      </div>
    </>
  );
}
