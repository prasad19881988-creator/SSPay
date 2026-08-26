import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownToLine, ArrowLeft, Bell, Bus, Check, ChevronRight, CircleDollarSign,
  CreditCard, Eye, EyeOff, Fuel, Gift, History, Home, IndianRupee, KeyRound,
  LockKeyhole, Menu, Plane, QrCode, Receipt, ScanLine, Search, Send, ShieldCheck,
  Smartphone, TrainFront, Tv, UserRound, WalletCards, Wifi, X, Zap, Building2,
  Droplets, Gas, MoreHorizontal, Copy, Snowflake, Settings2
} from "lucide-react";
import "./styles.css";
import ssLogo from "./assets/ss-enterprises-logo.png";

const offers = [
  { title: "Mobile Recharge Cashback", text: "Save on eligible prepaid & postpaid recharges", icon: "⚡", tag: "UP TO ₹75" },
  { title: "Bill Pay Rewards", text: "Get reward points on eligible bill payments", icon: "🎁", tag: "REWARD" },
  { title: "Travel Deals", text: "Special fares and booking offers", icon: "✈️", tag: "TRAVEL" },
  { title: "Refer & Earn", text: "Invite friends and unlock rewards", icon: "👥", tag: "BONUS" },
];

const services = [
  { id: "mobile_recharge", icon: "📱", text: "Mobile Recharge" },
  { id: "electricity", icon: "💡", text: "Electricity" },
  { id: "dth_broadband", icon: "🌐", text: "DTH / Broadband" },
  { id: "all_bills", icon: "🧾", text: "All Bills" },
];

const bills = [
  ["electricity", "💡", "Electricity"], ["gas", "🔥", "Gas Cylinder"], ["water", "💧", "Water"],
  ["dth", "📺", "DTH"], ["broadband", "🌐", "Broadband"], ["fastag", "🚗", "FASTag"],
  ["insurance", "🛡️", "Insurance"], ["loan", "🏦", "Loan EMI"], ["credit_card", "💳", "Credit Card"],
];

const travel = [
  ["train", <TrainFront />, "Train"], ["flight", <Plane />, "Flights"], ["bus", <Bus />, "Bus"],
];

const initialTransactions = [
  { title: "UPI Payment • Merchant", time: "Today • 10:20 AM", amount: "- ₹540", type: "debit" },
  { title: "Mobile Recharge", time: "Today • 11:12 AM", amount: "- ₹299", type: "debit" },
  { title: "Received from Rahul", time: "Today • 12:25 PM", amount: "+ ₹2,000", type: "credit" },
  { title: "Electricity Bill", time: "Yesterday • 08:40 PM", amount: "- ₹780", type: "debit" },
];
const USER_KEY = "sspay_user_v3";

