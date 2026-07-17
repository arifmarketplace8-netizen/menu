import { useState, useMemo, useRef, useEffect } from "react";
import {
  Utensils, ShoppingCart, Plus, Minus, Lock, TrendingUp, Package,
  Send, CheckCircle2, Printer, ChefHat, MessageCircle, X, Trash2,
  Wallet, ShoppingBag, BarChart3, Flame, Loader2, ShieldCheck,
  Bot, BadgeCheck, ToggleLeft, ToggleRight, Calendar, Sparkles,
  Smartphone, KeyRound, LayoutGrid, Receipt, Landmark, LogOut, UserCheck
} from "lucide-react";

// ---------------------------------------------------------------------------
// Static menu data
// ---------------------------------------------------------------------------
const CATEGORIES = ["ሁሉም", "መንዲ", "ጥብስ", "መጠጥ", "ጣፋጭ"];
const TABLES = ["Table 1", "Table 2", "Table 3", "Table 4", "Table 5", "Table 6", "Takeaway"];
const PAYMENTS = ["Cash", "Telebirr", "CBE Birr"];

const INITIAL_MENU = [
  { id: 1, name: "የበግ መንዲ", category: "መንዲ", price: 450, stock: 12, outOfStock: false, gradient: "from-amber-600 to-orange-800" },
  { id: 2, name: "የዶሮ መንዲ", category: "መንዲ", price: 350, stock: 4, outOfStock: false, gradient: "from-orange-500 to-amber-700" },
  { id: 3, name: "የከብት መንዲ", category: "መንዲ", price: 400, stock: 1, outOfStock: false, gradient: "from-amber-700 to-orange-900" },
  { id: 4, name: "ቺክና ጥብስ", category: "ጥብስ", price: 280, stock: 8, outOfStock: false, gradient: "from-orange-600 to-red-800" },
  { id: 5, name: "የበግ ጥብስ", category: "ጥብስ", price: 320, stock: 3, outOfStock: false, gradient: "from-red-700 to-orange-800" },
  { id: 6, name: "የበሬ ጥብስ", category: "ጥብስ", price: 300, stock: 6, outOfStock: false, gradient: "from-orange-700 to-amber-900" },
  { id: 7, name: "አቮካዶ ጭማቂ", category: "መጠጥ", price: 80, stock: 20, outOfStock: false, gradient: "from-emerald-600 to-green-800" },
  { id: 8, name: "ማንጎ ጭማቂ", category: "መጠጥ", price: 80, stock: 15, outOfStock: false, gradient: "from-yellow-500 to-amber-700" },
  { id: 9, name: "ቡና", category: "መጠጥ", price: 40, stock: 30, outOfStock: false, gradient: "from-stone-700 to-amber-900" },
  { id: 10, name: "ሻይ", category: "መጠጥ", price: 30, stock: 25, outOfStock: false, gradient: "from-amber-700 to-yellow-900" },
  { id: 11, name: "ባቅላቫ", category: "ጣፋጭ", price: 120, stock: 5, outOfStock: false, gradient: "from-amber-500 to-orange-700" },
  { id: 12, name: "ኬክ", category: "ጣፋጭ", price: 100, stock: 2, outOfStock: false, gradient: "from-rose-500 to-pink-700" },
];

const FONT_STACK = "'Noto Sans Ethiopic', 'Nyala', 'Abyssinica SIL', ui-sans-serif, system-ui, sans-serif";
const fmt = (n) => n.toLocaleString("en-US");

// ---------------------------------------------------------------------------
// Small shared UI pieces
// ---------------------------------------------------------------------------
function StockBadge({ item }) {
  if (item.outOfStock || item.stock <= 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-1">
        አልቋል
      </span>
    );
  }
  if (item.stock <= 2) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500 text-white text-xs font-semibold px-2.5 py-1 animate-pulse">
        {item.stock} ቀርቷል
      </span>
    );
  }
  if (item.stock <= 5) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 text-gray-900 text-xs font-semibold px-2.5 py-1">
        {item.stock} ቀርቷል
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1">
      {item.stock} ቀርቷል
    </span>
  );
}

