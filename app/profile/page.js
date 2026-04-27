"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();

  const [sealCode, setSealCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedBox, setExpandedBox] = useState(null);

  async function addBook() {
    if (!sealCode) return;

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/add-book-by-seal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        seal_code: sealCode
      })
    });

    const data = await res.json();

    setResult(data);
    setLoading(false);
  }

  if (!isSignedIn) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.card}>
            <h1>Giriş yapmanız gerekiyor</h1>
            <p style={styles.muted}>
              Profil sayfanızı görmek için giriş yapmalısınız.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const sentMessages = [
    {
      id: 1,
      to: "@kitap_dostu",
      text: "Rubailer üzerine başlattığın yorumu okudum, çok güzel bir noktaya değinmişsin.",
      time: "Bugün 14:30"
    },
    {
      id: 2,
      to: "@serh_defteri",
      text: "Gülistan hakkında yazdığın tahlile cevap verdim.",
      time: "Dün 21:10"
    }
  ];

  const incomingMessages = [
    {
      id: 1,
      from: "@rubai_okuru",
      text: "Rubailer tartışmasında yazdığın yoruma katılıyorum. Özellikle zaman vurgusu çok yerindeydi.",
      time: "Bugün 15:12"
    },
    {
      id: 2,
      from: "@klasik_okur",
      text: "Arkadaşlık isteğimi kabul eder misin? Aynı kitapları okuyoruz.",
      time: "Bugün 12:44"
    }
  ];

  const sameBookMessages = [
    {
      id: 1,
      username: "@hayyam_notlari",
      book: "Rubailer",
      author: "Ömer Hayyam",
      unread: 3,
      text: "Bu kitabı alan okuyucularla Rubailer’deki içtenlik meselesini konuşmak istiyorum.",
      cooldown: "Sonraki toplu mesaj hakkı: 2 gün 14 saat"
    },
    {
      id: 2,
      username: "@gulistan_serhi",
      book: "Gülistan",
      author: "Sadi Şirazi",
      unread: 1,
      text: "Gülistan okuyanlar için ahlak ve hikmet bölümleri hakkında ortak okuma yapmak isteyen var mı?",
      cooldown: "Sonraki toplu mesaj hakkı: 1 gün 8 saat"
    }
  ];

  const communityCalls = [
    {
      id: 1,
      username: "@okur_meclisi",
      text: "Bu hafta Rubailer üzerine ortak şerh çalışması yapmak isteyenleri tartışma alanına bekliyoruz.",
      time: "Bugün"
    },
    {
      id: 2,
      username: "@klasik_yolcu",
      text: "Klasik eserleri birlikte okumak isteyenler için yeni bir okuma grubu başlatıyorum.",
      time: "Dün"
    }
  ];

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Kevser Profile</div>
            <h1 style={styles.title}>
              Hoş geldin {user?.firstName || user?.username || "Kevser Üyesi"}
            </h1>
            <p style={styles.muted}>
              Kitapların, katkıların, mesajların ve bildirimlerin burada toplanır.
            </p>
          </div>

          <div style={styles.profileBadge}>
            <div style={styles.avatar}>
              {(user?.firstName?.[0] || user?.username?.[0] || "K").toUpperCase()}
            </div>
            <div>
              <div style={styles.username}>
                {user?.username || user?.primaryEmailAddress?.emailAddress || "Kullanıcı"}
              </div>
              <div style={styles.role}>Üye</div>
            </div>
          </div>
        </header>

        <section style={styles.topGrid}>
          <div style={styles.card}>
            <h2>Kitap Ekle</h2>
            <p style={styles.muted}>
              Kitabı satın aldıysanız, kitap içindeki mühür kodunu girerek kitabı hesabınıza ekleyebilirsiniz.
            </p>

            <input
              value={sealCode}
              onChange={(e) => setSealCode(e.target.value)}
              placeholder="Örn: 0759-0008-S01-01-TR-0042-000001-18"
              style={styles.input}
            />

            <button
              onClick={addBook}
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading ? "Ekleniyor..." : "Kitabı Hesabıma Ekle"}
            </button>

            {result && (
              <div style={result.ok ? styles.successBox : styles.errorBox}>
                {result.ok
                  ? result.alreadyAdded
                    ? "Bu kitap zaten hesabınızda."
                    : "Kitap başarıyla hesabınıza eklendi."
                  : "Hata: " + result.error}
              </div>
            )}
          </div>

          <div style={styles.card}>
            <h2>Üyelik Durumu</h2>
            <div style={styles.statusRow}>
              <span>Profil</span>
              <strong>Aktif</strong>
            </div>
            <div style={styles.statusRow}>
              <span>Studio</span>
              <strong style={{ color: "#777" }}>Pasif</strong>
            </div>
            <div style={styles.statusRow}>
              <span>Yayıncı Başvurusu</span>
              <strong>Kapalı</strong>
            </div>

            <button style={styles.secondaryButton}>
              Yayıncı Başvurusu Yap
            </button>
          </div>

          <div style={styles.card}>
            <h2>Bildirimler</h2>
            <div style={styles.notice}>
              Bir yorumuna yeni cevap geldi.
            </div>
            <div style={styles.notice}>
              Rubailer kitabında yeni tartışma başlatıldı.
            </div>
            <div style={styles.notice}>
              Aynı kitabı alanlardan 3 yeni mesaj var.
            </div>
          </div>
        </section>

        <section style={styles.messageGrid}>
          <MessageBox
            id="sent"
            title="Arkadaşlara Gönderilen Mesajlar"
            expandedBox={expandedBox}
            setExpandedBox={setExpandedBox}
          >
            {sentMessages.map((msg) => (
              <div key={msg.id} style={styles.messageItem}>
                <div style={styles.meta}>Kime: {msg.to} • {msg.time}</div>
                <p>{msg.text}</p>
              </div>
            ))}
          </MessageBox>

          <MessageBox
            id="incoming"
            title="Arkadaşlardan Gelen Mesajlar"
            expandedBox={expandedBox}
            setExpandedBox={setExpandedBox}
          >
            {incomingMessages.map((msg) => (
              <div key={msg.id} style={styles.messageItem}>
                <div style={styles.meta}>Kimden: {msg.from} • {msg.time}</div>
                <p>{msg.text}</p>
                <button style={styles.smallButton}>Cevap Yaz</button>
              </div>
            ))}
          </MessageBox>

          <MessageBox
            id="sameBook"
            title="Aynı Kitabı Alanlara Mesajlar"
            expandedBox={expandedBox}
            setExpandedBox={setExpandedBox}
          >
            {sameBookMessages.map((msg) => (
              <div key={msg.id} style={styles.sameBookItem}>
                <div style={styles.smallCover}>
                  <div>{msg.book}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={styles.meta}>
                    {msg.username} • {msg.author}
                  </div>

                  <div style={styles.unreadBadge}>
                    {msg.unread} okunmamış mesaj
                  </div>

                  <p>{msg.text}</p>

                  <div style={styles.cooldown}>
                    {msg.cooldown}
                  </div>

                  <div style={styles.actionRow}>
                    <button style={styles.smallButton}>Mesaj Gönder</button>
                    <button style={styles.smallButton}>Arkadaşlık İsteği Gönder</button>
                    <button style={styles.dangerSmallButton}>Bu kişiden mesaj alma</button>
                  </div>
                </div>
              </div>
            ))}
          </MessageBox>

          <MessageBox
            id="community"
            title="Topluluğa Çağrı Mesajları"
            expandedBox={expandedBox}
            setExpandedBox={setExpandedBox}
          >
            {communityCalls.map((msg) => (
              <div key={msg.id} style={styles.messageItem}>
                <div style={styles.meta}>
                  {msg.username} • {msg.time}
                </div>
                <p>{msg.text}</p>

                <div style={styles.actionRow}>
                  <button style={styles.smallButton}>Arkadaşlık İsteği Gönder</button>
                  <button style={styles.smallButton}>Katıl</button>
                  <button style={styles.dangerSmallButton}>Şikayet Et</button>
                </div>
              </div>
            ))}
          </MessageBox>
        </section>

        <section style={styles.card}>
          <h2>Katkılarım</h2>
          <p style={styles.muted}>
            Gönderdiğiniz şerh, yorum, tahlil ve tartışma cevapları burada listelenecek.
          </p>

          <div style={styles.contributionItem}>
            <div style={styles.meta}>Rubailer • Şerh/Yorum</div>
            <p>
              Hayyam’ın dilinde sade görünen ifadeler çoğu zaman derin bir varlık sorgusuna açılır.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

