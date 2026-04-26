"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function BookPage() {
  const { user, isSignedIn } = useUser();

  const [expandedPanel, setExpandedPanel] = useState(null);
  const [hasBook, setHasBook] = useState(false);
  const [checked, setChecked] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [discussionText, setDiscussionText] = useState("");
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const [commentaries, setCommentaries] = useState([]);
  const [openThread, setOpenThread] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const maxChars = 5000;
  const isFullscreen = expandedPanel === "commentary" || expandedPanel === "discussion";

  useEffect(() => {
    async function checkBook() {
      if (!isSignedIn || !user) {
        setChecked(true);
        setHasBook(false);
        return;
      }

      const res = await fetch("/api/check-user-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_slug: "omerhayyam-rubailer" })
      });

      const data = await res.json();
      setHasBook(data.ok && data.hasBook);
      setChecked(true);
    }

    async function loadContributions() {
      const res = await fetch("/api/get-contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_slug: "omerhayyam-rubailer" })
      });

      const data = await res.json();

      if (data.ok) {
        setCommentaries(data.data || []);
      }
    }

    checkBook();
    loadContributions();
  }, [isSignedIn, user]);

  async function sendContribution(type, content) {
    if (!content.trim()) return;

    setLoading(type);
    setMessage(null);

    const res = await fetch("/api/create-contribution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        type,
        book_slug: "omerhayyam-rubailer"
      })
    });

    const data = await res.json();

    if (data.ok) {
      setMessage("Başarıyla gönderildi");

      if (type === "commentary") {
        setCommentText("");
      }

      if (type === "discussion") {
        setDiscussionText("");
      }

      const refresh = await fetch("/api/get-contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_slug: "omerhayyam-rubailer" })
      });

      const refreshedData = await refresh.json();

      if (refreshedData.ok) {
        setCommentaries(refreshedData.data || []);
      }
    } else {
      setMessage("Hata: " + data.error);
    }

    setLoading(null);
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  const demoCommentaries = [
    {
      id: "demo-1",
      user_id: "@rubai_okuru",
      content: "Ömer Hayyam’ın şiirlerinde içtenlik her sayfasında apaçık ortadadır. Sizce en içten mısraları hangileridir?",
      type: "commentary",
      created_at: new Date().toISOString(),
      score: 18
    },
    {
      id: "demo-2",
      user_id: "@hayyam_notlari",
      content: "Hayyam’ın dilinde sade görünen ifadeler çoğu zaman derin bir varlık sorgusuna açılır.",
      type: "commentary",
      created_at: new Date().toISOString(),
      score: 11
    }
  ];

  const allCommentaries = [...commentaries, ...demoCommentaries]
    .filter((item) => item.type === "commentary")
    .map((item, index) => ({
      ...item,
      score: item.score ?? Math.max(0, 10 - index)
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0) || new Date(b.created_at) - new Date(a.created_at));

  const visibleCommentaries =
    expandedPanel === "commentary" ? allCommentaries : allCommentaries.slice(0, 2);

  const discussionThreads = [
    {
      id: 1,
      originalUser: "@rubai_okuru",
      originalDate: "25.04.2026 19:51",
      starterUser: "@klasik_okur",
      startedAt: "25.04.2026 20:14",
      originalText: "Ömer Hayyam’ın şiirlerinde içtenlik her sayfasında apaçık ortadadır. Sizce en içten mısraları hangileridir?",
      score: 34,
      replies: [
        { id: 1, user: "@fars_edebiyati", role: "üye", text: "Bence içtenlik en çok zaman ve pişmanlık temasında görünür.", time: "20:20" },
        { id: 2, user: "@kevser_editor", role: "yayıncı", text: "Bu tartışma yorumlu baskı için aday başlık olabilir.", time: "20:28" },
        { id: 3, user: "@rubai_okuru", role: "yorum sahibi", text: "Ben özellikle kısa dörtlüklerdeki doğrudan söyleyişin güçlü olduğunu düşünüyorum.", time: "20:36" }
      ]
    }
  ];

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        {!isFullscreen && (
          <>
            <div style={styles.header}>
              <div style={styles.eyebrow}>Kevser Books</div>
              <h1 style={styles.title}>Ömer Hayyam — Rubailer</h1>
              <p style={styles.muted}>
                Bu sayfa kitabın şerh/tahlil/yorum ve tartışma alanıdır.
              </p>
            </div>

            <section style={styles.bookGrid}>
              <PaperPage title="Şerh / Yorum Alanı Kuralları">
                <p>Bu alana kitabı hesabına eklemiş üyeler yorum, tahlil ve şerh gönderebilir.</p>
                <p>Katkılar güçlü, anlamlı ve kitapla ilişkili olmalıdır.</p>
                <p>Yorumlar puan sırasına göre yükselir; eşit puanda yeni olan üstte görünür.</p>
              </PaperPage>

              <PaperPage title="Yayıncı Sayfası 1">
                <p>Bu alan yayıncı tarafından hazırlanacak örnek kitap sayfasıdır.</p>
                <p>Kitaptan seçilmiş bir sayfa, önsöz parçası veya açıklama metni burada gösterilebilir.</p>
              </PaperPage>

              <div style={styles.coverWrap}>
                <div style={styles.cover}>
                  <div style={styles.coverInner}>
                    <div style={styles.coverSmall}>Kevser Publishing House</div>
                    <div style={styles.coverLine} />
                    <div>
                      <div style={styles.coverTitle}>Rubailer</div>
                      <div style={styles.coverAuthor}>Ömer Hayyam</div>
                    </div>
                    <div style={styles.coverSmall}>Şerh • Yorum • Tartışma</div>
                  </div>
                </div>
              </div>

              <PaperPage title="Yayıncı Sayfası 2">
                <p>Yayıncının seçtiği ikinci kitap sayfası burada yer alır.</p>
                <p>Kitaptan örnek bölüm, çeviri notu veya kısa açıklama olabilir.</p>
              </PaperPage>

              <PaperPage title="Tartışma Alanı Kuralları">
                <p>Bu alanda şerh ve yorumlardan tartışmaya taşınan başlıklar konuşulur.</p>
                <p>Kişisel saldırı, spam ve kitap dışı içerikler yayıncı havuzuna iletilebilir.</p>
                <p>Tartışmalar yorumlu baskı değerlendirmelerine katkı sağlayabilir.</p>
              </PaperPage>
            </section>
          </>
        )}

        {!hasBook && checked && !isFullscreen && (
          <div style={styles.warning}>
            Bu alana katkı yapmak için kitabı hesabınıza eklemeniz gerekiyor.
            <br />
            <a href="/profile" style={styles.profileButton}>Profile Git</a>
          </div>
        )}

        <section style={{ display: "grid", gap: "24px", marginTop: isFullscreen ? 0 : "40px" }}>
          {(!expandedPanel || expandedPanel === "commentary") && (
            <div style={styles.panel}>
              <div style={styles.panelHeaderDark}>
                <div>
                  <h2>Şerh / Tahlil / Yorum Alanı</h2>
                  <p style={styles.muted}>
                    Bu alana yalnızca kitabı hesabına eklemiş üyeler yazabilir.
                  </p>
                </div>

                <button
                  onClick={() => setExpandedPanel(expandedPanel === "commentary" ? null : "commentary")}
                  style={styles.expandButton}
                >
                  {expandedPanel === "commentary" ? "Sayfayı Küçült" : "Sayfayı Büyüt"}
                </button>
              </div>

              <div style={expandedPanel === "commentary" ? styles.whiteAreaExpanded : styles.whiteAreaSmall}>
                {visibleCommentaries.map((item) => (
                  <article key={item.id} style={styles.commentCard}>
                    <div style={styles.commentTop}>
                      <div>
                        <div style={styles.meta}>
                          {item.user_id || "Kullanıcı"} • {new Date(item.created_at).toLocaleString("tr-TR")}
                        </div>
                        <p style={styles.commentText}>{item.content}</p>
                      </div>

                      <div style={styles.score}>Puan: {item.score || 0}</div>
                    </div>

                    <div style={styles.actions}>
                      <button style={styles.smallButton}>Yorumu Yukarı Çıkar</button>
                      <button style={styles.smallButton}>Yorumu Aşağı İndir</button>
                      <button style={styles.greenButton}>Tartışma Başlat</button>
                      <button style={styles.redButton}>Yayıncı Havuzuna Şikayet Olarak İlet</button>
                    </div>
                  </article>
                ))}

                {hasBook && (
                  <div style={styles.writeBox}>
                    <div style={styles.writeTop}>
                      <label>Şerh / Tahlil / Yorum Yaz</label>
                      <span>Kalan karakter: {maxChars - commentText.length}</span>
                    </div>

                    <textarea
                      value={commentText}
                      maxLength={maxChars}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Kitap hakkında yorum, şerh veya tahlilinizi yazın..."
                      style={styles.bigTextarea}
                    />

                    <button
                      onClick={() => sendContribution("commentary", commentText)}
                      disabled={loading === "commentary"}
                      style={styles.blackButton}
                    >
                      {loading === "commentary" ? "Gönderiliyor..." : "Gönder"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {(!expandedPanel || expandedPanel === "discussion") && (
            <div style={styles.discussionPanel}>
              <div style={styles.panelHeaderGreen}>
                <div>
                  <h2>Tartışma Alanı</h2>
                  <p style={styles.muted}>
                    Tartışma başlatılan yorumlar burada başlığa dönüşür.
                  </p>
                </div>

                <button
                  onClick={() => setExpandedPanel(expandedPanel === "discussion" ? null : "discussion")}
                  style={styles.expandButton}
                >
                  {expandedPanel === "discussion" ? "Sayfayı Küçült" : "Sayfayı Büyüt"}
                </button>
              </div>

              <div style={expandedPanel === "discussion" ? styles.whiteAreaExpanded : styles.whiteAreaSmall}>
                {discussionThreads.map((thread) => {
                  const isOpen = openThread === thread.id;

                  return (
                    <article key={thread.id} style={styles.commentCard}>
                      <div style={styles.commentTop}>
                        <div>
                          <div style={{ color: "#a16207", fontWeight: "bold", fontSize: "14px" }}>
                            ★ Tartışmaya Taşınan Yorum
                          </div>
                          <div style={styles.meta}>
                            Yorum sahibi:{" "}
                            <button onClick={() => setSelectedUser(thread.originalUser)} style={styles.linkButton}>
                              {thread.originalUser}
                            </button>{" "}
                            • {thread.originalDate}
                          </div>
                          <div style={styles.meta}>
                            Tartışmayı başlatan:{" "}
                            <button onClick={() => setSelectedUser(thread.starterUser)} style={styles.linkButton}>
                              {thread.starterUser}
                            </button>{" "}
                            • {thread.startedAt}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={styles.score}>Puan: {thread.score}</div>
                          <button onClick={() => setOpenThread(isOpen ? null : thread.id)} style={styles.plusButton}>
                            {isOpen ? "−" : "+"}
                          </button>
                        </div>
                      </div>

                      <p style={styles.commentText}>{thread.originalText}</p>

                      {selectedUser && (
                        <div style={styles.friendBox}>
                          {selectedUser} için <button style={styles.inlineAction}>Arkadaşlık İsteği Gönder</button>
                          <button onClick={() => setSelectedUser(null)} style={styles.closeButton}>kapat</button>
                        </div>
                      )}

                      {selectedReport && (
                        <div style={styles.reportBox}>
                          Bu mesajı <button style={styles.inlineAction}>Yayıncılar havuzuna şikayet olarak ilet</button>
                          <button onClick={() => setSelectedReport(null)} style={styles.closeButton}>kapat</button>
                        </div>
                      )}

                      {isOpen && (
                        <div style={styles.threadBox}>
                          {thread.replies.map((reply) => (
                            <div key={reply.id} style={styles.reply}>
                              <div style={styles.commentTop}>
                                <div style={styles.meta}>
                                  <button onClick={() => setSelectedUser(reply.user)} style={styles.linkButton}>
                                    {reply.user}
                                  </button>{" "}
                                  • {reply.role} • {reply.time}
                                </div>
                                <button onClick={() => setSelectedReport(reply.id)} style={styles.xButton}>X</button>
                              </div>
                              <p>{reply.text}</p>
                            </div>
                          ))}

                          {hasBook && (
                            <div style={styles.writeBox}>
                              <label>Bu tartışmaya cevap yaz</label>
                              <textarea
                                value={discussionText}
                                onChange={(e) => setDiscussionText(e.target.value)}
                                placeholder="Cevabınızı yazın..."
                                style={styles.mediumTextarea}
                              />
                              <button
                                onClick={() => sendContribution("discussion", discussionText)}
                                disabled={loading === "discussion"}
                                style={styles.blackButton}
                              >
                                {loading === "discussion" ? "Gönderiliyor..." : "Gönder"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {!isFullscreen && (
          <section style={styles.recentBox}>
            <div style={styles.eyebrow}>Son Katkılar</div>
            <h2>Son 7 Katkı</h2>

            {allCommentaries.slice(0, 7).map((item) => (
              <article key={item.id} style={styles.recentItem}>
                <div style={styles.meta}>
                  {item.type} • {item.user_id || "Kullanıcı"} • {new Date(item.created_at).toLocaleString("tr-TR")}
                </div>
                <p>{item.content}</p>
              </article>
            ))}
          </section>
        )}

        {message && <div style={styles.message}>{message}</div>}
      </section>

      {isFullscreen && <FloatingScrollButtons onTop={scrollTop} onBottom={scrollBottom} />}
    </main>
  );
}

function PaperPage({ title, children }) {
  return (
    <article style={styles.paper}>
      <div style={styles.paperTitle}>{title}</div>
      <div style={styles.paperBody}>{children}</div>
    </article>
  );
}

function FloatingScrollButtons({ onTop, onBottom }) {
  return (
    <div style={styles.floatButtons}>
      <button onClick={onTop} style={styles.floatButton}>↑</button>
      <button onClick={onBottom} style={styles.floatButton}>↓</button>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "black",
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
    marginBottom: "32px"
  },
  eyebrow: {
    color: "#f5b400",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "13px"
  },
  title: {
    fontSize: "42px",
    marginTop: "12px"
  },
  muted: {
    color: "#aaa",
    lineHeight: "1.7"
  },
  bookGrid: {
    display: "grid",
    gridTemplateColumns: "0.85fr 0.9fr 1.15fr 0.9fr 0.85fr",
    gap: "18px"
  },
  paper: {
    minHeight: "520px",
    borderRadius: "20px",
    border: "1px solid #333",
    background: "#f4ead7",
    color: "#24180d",
    padding: "20px"
  },
  paperTitle: {
    borderBottom: "1px solid rgba(0,0,0,0.15)",
    paddingBottom: "12px",
    color: "#7a521d",
    fontWeight: "bold",
    fontSize: "13px",
    letterSpacing: "2px"
  },
  paperBody: {
    marginTop: "18px",
    fontFamily: "Georgia, serif",
    lineHeight: "1.8"
  },
  coverWrap: {
    height: "520px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  cover: {
    height: "100%",
    width: "100%",
    maxWidth: "330px",
    borderRadius: "28px",
    border: "1px solid #8a6a12",
    background: "linear-gradient(135deg, #3b230f, #090909)",
    padding: "28px"
  },
  coverInner: {
    height: "100%",
    border: "1px solid rgba(245,180,0,0.25)",
    borderRadius: "20px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "center"
  },
  coverSmall: {
    color: "#d6b15d",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "11px"
  },
  coverLine: {
    height: "1px",
    width: "80px",
    background: "#d6b15d",
    margin: "0 auto"
  },
  coverTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "48px",
    color: "#f8df9b"
  },
  coverAuthor: {
    fontSize: "20px",
    marginTop: "20px"
  },
  warning: {
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "20px",
    background: "#111",
    marginTop: "32px",
    color: "#f5b400"
  },
  profileButton: {
    display: "inline-block",
    marginTop: "12px",
    background: "#f5b400",
    color: "black",
    padding: "10px 16px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "bold"
  },
  panel: {
    border: "1px solid #333",
    borderRadius: "28px",
    padding: "20px",
    background: "#111"
  },
  discussionPanel: {
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "28px",
    padding: "20px",
    background: "rgba(16,185,129,0.08)"
  },
  panelHeaderDark: {
    borderRadius: "20px",
    padding: "24px",
    background: "#1f1f1f",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px"
  },
  panelHeaderGreen: {
    borderRadius: "20px",
    padding: "24px",
    background: "#04251b",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px"
  },
  expandButton: {
    border: "1px solid #2563eb",
    color: "#60a5fa",
    background: "transparent",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    height: "fit-content"
  },
  whiteAreaSmall: {
    marginTop: "16px",
    background: "white",
    color: "black",
    borderRadius: "20px",
    padding: "20px",
    maxHeight: "620px",
    overflow: "hidden"
  },
  whiteAreaExpanded: {
    marginTop: "16px",
    background: "white",
    color: "black",
    borderRadius: "20px",
    padding: "20px",
    minHeight: "850px"
  },
  commentCard: {
    border: "1px solid #ddd",
    borderRadius: "18px",
    padding: "18px",
    background: "#fffaf0",
    marginBottom: "14px"
  },
  commentTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "flex-start"
  },
  meta: {
    fontSize: "13px",
    color: "#666"
  },
  commentText: {
    marginTop: "10px",
    lineHeight: "1.7"
  },
  score: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "white",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap"
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "18px"
  },
  smallButton: {
    border: "1px solid #ddd",
    background: "white",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer"
  },
  greenButton: {
    border: "none",
    background: "#064e3b",
    color: "white",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer"
  },
  redButton: {
    border: "1px solid #fca5a5",
    background: "white",
    color: "#b91c1c",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer"
  },
  writeBox: {
    border: "1px solid #ddd",
    borderRadius: "18px",
    background: "white",
    padding: "18px",
    marginTop: "22px"
  },
  writeTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "13px"
  },
  bigTextarea: {
    width: "100%",
    height: "220px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "14px",
    marginTop: "12px"
  },
  mediumTextarea: {
    width: "100%",
    height: "120px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "14px",
    marginTop: "12px"
  },
  blackButton: {
    marginTop: "12px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    cursor: "pointer"
  },
  plusButton: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    border: "1px solid #047857",
    color: "#047857",
    background: "white",
    fontSize: "22px",
    cursor: "pointer"
  },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#1d4ed8",
    fontWeight: "bold",
    cursor: "pointer"
  },
  friendBox: {
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#1e3a8a",
    borderRadius: "12px",
    padding: "12px",
    marginTop: "12px"
  },
  reportBox: {
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#991b1b",
    borderRadius: "12px",
    padding: "12px",
    marginTop: "12px"
  },
  inlineAction: {
    border: "none",
    background: "transparent",
    textDecoration: "underline",
    fontWeight: "bold",
    cursor: "pointer"
  },
  closeButton: {
    marginLeft: "14px",
    border: "none",
    background: "transparent",
    color: "#555",
    cursor: "pointer"
  },
  threadBox: {
    border: "1px solid #ddd",
    borderRadius: "18px",
    background: "white",
    padding: "16px",
    marginTop: "18px"
  },
  reply: {
    border: "1px solid #ddd",
    borderRadius: "14px",
    background: "#f9fafb",
    padding: "14px",
    marginBottom: "10px"
  },
  xButton: {
    border: "1px solid #fca5a5",
    color: "#dc2626",
    background: "white",
    borderRadius: "999px",
    padding: "4px 8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  recentBox: {
    border: "1px solid #333",
    borderRadius: "28px",
    background: "#111",
    padding: "28px",
    marginTop: "48px"
  },
  recentItem: {
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "16px",
    background: "black",
    marginTop: "12px"
  },
  message: {
    marginTop: "20px",
    color: "#f5b400"
  },
  floatButtons: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  floatButton: {
    width: "48px",
    height: "48px",
    borderRadius: "999px",
    border: "1px solid #333",
    background: "black",
    color: "white",
    fontSize: "22px",
    cursor: "pointer"
  }
};
