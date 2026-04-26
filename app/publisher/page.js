"use client";

import { useState } from "react";

export default function PublisherPanel() {
  const [active, setActive] = useState("studio");

  const menu = [
    { id: "studio", label: "Stüdyo Dashboard" },
    { id: "pool", label: "Havuz" },
    { id: "revenue", label: "Gelirler" },
    { id: "settings", label: "Yayıncı Profil Ayarları" }
  ];

  return (
    <main style={page}>
      <div style={sky} />

      <section style={container}>
        <header style={header}>
          <div>
            <div style={eyebrow}>Kevser Publisher Studio</div>
            <h1 style={title}>Yayıncı Paneli</h1>
            <p style={muted}>
              Kitap, audiobook, katkı havuzu, gelirler ve yayıncı profil ayarları.
            </p>
          </div>

          <div style={statusBox}>
            <div style={smallMuted}>Durum</div>
            <strong>Onaylı Yayıncı</strong>
          </div>
        </header>

        <div style={layout}>
          <aside style={sidebar}>
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  ...sideButton,
                  background: active === item.id ? "#f5b400" : "rgba(255,255,255,0.65)",
                  color: active === item.id ? "black" : "#222"
                }}
              >
                {item.label}
              </button>
            ))}
          </aside>

          <section style={content}>
            {active === "studio" && <Studio />}
            {active === "pool" && <Pool />}
            {active === "revenue" && <Revenue />}
            {active === "settings" && <Settings />}
          </section>
        </div>
      </section>
    </main>
  );
}

function Studio() {
  return (
    <div>
      <h2 style={sectionTitle}>Stüdyo Dashboard</h2>
      <p style={mutedDark}>
        Traditional eser havuzu, telifli eser havuzu ve stüdyo araçları burada yönetilecek.
      </p>

      <div style={cardGrid}>
        <Card title="Traditional Eser Havuzu" text="Telif hakkı olmayan klasik eserler. Yayıncılar dil seçerek üstlenebilir." />
        <Card title="Telifli Eser Havuzu" text="Yayıncının kendi telifli eserleri ve çevrilmesini istediği diller." />
        <Card title="Stüdyo Araçları" text="Çeviri, düzenleme, hazırlık ve yayın süreci destek araçları." />
      </div>
    </div>
  );
}

function Pool() {
  return (
    <div>
      <h2 style={sectionTitle}>Havuz</h2>
      <p style={mutedDark}>
        Şerh/yorum, tartışma ve çeviri katkı alanlarından gelen işlemler burada toplanır.
      </p>

      <div style={poolGrid}>
        <PoolCard
          title="Şikayet Havuzu"
          text="Şerh/yorum ve tartışma alanlarından gelen şikayetler."
          badge="12 bekleyen"
        />

        <PoolCard
          title="Şahitlik / Yayıncı Kararı"
          text="Bir yayıncı kaldırma talep ettiğinde diğer yayıncıların onay süreci."
          badge="4 karar bekliyor"
        />

        <PoolCard
          title="İtiraz Havuzu"
          text="24 saat içinde kullanıcı tarafından yapılan itirazlar."
          badge="2 itiraz"
        />

        <PoolCard
          title="Çeviri Katkı Havuzu"
          text="Books sayfasındaki çeviri katkısı formundan gelen öneriler."
          badge="18 öneri"
        />
      </div>

      <div style={wideCard}>
        <h3>Örnek Şikayet Akışı</h3>
        <p style={mutedDark}>
          Bir yorum uygunsuz görülürse yayıncı şikayet eder. İki yayıncı “sıdk bir karardır”
          derse yorum 24 saat askıya alınır. Kullanıcıya sistem mesajı gider. Kullanıcı
          itiraz ederse konu itiraz havuzuna düşer. Admin tek başına nihai karar verebilir.
        </p>
      </div>
    </div>
  );
}

