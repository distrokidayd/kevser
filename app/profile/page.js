"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("books");
  const [expandedMessageBox, setExpandedMessageBox] = useState(null);

  const isPublisher = false;

  const tabs = [
    "Profil",
    "Kitaplarım",
    "Kitap Ekle",
    "Katkılarım",
    "Arkadaşlar",
    "Mesajlar",
    "Bildirimler",
    "Yayıncı Ol",
    "Studio"
  ];

  const tabKey = {
    Profil: "profile",
    Kitaplarım: "books",
    "Kitap Ekle": "addBook",
    Katkılarım: "contributions",
    Arkadaşlar: "friends",
    Mesajlar: "messages",
    Bildirimler: "notifications",
    "Yayıncı Ol": "publisher",
    Studio: "studio"
  };

  return (
    <main style={page}>
      <div style={container}>
        <header style={header}>
          <div>
            <p style={eyebrow}>Kevser Üye Paneli</p>
            <h1 style={title}>Profil ve Üyelik Merkezi</h1>
            <p style={muted}>
              Kitaplar, katkılar, arkadaşlar, mesajlar, bildirimler ve yayıncı başvurusu burada yönetilir.
            </p>
          </div>

          <div style={statusBox}>
            <p style={smallMuted}>Üyelik Durumu</p>
            <h3>Standart Üye</h3>
            <p style={muted}>Studio pasif. Yayıncı onayı sonrası aktif olur.</p>
          </div>
        </header>

        <div style={layout}>
          <aside style={sidebar}>
            {tabs.map((tab) => {
              const key = tabKey[tab];
              const disabled = key === "studio" && !isPublisher;

              return (
                <button
                  key={tab}
                  disabled={disabled}
                  onClick={() => !disabled && setActiveTab(key)}
                  style={{
                    ...sideButton,
                    background: activeTab === key ? "#f5b400" : "#111",
                    color: disabled ? "#555" : activeTab === key ? "black" : "white",
                    cursor: disabled ? "not-allowed" : "pointer"
                  }}
                >
                  {tab} {disabled ? "— Pasif" : ""}
                </button>
              );
            })}
          </aside>

          <section style={content}>
            {activeTab === "profile" && <Profile />}
            {activeTab === "books" && <Books />}
            {activeTab === "addBook" && <AddBook />}
            {activeTab === "contributions" && <Contributions />}
            {activeTab === "friends" && <Friends />}
            {activeTab === "messages" && (
              <Messages
                expandedMessageBox={expandedMessageBox}
                setExpandedMessageBox={setExpandedMessageBox}
              />
            )}
            {activeTab === "notifications" && <Notifications />}
            {activeTab === "publisher" && <Publisher />}
            {activeTab === "studio" && <Studio />}
          </section>
        </div>
      </div>
    </main>
  );
}

function Profile() {
  return (
    <div>
      <h2>Profil</h2>
      <div style={grid2}>
        <Card title="Kullanıcı Adı" text="@kevser_okuru" />
        <Card title="E-posta" text="uye@kevserapp.com" />
        <Card title="Rol" text="Standart üye" />
        <Card title="Yayıncı Durumu" text="Başvuru yapılmadı" />
      </div>
    </div>
  );
}

function Books() {
  return (
    <div>
      <h2>Kitaplarım</h2>
      <p style={muted}>
        Kullanıcı, kitabın içinde gizli bulunan mühür numarasıyla kitabı hesabına ekler.
      </p>

      <div style={bookCard}>
        <div>
          <h3>Ömer Hayyam — Rubailer</h3>
          <p style={muted}>Aynı kitabı alan üye sayısı: 184</p>
        </div>

        <div style={actions}>
          <a href="/books/omerhayyam/rubailer" style={primaryButton}>Kitap Sayfasına Git</a>
          <button style={darkButton}>Aynı Kitabı Alanlara Mesaj</button>
        </div>

        <div style={notice}>Toplu mesaj hakkı: 2 gün 14 saat sonra</div>
      </div>
    </div>
  );
}