function StatCard({ icon: Icon, label, value, accent, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
          <p className="text-xl font-bold text-gray-900 truncate">{value}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Switch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 active:scale-95 ${
        checked ? "bg-emerald-500" : "bg-gray-300"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// LOGIN PAGE COMPONENT
// ---------------------------------------------------------------------------
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState("waiter"); // 'waiter' or 'owner'
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (role === "waiter" && pin === "1111") {
      onLogin("waiter");
    } else if (role === "owner" && pin === "1234") {
      onLogin("owner");
    } else {
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4" style={{ fontFamily: FONT_STACK }}>
      <div className={`bg-gray-900 rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-800 ${shake ? "animate-shake" : ""}`}>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-extrabold text-xl">አል ባሻ አል መንዲ</h3>
          <p className="text-gray-400 text-xs mt-1">የመግቢያ ሚስጥር ቁጥር ያስገቡ</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-gray-800 p-1.5 rounded-xl mb-6">
          <button
            onClick={() => { setRole("waiter"); setPin(""); }}
            className={`py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              role === "waiter" ? "bg-amber-500 text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            ዌይተር (Waiter)
          </button>
          <button
            onClick={() => { setRole("owner"); setPin(""); }}
            className={`py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              role === "owner" ? "bg-amber-500 text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Lock className="w-4 h-4" />
            ባለቤት (Owner)
          </button>
        </div>

        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="••••"
          maxLength={4}
          className="w-full text-center tracking-[0.5em] text-2xl bg-gray-800 text-white rounded-xl py-3 mb-5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 hover:brightness-105"
        >
          <KeyRound className="w-5 h-5" />
          ግባ
        </button>

        <div className="mt-6 text-center text-[11px] text-gray-500">
          <p>ማሳያ ፒን ቁጥሮች፦ ዌይተር: <span className="text-gray-300 font-bold">1111</span> | ባለቤት: <span className="text-gray-300 font-bold">1234</span></p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 1: Waiter Tablet POS
// ---------------------------------------------------------------------------
function POSTab({
  menu, addToCart, cart, changeQty, removeFromCart, clearCart, cartTotal,
  sendToKitchen, sending, selectedTable, setSelectedTable, paymentMethod, setPaymentMethod
}) {
  const [activeCat, setActiveCat] = useState("ሁሉም");
  const filtered = useMemo(
    () => (activeCat === "ሁሉም" ? menu : menu.filter((m) => m.category === activeCat)),
    [menu, activeCat]
  );
  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-28 lg:pb-6">
      {/* Menu side */}
      <div className="flex-1 min-w-0">
        {/* Table & Category Selectors */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-5 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-sm font-bold text-gray-700 shrink-0 mr-2">ጠረጴዛ ምረጥ:</span>
            {TABLES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTable(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 shrink-0 ${
                  selectedTable === t
                    ? "bg-gray-900 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-gray-100 pt-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 border ${
                  activeCat === cat
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/30"
                    : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const disabled = item.outOfStock || item.stock <= 0;
            return (
              <button
                key={item.id}
                disabled={disabled}
                onClick={() => addToCart(item)}
                className={`group text-left rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-200 ${
                  disabled
                    ? "opacity-50 grayscale cursor-not-allowed"
                    : "hover:-translate-y-1 hover:shadow-lg active:scale-95 cursor-pointer"
                }`}
              >
                <div className={`h-24 md:h-28 bg-gradient-to-br ${item.gradient} relative flex items-center justify-center`}>
                  <Utensils className="w-8 h-8 text-white/70" />
                  <div className="absolute top-2 right-2">
                    <StockBadge item={item} />
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-bold text-gray-900 text-sm leading-snug truncate">{item.name}</p>
                  <p className="text-amber-600 font-extrabold mt-1">{fmt(item.price)} ብር</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cart sidebar */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="bg-gray-900 rounded-2xl p-5 lg:sticky lg:top-24 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <span>የትዕዛዝ ዝርዝር</span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-gray-400 hover:text-red-400 transition-colors active:scale-95"
                title="ዝርዝሩን አጽዳ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active Table Indicator */}
          <div className="mb-4 bg-gray-800 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-lg flex justify-between items-center">
            <span>የተመረጠ ጠረጴዛ:</span>
            <span className="text-amber-400 text-sm">{selectedTable}</span>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar mb-4">
            {cart.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">ዝርዝሩ ባዶ ነው። ምግብ ይምረጡ።</p>
            )}
            {cart.map((c) => {
              const item = menu.find((m) => m.id === c.id);
              if (!item) return null;
              return (
                <div key={c.id} className="bg-gray-800/70 rounded-xl p-3 animate-fadeIn">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                    <button
                      onClick={() => removeFromCart(c.id)}
                      className="text-gray-500 hover:text-red-400 shrink-0 active:scale-95"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeQty(c.id, -1)}
                        className="w-6 h-6 rounded-md bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 active:scale-90 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white text-sm w-5 text-center">{c.qty}</span>
                      <button
                        onClick={() => changeQty(c.id, 1)}
                        disabled={c.qty >= item.stock}
                        className="w-6 h-6 rounded-md bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 active:scale-90 transition disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-amber-400 text-sm font-bold">{fmt(item.price * c.qty)} ብር</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Method Selector */}
          {cart.length > 0 && (
            <div className="border-t border-gray-800 pt-3 pb-2 mb-3">
              <span className="text-xs text-gray-400 font-bold block mb-2">የአከፋፈል ዘዴ ምረጥ:</span>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPaymentMethod(p)}
                    className={`py-2 rounded-lg text-[11px] font-bold transition-all ${
                      paymentMethod === p
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-700 pt-4 mb-4 flex items-center justify-between">
            <span className="text-gray-400 text-sm font-medium">ጠቅላላ ድምር</span>
            <span className="text-white text-xl font-extrabold">{fmt(cartTotal)} ብር</span>
          </div>

          <button
            onClick={sendToKitchen}
            disabled={cart.length === 0 || sending}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105"
          >
            <ChefHat className="w-5 h-5" />
            ወደ ኪችን ላክ
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kitchen send overlay
// ---------------------------------------------------------------------------
function KitchenOverlay({ visible, step, table, method, total }) {
  if (!visible) return null;
  const steps = [
    { icon: ShieldCheck, text: `ከ${table} ትዕዛዝ በHTTPS በኩል ደህንነቱ ተጠብቆ እየተላከ ነው...` },
    { icon: CheckCircle2, text: `ትዕዛዝ በ${method} በተሳካ ሁኔታ ተመዝግቧል!` },
    { icon: Printer, text: `የካሸር ደረሰኝ (${fmt(total)} ብር) ታተመ! 🖨️` },
    { icon: ChefHat, text: `የኪችን ትዕዛዝ ወደ ማብሰያ ክፍል ተላከ! 👨‍🍳` },
  ];
  return (
    <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-scaleIn">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">ትዕዛዝ በመላክ ላይ</h3>
        </div>
        <div className="space-y-4">
          {steps.map((s, i) => {
            const done = i < step;
            const active = i === step;
            const Icon = s.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  done || active ? "opacity-100" : "opacity-30"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    done ? "bg-emerald-500" : active ? "bg-amber-500" : "bg-gray-200"
                  }`}
                >
                  {active ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Icon className={`w-4 h-4 ${done ? "text-white" : "text-gray-400"}`} />
                  )}
                </div>
                <span className={`text-sm font-medium ${done || active ? "text-gray-900" : "text-gray-400"}`}>
                  {s.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 2: Owner Admin Panel
// ---------------------------------------------------------------------------
function AdminTab({ menu, changeStock, toggleOutOfStock, revenue, orderCount, bestSeller, revenueByMethod }) {
  return (
    <div className="space-y-8 pb-10 animate-fadeIn">
      <div>
        <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          የቀጥታ ሽያጭ ዳሽቦርድ
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={Wallet} label="ጠቅላላ ሽያጭ" value={`${fmt(revenue)} ብር`} accent="bg-gradient-to-br from-amber-500 to-orange-600">
            <div className="border-t border-gray-100 pt-3 mt-1 space-y-1 text-xs text-gray-500 font-medium">
              <div className="flex justify-between">
                <span>💵 በካሽ (Cash):</span>
                <span className="font-bold text-gray-800">{fmt(revenueByMethod.Cash)} ብር</span>
              </div>
              <div className="flex justify-between">
                <span>📱 ቴሌብር (Telebirr):</span>
                <span className="font-bold text-sky-600">{fmt(revenueByMethod.Telebirr)} ብር</span>
              </div>
              <div className="flex justify-between">
                <span>🏦 ሲቢኢ ብር (CBE Birr):</span>
                <span className="font-bold text-emerald-600">{fmt(revenueByMethod["CBE Birr"])} ብር</span>
              </div>
            </div>
          </StatCard>

          <StatCard icon={ShoppingBag} label="ጠቅላላ ኦርደሮች" value={orderCount} accent="bg-gradient-to-br from-orange-500 to-red-600" />
          <StatCard icon={Flame} label="በብዛት የተሸጠ" value={bestSeller || "—"} accent="bg-gradient-to-br from-red-500 to-rose-600" />
        </div>
      </div>
      <div>
        <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-600" />
          የስቶክ ቁጥጥር
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {menu.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                <StockBadge item={item} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => changeStock(item.id, -1)}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center active:scale-90 transition"
                >
                  <Minus className="w-4 h-4 text-gray-700" />
                </button>
                <span className="text-2xl font-extrabold text-gray-900">{item.stock}</span>
                <button
                  onClick={() => changeStock(item.id, 1)}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center active:scale-90 transition"
                >
                  <Plus className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500">ከስቶክ ውጪ አድርግ</span>
                <Switch checked={item.outOfStock} onChange={() => toggleOutOfStock(item.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB 3: Telegram Nightly Report
// ---------------------------------------------------------------------------
function TelegramTab({ revenue, orderCount, bestSeller, revenueByMethod }) {
  const [typing, setTyping] = useState(false);
  const [reportShown, setReportShown] = useState(false);
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [typing, reportShown, weekly, monthly]);
  const triggerReport = () => {
    if (typing) return;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setReportShown(true);
    }, 1500);
  };
  const weeklyTotal = revenue * 6 + Math.round(revenue * 0.8);
  const monthlyTotal = weeklyTotal * 4;
  return (
    <div className="max-w-lg mx-auto pb-28 lg:pb-6">
      <div className="bg-gray-950 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="bg-gray-900 px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-white text-sm font-semibold truncate">Al Basha ERP Notifier</p>
              <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />
            </div>
            <p className="text-emerald-400 text-xs">በመስመር ላይ</p>
          </div>
        </div>
        <div ref={scrollRef} className="bg-gray-950 px-3 py-4 space-y-3 max-h-[28rem] overflow-y-auto no-scrollbar">
          <div className="flex justify-center">
            <span className="bg-white/5 text-gray-400 text-xs px-3 py-1 rounded-full">ዛሬ</span>
          </div>
          <ChatBubble>
            እንኳን ደህና መጡ! 👋 ይህ ራስ-ሰር የ Al Basha ERP ማሳወቂያ ቦት ነው። በየቀኑ ከምሽቱ 5:00 ላይ የሽያጭ ሪፖርት እልካለሁ።
          </ChatBubble>
          {typing && (
            <div className="flex items-center gap-1.5 bg-gray-800 w-fit px-4 py-3 rounded-2xl rounded-bl-sm animate-fadeIn">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
          )}
          {reportShown && (
            <ChatBubble accent>
              <p className="font-bold mb-1">📱 የአል ባሻ ዕለታዊ የሽያጭ ሪፖርት</p>
              <p>📅 ቀን፦ ሐምሌ 2018 ዓ.ም</p>
              <p>
                💰 ጠቅላላ የዛሬ ሽያጭ፦ <span className="font-bold text-amber-400">{fmt(revenue)} ብር</span>
              </p>
              <p>
                📦 ጠቅላላ ኦርደር፦ <span className="font-bold">{orderCount} ትዕዛዞች</span>
              </p>
              <p>🔥 በብዛት የተሸጠ፦ {bestSeller || "የበግ መንዲ"}</p>

              <div className="border-t border-gray-700 my-2 pt-2 text-xs text-gray-300">
                <p className="font-semibold text-gray-200 mb-1">📊 የገቢ አሰባሰብ ዝርዝር (Reconciliation)፦</p>
                <p>• 💵 በካሽ (Cash)፦ {fmt(revenueByMethod.Cash)} ብር</p>
                <p>• 📱 በቴሌብር (Telebirr)፦ {fmt(revenueByMethod.Telebirr)} ብር</p>
                <p>• 🏦 በሲቢኢ ብር (CBE Birr)፦ {fmt(revenueByMethod["CBE Birr"])} ብር</p>
              </div>
              <p className="mt-2 italic text-gray-300">ሲስተሙ በስኬት ተዘግቷል። መልካም ምሽት!</p>
            </ChatBubble>
          )}
          {weekly && (
            <ChatBubble accent>
              <p className="font-bold mb-1">📊 የሳምንት ማጠቃለያ ሪፖርት</p>
              <p>🗓️ ከሐምሌ 1 - 7 ቀን 2018 ዓ.ም</p>
              <p>
                💰 የሳምንት ጠቅላላ ሽያጭ፦ <span className="font-bold text-amber-400">{fmt(weeklyTotal)} ብር</span>
              </p>
              <p>📦 አማካይ ዕለታዊ ኦርደር፦ {Math.max(orderCount, 6)} ትዕዛዞች</p>
              <p>📈 ከባለፈው ሳምንት፦ +12%</p>
            </ChatBubble>
          )}
          {monthly && (
            <ChatBubble accent>
              <p className="font-bold mb-1">📆 የወር ማጠቃለያ ሪፖርት</p>
              <p>🗓️ ሐምሌ 2018 ዓ.ም</p>
              <p>
                💰 የወር ጠቅላላ ሽያጭ፦ <span className="font-bold text-amber-400">{fmt(monthlyTotal)} ብር</span>
              </p>
              <p>🏆 በጣም የተሸጠ ምድብ፦ መንዲ</p>
              <p>📈 ከባለፈው ወር፦ +8%</p>
            </ChatBubble>
          )}
        </div>
        <div className="bg-gray-900 px-4 py-4 space-y-3">
          <button
            onClick={triggerReport}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 hover:brightness-110"
          >
            <MessageCircle className="w-4 h-4" />
            Trigger 5:00 PM Report ▶
          </button>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm font-medium">የሳምንት ማጠቃለያ</span>
            <Switch checked={weekly} onChange={() => setWeekly((v) => !v)} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm font-medium">የወር ማጠቃለያ</span>
            <Switch checked={monthly} onChange={() => setMonthly((v) => !v)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ children, accent }) {
  return (
    <div
      className={`w-fit max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed animate-fadeIn ${
        accent ? "bg-gray-800 text-gray-100 border border-sky-900" : "bg-gray-800 text-gray-100"
      }`}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root App
// ---------------------------------------------------------------------------
export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // null (shows login), 'waiter', or 'owner'
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("pos");
  const [revenue, setRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [itemsSold, setItemsSold] = useState({});
  const [sending, setSending] = useState(false);
  const [step, setStep] = useState(0);

  const [selectedTable, setSelectedTable] = useState("Table 1");
  const [paymentMethod, setPaymentMethod] = useState("Telebirr");
  const [revenueByMethod, setRevenueByMethod] = useState({ Cash: 0, Telebirr: 0, "CBE Birr": 0 });

  const [lastCheckoutTable, setLastCheckoutTable] = useState("Table 1");
  const [lastCheckoutMethod, setLastCheckoutMethod] = useState("Telebirr");
  const [lastCheckoutTotal, setLastCheckoutTotal] = useState(0);

  // If user logs in as waiter, force the tab to "pos" automatically
  const handleLogin = (role) => {
    setCurrentUser(role);
    if (role === "waiter") {
      setActiveTab("pos");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, c) => {
      const item = menu.find((m) => m.id === c.id);
      return sum + (item ? item.price * c.qty : 0);
    }, 0);
  }, [cart, menu]);

  const bestSeller = useMemo(() => {
    const entries = Object.entries(itemsSold);
    if (entries.length === 0) return null;
    const [topId] = entries.sort((a, b) => b[1] - a[1])[0];
    return menu.find((m) => m.id === Number(topId))?.name || null;
  }, [itemsSold, menu]);

  const addToCart = (item) => {
    if (item.outOfStock || item.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        if (existing.qty >= item.stock) return prev;
        return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { id: item.id, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart((prev) => {
      const item = menu.find((m) => m.id === id);
      return prev
        .map((c) => {
          if (c.id !== id) return c;
          const newQty = Math.min(Math.max(c.qty + delta, 0), item ? item.stock : 99);
          return { ...c, qty: newQty };
        })
        .filter((c) => c.qty > 0);
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));
  const clearCart = () => setCart([]);

  const changeStock = (id, delta) => {
    setMenu((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stock: Math.max(0, m.stock + delta) } : m))
    );
  };

  const toggleOutOfStock = (id) => {
    setMenu((prev) => prev.map((m) => (m.id === id ? { ...m, outOfStock: !m.outOfStock } : m)));
  };

  const sendToKitchen = () => {
    if (cart.length === 0 || sending) return;
    const snapshot = [...cart];
    const total = cartTotal;

    setLastCheckoutTable(selectedTable);
    setLastCheckoutMethod(paymentMethod);
    setLastCheckoutTotal(total);

    setMenu((prev) =>
      prev.map((m) => {
        const c = snapshot.find((x) => x.id === m.id);
        return c ? { ...m, stock: Math.max(0, m.stock - c.qty) } : m;
      })
    );

    setRevenue((r) => r + total);
    setOrderCount((o) => o + 1);

    setRevenueByMethod((prev) => ({
      ...prev,
      [paymentMethod]: prev[paymentMethod] + total,
    }));

    setItemsSold((prev) => {
      const next = { ...prev };
      snapshot.forEach((c) => {
        next[c.id] = (next[c.id] || 0) + c.qty;
      });
      return next;
    });
    setCart([]);

    setSending(true);
    setStep(0);
    setTimeout(() => setStep(1), 700);
    setTimeout(() => setStep(2), 1500);
    setTimeout(() => setStep(3), 2300);
    setTimeout(() => setStep(4), 3100);
    setTimeout(() => {
      setSending(false);
      setStep(0);
    }, 4000);
  };

  // Filter tabs dynamically based on logged in role
  const tabs = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser === "waiter") {
      return [{ id: "pos", label: "የዌይተር POS", icon: Smartphone }];
    }
    // Owner can access all tabs
    return [
      { id: "pos", label: "የዌይተር POS", icon: Smartphone },
      { id: "admin", label: "የባለቤት ፓነል", icon: Lock },
      { id: "telegram", label: "ቴሌግራም ሪፖርት", icon: MessageCircle },
    ];
  }, [currentUser]);

  // If not logged in, show the Login screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: FONT_STACK }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-8px); }
          40%, 60% { transform: translateX(8px); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <header className="bg-gray-900 sticky top-0 z-30 border-b border-gray-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold leading-tight">አል ባሻ አል መንዲ</p>
              <p className="text-gray-400 text-xs">
                {currentUser === "owner" ? "🛡️ የባለቤት መዳረሻ (Owner Panel)" : "🧑‍🍳 የዌይተር መዳረሻ (Waiter POS)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 bg-gray-800 rounded-xl p-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    activeTab === t.id
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors active:scale-95 border border-red-500/20"
              title="ውጣ (Lock)"
            >
              <LogOut className="w-4 h-4" />
              <span>ውጣ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {activeTab === "pos" && (
          <POSTab
            menu={menu}
            addToCart={addToCart}
            cart={cart}
            changeQty={changeQty}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            cartTotal={cartTotal}
            sendToKitchen={sendToKitchen}
            sending={sending}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        )}
        {currentUser === "owner" && activeTab === "admin" && (
          <AdminTab
            menu={menu}
            changeStock={changeStock}
            toggleOutOfStock={toggleOutOfStock}
            revenue={revenue}
            orderCount={orderCount}
            bestSeller={bestSeller}
            revenueByMethod={revenueByMethod}
          />
        )}
        {currentUser === "owner" && activeTab === "telegram" && (
          <TelegramTab revenue={revenue} orderCount={orderCount} bestSeller={bestSeller} revenueByMethod={revenueByMethod} />
        )}
      </main>

      {/* Mobile bottom tab bar */}
      {tabs.length > 1 && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-gray-900 border-t border-gray-800 px-2 py-2 flex items-center justify-around shadow-lg">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg transition-all duration-200 active:scale-95 ${
                activeTab === t.id ? "text-amber-400" : "text-gray-500"
              }`}
            >
              <t.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{t.label}</span>
            </button>
          ))}
        </nav>
      )}

      <KitchenOverlay
        visible={sending}
        step={step}
        table={lastCheckoutTable}
        method={lastCheckoutMethod}
        total={lastCheckoutTotal}
      />
    </div>
  );
}
