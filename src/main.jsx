import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownToLine,
  Bell,
  ChevronRight,
  Gift,
  History,
  Home,
  IndianRupee,
  Menu,
  QrCode,
  ScanLine,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
} from "lucide-react";

import "./styles.css";
import ssLogo from "./assets/ss-enterprises-logo.png";

const offers = [
  {
    title: "Recharge & Earn",
    text: "Get rewards on eligible recharges",
    icon: "⚡",
  },
  {
    title: "Bill Pay Bonus",
    text: "Pay bills and unlock reward points",
    icon: "🎁",
  },
  {
    title: "Refer & Earn",
    text: "Invite friends and earn rewards",
    icon: "👥",
  },
  {
    title: "Welcome Reward",
    text: "Special rewards for eligible users",
    icon: "✨",
  },
];

const services = [
  { icon: "📱", text: "Mobile Recharge" },
  { icon: "💡", text: "Electricity" },
  { icon: "🌐", text: "DTH / Broadband" },
  { icon: "🧾", text: "All Bills" },
];

const transactions = [
  {
    title: "UPI Payment • Merchant",
    time: "Today • 10:20 AM",
    amount: "- ₹540",
    type: "debit",
  },
  {
    title: "Mobile Recharge",
    time: "Today • 11:12 AM",
    amount: "- ₹299",
    type: "debit",
  },
  {
    title: "Received from Rahul",
    time: "Today • 12:25 PM",
    amount: "+ ₹2,000",
    type: "credit",
  },
  {
    title: "Electricity Bill",
    time: "Yesterday • 08:40 PM",
    amount: "- ₹780",
    type: "debit",
  },
];

function App() {
  const [tab, setTab] = useState("home");
  const [showBalance, setShowBalance] = useState(true);
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">
            <img src={ssLogo} alt="SS Enterprises" />
          </div>

          <div className="brand-text">
            <strong>SSPay</strong>
            <small>by SS Enterprises</small>
          </div>
        </div>

        <div className="top-actions">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => notify("Notifications will appear here")}
          >
            <Bell size={19} />
          </button>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => notify("Menu is coming soon")}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <main>
        {tab === "home" && (
          <>
            <section className="hero-card">
              <div className="hero-glow" />

              <div className="hero-top">
                <span>Available Balance</span>

                <button
                  type="button"
                  onClick={() => setShowBalance((value) => !value)}
                >
                  {showBalance ? "Hide" : "Show"}
                </button>
              </div>

              <div className="balance">
                {showBalance ? "₹ 25,840.00" : "₹ ••••••"}
              </div>

              <div className="hero-bottom">
                <span>SS Enterprises</span>
                <span className="verified">
                  <ShieldCheck size={13} />
                  Secure • Verified
                </span>
              </div>
            </section>

            <section className="quick-grid">
              <QuickAction
                icon={<ScanLine />}
                text="Scan & Pay"
                onClick={() => notify("Scan & Pay screen will be connected next")}
              />

              <QuickAction
                icon={<Send />}
                text="Send Money"
                onClick={() => notify("Send Money screen will be connected next")}
              />

              <QuickAction
                icon={<ArrowDownToLine />}
                text="Receive"
                onClick={() => notify("Receive Money screen will be connected next")}
              />

              <QuickAction
                icon={<IndianRupee />}
                text="Bank Transfer"
                onClick={() => notify("Bank Transfer will be connected next")}
              />
            </section>

            <SectionHeader title="Pay & Services" />

            <section className="service-grid">
              {services.map((service) => (
                <Service
                  key={service.text}
                  icon={service.icon}
                  text={service.text}
                  onClick={() => notify(`${service.text} will be available here`)}
                />
              ))}
            </section>

            <section className="offers-head">
              <div>
                <span className="eyebrow">EXCLUSIVE</span>
                <h2>SSPay Offers</h2>
              </div>

              <button type="button" onClick={() => setTab("offers")}>
                View all
                <ChevronRight size={16} />
              </button>
            </section>

            <div className="offers-row">
              {offers.slice(0, 3).map((offer) => (
                <OfferCard key={offer.title} offer={offer} />
              ))}
            </div>

            <SectionHeader
              title="SSPay Card"
              action={
                <button
                  className="text-btn"
                  type="button"
                  onClick={() => setTab("card")}
                >
                  Manage
                </button>
              }
            />

            <button
              className="bank-card"
              type="button"
              onClick={() => setTab("card")}
              aria-label="Open SSPay Card"
            >
              <CardFace />
            </button>
          </>
        )}

        {tab === "offers" && (
          <PageHeader
            title="SSPay Offers"
            icon={<Gift />}
            onBack={() => setTab("home")}
          >
            <div className="offer-banner">
              <Sparkles size={23} />

              <div>
                <strong>Smart rewards, made for you.</strong>
                <p>
                  Discover available promotions and rewards inside SSPay.
                </p>
              </div>
            </div>

            {offers.map((offer) => (
              <button
                className="large-offer"
                type="button"
                key={offer.title}
                onClick={() => notify(`${offer.title} selected`)}
              >
                <span>{offer.icon}</span>

                <div>
                  <strong>{offer.title}</strong>
                  <p>{offer.text}</p>
                </div>

                <ChevronRight size={18} />
              </button>
            ))}
          </PageHeader>
        )}

        {tab === "card" && (
          <PageHeader
            title="SSPay Card"
            icon={<WalletCards />}
            onBack={() => setTab("home")}
          >
            <div className="bank-card big">
              <CardFace />
            </div>

            <div className="security-box">
              <ShieldCheck size={24} />

              <div>
                <strong>Secure by design</strong>
                <p>
                  Card details are masked in normal view.
                </p>
              </div>
            </div>

            <div className="section-head">
              <h2>Card Controls</h2>
            </div>

            <section className="service-grid card-controls">
              <Service
                icon="🔒"
                text="Freeze Card"
                onClick={() => notify("Card freeze control will be connected")}
              />

              <Service
                icon="👁️"
                text="Card Details"
                onClick={() => notify("Secure card details will appear here")}
              />

              <Service
                icon="⚙️"
                text="Card Settings"
                onClick={() => notify("Card settings will appear here")}
              />

              <Service
                icon="🧾"
                text="Card History"
                onClick={() => setTab("history")}
              />
            </section>
          </PageHeader>
        )}

        {tab === "history" && (
          <PageHeader
            title="Transactions"
            icon={<History />}
            onBack={() => setTab("home")}
          >
            <div className="transaction-list">
              {transactions.map((transaction) => (
                <div className="transaction" key={transaction.title}>
                  <div className="txn-icon">
                    {transaction.type === "credit" ? "↓" : "↑"}
                  </div>

                  <div className="txn-details">
                    <strong>{transaction.title}</strong>
                    <small>{transaction.time}</small>
                  </div>

                  <strong
                    className={
                      transaction.type === "credit" ? "credit" : ""
                    }
                  >
                    {transaction.amount}
                  </strong>
                </div>
              ))}
            </div>
          </PageHeader>
        )}

        {tab === "profile" && (
          <PageHeader
            title="Profile"
            icon={<UserRound />}
            onBack={() => setTab("home")}
          >
            <div className="profile-card">
              <div className="avatar">SS</div>

              <div>
                <h2>SS Enterprises</h2>
                <p>Verified business profile</p>
              </div>

              <ShieldCheck size={21} />
            </div>

            {[
              "Account & KYC",
              "Security & PIN",
              "Notifications",
              "Help & Support",
            ].map((item) => (
              <button
                className="setting"
                type="button"
                key={item}
                onClick={() => notify(`${item} will be available here`)}
              >
                <span>{item}</span>
                <ChevronRight size={17} />
              </button>
            ))}
          </PageHeader>
        )}
      </main>

      <nav className="bottom-nav">
        <NavButton
          active={tab === "home"}
          icon={<Home />}
          text="Home"
          onClick={() => setTab("home")}
        />

        <NavButton
          active={tab === "offers"}
          icon={<Gift />}
          text="Offers"
          onClick={() => setTab("offers")}
        />

        <button
          className="scan-main"
          type="button"
          aria-label="Scan & Pay"
          onClick={() => notify("Scan & Pay screen will be connected next")}
        >
          <QrCode />
        </button>

        <NavButton
          active={tab === "history"}
          icon={<History />}
          text="History"
          onClick={() => setTab("history")}
        />

        <NavButton
          active={tab === "profile"}
          icon={<UserRound />}
          text="Profile"
          onClick={() => setTab("profile")}
        />
      </nav>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function QuickAction({ icon, text, onClick }) {
  return (
    <button className="quick" type="button" onClick={onClick}>
      <span>{icon}</span>
      <strong>{text}</strong>
    </button>
  );
}

