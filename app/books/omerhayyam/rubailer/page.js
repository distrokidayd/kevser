"use client";

import { useEffect, useState } from "react";
import TranslatedContent from "@/app/components/TranslatedContent";

export default function BookPage() {
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [comments, setComments] = useState([]);
  const [threads, setThreads] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [openThread, setOpenThread] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [appealMessage, setAppealMessage] = useState("");

  const maxChars = 5000;
  const isFullscreen =
    expandedPanel === "commentary" || expandedPanel === "discussion";

  useEffect(() => {
    loadComments();
    loadThreads();
  }, []);

  async function loadComments() {
    const res = await fetch("/api/get-contributions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_slug: "omerhayyam-rubailer",
      }),
    });

    const data = await res.json();

    if (data.ok) {
      setComments(data.data || []);
    }
  }

  async function loadThreads() {
    const res = await fetch("/api/get-discussions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        book_slug: "omerhayyam-rubailer",
      }),
    });

    const data = await res.json();

    if (data.ok) {
      setThreads(data.data || []);
    }
  }

  async function sendComment() {
    if (!commentText.trim()) return;

    await fetch("/api/create-contribution", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: commentText,
        type: "commentary",
        book_slug: "omerhayyam-rubailer",
      }),
    });

    setCommentText("");
    loadComments();
  }

  async function voteContribution(id, value) {
    await fetch("/api/vote-contribution", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contribution_id: id,
        value,
      }),
    });

    loadComments();
  }

  async function startDiscussion(id) {
    await fetch("/api/start-discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contribution_id: id,
      }),
    });

    loadThreads();
  }

  async function reportContent(payload) {
    await fetch("/api/report-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setSelectedReport("Şikayet yayıncı havuzuna iletildi.");
  }

  async function createAppeal(contributionId) {
    try {
      setAppealMessage("");

      const reason = window.prompt("İtiraz sebebinizi yazın:");

      if (!reason || !reason.trim()) {
        return;
      }

      const reportsRes = await fetch("/api/get-reports");
      const reportsData = await reportsRes.json();

      if (!reportsData.success) {
        setAppealMessage("Şikayet kaydı bulunamadı.");
        return;
      }

      const matchedReport = (reportsData.reports || []).find(
        (report) => report.content_id === contributionId
      );

      if (!matchedReport) {
        setAppealMessage("Bu içerik için bağlı şikayet kaydı bulunamadı.");
        return;
      }

      const res = await fetch("/api/create-appeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: matchedReport.id,
          contributionId,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setAppealMessage(data.error || "İtiraz gönderilemedi.");
        return;
      }

      setAppealMessage("İtirazınız admin paneline gönderildi.");
    } catch (error) {
      console.error("İtiraz hatası:", error);
      setAppealMessage("İtiraz gönderilirken hata oluştu.");
    }
  }

  function scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function scrollBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  const demoComments = [
    {
      id: "demo-1",
      user_id: "@rubai_okuru",
      content:
        "Ömer Hayyam’ın şiirlerinde içtenlik her sayfasında apaçık ortadadır.\nSizce en içten mısraları hangileridir?",
      created_at: new Date().toISOString(),
      score: 18,
      status: "active",
      source_language: "Türkçe",
    },
  ];

  const allComments = [...comments, ...demoComments].filter(
    (item) => item.type === "commentary" || item.id?.startsWith("demo")
  );

  const visibleComments =
    expandedPanel === "commentary" ? allComments : allComments.slice(0, 2);

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        {!isFullscreen && (
          <>
            <header style={styles.header}>
              <div style={styles.eyebrow}>Kevser Books</div>
              <h1 style={styles.title}>Ömer Hayyam — Rubailer</h1>
              <p style={styles.muted}>
                Bu sayfa kitabın şerh, tahlil, yorum ve tartışma alanıdır.
              </p>
            </header>

            <section style={styles.bookGrid}>
              <PaperPage title="Okuma Notu">
                <p>
                  Bu alana kitabı hesabına eklemiş üyeler yorum, tahlil ve şerh
                  gönderebilir.
                </p>
                <p>Katkılar güçlü, anlamlı ve kitapla ilişkili olmalıdır.</p>
                <p>
                  Yorumlar puan sırasına göre yükselir; eşit puanda yeni olan
                  üstte görünür.
                </p>
              </PaperPage>

              <PaperPage title="Yayıncı Alanı">
                <p>
                  Bu alan yayıncı tarafından hazırlanacak örnek kitap sayfasıdır.
                </p>
                <p>
                  Kitaptan seçilmiş bir sayfa, önsöz parçası veya açıklama metni
                  burada gösterilebilir.
                </p>
              </PaperPage>

              <div style={styles.coverWrap}>
                <div style={styles.cover}>
                  <div style={styles.coverInner}>
                    <div style={styles.coverSmall}>Kevser Publishing House</div>
                    <div style={styles.coverLine}></div>
                    <div>
                      <div style={styles.coverTitle}>Rubailer</div>
                      <div style={styles.coverAuthor}>Ömer Hayyam</div>
                    </div>
                    <div style={styles.coverSmall}>Şerh • Yorum • Tartışma</div>
                  </div>
                </div>
              </div>

              <PaperPage title="Kitap Sayfası">
                <p>Yayıncının seçtiği ikinci kitap sayfası burada yer alır.</p>
                <p>
                  Kitaptan örnek bölüm, çeviri notu veya kısa açıklama olabilir.
                </p>
              </PaperPage>

              <PaperPage title="Tartışma Notu">
                <p>
                  Bu alanda şerh ve yorumlardan tartışmaya taşınan başlıklar
                  konuşulur.
                </p>
                <p>
                  Kişisel saldırı, spam ve kitap dışı içerikler yayıncı havuzuna
                  iletilebilir.
                </p>
              </PaperPage>
            </section>
          </>
        )}

        {(!expandedPanel || expandedPanel === "commentary") && (
          <section
            style={
              expandedPanel === "commentary"
                ? styles.panelFullscreen
                : styles.panel
            }
          >
            <div style={styles.panelHeaderDark}>
              <div>
                <h2>Şerh / Tahlil / Yorum Alanı</h2>
                <p style={styles.muted}>
                  Bu alana yalnızca kitabı hesabına eklemiş üyeler yazabilir.
                </p>
              </div>

              <button
                onClick={() =>
                  setExpandedPanel(
                    expandedPanel === "commentary" ? null : "commentary"
                  )
                }
                style={styles.expandButton}
              >
                {expandedPanel === "commentary"
                  ? "Sayfayı Küçült"
                  : "Sayfayı Büyüt"}
              </button>
            </div>

            {selectedReport && (
              <div style={styles.reportBox}>
                {selectedReport}
                <button
                  onClick={() => setSelectedReport(null)}
                  style={styles.closeButton}
                >
                  kapat
                </button>
              </div>
            )}

            {appealMessage && (
              <div style={styles.appealBox}>
                {appealMessage}
                <button
                  onClick={() => setAppealMessage("")}
                  style={styles.closeButton}
                >
                  kapat
                </button>
              </div>
            )}

            <div
              style={
                expandedPanel === "commentary"
                  ? styles.whiteAreaExpanded
                  : styles.whiteAreaSmall
              }
            >
              {visibleComments.map((item) => (
                <article key={item.id} style={styles.commentCard}>
                  <div style={styles.commentTop}>
                    <div>
                      <div style={styles.meta}>
                        {item.user_id || "Kullanıcı"} •{" "}
                        {new Date(item.created_at).toLocaleString("tr-TR")}
                      </div>

                      <div style={styles.commentText}>
                        <TranslatedContent contribution={item} />
                      </div>
                    </div>

                    <div style={styles.score}>Puan: {item.score || 0}</div>
                  </div>

                  {item.status === "suspended" && (
                    <div style={styles.suspendedBox}>
                      <strong>Bu katkı askıya alınmış.</strong>
                      <p>
                        Yayıncı kararı sonrası içerik askıya alınmıştır. İçerik
                        sahibi admin incelemesi için itiraz gönderebilir.
                      </p>

                      {!item.id?.startsWith("demo") && (
                        <button
                          style={styles.appealButton}
                          onClick={() => createAppeal(item.id)}
                        >
                          İtiraz Et
                        </button>
                      )}
                    </div>
                  )}

                  {!item.id?.startsWith("demo") &&
                    item.status !== "suspended" && (
                      <div style={styles.actions}>
                        <button
                          onClick={() => voteContribution(item.id, 1)}
                          style={styles.smallButton}
                        >
                          Yorumu Yukarı Çıkar
                        </button>

                        <button
                          onClick={() => voteContribution(item.id, -1)}
                          style={styles.smallButton}
                        >
                          Yorumu Aşağı İndir
                        </button>

                        <button
                          onClick={() => startDiscussion(item.id)}
                          style={styles.greenButton}
                        >
                          Tartışma Başlat
                        </button>

                        <button
                          onClick={() =>
                            reportContent({
                              contribution_id: item.id,
                            })
                          }
                          style={styles.redButton}
                        >
                          Yayıncı Havuzuna Şikayet Olarak İlet
                        </button>
                      </div>
                    )}
                </article>
              ))}

              <div style={styles.writeBox}>
                <div style={styles.writeTop}>
                  <strong>Şerh / Tahlil / Yorum Yaz</strong>
                  <span>Kalan karakter: {maxChars - commentText.length}</span>
                </div>

                <textarea
                  maxLength={maxChars}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Kitap hakkında yorum, şerh veya tahlilinizi yazın..."
                  style={styles.bigTextarea}
                />

                <button onClick={sendComment} style={styles.blackButton}>
                  Gönder
                </button>
              </div>
            </div>
          </section>
        )}

        {(!expandedPanel || expandedPanel === "discussion") && (
          <section
            style={
              expandedPanel === "discussion"
                ? styles.discussionFullscreen
                : styles.discussionPanel
            }
          >
            <div style={styles.panelHeaderGreen}>
              <div>
                <h2>Tartışma Alanı</h2>
                <p style={styles.muted}>
                  Tartışma başlatılan yorumlar burada başlığa dönüşür.
                </p>
              </div>

              <button
                onClick={() =>
                  setExpandedPanel(
                    expandedPanel === "discussion" ? null : "discussion"
                  )
                }
                style={styles.expandButton}
              >
                {expandedPanel === "discussion"
                  ? "Sayfayı Küçült"
                  : "Sayfayı Büyüt"}
              </button>
            </div>

            <div
              style={
                expandedPanel === "discussion"
                  ? styles.whiteAreaExpanded
                  : styles.whiteAreaSmall
              }
            >
              {threads.length === 0 && (
                <p style={styles.noVote}>Henüz tartışma başlığı yok.</p>
              )}

              {threads.map((thread) => {
                const isOpen = openThread === thread.id;

                return (
                  <article key={thread.id} style={styles.commentCard}>
                    <div style={styles.commentTop}>
                      <div>
                        <div style={styles.threadLabel}>
                          ★ Tartışmaya Taşınan Yorum
                        </div>

                        <div style={styles.meta}>
                          Yorum sahibi:{" "}
                          <button
                            onClick={() =>
                              setSelectedUser(thread.contributions?.user_id)
                            }
                            style={styles.linkButton}
                          >
                            {thread.contributions?.user_id || "Kullanıcı"}
                          </button>
                        </div>

                        <div style={styles.meta}>
                          Tartışmayı başlatan:{" "}
                          <button
                            onClick={() => setSelectedUser(thread.started_by)}
                            style={styles.linkButton}
                          >
                            {thread.started_by || "Kullanıcı"}
                          </button>{" "}
                          • {new Date(thread.created_at).toLocaleString("tr-TR")}
                        </div>
                      </div>

                      <button
                        onClick={() => setOpenThread(isOpen ? null : thread.id)}
                        style={styles.plusButton}
                      >
                        {isOpen ? "−" : "+"}
                      </button>
                    </div>

                    <p style={styles.commentText}>
                      {thread.contributions?.content}
                    </p>

                    {selectedUser && (
                      <div style={styles.friendBox}>
                        {selectedUser} için{" "}
                        <button style={styles.inlineAction}>
                          Arkadaşlık İsteği Gönder
                        </button>
                        <button
                          onClick={() => setSelectedUser(null)}
                          style={styles.closeButton}
                        >
                          kapat
                        </button>
                      </div>
                    )}

                    {isOpen && (
                      <div style={styles.threadBox}>
                        {thread.discussion_replies?.map((reply) => (
                          <div key={reply.id} style={styles.reply}>
                            <div style={styles.commentTop}>
                              <div style={styles.meta}>
                                <button
                                  onClick={() => setSelectedUser(reply.user_id)}
                                  style={styles.linkButton}
                                >
                                  {reply.user_id || "Kullanıcı"}
                                </button>{" "}
                                •{" "}
                                {new Date(reply.created_at).toLocaleString(
                                  "tr-TR"
                                )}
                              </div>

                              <button
                                onClick={() =>
                                  reportContent({
                                    reply_id: reply.id,
                                  })
                                }
                                style={styles.xButton}
                              >
                                X
                              </button>
                            </div>

                            <p>{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {!isFullscreen && (
          <section style={styles.recentBox}>
            <div style={styles.eyebrow}>Son Katkılar</div>
            <h2>Son 7 Katkı</h2>

            {allComments.slice(0, 7).map((item) => (
              <article key={item.id} style={styles.recentItem}>
                <div style={styles.meta}>
                  {item.type || "commentary"} • {item.user_id || "Kullanıcı"} •{" "}
                  {new Date(item.created_at).toLocaleString("tr-TR")}
                </div>

                <div style={styles.commentText}>
                  <TranslatedContent contribution={item} />
                </div>
              </article>
            ))}
          </section>
        )}
      </section>

      {isFullscreen && (
        <FloatingScrollButtons onTop={scrollTop} onBottom={scrollBottom} />
      )}
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
      <button onClick={onTop} style={styles.floatButton}>
        ↑
      </button>
      <button onClick={onBottom} style={styles.floatButton}>
        ↓
      </button>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "black",
    color: "white",
    padding: "40px",
  },
  container: {
    maxWidth: "1300px",
    margin: "0 auto",
  },
  header: {
    border: "1px solid #333",
    borderRadius: "28px",
    padding: "28px",
    background: "#111",
    marginBottom: "32px",
  },
  eyebrow: {
    color: "#f5b400",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "13px",
  },
  title: {
    fontSize: "42px",
    marginTop: "12px",
  },
  muted: {
    color: "#aaa",
    lineHeight: "1.7",
  },
  bookGrid: {
    display: "grid",
    gridTemplateColumns: "0.85fr 0.9fr 1.15fr 0.9fr 0.85fr",
    gap: "18px",
  },
  paper: {
    minHeight: "520px",
    borderRadius: "20px",
    border: "1px solid #333",
    background: "#f4ead7",
    color: "#24180d",
    padding: "20px",
  },
  paperTitle: {
    borderBottom: "1px solid rgba(0,0,0,0.15)",
    paddingBottom: "12px",
    color: "#7a521d",
    fontWeight: "bold",
    fontSize: "13px",
    letterSpacing: "2px",
  },
  paperBody: {
    marginTop: "18px",
    fontFamily: "Georgia, serif",
    lineHeight: "1.8",
  },
  coverWrap: {
    height: "520px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cover: {
    height: "100%",
    width: "100%",
    maxWidth: "330px",
    borderRadius: "28px",
    border: "1px solid #8a6a12",
    background: "linear-gradient(135deg, #3b230f, #090909)",
    padding: "28px",
  },
  coverInner: {
    height: "100%",
    border: "1px solid rgba(245,180,0,0.25)",
    borderRadius: "20px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "center",
  },
  coverSmall: {
    color: "#d6b15d",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "11px",
  },
  coverLine: {
    height: "1px",
    width: "80px",
    background: "#d6b15d",
    margin: "0 auto",
  },
  coverTitle: {
    fontFamily: "Georgia, serif",
    fontSize: "48px",
    color: "#f8df9b",
  },
  coverAuthor: {
    fontSize: "20px",
    marginTop: "20px",
  },
  panel: {
    border: "1px solid #333",
    borderRadius: "28px",
    padding: "20px",
    background: "#111",
    marginTop: "32px",
  },
  panelFullscreen: {
    border: "1px solid #333",
    borderRadius: "28px",
    padding: "20px",
    background: "#111",
    minHeight: "100vh",
  },
  discussionPanel: {
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "28px",
    padding: "20px",
    background: "rgba(16,185,129,0.08)",
    marginTop: "32px",
  },
  discussionFullscreen: {
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "28px",
    padding: "20px",
    background: "rgba(16,185,129,0.08)",
    minHeight: "100vh",
  },
  panelHeaderDark: {
    borderRadius: "20px",
    padding: "24px",
    background: "#1f1f1f",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  panelHeaderGreen: {
    borderRadius: "20px",
    padding: "24px",
    background: "#04251b",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  expandButton: {
    border: "1px solid #2563eb",
    color: "#60a5fa",
    background: "transparent",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    height: "fit-content",
  },
  whiteAreaSmall: {
    marginTop: "16px",
    background: "white",
    color: "black",
    borderRadius: "20px",
    padding: "20px",
    maxHeight: "620px",
    overflow: "hidden",
  },
  whiteAreaExpanded: {
    marginTop: "16px",
    background: "white",
    color: "black",
    borderRadius: "20px",
    padding: "20px",
    minHeight: "850px",
  },
  commentCard: {
    border: "1px solid #ddd",
    borderRadius: "18px",
    padding: "18px",
    background: "#fffaf0",
    marginBottom: "14px",
  },
  commentTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "flex-start",
  },
  meta: {
    fontSize: "13px",
    color: "#666",
  },
  commentText: {
    marginTop: "10px",
    lineHeight: "1.7",
  },
  score: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "white",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "18px",
  },
  smallButton: {
    border: "1px solid #ddd",
    background: "white",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
  },
  greenButton: {
    border: "none",
    background: "#064e3b",
    color: "white",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
  },
  redButton: {
    border: "1px solid #fca5a5",
    background: "white",
    color: "#b91c1c",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
  },
  appealButton: {
    border: "none",
    background: "#7a4d12",
    color: "white",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  writeBox: {
    border: "1px solid #ddd",
    borderRadius: "18px",
    background: "white",
    padding: "18px",
    marginTop: "22px",
  },
  writeTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "13px",
  },
  bigTextarea: {
    width: "100%",
    height: "220px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "14px",
    marginTop: "12px",
    boxSizing: "border-box",
  },
  blackButton: {
    marginTop: "12px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    cursor: "pointer",
  },
  plusButton: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    border: "1px solid #047857",
    color: "#047857",
    background: "white",
    fontSize: "22px",
    cursor: "pointer",
  },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#1d4ed8",
    fontWeight: "bold",
    cursor: "pointer",
  },
  friendBox: {
    border: "1px solid #bfdbfe",
    background: "#eff6ff",
    color: "#1e3a8a",
    borderRadius: "12px",
    padding: "12px",
    marginTop: "12px",
  },
  reportBox: {
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#991b1b",
    borderRadius: "12px",
    padding: "12px",
    marginTop: "12px",
  },
  appealBox: {
    border: "1px solid #facc15",
    background: "#fefce8",
    color: "#713f12",
    borderRadius: "12px",
    padding: "12px",
    marginTop: "12px",
  },
  suspendedBox: {
    border: "1px solid #facc15",
    background: "#fefce8",
    color: "#713f12",
    borderRadius: "12px",
    padding: "14px",
    marginTop: "14px",
  },
  inlineAction: {
    border: "none",
    background: "transparent",
    textDecoration: "underline",
    fontWeight: "bold",
    cursor: "pointer",
  },
  closeButton: {
    marginLeft: "14px",
    border: "none",
    background: "transparent",
    color: "#555",
    cursor: "pointer",
  },
  threadBox: {
    border: "1px solid #ddd",
    borderRadius: "18px",
    background: "white",
    padding: "16px",
    marginTop: "18px",
  },
  reply: {
    border: "1px solid #ddd",
    borderRadius: "14px",
    background: "#f9fafb",
    padding: "14px",
    marginBottom: "10px",
  },
  xButton: {
    border: "1px solid #fca5a5",
    color: "#dc2626",
    background: "white",
    borderRadius: "999px",
    padding: "4px 8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  recentBox: {
    border: "1px solid #333",
    borderRadius: "28px",
    background: "#111",
    padding: "28px",
    marginTop: "48px",
  },
  recentItem: {
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "16px",
    background: "black",
    marginTop: "12px",
  },
  threadLabel: {
    color: "#a16207",
    fontWeight: "bold",
    fontSize: "14px",
  },
  noVote: {
    margin: 0,
    color: "#6f604c",
  },
  floatButtons: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  floatButton: {
    width: "48px",
    height: "48px",
    borderRadius: "999px",
    border: "1px solid #333",
    background: "black",
    color: "white",
    fontSize: "22px",
    cursor: "pointer",
  },
};
