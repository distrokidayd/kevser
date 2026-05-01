"use client";

import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";

export default function ProfilePage({ params }) {
  const lang = params?.lang || "tr";
  const { user, isSignedIn } = useUser();

  const [activeTab, setActiveTab] = useState("messages");
  const [expandedBox, setExpandedBox] = useState(null);

  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [sealCode, setSealCode] = useState("");
  const [sealMessage, setSealMessage] = useState("");

  const [notifications, setNotifications] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [religion, setReligion] = useState("islam");
  const [isSect, setIsSect] = useState(false);
  const [sect, setSect] = useState("");

  useEffect(() => {
    if (isSignedIn) {
      loadBooks();
      loadNotifications();
    }
  }, [isSignedIn]);

  async function loadBooks() {
    try {
      setBooksLoading(true);
      const res = await fetch("/api/get-my-books");
      const data = await res.json();
      if (data.success) setBooks(data.books || []);
    } catch (err) {
      console.error(err);
    } finally {
      setBooksLoading(false);
    }
  }

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function addBookBySeal() {
    if (!sealCode.trim()) return;

    try {
      setSealMessage("");
      const res = await fetch("/api/add-book-by-seal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seal_code: sealCode.trim() }),
      });

      const data = await res.json();

      if (!data.ok && !data.success) {
        setSealMessage(data.error || "Kitap eklenemedi.");
        return;
      }

      setSealMessage("Kitap hesabınıza eklendi.");
      setSealCode("");
      loadBooks();
    } catch (err) {
      console.error(err);
      setSealMessage("Bir hata oluştu.");
    }
  }

  if (!isSignedIn) {
    return (
      <main style={styles.page}>
        <section style={styles.hero}>
          <div>
            <div style={styles.kicker}>Kevser Profile</div>
            <h1 style={styles.title}>Profil</h1>
            <p style={styles.muted}>Profil sayfasını görmek için giriş yapmalısınız.</p>
          </div>

          <SignInButton mode="modal">
            <button style={styles.primaryButton}>Giriş Yap</button>
          </SignInButton>
        </section>
      </main>
    );
  }

  const sentMessages = [
    {
      id: 1,
      to: "@kitap_dostu",
      time: "Bugün 14:30",
      text: "Rubailer üzerine başlattığın yorumu okudum. Çok güzel bir noktaya değinmişsin.",
    },
    {
      id: 2,
      to: "@serh_defteri",
      time: "Dün 21:10",
      text: "Gülistan hakkında yazdığın tahlile cevap verdim.",
    },
  ];

  const incomingMessages = [
    {
      id: 1,
      from: "@rubai_okuru",
      time: "Bugün 15:12",
      text: "Rubailer tartışmasında yazdığın yoruma katılıyorum.",
    },
    {
      id: 2,
      from: "@klasik_okur",
      time: "Bugün 12:44",
      text: "Aynı kitapları okuyoruz. Arkadaşlık isteğimi kabul eder misin?",
    },
  ];

  const sameBookMessages = [
    {
      id: 1,
      username: "@hayyam_notlari",
      book: "Rubailer",
      unread: 3,
      text: "Bu kitabı alan okuyucularla Rubailer’deki içtenlik meselesini konuşmak istiyorum.",
    },
    {
      id: 2,
      username: "@gulistan_serhi",
      book: "Gülistan",
      unread: 1,
      text: "Gülistan okuyanlar için ahlak ve hikmet bölümleri hakkında ortak okuma yapmak isteyen var mı?",
    },
  ];

  const communityMessages = [
    {
      id: 1,
      username: "@okur_meclisi",
      time: "Bugün",
      text: "Bu hafta Rubailer üzerine ortak şerh çalışması yapmak isteyenleri tartışma alanına bekliyoruz.",
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <div style={styles.kicker}>Kevser Profile</div>
          <h1 style={styles.title}>Üye Merkezi</h1>
          <p style={styles.muted}>
            Kitapların, mühür kodların, mesajların, profil kimliğin, cüzdanın ve yayıncı/stüdyo durumun burada toplanır.
          </p>
        </div>

        <div style={styles.profileMini}>
          <div style={styles.avatar}>
            {(user?.firstName?.[0] || user?.username?.[0] || "K").toUpperCase()}
          </div>

          <div>
            <strong>{user?.username || user?.primaryEmailAddress?.emailAddress || "Kevser Üyesi"}</strong>
            <div style={styles.mutedSmall}>Üye • Ana dil: Türkçe</div>
            <button style={styles.avatarButton}>Avatar Yükle</button>
          </div>
        </div>
      </section>

      <section style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.sideTitle}>Profil Menüsü</div>

          <SideButton active={activeTab === "messages"} onClick={() => setActiveTab("messages")}>
            Mesajlar
          </SideButton>

          <SideButton active={activeTab === "books"} onClick={() => setActiveTab("books")}>
            Kitaplarım
          </SideButton>

          <SideButton active={activeTab === "wallet"} onClick={() => setActiveTab("wallet")}>
            Cüzdan
          </SideButton>

          <SideButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
            Profil
          </SideButton>

          <SideButton active={activeTab === "publisher"} onClick={() => setActiveTab("publisher")}>
            Yayıncı / Stüdyo
          </SideButton>
        </aside>

        <section style={styles.content}>
          {activeTab === "messages" && (
            <>
              <PanelHeader
                title="Mesajlar"
                desc="Dört mesaj alanı ve sistem mesajları burada gruplanır. Admin kararları Sistem Mesajları alanına düşer."
              />

              <section style={styles.messageGrid}>
                <MessageBox
                  id="sent"
                  title="Arkadaşlara Gönderilen Mesajlar"
                  expandedBox={expandedBox}
                  setExpandedBox={setExpandedBox}
                >
                  {sentMessages.map((msg) => (
                    <MessageCard key={msg.id} meta={`Kime: ${msg.to} • ${msg.time}`}>
                      {msg.text}
                    </MessageCard>
                  ))}
                </MessageBox>

                <MessageBox
                  id="incoming"
                  title="Arkadaşlardan Gelen Mesajlar"
                  expandedBox={expandedBox}
                  setExpandedBox={setExpandedBox}
                >
                  {incomingMessages.map((msg) => (
                    <MessageCard key={msg.id} meta={`Kimden: ${msg.from} • ${msg.time}`}>
                      {msg.text}
                      <div style={styles.actionRow}>
                        <button style={styles.smallButton}>Cevap Yaz</button>
                      </div>
                    </MessageCard>
                  ))}
                </MessageBox>

                <MessageBox
                  id="sameBook"
                  title="Aynı Kitabı Alanlara Mesajlar"
                  expandedBox={expandedBox}
                  setExpandedBox={setExpandedBox}
                >
                  {sameBookMessages.map((msg) => (
                    <MessageCard key={msg.id} meta={`${msg.username} • ${msg.book} • ${msg.unread} okunmamış`}>
                      {msg.text}
                      <div style={styles.actionRow}>
                        <button style={styles.smallButton}>Mesaj Gönder</button>
                        <button style={styles.smallButton}>Arkadaşlık İsteği Gönder</button>
                        <button style={styles.dangerButton}>Bu kişiden mesaj alma</button>
                      </div>
                    </MessageCard>
                  ))}
                </MessageBox>

                <MessageBox
                  id="community"
                  title="Topluluğa Çağrı Mesajları"
                  expandedBox={expandedBox}
                  setExpandedBox={setExpandedBox}
                >
                  {communityMessages.map((msg) => (
                    <MessageCard key={msg.id} meta={`${msg.username} • ${msg.time}`}>
                      {msg.text}
                      <div style={styles.actionRow}>
                        <button style={styles.smallButton}>Katıl</button>
                        <button style={styles.dangerButton}>Şikayet Et</button>
                      </div>
                    </MessageCard>
                  ))}
                </MessageBox>

                <MessageBox
                  id="system"
                  title="Sistem Mesajları"
                  expandedBox={expandedBox}
                  setExpandedBox={setExpandedBox}
                >
                  {notifications.length === 0 && (
                    <p style={styles.muted}>Henüz sistem mesajı yok.</p>
                  )}

                  {notifications.map((n) => (
                    <MessageCard
                      key={n.id}
                      meta={new Date(n.created_at).toLocaleString("tr-TR")}
                    >
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                    </MessageCard>
                  ))}
                </MessageBox>
              </section>
            </>
          )}

          {activeTab === "books" && (
            <>
              <PanelHeader
                title="Kitaplarım"
                desc="Amazon, Google Books veya Kevser mağazasından alınan kitapların mühür kodu burada girilir."
              />

              <section style={styles.twoGrid}>
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Kitaplarım</h2>

                  {booksLoading && <p style={styles.muted}>Yükleniyor...</p>}

                  {!booksLoading && books.length === 0 && (
                    <p style={styles.muted}>Henüz hesabınıza eklenmiş kitap yok.</p>
                  )}

                  {(books.length ? books : [{ id: "demo", book_slug: "omerhayyam-rubailer", seal_code: "DEMO-KEV" }]).map((book) => (
                    <div key={book.id} style={styles.bookCard}>
                      <div style={styles.cover}>Rubailer</div>
                      <div>
                        <div style={styles.badge}>Şerh / yorum hakkı açık</div>
                        <h3>{book.book_slug || "Ömer Hayyam — Rubailer"}</h3>
                        <p style={styles.mutedSmall}>Mühür: {book.seal_code || "—"}</p>
                        <div style={styles.actionRow}>
                          <a href={`/${lang}/books/omerhayyam/rubailer`} style={styles.linkButton}>
                            Tahlil’e Git
                          </a>
                          <button style={styles.smallButton}>Katkılarımı Gör</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Kitap Ekle</h2>
                  <p style={styles.muted}>
                    Kitabın içindeki mühür kodunu gir. Sistem kodun hangi kitaba ait olduğunu tanır.
                  </p>

                  <input
                    style={styles.input}
                    value={sealCode}
                    onChange={(e) => setSealCode(e.target.value)}
                    placeholder="Örn: KEV-7H2M9Q4A"
                  />

                  <button onClick={addBookBySeal} style={styles.primaryButton}>
                    Kitabı Hesabıma Ekle
                  </button>

                  {sealMessage && <div style={styles.notice}>{sealMessage}</div>}
                </div>
              </section>
            </>
          )}

          {activeTab === "wallet" && (
            <>
              <PanelHeader
                title="Cüzdan"
                desc="Mağazada kullanabileceğin bakiye, hediye para ve kupon alanı."
              />

              <section style={styles.walletGrid}>
                <div style={styles.card}>
                  <span style={styles.muted}>Mağaza Bakiyesi</span>
                  <strong style={styles.balance}>$0.00</strong>
                </div>

                <div style={styles.card}>
                  <span style={styles.muted}>Hediye Para</span>
                  <strong style={styles.balance}>$5.00</strong>
                </div>
              </section>

              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Cüzdan İşlemleri</h2>
                <div style={styles.actionRow}>
                  <button style={styles.goldButton}>Kripto ile Bakiye Yükle</button>
                  <button style={styles.smallButton}>Kupon Kodu Gir</button>
                  <button style={styles.smallButton}>Harcama Geçmişi</button>
                </div>
              </div>
            </>
          )}

          {activeTab === "profile" && (
            <>
              <PanelHeader
                title="Profil"
                desc="Kişisel bilgiler, ana dil, bildiği diller ve din bilgisi burada düzenlenir."
                action={
                  <button onClick={() => setEditMode(!editMode)} style={styles.primaryButton}>
                    {editMode ? "Kaydet" : "Düzenle"}
                  </button>
                }
              />

              <section style={styles.profileGrid}>
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Kimlik Bilgileri</h2>
                  <input style={styles.input} placeholder="Ad" disabled={!editMode} />
                  <input style={styles.input} placeholder="Soyad" disabled={!editMode} />
                  <input style={styles.input} placeholder="Mükim olduğu şehir" disabled={!editMode} />
                  <input style={styles.input} placeholder="Ülke" disabled={!editMode} />
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>İletişim ve Güvenlik</h2>
                  <input
                    style={styles.input}
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    disabled
                    readOnly
                  />
                  <input style={styles.input} placeholder="Telefon" disabled={!editMode} />
                  <div style={styles.actionRow}>
                    <button style={styles.primaryButton}>E-posta / Telefonu Güncelle</button>
                    <button style={styles.smallButton}>Şifreyi Değiştir</button>
                  </div>
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Ana Dil</h2>
                  <select style={styles.input} disabled={!editMode}>
                    <option>Türkçe</option>
                    <option>English</option>
                    <option>العربية</option>
                    <option>Deutsch</option>
                    <option>Français</option>
                  </select>
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Bildiği Diller</h2>
                  <div style={styles.pills}>
                    <span style={styles.pill}>Türkçe</span>
                    <span style={styles.pill}>English</span>
                    <span style={styles.pill}>العربية</span>
                  </div>
                  <button style={styles.primaryButton}>Dil Ayarlarını Kaydet</button>
                </div>

                <div style={styles.cardWide}>
                  <h2 style={styles.cardTitle}>Din</h2>
                  <p style={styles.muted}>
                    Din bilgisi profil üzerinden en fazla 2 kez değiştirilebilir.
                  </p>

                  <div style={styles.warning}>
                    Not: Kişi din bilgisini profilinden en fazla 2 defa değiştirebilir.
                  </div>

                  <div style={styles.religionGrid}>
                    <button
                      style={religion === "islam" ? styles.choiceActive : styles.choice}
                      onClick={() => setReligion("islam")}
                    >
                      İslam
                    </button>
                    <button
                      style={religion === "christian" ? styles.choiceActive : styles.choice}
                      onClick={() => setReligion("christian")}
                    >
                      Hristiyanlık
                    </button>
                    <button
                      style={religion === "jewish" ? styles.choiceActive : styles.choice}
                      onClick={() => setReligion("jewish")}
                    >
                      Yahudilik
                    </button>
                    <button
                      style={religion === "other" ? styles.choiceActive : styles.choice}
                      onClick={() => setReligion("other")}
                    >
                      Diğer
                    </button>
                  </div>

                  {religion === "islam" && (
                    <div style={styles.innerCard}>
                      <h3>Fırkalardan mısın?</h3>
                      <div style={styles.religionGridTwo}>
                        <button
                          style={!isSect ? styles.choiceActive : styles.choice}
                          onClick={() => setIsSect(false)}
                        >
                          Müslüman
                        </button>
                        <button
                          style={isSect ? styles.choiceActive : styles.choice}
                          onClick={() => setIsSect(true)}
                        >
                          Fırkalardanım
                        </button>
                      </div>

                      {isSect && (
                        <>
                          <select style={styles.input} value={sect} onChange={(e) => setSect(e.target.value)}>
                            <option value="">Fırkanı seç</option>
                            <option>Hanefî</option>
                            <option>Şafiî</option>
                            <option>Malikî</option>
                            <option>Hanbelî</option>
                            <option>Caferî</option>
                            <option>Zeydî</option>
                            <option>İsmailî</option>
                            <option>Alevî</option>
                            <option>Bektaşî</option>
                            <option>Mâtürîdî</option>
                            <option>Eş&apos;arî</option>
                            <option>Selefî</option>
                            <option>Sûfî</option>
                            <option>Diğer</option>
                          </select>

                          <input style={styles.input} placeholder="Diğer ise yazınız" />
                        </>
                      )}
                    </div>
                  )}

                  {religion !== "islam" && (
                    <input style={styles.input} placeholder="Mezhep / gelenek / diğer açıklama" />
                  )}

                  <button style={styles.primaryButton}>Din Bilgisini Kaydet</button>
                </div>
              </section>
            </>
          )}

          {activeTab === "publisher" && (
            <>
              <PanelHeader
                title="Yayıncı / Stüdyo"
                desc="Yayıncı başvurusu ve stüdyo erişimi burada yönetilir."
              />

              <section style={styles.twoGrid}>
                <div style={styles.studioCard}>
                  <h2 style={styles.cardTitle}>Yayıncı Olarak Başvur</h2>
                  <p style={styles.muted}>
                    Sosyal medya, website, deneyim, anlaşma metni ve sesli kabul ile başvuru yapılır.
                  </p>
                  <button style={styles.primaryButton}>Başvuru Formunu Aç</button>
                </div>

                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>Stüdyoya Git</h2>
                  <p style={styles.muted}>Yayıncı olarak kabul edilmeden bu alan aktif olmaz.</p>
                  <button style={styles.smallButton}>Yayıncı olarak kabul edilmeniz gerekiyor</button>
                </div>
              </section>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

function SideButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={active ? styles.sideButtonActive : styles.sideButton}>
      {children}
    </button>
  );
}

function PanelHeader({ title, desc, action }) {
  return (
    <div style={styles.panelHeader}>
      <div>
        <h2 style={styles.panelTitle}>{title}</h2>
        <p style={styles.muted}>{desc}</p>
      </div>
      {action}
    </div>
  );
}

function MessageBox({ id, title, expandedBox, setExpandedBox, children }) {
  const isExpanded = expandedBox === id;
  const isHidden = expandedBox && !isExpanded;

  if (isHidden) return null;

  return (
    <div style={isExpanded ? styles.messageBoxExpanded : styles.messageBox}>
      <div style={styles.boxTop}>
        <h3>{title}</h3>
        <button
          onClick={() => setExpandedBox(isExpanded ? null : id)}
          style={styles.expandButton}
        >
          {isExpanded ? "Sayfayı Küçült" : "Sayfayı Büyüt"}
        </button>
      </div>
      {children}
    </div>
  );
}

function MessageCard({ meta, children }) {
  return (
    <div style={styles.messageCard}>
      <div style={styles.meta}>{meta}</div>
      <div>{children}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "44px 32px 80px",
    color: "#163242",
    background:
      "radial-gradient(circle at 18% 12%, rgba(255,255,255,.9), transparent 18%), linear-gradient(180deg, #f8fdff 0%, #eef9ff 36%, #eefaf7 68%, #d7f1f5 100%)",
  },
  hero: {
    maxWidth: "1420px",
    margin: "0 auto 26px",
    display: "flex",
    justifyContent: "space-between",
    gap: "28px",
    alignItems: "center",
    background: "rgba(255,255,255,.76)",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "34px",
    padding: "30px",
    boxShadow: "0 24px 80px rgba(19,68,89,.12)",
  },
  kicker: {
    color: "#0fb7a6",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: 900,
  },
  title: {
    fontFamily: "Georgia, serif",
    color: "#0f3b4d",
    fontSize: "44px",
    margin: "10px 0",
  },
  muted: {
    color: "#5d7685",
    lineHeight: 1.7,
  },
  mutedSmall: {
    color: "#5d7685",
    fontSize: "13px",
    lineHeight: 1.6,
  },
  profileMini: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    minWidth: "330px",
    background: "rgba(255,255,255,.75)",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "24px",
    padding: "16px",
  },
  avatar: {
    width: "78px",
    height: "78px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#fff,#0fb7a6)",
    border: "4px solid white",
    display: "grid",
    placeItems: "center",
    fontSize: "28px",
    fontWeight: 900,
    color: "#0f3b4d",
  },
  avatarButton: {
    border: "none",
    background: "#0fb7a6",
    color: "white",
    borderRadius: "999px",
    padding: "9px 13px",
    fontWeight: 900,
    marginTop: "8px",
    cursor: "pointer",
  },
  layout: {
    maxWidth: "1420px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "280px minmax(0,1fr)",
    gap: "24px",
    alignItems: "start",
  },
  sidebar: {
    position: "sticky",
    top: "102px",
    background: "rgba(255,255,255,.76)",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "28px",
    padding: "18px",
    boxShadow: "0 24px 80px rgba(19,68,89,.12)",
  },
  sideTitle: {
    color: "#0fb7a6",
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: 900,
    margin: "4px 0 14px",
  },
  sideButton: {
    width: "100%",
    border: "1px solid rgba(15,59,77,.14)",
    background: "white",
    color: "#0f3b4d",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "10px",
    textAlign: "left",
    fontSize: "16px",
    fontWeight: 900,
    cursor: "pointer",
  },
  sideButtonActive: {
    width: "100%",
    border: "1px solid #0fb7a6",
    background: "#0fb7a6",
    color: "white",
    borderRadius: "18px",
    padding: "16px",
    marginBottom: "10px",
    textAlign: "left",
    fontSize: "16px",
    fontWeight: 900,
    cursor: "pointer",
  },
  content: {
    background: "rgba(255,255,255,.76)",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "34px",
    padding: "26px",
    boxShadow: "0 24px 80px rgba(19,68,89,.12)",
    minHeight: "950px",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "flex-start",
    borderBottom: "1px solid rgba(15,59,77,.1)",
    paddingBottom: "20px",
    marginBottom: "22px",
  },
  panelTitle: {
    fontFamily: "Georgia, serif",
    color: "#0f3b4d",
    fontSize: "34px",
    margin: "0 0 10px",
  },
  messageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: "18px",
  },
  messageBox: {
    background: "rgba(255,255,255,.82)",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "26px",
    padding: "20px",
    minHeight: "330px",
  },
  messageBoxExpanded: {
    gridColumn: "1 / -1",
    background: "rgba(255,255,255,.9)",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "26px",
    padding: "20px",
    minHeight: "790px",
  },
  boxTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "center",
    borderBottom: "1px solid rgba(15,59,77,.1)",
    paddingBottom: "14px",
    marginBottom: "14px",
  },
  expandButton: {
    border: "1px solid #0fb7a6",
    color: "#0fb7a6",
    background: "white",
    borderRadius: "999px",
    padding: "9px 13px",
    fontWeight: 900,
    cursor: "pointer",
  },
  messageCard: {
    background: "white",
    border: "1px solid rgba(15,59,77,.1)",
    borderRadius: "18px",
    padding: "15px",
    marginBottom: "12px",
  },
  meta: {
    color: "#5d7685",
    fontSize: "13px",
    fontWeight: 700,
  },
  actionRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  smallButton: {
    border: "1px solid rgba(15,59,77,.14)",
    background: "white",
    color: "#0f3b4d",
    borderRadius: "999px",
    padding: "9px 12px",
    fontWeight: 800,
    cursor: "pointer",
  },
  dangerButton: {
    border: "1px solid #fecaca",
    background: "white",
    color: "#b91c1c",
    borderRadius: "999px",
    padding: "9px 12px",
    fontWeight: 800,
    cursor: "pointer",
  },
  primaryButton: {
    border: "none",
    background: "#0fb7a6",
    color: "white",
    borderRadius: "999px",
    padding: "12px 16px",
    fontWeight: 900,
    cursor: "pointer",
    textDecoration: "none",
  },
  goldButton: {
    border: "none",
    background: "#d49b1f",
    color: "white",
    borderRadius: "999px",
    padding: "12px 16px",
    fontWeight: 900,
    cursor: "pointer",
  },
  twoGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr .9fr",
    gap: "18px",
  },
  card: {
    background: "rgba(255,255,255,.86)",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "26px",
    padding: "22px",
  },
  cardWide: {
    gridColumn: "1 / -1",
    background: "rgba(255,255,255,.86)",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "26px",
    padding: "22px",
  },
  cardTitle: {
    fontFamily: "Georgia, serif",
    color: "#0f3b4d",
    fontSize: "28px",
    margin: "0 0 12px",
  },
  input: {
    width: "100%",
    border: "1px solid rgba(15,59,77,.16)",
    background: "white",
    borderRadius: "16px",
    padding: "14px",
    margin: "12px 0",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  bookCard: {
    display: "grid",
    gridTemplateColumns: "96px 1fr",
    gap: "16px",
    alignItems: "start",
    background: "white",
    border: "1px solid rgba(15,59,77,.1)",
    borderRadius: "22px",
    padding: "16px",
    marginTop: "14px",
  },
  cover: {
    height: "130px",
    borderRadius: "18px",
    background: "linear-gradient(135deg,#f8fdff,#c9f2ed)",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    color: "#0f3b4d",
    fontWeight: 900,
    border: "1px solid rgba(15,59,77,.14)",
  },
  badge: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 900,
  },
  linkButton: {
    border: "1px solid #0fb7a6",
    color: "#0fb7a6",
    background: "white",
    borderRadius: "999px",
    padding: "9px 12px",
    fontWeight: 800,
    cursor: "pointer",
    textDecoration: "none",
  },
  notice: {
    marginTop: "14px",
    background: "rgba(15,183,166,.1)",
    border: "1px solid rgba(15,183,166,.18)",
    color: "#0f3b4d",
    borderRadius: "18px",
    padding: "12px",
  },
  walletGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: "18px",
    marginBottom: "18px",
  },
  balance: {
    display: "block",
    fontSize: "30px",
    color: "#0f3b4d",
    marginTop: "8px",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: "18px",
  },
  pills: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "12px",
    marginBottom: "14px",
  },
  pill: {
    background: "#0fb7a6",
    color: "white",
    borderRadius: "999px",
    padding: "8px 12px",
    fontWeight: 900,
  },
  warning: {
    background: "#fff7ed",
    color: "#9a3412",
    border: "1px solid #fed7aa",
    borderRadius: "18px",
    padding: "14px",
    lineHeight: 1.6,
    marginBottom: "14px",
  },
  religionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,minmax(0,1fr))",
    gap: "10px",
    margin: "12px 0",
  },
  religionGridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: "10px",
    margin: "12px 0",
  },
  choice: {
    border: "1px solid rgba(15,59,77,.14)",
    background: "white",
    color: "#0f3b4d",
    borderRadius: "16px",
    padding: "13px",
    fontWeight: 900,
    textAlign: "center",
    cursor: "pointer",
  },
  choiceActive: {
    border: "1px solid #0fb7a6",
    background: "#0fb7a6",
    color: "white",
    borderRadius: "16px",
    padding: "13px",
    fontWeight: 900,
    textAlign: "center",
    cursor: "pointer",
  },
  innerCard: {
    background: "white",
    border: "1px solid rgba(15,59,77,.12)",
    borderRadius: "22px",
    padding: "16px",
    marginTop: "14px",
  },
  studioCard: {
    background: "linear-gradient(135deg, rgba(212,155,31,.18), rgba(255,255,255,.85))",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "26px",
    padding: "22px",
  },
};
