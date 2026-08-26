import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDownToLine, Bell, Check, ChevronRight, Eye, EyeOff, Gift, History, Home, IndianRupee, KeyRound, LockKeyhole, Menu, QrCode, ScanLine, Send, ShieldCheck, Sparkles, UserRound, WalletCards, X, Smartphone, Building2, Receipt, Zap, CreditCard, CircleDollarSign } from "lucide-react";
import "./styles.css";
import ssLogo from "./assets/ss-enterprises-logo.png";

const offers = [
  { title: "Recharge & Earn", text: "Get rewards on eligible recharges", icon: "⚡" },
  { title: "Bill Pay Bonus", text: "Pay bills and unlock reward points", icon: "🎁" },
  { title: "Refer & Earn", text: "Invite friends and earn rewards", icon: "👥" },
  { title: "Welcome Reward", text: "Special rewards for eligible users", icon: "✨" },
];
const services = [
  { icon: "📱", text: "Mobile Recharge" },
  { icon: "💡", text: "Electricity" },
  { icon: "🌐", text: "DTH / Broadband" },
  { icon: "🧾", text: "All Bills" },
];
const initialTransactions = [
  { title: "UPI Payment • Merchant", time: "Today • 10:20 AM", amount: "- ₹540", type: "debit" },
  { title: "Mobile Recharge", time: "Today • 11:12 AM", amount: "- ₹299", type: "debit" },
  { title: "Received from Rahul", time: "Today • 12:25 PM", amount: "+ ₹2,000", type: "credit" },
  { title: "Electricity Bill", time: "Yesterday • 08:40 PM", amount: "- ₹780", type: "debit" },
];
const MPIN_KEY = "sspay_demo_mpin_hash_v2";
const MPIN_ATTEMPTS_KEY = "sspay_demo_mpin_attempts_v2";
const MPIN_LOCK_KEY = "sspay_demo_mpin_lock_v2";
const USER_KEY = "sspay_demo_user_v1";

