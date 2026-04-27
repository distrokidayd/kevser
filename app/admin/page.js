"use client";

import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const [appeals, setAppeals] = useState([]);
  const [appealsLoading, setAppealsLoading] = useState(false);

  const [bookId, setBookId] = useState("");
  const [sealCode, setSealCode] = useState("");
  const [sealLoading, setSealLoading] = useState(false);
  const [sealMessage, setSealMessage] = useState("");

  const loadReports = async () => {
    try {
      setReportsLoading(true);
      const res = await fetch("/api/get-reports");
      const data = await res.json();
      if (data.success) setReports(data.reports || []);
    } catch (error) {
      console.error("Admin şikayetleri alınamadı:", error);
    } finally {
      setReportsLoading(false);
    }
  };

  const loadAppeals = async () => {
    try {
      setAppealsLoading(true);
      const res = await fetch("/api/admin/get-appeals");
      const data = await res.json();
      if (data.success) setAppeals(data.appeals || []);
    } catch (error) {
      console.error("Admin itirazları alınamadı:", error);
    } finally {
      setAppealsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    loadAppeals();
  }, []);

  const resolveReport = async (reportId, action) => {
    try {
      const res = await fetch("/api/admin/resolve-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reportId, action })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Admin kararı kaydedilemedi.");
        return;
      }

      alert("Admin kararı kaydedildi.");
      await loadReports();
      await loadAppeals();
    } catch (error) {
      console.error("Admin karar hatası:", error);
      alert("Admin kararı verilirken hata oluştu.");
    }
  };

  const resolveAppeal = async (appealId, action) => {
    try {
      const res = await fetch("/api/admin/resolve-appeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ appealId, action })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "İtiraz kararı kaydedilemedi.");
        return;
      }

      alert("İtiraz kararı kaydedildi.");
      await loadAppeals();
      await loadReports();
    } catch (error) {
      console.error("İtiraz karar hatası:", error);
      alert("İtiraz kararı verilirken hata oluştu.");
    }
  };

  const createSealCode = async () => {
    try {
      setSealLoading(true);
      setSealMessage("");
      setSealCode("");

      if (!bookId.trim()) {
        setSealMessage("Lütfen kitap ID gir.");
        return;
      }

      const res = await fetch("/api/admin/create-seal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          bookId: bookId.trim()
        })
      });

      const data = await res.json();

      if (!data.success) {
        setSealMessage(data.error || "Mühür kodu oluşturulamadı.");
        return;
      }

      setSealCode(data.code || "");
      setSealMessage("Mühür kodu başarıyla oluşturuldu.");
    } catch (error) {
      console.error("Mühür kodu hatası:", error);
      setSealMessage("Mühür kodu oluşturulurken hata oluştu.");
    } finally {
      setSealLoading(false);
    }
  };

  const countVotes = (votes, decision) => {
    if (!Array.isArray(votes)) return 0;
    return votes.filter((vote) => vote.decision === decision).length;
  };

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <p style={styles.smallTitle}>Kevser Yayın Evi</p>
        <h1 style={styles.title}>Admin Paneli</h1>
        <p style={styles.subtitle}>
          Kullanıcı, yayıncı, şikayet, itiraz, kitap ve mühür kodu yönetimi
        </p>
      </section>

      <section style={styles.tabs}>
        <button
          style={activeTab === "dashboard" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("dashboard")}
        >
          Admin Dashboard
        </button>

        <button
          style={
            activeTab === "publisherApplications"
              ? styles.activeTab
              : styles.tab
          }
          onClick={() => setActiveTab("publisherApplications")}
        >
          Yayıncı Başvuruları
        </button>

        <button
          style={activeTab === "reports" ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab("reports");
            loadReports();
          }}
        >
          Şikayet Havuzu
        </button>

        <button
          style={activeTab === "appeals" ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab("appeals");
            loadAppeals();
          }}
        >
          İtirazlar
        </button>

        <button
          style={activeTab === "books" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("books")}
        >
          Kitap Yönetimi
        </button>

        <button
          style={activeTab === "seal" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("seal")}
        >
          Mühür Kodu
        </button>
      </section>

      {activeTab === "dashboard" && (
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Admin Dashboard</h2>

          <div style={styles.grid}>
            <div style={styles.infoBox}>
              <h3>Kullanıcı Yönetimi</h3>
              <p>Kullanıcı profilleri ve roller burada yönetilecek.</p>
            </div>

            <div style={styles.infoBox}>
              <h3>Yayıncı Yönetimi</h3>
              <p>
                Yayıncı başvuruları ve yetkilendirmeler burada kontrol edilecek.
              </p>
            </div>

            <div style={styles.infoBox}>
              <h3>Moderasyon</h3>
              <p>
                Şikayetler, askıya alınan içerikler ve itirazlar burada izlenecek.
              </p>
            </div>

            <div style={styles.infoBox}>
              <h3>Kitap Sistemi</h3>
              <p>
                Kitaplar, mühür kodları ve kullanıcı kitap erişimleri yönetilecek.
              </p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "publisherApplications" && (
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Yayıncı Başvuruları</h2>
          <p style={styles.emptyText}>
            Yayıncı başvuru sistemi sonraki adımda Supabase’e bağlanacak.
          </p>
        </section>
      )}

      {activeTab === "reports" && (
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Admin Şikayet Havuzu</h2>
              <p style={styles.sectionDesc}>
                Yayıncı havuzundan gelen şikayetler, oy geçmişi ve askıya alınan
                içerikler burada izlenir.
              </p>
            </div>

            <button style={styles.refreshButton} onClick={loadReports}>
              Yenile
            </button>
          </div>

          {reportsLoading && (
            <p style={styles.emptyText}>Şikayetler yükleniyor...</p>
          )}

          {!reportsLoading && reports.length === 0 && (
            <p style={styles.emptyText}>Şikayet kaydı bulunamadı.</p>
          )}

          <div style={styles.reportList}>
            {reports.map((report) => {
              const approveCount = countVotes(report.publisher_votes, "approve");
              const rejectCount = countVotes(report.publisher_votes, "reject");

              return (
                <div key={report.id} style={styles.reportCard}>
                  <div style={styles.reportTop}>
                    <span style={styles.badge}>Şikayet Kaydı</span>
                    <span style={styles.status}>{report.status || "pending"}</span>
                  </div>

                  <p>
                    <strong>Report ID:</strong> {report.id}
                  </p>

                  <p>
                    <strong>İçerik ID:</strong>{" "}
                    {report.content_id || "Belirtilmemiş"}
                  </p>

                  <p>
                    <strong>Şikayet Sebebi:</strong>{" "}
                    {report.reason || "Sebep girilmemiş"}
                  </p>

                  <p>
                    <strong>Oluşturulma:</strong>{" "}
                    {report.created_at
                      ? new Date(report.created_at).toLocaleString("tr-TR")
                      : "Tarih yok"}
                  </p>

                  <div style={styles.voteSummary}>
                    <span style={styles.approveCount}>Onay: {approveCount}</span>
                    <span style={styles.rejectCount}>Red: {rejectCount}</span>
                  </div>

                  <div style={styles.voteBox}>
                    <h4 style={styles.voteTitle}>Yayıncı Oy Geçmişi</h4>

                    {!Array.isArray(report.publisher_votes) ||
                    report.publisher_votes.length === 0 ? (
                      <p style={styles.noVote}>Henüz oy yok.</p>
                    ) : (
                      report.publisher_votes.map((vote, index) => (
                        <div key={index} style={styles.voteRow}>
                          <span>
                            <strong>Yayıncı:</strong>{" "}
                            {vote.userId || "Bilinmiyor"}
                          </span>

                          <span>
                            <strong>Karar:</strong>{" "}
                            {vote.decision === "approve" ? "Onay" : "Red"}
                          </span>

                          <span>
                            <strong>Tarih:</strong>{" "}
                            {vote.votedAt
                              ? new Date(vote.votedAt).toLocaleString("tr-TR")
                              : "Tarih yok"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={styles.adminActions}>
                    <button
                      style={styles.keepSuspendedButton}
                      onClick={() =>
                        resolveReport(report.id, "keep_suspended")
                      }
                    >
                      Askıda Bırak
                    </button>

                    <button
                      style={styles.restoreButton}
                      onClick={() => resolveReport(report.id, "restore")}
                    >
                      İçeriği Geri Aç
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "appeals" && (
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>İtirazlar</h2>
              <p style={styles.sectionDesc}>
                Askıya alınan içeriklere gelen kullanıcı itirazları burada
                nihai karara bağlanır.
              </p>
            </div>

            <button style={styles.refreshButton} onClick={loadAppeals}>
              Yenile
            </button>
          </div>

          {appealsLoading && (
            <p style={styles.emptyText}>İtirazlar yükleniyor...</p>
          )}

          {!appealsLoading && appeals.length === 0 && (
            <p style={styles.emptyText}>Henüz itiraz yok.</p>
          )}

          <div style={styles.reportList}>
            {appeals.map((appeal) => (
              <div key={appeal.id} style={styles.reportCard}>
                <div style={styles.reportTop}>
                  <span style={styles.badge}>Kullanıcı İtirazı</span>
                  <span style={styles.status}>{appeal.status || "pending"}</span>
                </div>

                <p>
                  <strong>İtiraz ID:</strong> {appeal.id}
                </p>

                <p>
                  <strong>Report ID:</strong>{" "}
                  {appeal.report_id || "Belirtilmemiş"}
                </p>

                <p>
                  <strong>Contribution ID:</strong>{" "}
                  {appeal.contribution_id || "Belirtilmemiş"}
                </p>

                <p>
                  <strong>Kullanıcı:</strong> {appeal.user_id || "Bilinmiyor"}
                </p>

                <p>
                  <strong>İtiraz Sebebi:</strong>{" "}
                  {appeal.reason || "Sebep girilmemiş"}
                </p>

                <p>
                  <strong>Oluşturulma:</strong>{" "}
                  {appeal.created_at
                    ? new Date(appeal.created_at).toLocaleString("tr-TR")
                    : "Tarih yok"}
                </p>

                <div style={styles.adminActions}>
                  <button
                    style={styles.keepSuspendedButton}
                    onClick={() => resolveAppeal(appeal.id, "reject")}
                  >
                    İtirazı Reddet
                  </button>

                  <button
                    style={styles.restoreButton}
                    onClick={() => resolveAppeal(appeal.id, "accept")}
                  >
                    İtirazı Kabul Et
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "books" && (
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Kitap Yönetimi</h2>
          <p style={styles.emptyText}>
            Kitap ekleme, düzenleme ve erişim yönetimi burada geliştirilecek.
          </p>
        </section>
      )}

      {activeTab === "seal" && (
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Mühür Kodu</h2>

          <div style={styles.formBox}>
            <label style={styles.label}>Kitap ID</label>

            <input
              style={styles.input}
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="Örn: omerhayyam-rubailer"
            />

            <button
              style={styles.primaryButton}
              onClick={createSealCode}
              disabled={sealLoading}
            >
              {sealLoading ? "Oluşturuluyor..." : "Mühür Kodu Oluştur"}
            </button>

            {sealMessage && <p style={styles.message}>{sealMessage}</p>}

            {sealCode && (
              <div style={styles.sealResult}>
                <p style={styles.sealLabel}>Oluşturulan Mühür Kodu</p>
                <strong style={styles.sealCode}>{sealCode}</strong>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4efe5",
    padding: "32px",
    color: "#2d2418",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    background: "#24180f",
    color: "#fff",
    padding: "28px",
    borderRadius: "18px",
    marginBottom: "20px"
  },
  smallTitle: {
    margin: 0,
    color: "#d8b46a",
    fontSize: "14px"
  },
  title: {
    margin: "8px 0",
    fontSize: "34px"
  },
  subtitle: {
    margin: 0,
    color: "#eee2cf"
  },
  tabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px"
  },
  tab: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #d8c7aa",
    background: "#fff",
    cursor: "pointer",
    color: "#3b2f20",
    fontWeight: "600"
  },
  activeTab: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #24180f",
    background: "#24180f",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "700"
  },
  card: {
    background: "#fffaf2",
    border: "1px solid #e2d2b8",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    marginBottom: "18px"
  },
  sectionTitle: {
    margin: "0 0 18px 0",
    fontSize: "26px",
    color: "#2d2418"
  },
  sectionDesc: {
    marginTop: 0,
    color: "#6f604c"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px"
  },
  infoBox: {
    background: "#fff",
    border: "1px solid #e5d6bd",
    borderRadius: "14px",
    padding: "18px"
  },
  emptyText: {
    background: "#fff",
    border: "1px dashed #c9b28c",
    borderRadius: "12px",
    padding: "18px",
    color: "#6f604c"
  },
  refreshButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#8b5e2b",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700"
  },
  reportList: {
    display: "grid",
    gap: "14px"
  },
  reportCard: {
    background: "#fff",
    border: "1px solid #e0ccb0",
    borderRadius: "16px",
    padding: "18px"
  },
  reportTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px"
  },
  badge: {
    background: "#fff0d6",
    color: "#7a4d12",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700"
  },
  status: {
    background: "#eee",
    color: "#333",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px"
  },
  voteSummary: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
    marginBottom: "10px",
    flexWrap: "wrap"
  },
  approveCount: {
    background: "#e8f5ec",
    color: "#236b3a",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "14px"
  },
  rejectCount: {
    background: "#fdecec",
    color: "#8a2525",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "14px"
  },
  voteBox: {
    marginTop: "14px",
    background: "#f8f2e8",
    border: "1px solid #ead8bd",
    borderRadius: "12px",
    padding: "14px"
  },
  voteTitle: {
    margin: "0 0 10px 0"
  },
  voteRow: {
    display: "grid",
    gridTemplateColumns: "1fr 120px 180px",
    gap: "10px",
    padding: "10px",
    background: "#fff",
    borderRadius: "10px",
    marginBottom: "8px",
    fontSize: "14px"
  },
  noVote: {
    margin: 0,
    color: "#6f604c"
  },
  adminActions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap"
  },
  keepSuspendedButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#7a4d12",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700"
  },
  restoreButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#2f7d46",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700"
  },
  formBox: {
    maxWidth: "460px",
    background: "#fff",
    border: "1px solid #e5d6bd",
    borderRadius: "14px",
    padding: "20px"
  },
  label: {
    display: "block",
    fontWeight: "700",
    marginBottom: "8px"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d8c7aa",
    marginBottom: "12px",
    fontSize: "15px",
    boxSizing: "border-box"
  },
  primaryButton: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#24180f",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px"
  },
  message: {
    marginTop: "12px",
    color: "#6f604c"
  },
  sealResult: {
    marginTop: "16px",
    padding: "16px",
    borderRadius: "12px",
    background: "#f6f1e8",
    border: "1px dashed #bfa36f"
  },
  sealLabel: {
    margin: "0 0 8px 0",
    color: "#6f604c",
    fontSize: "14px"
  },
  sealCode: {
    fontSize: "24px",
    letterSpacing: "2px",
    color: "#24180f"
  }
};
