"use client";

import { useState } from "react";

export default function PublishersPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    penName: "",
    religion: "",
    denomination: "",
    experience: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitApplication = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/create-publisher-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.error || "Başvuru gönderilemedi.");
        return;
      }

      setMessage("Yayıncı başvurunuz başarıyla gönderildi.");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        penName: "",
        religion: "",
        denomination: "",
        experience: "",
        reason: "",
      });
    } catch (error) {
      console.error("Başvuru hatası:", error);
      setMessage("Başvuru gönderilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Kevser Yayın Evi</p>
        <h1 style={styles.title}>Yayıncı Başvurusu</h1>
        <p style={styles.subtitle}>
          Kevser platformunda şerh, yorum, tartışma ve moderasyon süreçlerinde
          görev almak için yayıncı başvurusu yapabilirsiniz.
        </p>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Başvuru Formu</h2>

        <div style={styles.grid}>
          <div>
            <label style={styles.label}>Ad Soyad *</label>
            <input
              style={styles.input}
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="Adınızı ve soyadınızı yazın"
            />
          </div>

          <div>
            <label style={styles.label}>E-posta *</label>
            <input
              style={styles.input}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="ornek@mail.com"
            />
          </div>

          <div>
            <label style={styles.label}>Telefon</label>
            <input
              style={styles.input}
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Telefon numarası"
            />
          </div>

          <div>
            <label style={styles.label}>Müstear İsim</label>
            <input
              style={styles.input}
              value={form.penName}
              onChange={(e) => updateField("penName", e.target.value)}
              placeholder="Varsa müstear isminiz"
            />
          </div>

          <div>
            <label style={styles.label}>Dini Seçim</label>
            <input
              style={styles.input}
              value={form.religion}
              onChange={(e) => updateField("religion", e.target.value)}
              placeholder="Örn: İslam"
            />
          </div>

          <div>
            <label style={styles.label}>Mezhep</label>
            <input
              style={styles.input}
              value={form.denomination}
              onChange={(e) => updateField("denomination", e.target.value)}
              placeholder="Örn: Hanefi"
            />
          </div>
        </div>

        <div style={styles.fullField}>
          <label style={styles.label}>Adres</label>
          <textarea
            style={styles.textarea}
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Adres bilginizi yazın"
          />
        </div>

        <div style={styles.fullField}>
          <label style={styles.label}>Tecrübe</label>
          <textarea
            style={styles.textarea}
            value={form.experience}
            onChange={(e) => updateField("experience", e.target.value)}
            placeholder="Yayıncılık, editörlük, ilmi çalışma veya moderasyon tecrübenizi yazın"
          />
        </div>

        <div style={styles.fullField}>
          <label style={styles.label}>Başvuru Sebebi *</label>
          <textarea
            style={styles.textareaLarge}
            value={form.reason}
            onChange={(e) => updateField("reason", e.target.value)}
            placeholder="Neden Kevser Yayın Evi'nde yayıncı olmak istiyorsunuz?"
          />
        </div>

        <button
          style={styles.primaryButton}
          onClick={submitApplication}
          disabled={loading}
        >
          {loading ? "Başvuru Gönderiliyor..." : "Yayıncı Başvurusu Gönder"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </section>
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
  hero: {
    background: "#3b2f20",
    color: "#fff",
    padding: "32px",
    borderRadius: "20px",
    marginBottom: "24px",
  },
  eyebrow: {
    margin: 0,
    color: "#d8b46a",
    fontSize: "14px",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  title: {
    margin: "10px 0",
    fontSize: "38px",
  },
  subtitle: {
    margin: 0,
    color: "#eee2cf",
    maxWidth: "760px",
    lineHeight: "1.7",
  },
  card: {
    background: "#fffaf2",
    border: "1px solid #e2d2b8",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    fontSize: "26px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  fullField: {
    marginTop: "16px",
  },
  label: {
    display: "block",
    fontWeight: "700",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d8c7aa",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#fff",
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d8c7aa",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#fff",
  },
  textareaLarge: {
    width: "100%",
    minHeight: "140px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d8c7aa",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#fff",
  },
  primaryButton: {
    marginTop: "18px",
    width: "100%",
    padding: "14px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#3b2f20",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
  },
  message: {
    marginTop: "14px",
    background: "#fff",
    border: "1px dashed #c9b28c",
    borderRadius: "12px",
    padding: "14px",
    color: "#6f604c",
  },
};