async function hashMPIN(pin) {
  const bytes = new TextEncoder().encode(`SSPAY-MPIN:${pin}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function readStoredNumber(key, fallback = 0) { const value = Number.parseInt(localStorage.getItem(key) || "", 10); return Number.isFinite(value) ? value : fallback; }
function readLockUntil() { const value = Number.parseInt(localStorage.getItem(MPIN_LOCK_KEY) || "", 10); return Number.isFinite(value) ? value : 0; }

function App() {
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; } });
  const [authMode, setAuthMode] = useState(() => localStorage.getItem(USER_KEY) ? "login" : "signup");
  const [showBalance, setShowBalance] = useState(true);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(null);
  const [mpinMode, setMpinMode] = useState("create");
  const [hasMPIN, setHasMPIN] = useState(() => Boolean(localStorage.getItem(MPIN_KEY)));
  const [attempts, setAttempts] = useState(() => readStoredNumber(MPIN_ATTEMPTS_KEY));
  const [lockUntil, setLockUntil] = useState(() => readLockUntil());
  const [remainingLock, setRemainingLock] = useState(0);
  const [mpinError, setMpinError] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [transactions, setTransactions] = useState(() => { try { return JSON.parse(localStorage.getItem("sspay_demo_transactions") || "null") || initialTransactions; } catch { return initialTransactions; } });
  const locked = lockUntil > Date.now();

  useEffect(() => {
    const timer = window.setInterval(() => {
      const until = readLockUntil(); const seconds = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      setLockUntil(until); setRemainingLock(seconds);
      if (seconds === 0 && until) { localStorage.removeItem(MPIN_LOCK_KEY); localStorage.setItem(MPIN_ATTEMPTS_KEY, "0"); setAttempts(0); }
    }, 500);
    return () => window.clearInterval(timer);
  }, []);
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };
  const handleSignup = (profile) => {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile); setAuthMode("login"); notify("Account created successfully");
  };
  const handleLogin = (profile) => {
    setUser(profile); setTab("home"); notify(`Welcome ${profile.name || "to SSPay"}`);
  };
  const logout = () => { setUser(null); setAuthMode("login"); setModal(null); };
  const openMPIN = (mode = "create") => { setMpinMode(mode); setMpinError(""); setModal("mpin"); };
  const requireMPIN = (action) => {
    if (!hasMPIN) { setPendingAction(action); openMPIN("create"); return; }
    if (locked) { notify(`MPIN locked. Try again in ${remainingLock}s`); return; }
    setPendingAction(action); setMpinError(""); setModal("verify");
  };
  const finishPendingAction = () => { const action = pendingAction; setPendingAction(""); setModal(action ? "action" : null); };
  const handleCreateMPIN = async (pin) => {
    if (!/^\d{4,6}$/.test(pin)) { setMpinError("MPIN 4–6 digits का होना चाहिए"); return false; }
    localStorage.setItem(MPIN_KEY, await hashMPIN(pin)); localStorage.setItem(MPIN_ATTEMPTS_KEY, "0"); localStorage.removeItem(MPIN_LOCK_KEY);
    setHasMPIN(true); setAttempts(0); setMpinError(""); notify("MPIN successfully created"); return true;
  };
  const handleChangeMPIN = async (oldPin, newPin) => {
    if (!/^\d{4,6}$/.test(newPin)) { setMpinError("New MPIN 4–6 digits का होना चाहिए"); return false; }
    const saved = localStorage.getItem(MPIN_KEY);
    if (!saved || (await hashMPIN(oldPin)) !== saved) { setMpinError("Current MPIN गलत है"); return false; }
    localStorage.setItem(MPIN_KEY, await hashMPIN(newPin)); localStorage.setItem(MPIN_ATTEMPTS_KEY, "0"); setAttempts(0); setMpinError(""); notify("MPIN changed successfully"); return true;
  };
  const handleVerifyMPIN = async (pin) => {
    if (locked) { setMpinError(`Too many attempts. Try again in ${remainingLock}s`); return false; }
    const saved = localStorage.getItem(MPIN_KEY);
    if (saved && (await hashMPIN(pin)) === saved) { localStorage.setItem(MPIN_ATTEMPTS_KEY, "0"); setAttempts(0); setMpinError(""); finishPendingAction(); return true; }
    const next = attempts + 1;
    if (next >= 3) { const until = Date.now() + 60000; localStorage.setItem(MPIN_LOCK_KEY, String(until)); localStorage.setItem(MPIN_ATTEMPTS_KEY, "0"); setLockUntil(until); setAttempts(0); setMpinError("3 गलत attempts. MPIN 60 seconds के लिए locked है"); }
    else { localStorage.setItem(MPIN_ATTEMPTS_KEY, String(next)); setAttempts(next); setMpinError(`गलत MPIN — ${3 - next} attempt बाकी`); }
    return false;
  };
  const closeMpin = () => {
    setMpinError("");
    if (mpinMode === "create" && hasMPIN && pendingAction) { setModal("action"); return; }
    setModal(null); setPendingAction("");
  };
  const addTransaction = (title, amount, type = "debit") => {
    const now = new Date(); const time = `Today • ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    const next = [{ title, time, amount, type }, ...transactions]; setTransactions(next); localStorage.setItem("sspay_demo_transactions", JSON.stringify(next));
  };
  const completeAction = (action, result) => { if (result) addTransaction(result.title, result.amount, result.type); setModal(null); notify(result?.message || `${action} completed successfully`); };
  const securityStatus = useMemo(() => locked ? `Locked • ${remainingLock}s` : hasMPIN ? "MPIN protected" : "MPIN not set", [hasMPIN, locked, remainingLock]);

  if (!user) return <AuthScreen mode={authMode} onModeChange={setAuthMode} onSignup={handleSignup} onLogin={handleLogin} />;

  return <div className="app">
    <header className="topbar"><div className="brand"><div className="brand-logo"><img src={ssLogo} alt="SS Enterprises" /></div><div className="brand-text"><strong>SSPay</strong><small>by SS Enterprises</small></div></div><div className="top-actions"><button type="button" onClick={() => notify("No new notifications")}><Bell size={19}/></button><button type="button" onClick={() => setTab("profile")}><Menu size={20}/></button></div></header>
    <main>
      {tab === "home" && <>
        <section className="hero-card"><div className="hero-glow"/><div className="hero-top"><span>Demo Wallet Balance</span><button type="button" onClick={() => setShowBalance(v => !v)}>{showBalance ? "Hide" : "Show"}</button></div><div className="balance">{showBalance ? "₹ 0.00" : "₹ ••••••"}</div><div className="hero-bottom"><span>SS Enterprises</span><span className="verified"><ShieldCheck size={13}/>Secure • Verified</span></div></section>
        <section className="quick-grid"><QuickAction icon={<ScanLine/>} text="Scan & Pay" onClick={() => requireMPIN("Scan & Pay")}/><QuickAction icon={<Send/>} text="Send Money" onClick={() => requireMPIN("Send Money")}/><QuickAction icon={<ArrowDownToLine/>} text="Receive" onClick={() => requireMPIN("Receive Money")}/><QuickAction icon={<IndianRupee/>} text="Bank Transfer" onClick={() => requireMPIN("Bank Transfer")}/></section>
        <SectionHeader title="Pay & Services"/><section className="service-grid">{services.map(s => <Service key={s.text} icon={s.icon} text={s.text} onClick={() => requireMPIN(s.text)}/>)}</section>
        <section className="offers-head"><div><span className="eyebrow">EXCLUSIVE</span><h2>SSPay Offers</h2></div><button type="button" onClick={() => setTab("offers")}>View all <ChevronRight size={16}/></button></section><div className="offers-row">{offers.slice(0,3).map(o => <OfferCard key={o.title} offer={o} onClick={() => notify(`${o.title} selected`)}/>)}</div>
        <SectionHeader title="SSPay Card" action={<button className="text-btn" type="button" onClick={() => setTab("card")}>Manage</button>}/><button className="bank-card" type="button" onClick={() => setTab("card")}><CardFace/></button>
      </>}
      {tab === "offers" && <PageHeader title="SSPay Offers" icon={<Gift/>} onBack={() => setTab("home")}><div className="offer-banner"><Sparkles size={23}/><div><strong>Smart rewards, made for you.</strong><p>Discover available promotions and rewards inside SSPay.</p></div></div>{offers.map(o => <button className="large-offer" type="button" key={o.title} onClick={() => notify(`${o.title} selected`)}><span>{o.icon}</span><div><strong>{o.title}</strong><p>{o.text}</p></div><ChevronRight size={18}/></button>)}</PageHeader>}
      {tab === "card" && <PageHeader title="SSPay Card" icon={<WalletCards/>} onBack={() => setTab("home")}><div className="bank-card big"><CardFace/></div><div className="security-box"><ShieldCheck size={24}/><div><strong>Secure by design</strong><p>Card details are masked in normal view.</p></div></div><div className="section-head"><h2>Card Controls</h2></div><section className="service-grid card-controls"><Service icon="🔒" text="Freeze Card" onClick={() => requireMPIN("Freeze Card")}/><Service icon="👁️" text="Card Details" onClick={() => requireMPIN("Card Details")}/><Service icon="⚙️" text="Card Settings" onClick={() => notify("Card settings opened")}/><Service icon="🧾" text="Card History" onClick={() => setTab("history")}/></section></PageHeader>}
      {tab === "history" && <PageHeader title="Transactions" icon={<History/>} onBack={() => setTab("home")}><div className="transaction-list">{transactions.map((t,i)=><div className="transaction" key={`${t.title}-${i}`}><div className="txn-icon">{t.type === "credit" ? "↓" : "↑"}</div><div className="txn-details"><strong>{t.title}</strong><small>{t.time}</small></div><strong className={t.type === "credit" ? "credit" : ""}>{t.amount}</strong></div>)}</div></PageHeader>}
      {tab === "profile" && <PageHeader title="Profile" icon={<UserRound/>} onBack={() => setTab("home")}><div className="profile-card"><div className="avatar">SS</div><div><h2>{user.name || "SS Enterprises"}</h2><p>{user.mobile ? `+91 ${user.mobile}` : "Verified business profile"}</p></div><ShieldCheck size={21}/></div><button className="setting" type="button" onClick={() => notify("Account & KYC opened")}><span>Account & KYC</span><ChevronRight size={17}/></button><button className="setting security-setting" type="button" onClick={() => openMPIN(hasMPIN ? "change" : "create")}><span><strong>Security & MPIN</strong><small>{securityStatus}</small></span><ChevronRight size={17}/></button><button className="setting" type="button" onClick={() => notify("Notifications opened")}><span>Notifications</span><ChevronRight size={17}/></button><button className="setting" type="button" onClick={() => notify("Help & Support opened")}><span>Help & Support</span><ChevronRight size={17}/></button><button className="setting logout-setting" type="button" onClick={logout}><span><strong>Logout</strong><small>Sign out from this demo account</small></span><ChevronRight size={17}/></button></PageHeader>}
    </main>
    <nav className="bottom-nav"><NavButton active={tab === "home"} icon={<Home/>} text="Home" onClick={() => setTab("home")}/><NavButton active={tab === "offers"} icon={<Gift/>} text="Offers" onClick={() => setTab("offers")}/><button className="scan-main" type="button" onClick={() => requireMPIN("Scan & Pay")}><QrCode/></button><NavButton active={tab === "history"} icon={<History/>} text="History" onClick={() => setTab("history")}/><NavButton active={tab === "profile"} icon={<UserRound/>} text="Profile" onClick={() => setTab("profile")}/></nav>
    {toast && <div className="toast">{toast}</div>}
    {modal === "mpin" && <MPINModal mode={mpinMode} locked={locked} remainingLock={remainingLock} error={mpinError} onClose={closeMpin} onCreate={handleCreateMPIN} onChange={handleChangeMPIN}/>} 
    {modal === "verify" && <VerifyModal action={pendingAction} locked={locked} remainingLock={remainingLock} attempts={attempts} error={mpinError} onClose={() => {setModal(null);setMpinError("");setPendingAction("")}} onVerify={handleVerifyMPIN}/>} 
    {modal === "action" && <ActionModal action={pendingAction} onClose={() => {setModal(null);setPendingAction("")}} onComplete={completeAction}/>} 
  </div>;
}