function Revenue() {
  return (
    <div>
      <h2 style={sectionTitle}>Gelirler</h2>

      <div style={cardGrid}>
        <Card title="Toplam Gelir" text="$420" />
        <Card title="Çekilebilir Bakiye" text="$120" />
        <Card title="Katkı Gelir Havuzu" text="Yorumlu baskılardan ayrılan pay." />
      </div>

      <div style={wideCard}>
        <h3>Para Çekme Bilgileri</h3>
        <input style={input} placeholder="Banka / ödeme hesabı" />
        <input style={input} placeholder="IBAN / hesap bilgisi" />
        <button style={primaryButton}>Para Çekme Talebi Oluştur</button>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <h2 style={sectionTitle}>Yayıncı Profil Ayarları</h2>

      <div style={wideCard}>
        <input style={input} placeholder="Kullanıcı adı" />
        <input style={input} placeholder="Mail adresi" />
        <input style={input} placeholder="Telefon" />
        <input style={input} placeholder="Mukim olduğu şehir" />
        <input style={input} placeholder="Adres" />
        <input style={input} placeholder="Müstear / yazar ismi" />

        <select style={input}>
          <option>Dini aidiyet seç</option>
          <option>İslam</option>
          <option>Hristiyanlık</option>
          <option>Yahudilik</option>
          <option>Sabiilik</option>
          <option>Diğer</option>
        </select>

        <input style={input} placeholder="Fırka / mezhep / diğer açıklama" />

        <button style={primaryButton}>Kaydet</button>
      </div>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p style={mutedDark}>{text}</p>
    </div>
  );
}

function PoolCard({ title, text, badge }) {
  return (
    <div style={poolCard}>
      <div style={badgeStyle}>{badge}</div>
      <h3>{title}</h3>
      <p style={mutedDark}>{text}</p>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #dff3ff 0%, #f7fbff 45%, #fff7e8 100%)",
  color: "#151515",
  position: "relative",
  overflow: "hidden"
};

const sky = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.95), transparent 22%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.75), transparent 24%), radial-gradient(circle at 50% 80%, rgba(245,180,0,0.14), transparent 30%)",
  pointerEvents: "none"
};

const container = {
  position: "relative",
  maxWidth: "1300px",
  margin: "0 auto",
  padding: "36px 24px"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  alignItems: "center",
  border: "1px solid rgba(255,255,255,0.65)",
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(18px)",
  borderRadius: "30px",
  padding: "28px",
  boxShadow: "0 20px 60px rgba(60,90,120,0.18)",
  marginBottom: "24px"
};

const eyebrow = {
  color: "#b77900",
  letterSpacing: "4px",
  textTransform: "uppercase",
  fontSize: "13px",
  fontWeight: "bold"
};

const title = {
  fontSize: "40px",
  margin: "10px 0"
};

const muted = {
  color: "#51606b",
  lineHeight: "1.7"
};

const mutedDark = {
  color: "#5d6470",
  lineHeight: "1.7"
};

const smallMuted = {
  color: "#6b7280",
  fontSize: "13px"
};

const statusBox = {
  minWidth: "190px",
  border: "1px solid rgba(255,255,255,0.7)",
  background: "rgba(255,255,255,0.65)",
  borderRadius: "22px",
  padding: "18px"
};

const layout = {
  display: "grid",
  gridTemplateColumns: "250px 1fr",
  gap: "22px"
};

const sidebar = {
  border: "1px solid rgba(255,255,255,0.65)",
  background: "rgba(255,255,255,0.45)",
  backdropFilter: "blur(18px)",
  borderRadius: "28px",
  padding: "14px",
  boxShadow: "0 20px 60px rgba(60,90,120,0.14)"
};

const sideButton = {
  width: "100%",
  border: "none",
  borderRadius: "18px",
  padding: "14px",
  marginBottom: "10px",
  textAlign: "left",
  fontWeight: "bold",
  cursor: "pointer"
};

const content = {
  minHeight: "650px",
  border: "1px solid rgba(255,255,255,0.65)",
  background: "rgba(255,255,255,0.58)",
  backdropFilter: "blur(20px)",
  borderRadius: "30px",
  padding: "28px",
  boxShadow: "0 20px 60px rgba(60,90,120,0.14)"
};

const sectionTitle = {
  fontSize: "30px",
  marginBottom: "8px"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "18px",
  marginTop: "24px"
};

const poolGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
  marginTop: "24px"
};

const card = {
  border: "1px solid rgba(255,255,255,0.75)",
  background: "rgba(255,255,255,0.72)",
  borderRadius: "26px",
  padding: "22px",
  boxShadow: "0 12px 30px rgba(60,90,120,0.12)"
};

const poolCard = {
  ...card,
  position: "relative"
};

const badgeStyle = {
  display: "inline-block",
  background: "#f5b400",
  color: "black",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "10px"
};

const wideCard = {
  ...card,
  marginTop: "24px"
};

const input = {
  width: "100%",
  marginTop: "12px",
  border: "1px solid #d8dde6",
  borderRadius: "14px",
  padding: "14px",
  fontSize: "15px",
  background: "white"
};

const primaryButton = {
  marginTop: "16px",
  background: "#f5b400",
  color: "black",
  border: "none",
  borderRadius: "14px",
  padding: "14px 20px",
  fontWeight: "bold",
  cursor: "pointer"
};