function AddBook() {
  return (
    <div>
      <h2>Kitap Ekle</h2>
      <p style={muted}>
        Kitap içindeki gizli mühür numarasını girerek kitabı hesabına ekleyebilirsin.
      </p>

      <div style={card}>
        <label style={smallMuted}>Mühür Numarası</label>
        <input style={input} placeholder="Kitap içindeki mühür numarasını girin" />
        <button style={primaryButton}>Kitabı Hesabıma Ekle</button>
      </div>
    </div>
  );
}

function Contributions() {
  return (
    <div>
      <h2>Katkılarım</h2>
      <div style={grid2}>
        <Card title="Çeviri Önerisi" text="Rubailer — 3 oy aldı" />
        <Card title="Şerh" text="Rubailer — hakem değerlendirmesinde" />
        <Card title="Tartışma Cevabı" text="Gülistan — 2 yanıt geldi" />
      </div>
    </div>
  );
}

function Friends() {
  return (
    <div>
      <h2>Arkadaşlar</h2>
      <div style={grid2}>
        <Card title="@okuyucuA" text="Ortak kitap: Rubailer" />
        <Card title="@okuyucuB" text="Ortak kitap: Gülistan — sessize alınmış" />
      </div>
    </div>
  );
}

function Messages({ expandedMessageBox, setExpandedMessageBox }) {
  const boxes = [
    {
      id: "sent",
      title: "Arkadaşlara Gönderilen Mesajlar",
      body: "Gönderdiğin birebir mesajlar burada görünür.",
      items: ["@sen: Rubailer tartışması hakkında mesaj gönderdin."]
    },
    {
      id: "received",
      title: "Arkadaşlardan Gelen Mesajlar",
      body: "Arkadaşlarının sana gönderdiği mesajlar burada görünür.",
      items: ["@okuyucuA: Şerhine katılıyorum.", "@okuyucuB: Çeviri önerini tartışalım."]
    },
    {
      id: "sameBook",
      title: "Aynı Kitabı Alanlara Mesaj",
      body: "Kitap bazlı özel odalar. 3 günde 1 toplu mesaj hakkı.",
      items: ["Rubailer — 3 yeni mesaj — @rubai_okuru", "Gülistan — mesaj yok"]
    },
    {
      id: "community",
      title: "Topluluk Mesajları",
      body: "Twitter gibi akan genel çağrı mesajları.",
      items: ["@okuyucu1: Rubailer üzerine yeni tartışma açtım.", "@okuyucu2: Gülistan için şerh ekledim."]
    }
  ];

  const visible = expandedMessageBox
    ? boxes.filter((box) => box.id === expandedMessageBox)
    : boxes;

  return (
    <div>
      <h2>Mesajlar</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: expandedMessageBox ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "20px"
      }}>
        {visible.map((box) => {
          const isExpanded = expandedMessageBox === box.id;

          return (
            <div key={box.id} style={{ ...card, minHeight: isExpanded ? "520px" : "260px" }}>
              <div style={topLine}>
                <h3>{box.title}</h3>
                <button
                  onClick={() => setExpandedMessageBox(isExpanded ? null : box.id)}
                  style={blueButton}
                >
                  {isExpanded ? "Sayfayı Küçült" : "Sayfayı Büyüt"}
                </button>
              </div>

              <p style={muted}>{box.body}</p>

              <div style={{ marginTop: "18px" }}>
                {box.items.map((item) => (
                  <div key={item} style={messageItem}>
                    <span>{item}</span>

                    {(box.id === "sameBook" || box.id === "community") && (
                      <button style={smallButton}>Arkadaşlık İsteği Gönder</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Notifications() {
  return (
    <div>
      <h2>Bildirimler</h2>
      <div style={grid1}>
        <Card title="Yeni Oy" text="Rubailer çeviri önerinize 1 yeni oy geldi." />
        <Card title="Yeni Yanıt" text="Bir üye şerhinize cevap verdi." />
        <Card title="Tartışma" text="Takip ettiğiniz başlıkta yeni mesaj var." />
      </div>
    </div>
  );
}

function Publisher() {
  return (
    <div>
      <h2>Yayıncı Ol</h2>
      <p style={muted}>
        Yayıncı başvurusu onaylanan üyelerde Studio aktif olur.
      </p>

      <div style={card}>
        <input style={input} placeholder="Yayıncı adı / kurum adı" />
        <textarea style={textarea} placeholder="Yayıncı olmak istemenizin sebebi" />
        <button style={primaryButton}>Başvuru Gönder</button>
      </div>
    </div>
  );
}

function Studio() {
  return (
    <div>
      <h2>Studio</h2>
      <p style={muted}>Bu alan yalnızca yayıncı onayı alan üyelerde aktif olur.</p>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p style={muted}>{text}</p>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "black",
  color: "white",
  padding: "40px"
};

const container = {
  maxWidth: "1300px",
  margin: "0 auto"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  marginBottom: "30px",
  border: "1px solid #333",
  borderRadius: "24px",
  padding: "28px",
  background: "#0d0d0d"
};

const eyebrow = {
  color: "#f5b400",
  letterSpacing: "4px",
  textTransform: "uppercase",
  fontSize: "13px"
};

const title = {
  fontSize: "42px",
  margin: "10px 0"
};

const muted = {
  color: "#aaa",
  lineHeight: "1.7"
};

const smallMuted = {
  color: "#777",
  fontSize: "13px"
};

const statusBox = {
  minWidth: "240px",
  border: "1px solid #333",
  borderRadius: "18px",
  padding: "18px",
  background: "black"
};

const layout = {
  display: "grid",
  gridTemplateColumns: "260px 1fr",
  gap: "22px"
};

const sidebar = {
  border: "1px solid #333",
  borderRadius: "22px",
  padding: "12px",
  background: "#0d0d0d"
};

const sideButton = {
  width: "100%",
  border: "none",
  borderRadius: "14px",
  padding: "13px",
  marginBottom: "8px",
  textAlign: "left"
};

const content = {
  border: "1px solid #333",
  borderRadius: "22px",
  padding: "28px",
  background: "#0d0d0d"
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
  marginTop: "20px"
};

const grid1 = {
  display: "grid",
  gap: "16px",
  marginTop: "20px"
};

const card = {
  border: "1px solid #333",
  borderRadius: "18px",
  padding: "20px",
  background: "#111"
};

const bookCard = {
  ...card,
  marginTop: "20px"
};

const actions = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "18px"
};

const primaryButton = {
  display: "inline-block",
  background: "#f5b400",
  color: "black",
  textDecoration: "none",
  border: "none",
  borderRadius: "12px",
  padding: "12px 16px",
  fontWeight: "bold",
  cursor: "pointer"
};

const darkButton = {
  background: "black",
  color: "white",
  border: "1px solid #333",
  borderRadius: "12px",
  padding: "12px 16px",
  cursor: "pointer"
};

const notice = {
  marginTop: "16px",
  border: "1px solid #5c4300",
  background: "#2b2105",
  color: "#ffd86b",
  borderRadius: "12px",
  padding: "12px"
};

const input = {
  width: "100%",
  marginTop: "10px",
  marginBottom: "14px",
  padding: "14px",
  background: "black",
  color: "white",
  border: "1px solid #333",
  borderRadius: "12px"
};

const textarea = {
  ...input,
  minHeight: "120px"
};

const topLine = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px"
};

const blueButton = {
  background: "transparent",
  color: "#60a5fa",
  border: "1px solid #2563eb",
  borderRadius: "10px",
  padding: "8px 12px",
  cursor: "pointer"
};

const messageItem = {
  border: "1px solid #333",
  borderRadius: "14px",
  padding: "14px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center"
};

const smallButton = {
  background: "white",
  color: "black",
  border: "none",
  borderRadius: "10px",
  padding: "8px 10px",
  cursor: "pointer"
};