function ActionModal({ action, onClose, onComplete }) {
  const [value, setValue] = useState({});
  const [error, setError] = useState("");
  const key = String(action || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const canonical = key === "scanpay" || key === "scanandpay" ? "Scan & Pay"
    : key === "sendmoney" ? "Send Money"
    : key === "receive" || key === "receivemoney" ? "Receive Money"
    : key === "banktransfer" ? "Bank Transfer"
    : key === "mobilerecharge" || key === "recharge" ? "Mobile Recharge"
    : key === "electricity" ? "Electricity"
    : key === "dthbroadband" || key === "dth" || key === "broadband" ? "DTH / Broadband"
    : key === "allbills" || key === "bills" ? "All Bills"
    : key === "freezecard" ? "Freeze Card"
    : key === "carddetails" ? "Card Details"
    : action;
  const set = (name, val) => setValue(v => ({ ...v, [name]: val }));

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (canonical === "Scan & Pay") {
      if (!value.upi) return setError("UPI ID / QR reference डालें");
      if (!/^.{3,}$/.test(value.upi)) return setError("Valid UPI ID डालें");
      return onComplete(canonical, { title: `UPI Payment • ${value.upi}`, amount: `- ₹${Number(value.amount || 0).toFixed(2)}`, type: "debit", message: "Scan & Pay demo transaction completed" });
    }
    if (canonical === "Send Money") {
      if (!value.upi) return setError("UPI ID या mobile number डालें");
      if (!value.amount || Number(value.amount) <= 0) return setError("Valid amount डालें");
      return onComplete(canonical, { title: `Sent to ${value.upi}`, amount: `- ₹${Number(value.amount).toFixed(2)}`, type: "debit", message: "Send Money demo transaction completed" });
    }
    if (canonical === "Receive Money") return onComplete(canonical, { title: "Receive Money • Request created", amount: "+ ₹0.00", type: "credit", message: "Receive request ready — share your UPI ID/QR with the payer" });
    if (canonical === "Bank Transfer") {
      if (!/^\d{9,18}$/.test(value.account || "")) return setError("Valid account number डालें");
      if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(value.ifsc || "")) return setError("Valid IFSC डालें");
      if (!value.amount || Number(value.amount) <= 0) return setError("Valid amount डालें");
      return onComplete(canonical, { title: `Bank Transfer • ${value.account.slice(-4)}`, amount: `- ₹${Number(value.amount).toFixed(2)}`, type: "debit", message: "Bank Transfer demo request submitted" });
    }
    if (canonical === "Mobile Recharge") {
      if (!/^\d{10}$/.test(value.mobile || "")) return setError("10 digit mobile number डालें");
      if (!value.amount || Number(value.amount) <= 0) return setError("Recharge amount डालें");
      return onComplete(canonical, { title: `Mobile Recharge • ${value.mobile}`, amount: `- ₹${Number(value.amount).toFixed(2)}`, type: "debit", message: "Mobile recharge demo order created" });
    }
    if (["Electricity", "DTH / Broadband", "All Bills"].includes(canonical)) {
      if (!value.consumer) return setError("Consumer / account number डालें");
      if (!value.amount || Number(value.amount) <= 0) return setError("Bill amount डालें");
      return onComplete(canonical, { title: `${canonical} • ${value.consumer}`, amount: `- ₹${Number(value.amount).toFixed(2)}`, type: "debit", message: `${canonical} demo payment created` });
    }
    if (canonical === "Freeze Card") return onComplete(canonical, { message: "Card freeze request completed in demo" });
    if (canonical === "Card Details") return onComplete(canonical, { message: "Card details unlocked for this demo session" });
    return onComplete(canonical, { message: `${canonical} demo action completed` });
  };

  const fields = () => {
    if (canonical === "Scan & Pay") return <><Field label="UPI ID / QR reference" value={value.upi || ""} onChange={v => set("upi", v)} placeholder="name@upi"/><Field label="Amount" value={value.amount || ""} onChange={v => set("amount", v)} type="number" placeholder="0"/></>;
    if (canonical === "Send Money") return <><Field label="UPI ID / Mobile" value={value.upi || ""} onChange={v => set("upi", v)} placeholder="name@upi / 10 digit mobile"/><Field label="Amount" value={value.amount || ""} onChange={v => set("amount", v)} type="number" placeholder="0"/></>;
    if (canonical === "Receive Money") return <ReceivePanel/>;
    if (canonical === "Bank Transfer") return <><Field label="Account Number" value={value.account || ""} onChange={v => set("account", v.replace(/\D/g, ""))} inputMode="numeric"/><Field label="IFSC" value={value.ifsc || ""} onChange={v => set("ifsc", v.toUpperCase())} placeholder="SBIN0001234"/><Field label="Amount" value={value.amount || ""} onChange={v => set("amount", v)} type="number"/></>;
    if (canonical === "Mobile Recharge") return <><Field label="Mobile Number" value={value.mobile || ""} onChange={v => set("mobile", v.replace(/\D/g, ""))} inputMode="numeric"/><Field label="Operator" value={value.operator || ""} onChange={v => set("operator", v)} placeholder="Jio / Airtel / Vi / BSNL"/><Field label="Amount" value={value.amount || ""} onChange={v => set("amount", v)} type="number"/></>;
    if (["Electricity", "DTH / Broadband", "All Bills"].includes(canonical)) return <><Field label="Consumer / Account Number" value={value.consumer || ""} onChange={v => set("consumer", v)}/><Field label="Amount" value={value.amount || ""} onChange={v => set("amount", v)} type="number" placeholder="0"/></>;
    if (canonical === "Freeze Card") return <div className="action-confirm"><ShieldCheck size={28}/><p>Card freeze request will be recorded in this demo.</p></div>;
    if (canonical === "Card Details") return <div className="action-confirm"><CreditCard size={28}/><p>Demo card details are already visible on the card screen.</p></div>;
    return <div className="action-confirm"><ShieldCheck size={28}/><p>This demo action is ready.</p></div>;
  };
  const instant = ["Receive Money", "Freeze Card", "Card Details"].includes(canonical);
  return <div className="modal-backdrop"><form className="mpin-modal action-modal" onSubmit={submit}><div className="modal-head"><div className="modal-icon"><ActionIcon action={canonical}/></div><button type="button" className="modal-close" onClick={onClose}><X size={18}/></button></div><h2>{canonical}</h2><p className="modal-subtitle">{instant ? "यह demo flow है। Real bank/UPI transaction के लिए authorized backend/provider connection जरूरी होगा।" : "Details भरें और Continue दबाएँ। यह अभी demo transaction flow है।"}</p>{fields()}{error && <div className="mpin-error">{error}</div>}<button className="primary-action" type="submit">{instant ? <><Check size={16}/> Continue</> : <><Check size={16}/> Submit</>}</button></form></div>;
}
function AuthScreen({mode, onModeChange, onSignup, onLogin}) {
  const [name,setName]=useState(""); const [mobile,setMobile]=useState(""); const [password,setPassword]=useState(""); const [confirm,setConfirm]=useState(""); const [error,setError]=useState("");
  const submit=(e)=>{ e.preventDefault(); setError("");
    if(mode==="signup") {
      if(!name.trim()) return setError("Name डालें");
      if(!/^\d{10}$/.test(mobile)) return setError("10 digit mobile number डालें");
      if(password.length<4) return setError("Password कम से कम 4 characters का होना चाहिए");
      if(password!==confirm) return setError("Password match नहीं कर रहा");
      onSignup({name:name.trim(),mobile,password});
    } else {
      const saved=localStorage.getItem(USER_KEY); let profile=null; try { profile=JSON.parse(saved||"null"); } catch {}
      if(!profile) return setError("पहले Sign Up करें");
      if(mobile!==profile.mobile || password!==profile.password) return setError("Mobile number या password गलत है");
      onLogin(profile);
    }
  };
  return <div className="auth-screen"><div className="auth-card"><div className="auth-brand"><div className="brand-logo"><img src={ssLogo} alt="SS Enterprises"/></div><div><strong>SSPay</strong><small>by SS Enterprises</small></div></div><div className="auth-tabs"><button type="button" className={mode==="login"?"active":""} onClick={()=>{onModeChange("login");setError("")}}>Login</button><button type="button" className={mode==="signup"?"active":""} onClick={()=>{onModeChange("signup");setError("")}}>Sign Up</button></div><h1>{mode==="signup"?"Create your SSPay account":"Welcome back"}</h1><p className="auth-subtitle">{mode==="signup"?"Paytm-style demo onboarding के लिए अपना basic profile बनाइए।":"अपने SSPay demo account में login करें।"}</p><form onSubmit={submit}>{mode==="signup"&&<label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}<label>Mobile Number<input inputMode="numeric" maxLength={10} value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,""))} placeholder="10 digit mobile number"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create password"/></label>{mode==="signup"&&<label>Confirm Password<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm password"/></label>}{error&&<div className="mpin-error">{error}</div>}<button className="primary-action" type="submit">{mode==="signup"?"Create Account":"Login"}</button></form>{mode==="login"&&<button className="auth-switch" type="button" onClick={()=>onModeChange("signup")}>New user? <strong>Sign Up</strong></button>}{mode==="signup"&&<button className="auth-switch" type="button" onClick={()=>onModeChange("login")}>Already have an account? <strong>Login</strong></button>}<p className="demo-note">Demo only: account details इस browser में local storage में रखे जाते हैं। Real banking login नहीं है।</p></div></div>;
}
function ActionIcon({action}) { if(action.includes("Recharge")) return <Smartphone size={20}/>; if(action.includes("Bank")) return <Building2 size={20}/>; if(action.includes("Bill")||action.includes("Electricity")) return <Receipt size={20}/>; if(action.includes("Send")) return <Send size={20}/>; if(action.includes("Receive")) return <ArrowDownToLine size={20}/>; if(action.includes("Scan")) return <ScanLine size={20}/>; if(action.includes("Card")) return <CreditCard size={20}/>; return <CircleDollarSign size={20}/>; }
function Field({label,value,onChange,type="text",placeholder="",inputMode}) { return <label className="action-field">{label}<input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} inputMode={inputMode}/></label>; }
function ReceivePanel(){ return <div className="receive-panel"><div className="fake-qr"><QrCode size={112}/></div><strong>SSPay Receive</strong><p>अपना UPI ID payer के साथ share करें।</p><div className="receive-id">ssenterprises@sspay</div></div>; }
function MPINModal({mode,locked,remainingLock,error,onClose,onCreate,onChange}) { const [oldPin,setOldPin]=useState("");const [pin,setPin]=useState("");const [confirm,setConfirm]=useState("");const [show,setShow]=useState(false);const [busy,setBusy]=useState(false);const submit=async e=>{e.preventDefault();if(mode==="change"&&!oldPin)return;if(pin!==confirm)return;setBusy(true);const ok=mode==="change"?await onChange(oldPin,pin):await onCreate(pin);setBusy(false);if(ok)onClose();};return <div className="modal-backdrop"><form className="mpin-modal" onSubmit={submit}><div className="modal-head"><div className="modal-icon"><KeyRound size={20}/></div><button type="button" className="modal-close" onClick={onClose}><X size={18}/></button></div><h2>{mode==="change"?"Change MPIN":"Create MPIN"}</h2><p className="modal-subtitle">4–6 digit MPIN set करें। Demo में hashed form में रखा जाएगा।</p>{mode==="change"&&<label>Current MPIN<input inputMode="numeric" maxLength={6} type={show?"text":"password"} value={oldPin} onChange={e=>setOldPin(e.target.value.replace(/\D/g,""))}/></label>}<label>New MPIN<input inputMode="numeric" maxLength={6} type={show?"text":"password"} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,""))}/></label><label>Confirm MPIN<input inputMode="numeric" maxLength={6} type={show?"text":"password"} value={confirm} onChange={e=>setConfirm(e.target.value.replace(/\D/g,""))}/></label><button type="button" className="show-pin" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={15}/>:<Eye size={15}/>} {show?"Hide MPIN":"Show MPIN"}</button>{pin&&confirm&&pin!==confirm&&<div className="mpin-error">MPIN match नहीं कर रहा</div>}{error&&<div className="mpin-error">{error}</div>}{locked&&<div className="mpin-lock"><LockKeyhole size={16}/> Locked • {remainingLock}s</div>}<button className="primary-action" type="submit" disabled={busy||locked||!pin||!confirm||pin!==confirm}>{busy?"Saving…":mode==="change"?"Change MPIN":"Create MPIN"}</button></form></div>; }
function VerifyModal({action,locked,remainingLock,attempts,error,onClose,onVerify}) { const [pin,setPin]=useState("");const [show,setShow]=useState(false);const [busy,setBusy]=useState(false);const submit=async e=>{e.preventDefault();setBusy(true);await onVerify(pin);setBusy(false);};return <div className="modal-backdrop"><form className="mpin-modal" onSubmit={submit}><div className="modal-head"><div className="modal-icon"><LockKeyhole size={20}/></div><button type="button" className="modal-close" onClick={onClose}><X size={18}/></button></div><h2>Verify MPIN</h2><p className="modal-subtitle">{action} से पहले MPIN verification जरूरी है।</p><label>MPIN<input autoFocus inputMode="numeric" maxLength={6} type={show?"text":"password"} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,""))}/></label><button type="button" className="show-pin" onClick={()=>setShow(v=>!v)}>{show?<EyeOff size={15}/>:<Eye size={15}/>} {show?"Hide MPIN":"Show MPIN"}</button>{error&&<div className="mpin-error">{error}</div>}{!error&&attempts>0&&<div className="attempt-note">{3-attempts} attempts remaining</div>}{locked&&<div className="mpin-lock">Try again in {remainingLock}s</div>}<button className="primary-action" type="submit" disabled={busy||locked||pin.length<4}>{busy?"Verifying…":<><Check size={16}/> Verify & Continue</>}</button></form></div>; }
function QuickAction({icon,text,onClick}){return <button className="quick" type="button" onClick={onClick}><span>{icon}</span><strong>{text}</strong></button>}
function Service({icon,text,onClick}){return <button className="service" type="button" onClick={onClick}><span>{icon}</span><strong>{text}</strong></button>}
function OfferCard({offer,onClick}){return <button className="offer-card" type="button" onClick={onClick}><div className="offer-icon">{offer.icon}</div><strong>{offer.title}</strong><p>{offer.text}</p><span className="claim">Explore <ChevronRight size={14}/></span></button>}
function CardFace(){return <><div className="card-brand"><img src={ssLogo} alt="SS Enterprises"/><span>SSPay</span></div><div className="chip"/><div className="card-number">5824&nbsp;&nbsp; 1706&nbsp;&nbsp; 4582&nbsp;&nbsp; 9012</div><div className="card-details"><div><small>CARD HOLDER</small><strong>SS ENTERPRISES</strong></div><div><small>VALID THRU</small><strong>08/30</strong></div><div><small>CVV</small><strong>482</strong></div></div><div className="card-meta"><span>SS ENTERPRISES</span><span>DEMO / VIRTUAL CARD</span></div></>}
function SectionHeader({title,action}){return <section className="section-head"><h2>{title}</h2>{action||<ChevronRight size={18}/>}</section>}
function NavButton({active,icon,text,onClick}){return <button className={active?"nav active":"nav"} type="button" onClick={onClick}>{icon}<small>{text}</small></button>}
function PageHeader({title,icon,onBack,children}){return <section className="page"><div className="page-title"><button className="back-button" type="button" onClick={onBack} aria-label="Back"><ChevronRight size={18}/></button>{icon}<h1>{title}</h1></div>{children}</section>}
createRoot(document.getElementById("root")).render(<App/>);
