"use client";

import { useEffect, useState } from "react";

export default function PublisherPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/get-reports");
      const data = await res.json();

      if (data.success) {
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Şikayetler alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const voteReport = async (reportId, decision) => {
    try {
      await fetch("/api/vote-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId,
          decision,
        }),
      });

      await loadReports();
    } catch (error) {
      console.error("Oy gönderilemedi:", error);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.smallTitle}>Kevser Yayın Evi</p>
          <h1 style={styles.title}>Yayıncı Paneli</h1>
          <p style={styles.subtitle}>
            Yayıncı yönetimi, şikayet havuzu, gelir takibi ve profil ayarları
          </p>
        </div>
      </section>

      <section style={styles.tabs}>
        <button
          style={activeTab === "dashboard" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("dashboard")}
        >
          Stüdyo Dashboard
        </button>

        <button
          style={activeTab === "havuz" ? styles.activeTab : styles.tab}
          onClick={() => {
            setActiveTab("havuz");
            loadReports();
          }}
        >
          Havuz
        </button>

        <button
          style={activeTab === "gelirler" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("gelirler")}
        >
          Gelirler
        </button>

        <button
          style={activeTab === "profil" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("profil")}
        >
          Yayıncı Profil Ayarları
        </button>
      </section>

      {activeTab === "dashboard" && (
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Stüdyo Dashboard</h2>

          <div style={styles.grid}>
            <div style={styles.infoBox}>
              <h3>Traditional Eser Havuzu</h3>
              <p>Telifsiz eserler bu havuzda yönetilecek.</p>
            </div>

            <div style={styles.infoBox}>
              <h3>Telifli Eser Havuzu</h3>
              <p>Telifli eser başvuruları ve süreçleri burada takip edilecek.</p>
            </div>

            <div style={styles.infoBox}>
              <h3>Dil Seçimi</h3>
              <p>Yayıncılar çalışma dili ve çeviri alanlarını buradan seçecek.</p>
            </div>

            <div style={styles.infoBox}>
              <h3>Süre Sistemi</h3>
              <p>15 gün çalışma süresi + 5 gün uzatma mantığı burada işleyecek.</p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "havuz" && (
        <section style={styles.card}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Şikayet Havuzu</h2>
              <p style={styles.sectionDesc}>
                Kullanıcılardan gelen şikayetler burada yayıncı kararına sunulur.
              </p>
            </div>

            <button style={styles.refreshButton} onClick={loadReports}>
              Yenile
            </button>
          </div>

          {loading && <p style={styles.emptyText}>Şikayetler yükleniyor...</p>}

          {!loading && reports.length === 0 && (
            <p style={styles.emptyText}>Şu anda bekleyen şikayet yok.</p>
          )}

          <div style={styles.reportList}>
            {reports.map((report) => (
              <div key={report.id} style={styles.reportCard}>
                <div style={styles.reportTop}>
                  <span style={styles.badge}>Bekleyen Şikayet</span>
                  <span style={styles.status}>{report.status || "pending"}</span>
                </div>

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

                <div style={styles.actions}>
                  <button
                    style={styles.approveButton}
                    onClick={() => voteReport(report.id, "approve")}
                  >
                    Şikayeti Onayla
                  </button>

                  <button
                    style={styles.rejectButton}
                    onClick={() => voteReport(report.id, "reject")}
                  >
                    Şikayeti Reddet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "gelirler" && (
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Gelirler</h2>

          <div style={styles.infoBox}>
            <h3>Gelir Sistemi</h3>
            <p>
              Yorumlu baskılardan elde edilen gelirin 5&apos;te 1&apos;i katkı
              havuzuna aktarılacak. Yayıncılara puan sistemine göre dağıtılacak.
            </p>
          </div>
        </section>
      )}

      {activeTab === "profil" && (
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Yayıncı Profil Ayarları</h2>

          <div style={styles.grid}>
            <div style={styles.infoBox}>
              <h3>Kullanıcı Bilgileri</h3>
              <p>Ad, mail, telefon ve adres bilgileri burada düzenlenecek.</p>
            </div>

            <div style={styles.infoBox}>
              <h3>Müstear İsim</h3>
              <p>Yayıncı isterse müstear isimle görünebilecek.</p>
            </div>

            <div style={styles.infoBox}>
              <h3>Dini Seçim ve Mezhep</h3>
              <p>Bu alan en fazla 2 kez değiştirilebilecek.</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f1e8",
    padding: "32px",
    color: "#2d2418",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#3b2f20",
    color: "#fff",
    padding: "28px",
    borderRadius: "18px",
    marginBottom: "20px",
  },
  smallTitle: {
    margin: 0,
    color: "#d8b46a",
    fontSize: "14px",
  },
  title: {
    margin: "8px 0",
    fontSize: "34px",
  },
  subtitle: {
    margin: 0,
    color: "#eee2cf",
  },
  tabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  tab: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #d8c7aa",
    background: "#fff",
    cursor: "pointer",
    color: "#3b2f20",
    fontWeight: "600",
  },
  activeTab: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #3b2f20",
    background: "#3b2f20",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    background: "#fffaf2",
    border: "1px solid #e2d2b8",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    marginBottom: "18px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "26px",
    color: "#2d2418",
  },
  sectionDesc: {
    marginTop: "6px",
    color: "#6f604c",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  infoBox: {
    background: "#fff",
    border: "1px solid #e5d6bd",
    borderRadius: "14px",
    padding: "18px",
  },
  refreshButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#8b5e2b",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },
  emptyText: {
    background: "#fff",
    border: "1px dashed #c9b28c",
    borderRadius: "12px",
    padding: "18px",
    color: "#6f604c",
  },
  reportList: {
    display: "grid",
    gap: "14px",
  },
  reportCard: {
    background: "#fff",
    border: "1px solid #e0ccb0",
    borderRadius: "16px",
    padding: "18px",
  },
  reportTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  badge: {
    background: "#fff0d6",
    color: "#7a4d12",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },
  status: {
    background: "#eee",
    color: "#333",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
    flexWrap: "wrap",
  },
  approveButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#2f7d46",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },
  rejectButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#9b2f2f",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
  },
};