function MessageBox({ id, title, expandedBox, setExpandedBox, children }) {
  const isExpanded = expandedBox === id;
  const isHidden = expandedBox && !isExpanded;

  if (isHidden) return null;

  return (
    <div style={isExpanded ? styles.messageBoxExpanded : styles.messageBox}>
      <div style={styles.boxHeader}>
        <h2>{title}</h2>

        <button
          onClick={() => setExpandedBox(isExpanded ? null : id)}
          style={styles.expandButton}
        >
          {isExpanded ? "Sayfayı Küçült" : "Sayfayı Büyüt"}
        </button>
      </div>

      <div style={isExpanded ? styles.boxContentExpanded : styles.boxContent}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #050505 0%, #111 60%, #1a1205 100%)",
    color: "white",
    padding: "40px"
  },
  container: {
    maxWidth: "1300px",
    margin: "0 auto"
  },
  header: {
    border: "1px solid #333",
    borderRadius: "28px",
    padding: "28px",
    background: "#111",
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "center",
    marginBottom: "28px"
  },
  eyebrow: {
    color: "#f5b400",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "13px",
    fontWeight: "bold"
  },
  title: {
    fontSize: "38px",
    margin: "10px 0"
  },
  muted: {
    color: "#aaa",
    lineHeight: "1.7"
  },
  profileBadge: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    border: "1px solid #333",
    borderRadius: "20px",
    padding: "14px",
    background: "black"
  },
  avatar: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#f5b400",
    color: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "24px"
  },
  username: {
    fontWeight: "bold"
  },
  role: {
    color: "#aaa",
    fontSize: "13px"
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "28px"
  },
  card: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
    background: "#111",
    marginBottom: "24px"
  },
  input: {
    width: "100%",
    marginTop: "16px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "black",
    color: "white"
  },
  primaryButton: {
    marginTop: "16px",
    background: "#f5b400",
    color: "black",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  secondaryButton: {
    marginTop: "18px",
    background: "white",
    color: "black",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  successBox: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "12px",
    background: "#052e16",
    color: "#4ade80"
  },
  errorBox: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "12px",
    background: "#450a0a",
    color: "#f87171"
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #222",
    padding: "12px 0"
  },
  notice: {
    border: "1px solid #333",
    borderRadius: "14px",
    padding: "12px",
    background: "black",
    marginTop: "10px",
    color: "#ddd"
  },
  messageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "22px",
    marginBottom: "28px"
  },
  messageBox: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "20px",
    background: "#111",
    minHeight: "360px"
  },
  messageBoxExpanded: {
    gridColumn: "1 / -1",
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
    background: "#111",
    minHeight: "760px"
  },
  boxHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "center",
    borderBottom: "1px solid #222",
    paddingBottom: "14px"
  },
  expandButton: {
    border: "1px solid #2563eb",
    color: "#60a5fa",
    background: "transparent",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  boxContent: {
    marginTop: "16px",
    maxHeight: "260px",
    overflow: "hidden"
  },
  boxContentExpanded: {
    marginTop: "16px"
  },
  messageItem: {
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "16px",
    background: "black",
    marginBottom: "14px"
  },
  sameBookItem: {
    display: "flex",
    gap: "16px",
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "16px",
    background: "black",
    marginBottom: "14px"
  },
  smallCover: {
    width: "86px",
    height: "118px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #3b230f, #050505)",
    color: "#f5b400",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    padding: "8px",
    flexShrink: 0
  },
  meta: {
    color: "#aaa",
    fontSize: "13px"
  },
  unreadBadge: {
    display: "inline-block",
    marginTop: "8px",
    background: "#f5b400",
    color: "black",
    borderRadius: "999px",
    padding: "5px 10px",
    fontSize: "12px",
    fontWeight: "bold"
  },
  cooldown: {
    color: "#777",
    fontSize: "12px",
    marginTop: "8px"
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px"
  },
  smallButton: {
    border: "1px solid #333",
    background: "#1f1f1f",
    color: "white",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer"
  },
  dangerSmallButton: {
    border: "1px solid #7f1d1d",
    background: "#220808",
    color: "#fca5a5",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer"
  },
  contributionItem: {
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "16px",
    background: "black",
    marginTop: "14px"
  }
};
