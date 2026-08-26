import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import {
  ArrowDownToLine, ArrowUpRight, Bell, ChevronRight, Gift, History,
  Home, IndianRupee, LockKeyhole, Menu, QrCode, ScanLine, Send,
  ShieldCheck, Sparkles, UserRound, WalletCards, Zap
} from "lucide-react";
import "./styles.css";
import ssLogo from "./assets/ss-enterprises-logo.png";

const offers = [
  {title:"Recharge & Earn", text:"Get rewards on eligible recharges", icon:"⚡"},
  {title:"Bill Pay Bonus", text:"Pay bills and unlock reward points", icon:"🎁"},
  {title:"Refer & Earn", text:"Invite friends and earn rewards", icon:"👥"}
];

function App(){
  const [tab,setTab]=useState("home");
  const [showBalance,setShowBalance]=useState(true);

  return <div className="app">
    <header className="topbar">
      <div className="brand">
        <div className="brand-logo"><img src={ssLogo} alt="SS Enterprises"/></div>
        <div><b>SSPay</b><small>by SS Enterprises</small></div>
      </div>
      <div className="top-actions">
        <button><Bell size={19}/></button>
        <button><Menu size={20}/></button>
      </div>
    </header>

    <main>
      {tab==="home" && <>
        <section className="hero-card">
          <div className="hero-glow"></div>
          <div className="hero-top">
            <span>Available Balance</span>
            <button onClick={()=>setShowBalance(!showBalance)}>{showBalance ? "Hide" : "Show"}</button>
          </div>
          <div className="balance">{showBalance ? "₹ 25,840.00" : "₹ ••••••"}</div>
          <div className="hero-bottom">
            <span>SS Enterprises</span><span>Secure • Verified</span>
          </div>
        </section>

        <section className="quick-grid">
          <Quick icon={<ScanLine/>} text="Scan & Pay"/>
          <Quick icon={<Send/>} text="Send Money"/>
          <Quick icon={<ArrowDownToLine/>} text="Receive"/>
          <Quick icon={<IndianRupee/>} text="Bank Transfer"/>
        </section>

        <section className="section-head"><h2>Pay & Services</h2><ChevronRight size={18}/></section>
        <section className="service-grid">
          <Service icon="📱" text="Mobile Recharge"/>
          <Service icon="💡" text="Electricity"/>
          <Service icon="🌐" text="DTH / Broadband"/>
          <Service icon="🧾" text="All Bills"/>
        </section>

        <section className="offers-head">
          <div><span className="eyebrow">EXCLUSIVE</span><h2>SSPay Offers</h2></div>
          <button onClick={()=>setTab("offers")}>View all <ChevronRight size={16}/></button>
        </section>
        <div className="offers-row">
          {offers.map((o,i)=><div className="offer-card" key={i}>
            <div className="offer-icon">{o.icon}</div><b>{o.title}</b><p>{o.text}</p>
            <span className="claim">Explore <ChevronRight size={14}/></span>
          </div>)}
        </div>

        <section className="section-head"><h2>SSPay Card</h2><button className="text-btn" onClick={()=>setTab("card")}>Manage</button></section>
        <div className="bank-card" onClick={()=>setTab("card")}>
          <div className="card-brand"><img src={ssLogo} alt="SS Enterprises"/> <span>SSPay</span></div>
          <div className="chip"></div>
          <div className="card-number">••••  ••••  ••••  5824</div>
          <div className="card-meta"><span>SS ENTERPRISES</span><span>VIRTUAL CARD</span></div>
        </div>
      </>}

      {tab==="offers" && <Page title="SSPay Offers" icon={<Gift/>}>
        <div className="offer-banner"><Sparkles/><div><b>Smart rewards, made for you.</b><p>Discover available promotions inside SSPay.</p></div></div>
        {offers.concat([
          {title:"Welcome Reward",text:"Special reward for eligible new users",icon:"✨"},
          {title:"Festival Specials",text:"Seasonal offers when available",icon:"🪔"}
        ]).map((o,i)=><div className="large-offer" key={i}><span>{o.icon}</span><div><b>{o.title}</b><p>{o.text}</p></div><ChevronRight/></div>)}
      </Page>}

      {tab==="card" && <Page title="SSPay Card" icon={<WalletCards/>}>
        <div className="bank-card big">
          <div className="card-brand"><img src={ssLogo} alt="SS Enterprises"/> <span>SSPay</span></div><div className="chip"></div>
          <div className="card-number">5824  ••••  ••••  9012</div>
          <div className="card-meta"><span>SS ENTERPRISES</span><span>VIRTUAL</span></div>
        </div>
        <div className="security-box"><ShieldCheck/><div><b>Secure by design</b><p>Card details are masked in normal view.</p></div></div>
        <div className="service-grid card-controls">
          <Service icon="🔒" text="Freeze Card"/><Service icon="👁️" text="Card Details"/>
          <Service icon="⚙️" text="Card Settings"/><Service icon="🧾" text="Card History"/>
        </div>
      </Page>}

      {tab==="history" && <Page title="Transactions" icon={<History/>}>
        {["UPI Payment • Merchant","Mobile Recharge","Received from Rahul","Electricity Bill"].map((x,i)=>
          <div className="transaction" key={i}><div className="txn-icon">{i===2?"↓":"↑"}</div><div><b>{x}</b><small>Today • {10+i}:2{i} AM</small></div><strong className={i===2?"credit":""}>{i===2?"+ ₹2,000":"- ₹"+[540,299,780][i%3]}</strong></div>
        )}
      </Page>}

      {tab==="profile" && <Page title="Profile" icon={<UserRound/>}>
        <div className="profile-card"><div className="avatar">SS</div><div><h2>SS Enterprises</h2><p>Verified business profile</p></div><ShieldCheck/></div>
        {["Account & KYC","Security & PIN","Notifications","Help & Support"].map(x=><div className="setting"><span>{x}</span><ChevronRight/></div>)}
      </Page>}
    </main>

    <nav className="bottom-nav">
      <Nav active={tab==="home"} icon={<Home/>} text="Home" onClick={()=>setTab("home")}/>
      <Nav active={tab==="offers"} icon={<Gift/>} text="Offers" onClick={()=>setTab("offers")}/>
      <button className="scan-main" onClick={()=>alert("Scan & Pay screen coming next") }><QrCode/></button>
      <Nav active={tab==="history"} icon={<History/>} text="History" onClick={()=>setTab("history")}/>
      <Nav active={tab==="profile"} icon={<UserRound/>} text="Profile" onClick={()=>setTab("profile")}/>
    </nav>
  </div>
}

function Quick({icon,text}){return <button className="quick"><span>{icon}</span><b>{text}</b></button>}
function Service({icon,text}){return <button className="service"><span>{icon}</span><b>{text}</b></button>}
function Nav({active,icon,text,onClick}){return <button className={active?"nav active":"nav"} onClick={onClick}>{icon}<small>{text}</small></button>}
function Page({title,icon,children}){return <section className="page"><div className="page-title">{icon}<h1>{title}</h1></div>{children}</section>}

createRoot(document.getElementById("root")).render(<App/>);