function Service({ icon, text, onClick }) {
  return (
    <button className="service" type="button" onClick={onClick}>
      <span>{icon}</span>
      <strong>{text}</strong>
    </button>
  );
}

function OfferCard({ offer }) {
  return (
    <button
      className="offer-card"
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <div className="offer-icon">{offer.icon}</div>
      <strong>{offer.title}</strong>
      <p>{offer.text}</p>

      <span className="claim">
        Explore
        <ChevronRight size={14} />
      </span>
    </button>
  );
}

function CardFace() {
  return (
    <>
      <div className="card-brand">
        <img src={ssLogo} alt="SS Enterprises" />
        <span>SSPay</span>
      </div>

      <div className="chip" />

      <div className="card-number">
        5824&nbsp;&nbsp; ••••&nbsp;&nbsp; ••••&nbsp;&nbsp; 9012
      </div>

      <div className="card-meta">
        <span>SS ENTERPRISES</span>
        <span>VIRTUAL CARD</span>
      </div>
    </>
  );
}

function SectionHeader({ title, action }) {
  return (
    <section className="section-head">
      <h2>{title}</h2>
      {action || <ChevronRight size={18} />}
    </section>
  );
}

function NavButton({ active, icon, text, onClick }) {
  return (
    <button
      className={active ? "nav active" : "nav"}
      type="button"
      onClick={onClick}
    >
      {icon}
      <small>{text}</small>
    </button>
  );
}

function PageHeader({ title, icon, onBack, children }) {
  return (
    <section className="page">
      <div className="page-title">
        <button
          className="back-button"
          type="button"
          onClick={onBack}
          aria-label="Back"
        >
          <ChevronRight size={18} />
        </button>

        {icon}
        <h1>{title}</h1>
      </div>

      {children}
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
