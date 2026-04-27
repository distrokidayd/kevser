"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();

  const [activeTab, setActiveTab] = useState("messages");
  const [sealCode, setSealCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedBox, setExpandedBox] = useState(null);

  async function addBook() {
    if (!sealCode.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/add-book-by-seal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seal_code: sealCode,
      }),
    });

    const data = await res.json();

    setResult(data);
    setLoading(false);
  }

  if (!isSignedIn) {
    return (
      <main style={styles.page}>
        <section style={styles.container}>
          <div style={styles.card}>
            <h1>Giriş yapmanız gerekiyor</h1>
            <p style={styles.muted}>
              Profil, mesajlar ve kitap ekleme alanını kullanmak için giriş
              yapmalısınız.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const sentMessages = [
    {
      id: 1,
      to: "@kitap_dostu",
      text: "Rubailer üzerine başlattığın yorumu okudum. Çok güzel bir noktaya değinmişsin.",
      time: "Bugün 14:30",
    },
    {
      id: 2,
      to: "@serh_defteri",
      text: "Gülistan hakkında yazdığın tahlile cevap verdim.",
      time: "Dün 21:10",
    },
  ];

  const incomingMessages = [
    {
      id: 1,
      from: "@rubai_okuru",
      text: "Rubailer tartışmasında yazdığın yoruma katılıyorum. Özellikle zaman vurgusu çok yerindeydi.",
      time: "Bugün 15:12",
    },
    {
      id: 2,
      from: "@klasik_okur",
      text: "Arkadaşlık isteğimi kabul eder misin? Aynı kitapları okuyoruz.",
      time: "Bugün 12:44",
    },
  ];

  const sameBookMessages = [
    {
      id: 1,
      username: "@hayyam_notlari",
      book: "Rubailer",
      author: "Ömer Hayyam",
      unread: 3,
      text: "Bu kitabı alan okuyucularla Rubailer’deki içtenlik meselesini konuşmak istiyorum.",
      cooldown: "Sonraki toplu mesaj hakkı: 2 gün 14 saat",
    },
    {
      id: 2,
      username: "@gulistan_serhi",
      book: "Gülistan",
      author: "Sadi Şirazi",
      unread: 1,
      text: "Gülistan okuyanlar için ahlak ve hikmet bölümleri hakkında ortak okuma yapmak isteyen var mı?",
      cooldown: "Sonraki toplu mesaj hakkı: 1 gün 8 saat",
    },
  ];

  const communityCalls = [
    {
      id: 1,
      username: "@okur_meclisi",
      text: "Bu hafta Rubailer üzerine ortak şerh çalışması yapmak isteyenleri tartışma alanına bekliyoruz.",
      time: "Bugün",
    },
    {
      id: 2,
      username: "@klasik_yolcu",
      text: "Klasik eserleri birlikte okumak isteyenler için yeni bir okuma grubu başlatıyorum.",
      time: "Dün",
    },
  ];

  const ownedBooks = [
    {
      id: 1,
      title: "Rubailer",
      author: "Ömer Hayyam",
      language: "Türkçe Çeviri",
      status: "Şerh / yorum / tahlil hakkı açık",
      slug: "/books/omerhayyam/rubailer",
    },
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
              Kitapların, mühür kodların, mesajların, bildirimlerin ve yayıncı
              durumun burada toplanır.
            </p>
          </div>

          <div style={styles.profileBadge}>
            <div style={styles.avatar}>
              {(user?.firstName?.[0] || user?.username?.[0] || "K").toUpperCase()}
            </div>

            <div>
              <div style={styles.username}>
                {user?.username ||
                  user?.primaryEmailAddress?.emailAddress ||
                  "Kullanıcı"}
              </div>
              <div style={styles.role}>Üye</div>
            </div>
          </div>
        </header>

        <section style={styles.layout}>
          <aside style={styles.sidebar}>
            <div style={styles.sidebarTitle}>Profil Menüsü</div>

            <SideButton
              active={activeTab === "messages"}
              title="Mesajlar"
              desc="4 mesaj kutusu"
              onClick={() => setActiveTab("messages")}
            />

            <SideButton
              active={activeTab === "books"}
              title="Kitaplarım"
              desc="Kitaplar + mühür kodu"
              onClick={() => setActiveTab("books")}
            />

            <SideButton
              active={activeTab === "notifications"}
              title="Bildirimler"
              desc="Cevaplar ve haberler"
              onClick={() => setActiveTab("notifications")}
            />

            <SideButton
              active={activeTab === "profile"}
              title="Profil Düzenle"
              desc="Ad, mail, müstear isim"
              onClick={() => setActiveTab("profile")}
            />

            <SideButton
              active={activeTab === "publisher"}
              title="Yayıncı Başvurusu"
              desc="Başvuru / stüdyo erişimi"
              onClick={() => setActiveTab("publisher")}
            />
          </aside>

          <section style={styles.content}>
            {activeTab === "messages" && (
              <>
                <PanelHeader
                  title="Mesajlar"
                  desc="Mesaj alanları burada gruplanır. Her kutu eski sistemdeki gibi sayfayı büyütüp küçültebilir."
                />

                <section style={styles.messageGrid}>
                  <MessageBox
                    id="sent"
                    title="Arkadaşlara Gönderilen Mesajlar"
                    expandedBox={expandedBox}
                    setExpandedBox={setExpandedBox}
                  >
                    {sentMessages.map((msg) => (
                      <div key={msg.id} style={styles.messageItem}>
                        <div style={styles.meta}>
                          Kime: {msg.to} • {msg.time}
                        </div>
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
                        <div style={styles.meta}>
                          Kimden: {msg.from} • {msg.time}
                        </div>
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
                          <span>{msg.book}</span>
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={styles.meta}>
                            {msg.username} • {msg.author}
                          </div>

                          <div style={styles.unreadBadge}>
                            {msg.unread} okunmamış mesaj
                          </div>

                          <p>{msg.text}</p>

                          <div style={styles.cooldown}>{msg.cooldown}</div>

                          <div style={styles.actionRow}>
                            <button style={styles.smallButton}>
                              Mesaj Gönder
                            </button>
                            <button style={styles.smallButton}>
                              Arkadaşlık İsteği Gönder
                            </button>
                            <button style={styles.dangerSmallButton}>
                              Bu kişiden mesaj alma
                            </button>
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
                          <button style={styles.smallButton}>
                            Arkadaşlık İsteği Gönder
                          </button>
                          <button style={styles.smallButton}>Katıl</button>
                          <button style={styles.dangerSmallButton}>
                            Şikayet Et
                          </button>
                        </div>
                      </div>
                    ))}
                  </MessageBox>
                </section>
              </>
            )}

            {activeTab === "books" && (
              <>
                <PanelHeader
                  title="Kitaplarım"
                  desc="Satın alınan kitabın içindeki mühür kodu burada girilir. Kod hangi kitaba aitse o kitap hesaba eklenir ve yorum/şerh/tahlil hakkı açılır."
                />

                <section style={styles.booksTopGrid}>
                  <div style={styles.bookAddHero}>
                    <div style={styles.heroBadge}>Mühür Kodu</div>
                    <h2>Kitabı Hesabıma Ekle</h2>
                    <p style={styles.muted}>
                      Her basılı veya dijital Kevser kitabının ön kısmında
                      platformu anlatan metin ve o kitaba özel mühür kodu
                      bulunur. Bu kodu girince kitap “Kitaplarım” alanına
                      eklenir.
                    </p>

                    <input
                      value={sealCode}
                      onChange={(e) => setSealCode(e.target.value)}
                      placeholder="Örn: KEV-7H2M9Q4A"
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

                  <div style={styles.ownershipInfo}>
                    <h2>Kitap Sahipliği Nasıl Çalışır?</h2>
                    <p>
                      Kullanıcı bir kitabı satın aldığında kitabın içindeki
                      mühür kodunu kullanır. Sistem bu kodun hangi kitaba ait
                      olduğunu tanır ve kitabı kullanıcının hesabına bağlar.
                    </p>
                    <p>
                      Böylece Books sayfasında ilgili kitaba girildiğinde
                      şerh, yorum ve tahlil alanı yalnızca kitabı gerçekten
                      sahiplenen üyeye açılır.
                    </p>
                  </div>
                </section>

                <section style={styles.cardNoMargin}>
                  <h2>Kitaplarım</h2>

                  {ownedBooks.length === 0 && (
                    <p style={styles.muted}>Henüz hesabınıza eklenmiş kitap yok.</p>
                  )}

                  <div style={styles.bookList}>
                    {ownedBooks.map((book) => (
                      <div key={book.id} style={styles.bookCard}>
                        <div style={styles.bookCover}>{book.title}</div>

                        <div>
                          <div style={styles.meta}>{book.language}</div>
                          <h3>{book.author} — {book.title}</h3>
                          <div style={styles.bookStatus}>{book.status}</div>
                          <p style={styles.muted}>
                            Bu kitap hesabınıza bağlı olduğu için ilgili kitap
                            sayfasında yorum, şerh ve tahlil yazabilirsiniz.
                          </p>

                          <div style={styles.actionRow}>
                            <a href={book.slug} style={styles.linkPrimary}>
                              Kitap Sayfasına Git
                            </a>
                            <button style={styles.smallButton}>
                              Katkılarımı Gör
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeTab === "notifications" && (
              <>
                <PanelHeader
                  title="Bildirimler"
                  desc="Yorum cevapları, tartışmalar, kitap sahipliği ve sistem haberleri burada görünür."
                />

                <div style={styles.notice}>
                  Bir yorumuna yeni cevap geldi.
                </div>

                <div style={styles.notice}>
                  Rubailer kitabında yeni tartışma başlatıldı.
                </div>

                <div style={styles.notice}>
                  Aynı kitabı alanlardan 3 yeni mesaj var.
                </div>
              </>
            )}

            {activeTab === "profile" && (
              <>
                <PanelHeader
                  title="Profil Düzenle"
                  desc="Kullanıcı bilgileri, görünen ad ve ileride müstear isim bu alanda düzenlenecek."
                />

                <div style={styles.profileGrid}>
                  <div style={styles.formCard}>
                    <label style={styles.label}>Görünen Ad</label>
                    <input
                      value={user?.firstName || ""}
                      readOnly
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formCard}>
                    <label style={styles.label}>E-posta</label>
                    <input
                      value={user?.primaryEmailAddress?.emailAddress || ""}
                      readOnly
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formCard}>
                    <label style={styles.label}>Müstear İsim</label>
                    <input
                      placeholder="İleride düzenlenebilir"
                      readOnly
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formCard}>
                    <label style={styles.label}>Profil Durumu</label>
                    <input value="Aktif Üye" readOnly style={styles.input} />
                  </div>
                </div>
              </>
            )}

            {activeTab === "publisher" && (
              <>
                <PanelHeader
                  title="Yayıncı Başvurusu"
                  desc="Kullanıcı yayıncı değilse başvuru yapabilir. Admin onaylarsa bu alan aktif hale gelir ve Stüdyo Dashboard erişimi açılır."
                />

                <div style={styles.publisherGrid}>
                  <div style={styles.publisherCard}>
                    <div style={styles.heroBadge}>Pasif</div>
                    <h2>Yayıncı değilsiniz</h2>
                    <p style={styles.muted}>
                      Yayıncı olmak için başvuru formunu doldurabilirsiniz.
                      Başvuru admin panelinde incelenir.
                    </p>
                    <a href="/publishers" style={styles.linkPrimary}>
                      Yayıncı Başvurusu Yap
                    </a>
                  </div>

                  <div style={styles.publisherCardActive}>
                    <div style={styles.heroBadgeGreen}>Aktif</div>
                    <h2>Yayıncı hesabı aktif olursa</h2>
                    <p style={styles.muted}>
                      Bu alandan Stüdyo Dashboard, Havuz, Gelirler ve Yayıncı
                      Profil Ayarları ekranlarına geçiş yapılır.
                    </p>
                    <a href="/publisher" style={styles.linkGreen}>
                      Stüdyo Dashboard’a Git
                    </a>
                  </div>
                </div>
              </>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

function SideButton({ active, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      style={active ? styles.sideButtonActive : styles.sideButton}
    >
      <span>
        <strong>{title}</strong>
        <small>{desc}</small>
      </span>
    </button>
  );
}

function PanelHeader({ title, desc }) {
  return (
    <div style={styles.panelHeader}>
      <div>
        <h2 style={styles.panelTitle}>{title}</h2>
        <p style={styles.muted}>{desc}</p>
      </div>
    </div>
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
    padding: "40px",
  },
  container: {
    maxWidth: "1350px",
    margin: "0 auto",
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
    marginBottom: "28px",
  },
  eyebrow: {
    color: "#f5b400",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "13px",
    fontWeight: "bold",
  },
  title: {
    fontSize: "38px",
    margin: "10px 0",
  },
  muted: {
    color: "#aaa",
    lineHeight: "1.7",
  },
  profileBadge: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    border: "1px solid #333",
    borderRadius: "20px",
    padding: "14px",
    background: "black",
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
    fontSize: "24px",
  },
  username: {
    fontWeight: "bold",
  },
  role: {
    color: "#aaa",
    fontSize: "13px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "280px minmax(0, 1fr)",
    gap: "22px",
    alignItems: "start",
  },
  sidebar: {
    border: "1px solid #333",
    borderRadius: "26px",
    padding: "18px",
    background: "#101010",
    position: "sticky",
    top: "20px",
  },
  sidebarTitle: {
    color: "#f5b400",
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "14px",
  },
  sideButton: {
    width: "100%",
    border: "1px solid #303030",
    borderRadius: "16px",
    padding: "14px",
    marginBottom: "10px",
    color: "#eee",
    background: "#050505",
    textAlign: "left",
    cursor: "pointer",
  },
  sideButtonActive: {
    width: "100%",
    border: "1px solid #f5b400",
    borderRadius: "16px",
    padding: "14px",
    marginBottom: "10px",
    color: "black",
    background: "#f5b400",
    textAlign: "left",
    cursor: "pointer",
  },
  content: {
    border: "1px solid #333",
    borderRadius: "28px",
    background: "#111",
    padding: "24px",
    minHeight: "720px",
  },
  panelHeader: {
    borderBottom: "1px solid #242424",
    paddingBottom: "18px",
    marginBottom: "20px",
  },
  panelTitle: {
    margin: 0,
    fontSize: "28px",
  },
  messageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "22px",
  },
  messageBox: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "20px",
    background: "#070707",
    minHeight: "360px",
  },
  messageBoxExpanded: {
    gridColumn: "1 / -1",
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
    background: "#070707",
    minHeight: "760px",
  },
  boxHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "center",
    borderBottom: "1px solid #222",
    paddingBottom: "14px",
  },
  expandButton: {
    border: "1px solid #2563eb",
    color: "#60a5fa",
    background: "transparent",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  boxContent: {
    marginTop: "16px",
    maxHeight: "260px",
    overflow: "hidden",
  },
  boxContentExpanded: {
    marginTop: "16px",
  },
  messageItem: {
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "16px",
    background: "black",
    marginBottom: "14px",
  },
  sameBookItem: {
    display: "flex",
    gap: "16px",
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "16px",
    background: "black",
    marginBottom: "14px",
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
    flexShrink: 0,
  },
  meta: {
    color: "#aaa",
    fontSize: "13px",
  },
  unreadBadge: {
    display: "inline-block",
    marginTop: "8px",
    background: "#f5b400",
    color: "black",
    borderRadius: "999px",
    padding: "5px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  cooldown: {
    color: "#777",
    fontSize: "12px",
    marginTop: "8px",
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },
  smallButton: {
    border: "1px solid #333",
    background: "#1f1f1f",
    color: "white",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
  },
  dangerSmallButton: {
    border: "1px solid #7f1d1d",
    background: "#220808",
    color: "#fca5a5",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
  },
  booksTopGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "20px",
    marginBottom: "22px",
  },
  bookAddHero: {
    border: "1px solid rgba(245,180,0,0.35)",
    borderRadius: "24px",
    padding: "24px",
    background: "rgba(245,180,0,0.08)",
  },
  ownershipInfo: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
    background: "#070707",
    color: "#ddd",
    lineHeight: "1.7",
  },
  heroBadge: {
    display: "inline-block",
    background: "#f5b400",
    color: "black",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  heroBadgeGreen: {
    display: "inline-block",
    background: "#22c55e",
    color: "black",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    marginTop: "12px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "black",
    color: "white",
  },
  primaryButton: {
    marginTop: "16px",
    background: "#f5b400",
    color: "black",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  successBox: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "12px",
    background: "#052e16",
    color: "#4ade80",
  },
  errorBox: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "12px",
    background: "#450a0a",
    color: "#f87171",
  },
  cardNoMargin: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
    background: "#070707",
  },
  bookList: {
    display: "grid",
    gap: "16px",
    marginTop: "14px",
  },
  bookCard: {
    display: "grid",
    gridTemplateColumns: "110px 1fr",
    gap: "18px",
    border: "1px solid #333",
    borderRadius: "20px",
    padding: "18px",
    background: "black",
  },
  bookCover: {
    height: "145px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #3b230f, #050505)",
    border: "1px solid #6d5015",
    color: "#f5b400",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    padding: "10px",
  },
  bookStatus: {
    display: "inline-block",
    background: "#052e16",
    color: "#4ade80",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  linkPrimary: {
    display: "inline-block",
    textDecoration: "none",
    background: "#f5b400",
    color: "black",
    borderRadius: "12px",
    padding: "11px 14px",
    fontWeight: "bold",
  },
  linkGreen: {
    display: "inline-block",
    textDecoration: "none",
    background: "#166534",
    color: "white",
    borderRadius: "12px",
    padding: "11px 14px",
    fontWeight: "bold",
  },
  notice: {
    border: "1px solid #333",
    borderRadius: "14px",
    padding: "14px",
    background: "black",
    marginTop: "10px",
    color: "#ddd",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },
  formCard: {
    border: "1px solid #333",
    borderRadius: "18px",
    padding: "18px",
    background: "black",
  },
  label: {
    display: "block",
    color: "#ddd",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  publisherGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },
  publisherCard: {
    border: "1px solid rgba(245,180,0,0.35)",
    borderRadius: "24px",
    padding: "24px",
    background: "rgba(245,180,0,0.08)",
  },
  publisherCardActive: {
    border: "1px solid rgba(34,197,94,0.35)",
    borderRadius: "24px",
    padding: "24px",
    background: "rgba(34,197,94,0.08)",
  },
};