function App() {
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; } });
  const [authMode, setAuthMode] = useState(() => localStorage.getItem(USER_KEY) ? "login" : "signup");
  const [showBalance, setShowBalance] = useState(true);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(null);
  const [transactions, setTransactions] = useState(() => { try { return JSON.parse(localStorage.getItem("sspay_transactions_v3") || "null") || initialTransactions; } catch { return initialTransactions; } });
  const [cardFrozen, setCardFrozen] = useState(false);

  const notify = (message) => { setToast(message); window.clearTimeout(window.__sspayToast); window.__sspayToast = window.setTimeout(() => setToast(""), 2300); };
  const addTransaction = (title, amount, type = "debit") => {
    const now = new Date();
    const time = `Today • ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    const next = [{ title, time, amount, type }, ...transactions];
    setTransactions(next); localStorage.setItem("sspay_transactions_v3", JSON.stringify(next));
  };
  const finish = (result) => { if (result?.transaction) addTransaction(result.transaction.title, result.transaction.amount, result.transaction.type); setModal(null); notify(result?.message || "Request completed successfully"); };
  const open = (action, extra = {}) => setModal({ action, ...extra });
  const logout = () => { localStorage.removeItem(USER_KEY); setUser(null); setAuthMode("login"); setModal(null); };

  if (!user) return <AuthScreen mode={authMode} onModeChange={setAuthMode} onSignup={(p) => { localStorage.setItem(USER_KEY, JSON.stringify(p)); setUser(p); notify("Account created successfully"); }} onLogin={setUser} />;

  return <div className="app">
    <header className="topbar">
      <div className="brand"><div className="brand-logo"><img src={ssLogo} alt="SS Enterprises" /></div><div className="brand-text"><strong>SSPay</strong><small>by SS Enterprises</small></div></div>
      <div className="top-actions"><button onClick={() => notify("You are all caught up")}><Bell size={19}/></button><button onClick={() => setTab("profile")}><Menu size={20}/></button></div>
    </header>

    <main>
      {tab === "home" && <>
        <section className="hero-card"><div className="hero-glow"/><div className="hero-top"><span>Wallet Balance</span><button onClick={() => setShowBalance(v => !v)}>{showBalance ? "Hide" : "Show"}</button></div><div className="balance">{showBalance ? "₹ 0.00" : "₹ ••••••"}</div><div className="hero-bottom"><span>SS Enterprises</span><span className="verified"><ShieldCheck size={13}/>Secure • Verified</span></div></section>

        <section className="quick-grid">
          <QuickAction icon={<ScanLine/>} text="Scan & Pay" onClick={() => open("scan_pay")}/>
          <QuickAction icon={<Send/>} text="Send Money" onClick={() => open("send_money")}/>
          <QuickAction icon={<ArrowDownToLine/>} text="Receive" onClick={() => open("receive_money")}/>
          <QuickAction icon={<IndianRupee/>} text="Bank Transfer" onClick={() => open("bank_transfer")}/>
        </section>

        <SectionHeader title="Pay & Services" action={<button className="text-btn" onClick={() => setTab("bills")}>View all <ChevronRight size={16}/></button>}/>
        <section className="service-grid">{services.map(s => <Service key={s.id} icon={s.icon} text={s.text} onClick={() => open(s.id)}/>)}</section>

        <section className="section-head"><h2>Travel & Bookings</h2><button className="text-btn" onClick={() => setTab("travel")}>View all <ChevronRight size={16}/></button></section>
        <section className="travel-grid">{travel.map(([id, icon, text]) => <button className="travel-card" key={id} onClick={() => open(id)}><span>{icon}</span><strong>{text}</strong><small>Book now</small></button>)}</section>

        <section className="offers-head"><div><span className="eyebrow">EXCLUSIVE</span><h2>Offers for you</h2></div><button onClick={() => setTab("offers")}>View all <ChevronRight size={16}/></button></section>
        <div className="offers-row">{offers.slice(0,3).map(o => <OfferCard key={o.title} offer={o} onClick={() => open("offer", { offer: o })}/>)}</div>

        <SectionHeader title="SSPay Card" action={<button className="text-btn" onClick={() => setTab("card")}>Manage</button>}/>
        <div className="bank-card" role="button" tabIndex={0} onClick={() => setTab("card")} onKeyDown={e => (e.key === "Enter" || e.key === " ") && setTab("card")}><CardFace frozen={cardFrozen}/></div>
      </>}

      {tab === "bills" && <Page title="Bills & Recharges" icon={<Receipt/>} onBack={() => setTab("home")}>
        <div className="search-box"><Search size={18}/><input placeholder="Search bills, recharge or provider"/></div>
        <div className="category-grid">{bills.map(([id, icon, text]) => <Service key={id} icon={icon} text={text} onClick={() => open(id)}/>)}</div>
        <OfferStrip title="Extra savings on bill payments" text="Check the offer shown before you pay." onClick={() => setTab("offers")}/>
      </Page>}

      {tab === "travel" && <Page title="Travel & Bookings" icon={<Plane/>} onBack={() => setTab("home")}>
        <div className="travel-tabs"><button className="active">All</button><button>Train</button><button>Flights</button><button>Bus</button></div>
        <div className="travel-list">{travel.map(([id, icon, text]) => <button className="travel-list-card" key={id} onClick={() => open(id)}><span className="travel-icon">{icon}</span><div><strong>{text} tickets</strong><small>Search routes, dates & fares</small></div><ChevronRight/></button>)}</div>
        <OfferStrip title="Travel offers" text="Special fares and booking rewards can be displayed here." onClick={() => setTab("offers")}/>
      </Page>}

      {tab === "offers" && <Page title="Offers" icon={<Gift/>} onBack={() => setTab("home")}>
        <div className="offer-banner"><Gift size={24}/><div><strong>Save more with SSPay</strong><p>Available promotions are shown before eligible payments.</p></div></div>
        {offers.map(o => <button className="large-offer" key={o.title} onClick={() => open("offer", { offer: o })}><span>{o.icon}</span><div><b>{o.tag}</b><strong>{o.title}</strong><p>{o.text}</p></div><ChevronRight size={18}/></button>)}
      </Page>}

      {tab === "card" && <Page title="SSPay Card" icon={<WalletCards/>} onBack={() => setTab("home")}>
        <div className="card-screen"><CardFace large frozen={cardFrozen}/><div className="card-actions"><button onClick={() => setCardFrozen(v => !v)}><Snowflake size={18}/><span>{cardFrozen ? "Unfreeze card" : "Freeze card"}</span></button><button onClick={() => open("card_details")}><Eye size={18}/><span>Card details</span></button><button onClick={() => notify("Card settings opened")}><Settings2 size={18}/><span>Settings</span></button></div></div>
        <div className="security-box"><ShieldCheck size={24}/><div><strong>Secure card controls</strong><p>Manage your card, view details and control payments from one place.</p></div></div>
        <h2 className="mini-title">Recent card activity</h2><TransactionList transactions={transactions.slice(0,4)}/>
      </Page>}

      {tab === "history" && <Page title="Transactions" icon={<History/>} onBack={() => setTab("home")}><TransactionList transactions={transactions}/></Page>}
      {tab === "profile" && <Page title="Profile" icon={<UserRound/>} onBack={() => setTab("home")}>
        <div className="profile-card"><div className="avatar">SS</div><div><h2>{user.name || "SS Enterprises"}</h2><p>{user.mobile ? `+91 ${user.mobile}` : "Verified profile"}</p></div><ShieldCheck size={21}/></div>
        {["Account & KYC","Security & Privacy","Notifications","Help & Support"].map(x => <button className="setting" key={x} onClick={() => notify(`${x} opened`)}><span>{x}</span><ChevronRight size={17}/></button>)}
        <button className="setting logout-setting" onClick={logout}><span><strong>Logout</strong><small>Sign out from this account</small></span><ChevronRight size={17}/></button>
      </Page>}
    </main>

    <nav className="bottom-nav"><NavButton active={tab === "home"} icon={<Home/>} text="Home" onClick={() => setTab("home")}/><NavButton active={tab === "offers"} icon={<Gift/>} text="Offers" onClick={() => setTab("offers")}/><button className="scan-main" onClick={() => open("scan_pay")}><QrCode/></button><NavButton active={tab === "history"} icon={<History/>} text="History" onClick={() => setTab("history")}/><NavButton active={tab === "profile"} icon={<UserRound/>} text="Profile" onClick={() => setTab("profile")}/></nav>
    {toast && <div className="toast">{toast}</div>}
    {modal && <ActionModal modal={modal} onClose={() => setModal(null)} onComplete={finish} />}
  </div>;
}

function ActionModal({ modal, onClose, onComplete }) {
  const { action, offer } = modal;
  const [value, setValue] = useState({});
  const [error, setError] = useState("");
  const set = (k,v) => setValue(s => ({...s,[k]:v}));
  const labels = { scan_pay:"Scan & Pay", send_money:"Send Money", receive_money:"Receive Money", bank_transfer:"Bank Transfer", mobile_recharge:"Mobile Recharge", electricity:"Electricity", dth_broadband:"DTH / Broadband", all_bills:"All Bills", gas:"Gas Cylinder", water:"Water", dth:"DTH", broadband:"Broadband", fastag:"FASTag", insurance:"Insurance", loan:"Loan EMI", credit_card:"Credit Card", train:"Train Tickets", flight:"Flight Tickets", bus:"Bus Tickets", card_details:"Card Details", offer:"Offer Details" };
  const title = labels[action] || "Payment";
  const submit = (e) => {
    e.preventDefault(); setError("");
    if (action === "scan_pay") { if (!value.upi) return setError("UPI ID or QR reference डालें"); return onComplete({message:"Payment request created successfully", transaction:{title:`UPI Payment • ${value.upi}`,amount:`- ₹${Number(value.amount||0).toFixed(2)}`,type:"debit"}}); }
    if (action === "send_money") { if (!value.upi) return setError("UPI ID / mobile number डालें"); if (!(Number(value.amount)>0)) return setError("Amount डालें"); return onComplete({message:"Money transfer request created",transaction:{title:`Sent to ${value.upi}`,amount:`- ₹${Number(value.amount).toFixed(2)}`,type:"debit"}}); }
    if (action === "receive_money") return onComplete({message:"Your receive screen is ready"});
    if (action === "bank_transfer") { if (!/^\d{9,18}$/.test(value.account||"")) return setError("Valid account number डालें"); if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(value.ifsc||"")) return setError("Valid IFSC डालें"); if (!(Number(value.amount)>0)) return setError("Amount डालें"); return onComplete({message:"Bank transfer request created",transaction:{title:`Bank Transfer • ${value.account.slice(-4)}`,amount:`- ₹${Number(value.amount).toFixed(2)}`,type:"debit"}}); }
    if (action === "mobile_recharge") { if (!/^\d{10}$/.test(value.mobile||"")) return setError("10 digit mobile number डालें"); if (!value.operator) return setError("Operator चुनें"); if (!(Number(value.amount)>0)) return setError("Recharge amount डालें"); return onComplete({message:"Recharge order created successfully",transaction:{title:`${value.operator} Recharge • ${value.mobile}`,amount:`- ₹${Number(value.amount).toFixed(2)}`,type:"debit"}}); }
    if (["train","flight","bus"].includes(action)) { if (!value.from || !value.to || !value.date) return setError("From, To और Date भरें"); return onComplete({message:`${title} search ready — choose your preferred fare`}); }
    if (action === "offer") return onComplete({message:`${offer?.title || "Offer"} selected`});
    if (action === "card_details") return onComplete({message:"Card details panel opened"});
    if (!value.provider || !value.consumer) return setError("Provider और customer/account number भरें");
    if (!(Number(value.amount)>0)) return setError("Bill amount डालें");
    return onComplete({message:`${title} payment request created`,transaction:{title:`${title} • ${value.consumer}`,amount:`- ₹${Number(value.amount).toFixed(2)}`,type:"debit"}});
  };

  return <div className="modal-backdrop"><form className="mpin-modal action-modal" onSubmit={submit}>
    <div className="modal-head"><div className="modal-icon"><ActionIcon action={title}/></div><button type="button" className="modal-close" onClick={onClose}><X size={18}/></button></div>
    <h2>{title}</h2>
    {action === "scan_pay" ? <ScanPanel value={value} set={set}/> : action === "receive_money" ? <ReceivePanel/> : action === "offer" ? <OfferDetail offer={offer}/> : action === "card_details" ? <CardDetails/> : action === "mobile_recharge" ? <RechargePanel value={value} set={set}/> : ["train","flight","bus"].includes(action) ? <TravelForm value={value} set={set} type={action}/> : action === "send_money" ? <><Field label="UPI ID / Mobile" value={value.upi||""} onChange={v=>set("upi",v)} placeholder="name@upi / 10 digit mobile"/><AmountField value={value.amount||""} onChange={v=>set("amount",v)}/><OfferHint/></> : action === "bank_transfer" ? <><Field label="Account Number" value={value.account||""} onChange={v=>set("account",v.replace(/\D/g,""))} inputMode="numeric"/><Field label="IFSC" value={value.ifsc||""} onChange={v=>set("ifsc",v.toUpperCase())} placeholder="SBIN0001234"/><AmountField value={value.amount||""} onChange={v=>set("amount",v)}/></> : <BillForm action={action} value={value} set={set}/>} 
    {error && <div className="mpin-error">{error}</div>}
    {!["receive_money","offer","card_details"].includes(action) && <button className="primary-action" type="submit"><Check size={16}/> {action.includes("_") ? "Continue" : "Continue"}</button>}
    {(action === "offer" || action === "card_details") && <button className="primary-action" type="submit"><Check size={16}/> Continue</button>}
  </form></div>;
}

function ScanPanel({value,set}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanTimerRef = useRef(null);
  const [cameraState, setCameraState] = useState("starting");
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraState("unsupported");
        setCameraError("Is browser me camera access available nahi hai.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraState("ready");

        if ("BarcodeDetector" in window) {
          try {
            const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
            const scan = async () => {
              if (!videoRef.current || videoRef.current.readyState < 2) {
                scanTimerRef.current = window.setTimeout(scan, 500);
                return;
              }
              try {
                const codes = await detector.detect(videoRef.current);
                const raw = codes?.[0]?.rawValue;
                if (raw) {
                  set("upi", raw);
                  setCameraState("found");
                  return;
                }
              } catch {}
              scanTimerRef.current = window.setTimeout(scan, 450);
            };
            scan();
          } catch {}
        }
      } catch (err) {
        if (cancelled) return;
        setCameraState("error");
        setCameraError(err?.name === "NotAllowedError" ? "Camera permission allow kijiye." : "Camera start nahi ho paya.");
      }
    };
    startCamera();
    return () => {
      cancelled = true;
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [set]);

  const restartCamera = async () => {
    setCameraState("starting");
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play().catch(() => {}); }
      setCameraState("ready");
    } catch { setCameraState("error"); setCameraError("Camera permission allow kijiye."); }
  };

  return <>
    <div className="scanner scanner-live">
      <video ref={videoRef} className="scanner-video" playsInline muted autoPlay />
      <div className="scanner-overlay"><div className="scan-frame"><i/><i/><i/><i/></div><div className="scan-line"/></div>
      <div className="scanner-status">
        {cameraState === "starting" && <><ScanLine size={18}/> Camera start ho raha hai…</>}
        {cameraState === "ready" && <><ScanLine size={18}/> QR code ko frame ke andar rakhein</>}
        {cameraState === "found" && <><Check size={18}/> QR detected — details neeche verify karein</>}
        {(cameraState === "error" || cameraState === "unsupported") && <><X size={18}/> {cameraError}</>}
      </div>
    </div>
    {(cameraState === "error" || cameraState === "unsupported") && <button type="button" className="secondary-action" onClick={restartCamera}>Retry Camera</button>}
    <div className="or-line"><span>OR ENTER UPI ID</span></div>
    <Field label="UPI ID / QR reference" value={value.upi||""} onChange={v=>set("upi",v)} placeholder="name@upi"/>
    <AmountField value={value.amount||""} onChange={v=>set("amount",v)}/>
    <div className="scanner-note"><ShieldCheck size={15}/><span>Camera access sirf QR scan karne ke liye use hota hai.</span></div>
  </>;
}
function RechargePanel({value,set}) { const plans=["₹199 • 28 days","₹299 • 28 days","₹399 • 56 days","₹499 • 70 days"]; return <><Field label="Mobile Number" value={value.mobile||""} onChange={v=>set("mobile",v.replace(/\D/g,""))} inputMode="numeric" placeholder="10 digit mobile number"/><label className="action-field">Operator<select value={value.operator||""} onChange={e=>set("operator",e.target.value)}><option value="">Select operator</option><option>Jio</option><option>Airtel</option><option>Vi</option><option>BSNL</option></select></label><div className="plans"><div className="plans-title">Popular plans <span>Offers available</span></div>{plans.map(p=><button type="button" key={p} onClick={()=>set("amount",p.split(" ")[0].replace("₹",""))}>{p}<ChevronRight size={15}/></button>)}</div><AmountField value={value.amount||""} onChange={v=>set("amount",v)}/><OfferHint/></>; }
function BillForm({action,value,set}) { const providerLabel = action === "electricity" ? "Electricity board" : action === "gas" ? "Gas provider" : "Biller / Provider"; return <><label className="action-field">{providerLabel}<select value={value.provider||""} onChange={e=>set("provider",e.target.value)}><option value="">Select provider</option><option>Adani Electricity</option><option>BSES</option><option>Indraprastha Gas</option><option>Indian Oil</option><option>Tata Play</option><option>Airtel</option><option>JioFiber</option><option>Other provider</option></select></label><Field label="Consumer / Account Number" value={value.consumer||""} onChange={v=>set("consumer",v)} placeholder="Enter customer number"/><AmountField value={value.amount||""} onChange={v=>set("amount",v)}/><OfferHint/></>; }
function TravelForm({value,set,type}) { return <><div className="trip-route"><Field label="From" value={value.from||""} onChange={v=>set("from",v)} placeholder={type==="flight"?"Delhi":"New Delhi"}/><Field label="To" value={value.to||""} onChange={v=>set("to",v)} placeholder={type==="flight"?"Mumbai":"Lucknow"}/></div><Field label="Journey date" type="date" value={value.date||""} onChange={v=>set("date",v)}/><div className="trip-options"><button type="button">1 Traveller</button><button type="button">Economy</button><button type="button">{type === "train" ? "All classes" : "One way"}</button></div><OfferHint/></>; }
function OfferHint(){return <div className="offer-hint"><Zap size={16}/><div><strong>Offer available</strong><small>Eligible offers will appear before payment.</small></div><ChevronRight size={15}/></div>}
function AmountField({value,onChange}){return <Field label="Amount" value={value} onChange={onChange} type="number" placeholder="₹ 0"/>}
function Field({label,value,onChange,type="text",placeholder="",inputMode}){return <label className="action-field">{label}<input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder} inputMode={inputMode}/></label>}
function ReceivePanel(){return <div className="receive-panel"><div className="fake-qr"><QrCode size={120}/></div><strong>Receive payments</strong><p>Share your UPI ID or QR with the payer.</p><div className="receive-id">ssenterprises@sspay <Copy size={14}/></div></div>}
function OfferDetail({offer}){return <div className="offer-detail"><div className="offer-detail-icon">{offer?.icon || "🎁"}</div><b>{offer?.tag}</b><h3>{offer?.title}</h3><p>{offer?.text}</p><div className="offer-terms">✓ Eligible users only<br/>✓ Offer shown before payment<br/>✓ Terms may apply</div></div>}
function CardDetails(){return <div className="card-detail-panel"><ShieldCheck size={26}/><strong>Card details</strong><p>Use the card management screen to view or manage your card. Sensitive details should only be displayed after proper authentication.</p></div>}
function ActionIcon({action}){if(action.includes("Recharge"))return <Smartphone size={20}/>;if(action.includes("Bank"))return <Building2 size={20}/>;if(action.includes("Bill")||action.includes("Electricity")||action.includes("Gas")||action.includes("Water"))return <Receipt size={20}/>;if(action.includes("Send"))return <Send size={20}/>;if(action.includes("Receive"))return <ArrowDownToLine size={20}/>;if(action.includes("Scan"))return <ScanLine size={20}/>;if(action.includes("Train"))return <TrainFront size={20}/>;if(action.includes("Flight"))return <Plane size={20}/>;if(action.includes("Bus"))return <Bus size={20}/>;if(action.includes("Card"))return <CreditCard size={20}/>;return <CircleDollarSign size={20}/>;}

function AuthScreen({mode,onModeChange,onSignup,onLogin}){const[name,setName]=useState("");const[mobile,setMobile]=useState("");const[password,setPassword]=useState("");const[confirm,setConfirm]=useState("");const[error,setError]=useState("");const submit=e=>{e.preventDefault();setError("");if(mode==="signup"){if(!name.trim())return setError("Name डालें");if(!/^\d{10}$/.test(mobile))return setError("10 digit mobile number डालें");if(password.length<4)return setError("Password कम से कम 4 characters का होना चाहिए");if(password!==confirm)return setError("Password match नहीं कर रहा");onSignup({name:name.trim(),mobile,password});}else{let p=null;try{p=JSON.parse(localStorage.getItem(USER_KEY)||"null")}catch{}if(!p)return setError("पहले Sign Up करें");if(mobile!==p.mobile||password!==p.password)return setError("Mobile number या password गलत है");onLogin(p);}};return <div className="auth-screen"><div className="auth-card"><div className="auth-brand"><div className="brand-logo"><img src={ssLogo} alt="SS Enterprises"/></div><div><strong>SSPay</strong><small>by SS Enterprises</small></div></div><div className="auth-tabs"><button className={mode==="login"?"active":""} onClick={()=>{onModeChange("login");setError("")}}>Login</button><button className={mode==="signup"?"active":""} onClick={()=>{onModeChange("signup");setError("")}}>Sign Up</button></div><h1>{mode==="signup"?"Create your SSPay account":"Welcome back"}</h1><p className="auth-subtitle">Fast, simple payments and services in one place.</p><form onSubmit={submit}>{mode==="signup"&&<label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}<label>Mobile Number<input inputMode="numeric" maxLength={10} value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,""))} placeholder="10 digit mobile number"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password"/></label>{mode==="signup"&&<label>Confirm Password<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm password"/></label>}{error&&<div className="mpin-error">{error}</div>}<button className="primary-action" type="submit">{mode==="signup"?"Create Account":"Login"}</button></form><button className="auth-switch" onClick={()=>onModeChange(mode==="signup"?"login":"signup")}>{mode==="signup"?"Already have an account? ":"New user? "}<strong>{mode==="signup"?"Login":"Sign Up"}</strong></button></div></div>}
function CardFace({large=false,frozen=false}){const[show,setShow]=useState(false);return <div className={`card-visual ${large?"large":""} ${frozen?"frozen":""}`}><div className="card-shine"/><div className="card-brand"><img src={ssLogo} alt="SS Enterprises"/><span>SSPay</span></div><div className="card-top-label">VIRTUAL CARD</div><div className="chip"/><div className="contactless">)))</div><div className="card-number">{show?"5824 1706 4582 9012":"5824 •••• •••• 9012"}</div><div className="card-details"><div><small>CARD HOLDER</small><strong>SS ENTERPRISES</strong></div><div><small>VALID THRU</small><strong>08/30</strong></div><div><small>CVV</small><strong>{show?"482":"•••"}</strong></div></div><div className="card-bottom"><span>SSPAY</span><button onClick={(e)=>{e.stopPropagation();setShow(v=>!v)}}>{show?<EyeOff size={15}/>:<Eye size={15}/>} {show?"Hide":"View"}</button></div>{frozen&&<div className="frozen-badge"><Snowflake size={14}/> Card frozen</div>}</div>}
function TransactionList({transactions}){return <div className="transaction-list">{transactions.length?transactions.map((t,i)=><div className="transaction" key={`${t.title}-${i}`}><div className={`txn-icon ${t.type}`}>{t.type==="credit"?"↓":"↑"}</div><div className="txn-details"><strong>{t.title}</strong><small>{t.time}</small></div><strong className={t.type==="credit"?"credit":""}>{t.amount}</strong></div>):<div className="empty-state">No transactions yet</div>}</div>}
function QuickAction({icon,text,onClick}){return <button className="quick" onClick={onClick}><span>{icon}</span><strong>{text}</strong></button>}
function Service({icon,text,onClick}){return <button className="service" onClick={onClick}><span>{icon}</span><strong>{text}</strong></button>}
function OfferCard({offer,onClick}){return <button className="offer-card" onClick={onClick}><div className="offer-icon">{offer.icon}</div><b>{offer.tag}</b><strong>{offer.title}</strong><p>{offer.text}</p><span className="claim">Explore <ChevronRight size={14}/></span></button>}
function OfferStrip({title,text,onClick}){return <button className="offer-strip" onClick={onClick}><Gift size={22}/><div><strong>{title}</strong><small>{text}</small></div><ChevronRight/></button>}
function SectionHeader({title,action}){return <section className="section-head"><h2>{title}</h2>{action||<ChevronRight size={18}/>}</section>}
function NavButton({active,icon,text,onClick}){return <button className={active?"nav active":"nav"} onClick={onClick}>{icon}<small>{text}</small></button>}
function Page({title,icon,onBack,children}){return <section className="page"><div className="page-title"><button className="back-button" onClick={onBack}><ArrowLeft size={18}/></button>{icon}<h1>{title}</h1></div>{children}</section>}
createRoot(document.getElementById("root")).render(<App/>);
