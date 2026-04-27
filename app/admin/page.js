"use client";

import { useState } from "react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

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
          style={activeTab === "publisherApplications" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("publisherApplications")}
        >
          Yayıncı Başvuruları
        </button>

        <button
          style={activeTab === "reports" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("reports")}
        >
          Şikayet Havuzu
        </button>

        <button
          style={activeTab === "appeals" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("appeals")}
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
              <p>Yayıncı başvuruları ve yetkilendirmeler burada kontrol edilecek.</p>
            </div>

            <div style={styles.infoBox}>
              <h3>Moderasyon</h3>
              <p>Şikayetler, askıya alınan içerikler ve itirazlar burada izlenecek.</p>
            </div>

            <div style={styles.infoBox}>
              <h3>Kitap Sistemi</h3>
              <p>Kitaplar, mühür kodları ve kullanıcı kitap erişimleri yönetilecek.</p>
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
          <h2 style={styles.sectionTitle}>Şikayet Havuzu</h2>
          <p style={styles.emptyText}>
            Yayıncı havuzundan gelen şikayet kayıtları burada admin tarafından izlenecek.
          </p>
        </section>
      )}

      {activeTab === "appeals" && (
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>İtirazlar</h2>
          <p style={styles.emptyText}>
            Askıya alınan içeriklere gelen kullanıcı itirazları burada nihai karara bağlanacak.
          </p>
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

          <div style={styles.infoBox}>
            <h3>Mühür Kodu Üretimi</h3>
            <p>
              Admin burada kitaplara özel mühür kodu üretecek. Bu bölüm mevcut
              <strong> app/api/admin/create-seal/route.js </strong>
              API’sine bağlanacak.
            </p>
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
    fontFamily: "Arial, sans-serif",
  },
  header: {
    background: "#24180f",
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
    border: "1px solid #24180f",
    background: "#24180f",
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
  sectionTitle: {
    margin: "0 0 18px 0",
    fontSize: "26px",
    color: "#2d2418",
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
  emptyText: {
    background: "#fff",
    border: "1px dashed #c9b28c",
    borderRadius: "12px",
    padding: "18px",
    color: "#6f604c",
  },
};
