"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/publisher-applications");
      const data = await res.json();

      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Başvurular alınamadı:", error);
    } finally {
      setLoading(false);
    }
  }

  async function reviewApplication(applicationId, decision) {
    try {
      setReviewingId(applicationId);

      const res = await fetch("/api/admin/review-publisher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          applicationId,
          decision,
          adminNote: notes[applicationId] || ""
        })
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "İşlem başarısız.");
        return;
      }

      alert("İşlem tamamlandı.");
      await loadApplications();
    } catch (error) {
      console.error("Admin karar hatası:", error);
      alert("Bir hata oluştu.");
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <div style={styles.kicker}>Kevser Admin</div>
          <h1 style={styles.title}>Yayıncı Başvuruları</h1>
          <p style={styles.muted}>
            Yayıncı / Stüdyo başvuruları burada incelenir. Onaylanan kullanıcı geleneksel kitap havuzuna erişebilir.
          </p>
        </div>

        <button onClick={loadApplications} style={styles.refreshButton}>
          Yenile
        </button>
      </section>

      <section style={styles.content}>
        {loading && <p style={styles.muted}>Başvurular yükleniyor...</p>}

        {!loading && applications.length === 0 && (
          <div style={styles.emptyBox}>Henüz yayıncı başvurusu yok.</div>
        )}

        <div style={styles.list}>
          {applications.map((app) => (
            <article key={app.id} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={styles.badge}>Yayıncı Başvurusu</span>
                <span style={statusStyle(app.status)}>
                  {app.status || "pending"}
                </span>
              </div>

              <div style={styles.grid}>
                <Info label="Ad Soyad" value={app.full_name} />
                <Info label="E-posta" value={app.email} />
                <Info label="Telefon" value={app.phone || "Yok"} />
                <Info label="Website" value={app.website || "Yok"} />
                <Info label="Kullanıcı ID" value={app.user_id} />
                <Info label="Tarih" value={new Date(app.created_at).toLocaleString("tr-TR")} />
              </div>

              <div style={styles.block}>
                <strong>Sosyal Linkler</strong>
                <p>{app.social_links || "Belirtilmemiş"}</p>
              </div>

              <div style={styles.block}>
                <strong>Deneyim</strong>
                <p>{app.experience || "Belirtilmemiş"}</p>
              </div>

              <div style={styles.block}>
                <strong>Başvuru Sebebi</strong>
                <p>{app.reason || "Belirtilmemiş"}</p>
              </div>

              <div style={styles.block}>
                <strong>Sesli Kabul</strong>
                <p>{app.voice_acceptance_note || "Belirtilmemiş"}</p>
              </div>

              <textarea
                style={styles.textarea}
                placeholder="Admin notu yaz. Reddedersen bu not kullanıcıya mesaj olarak gider."
                value={notes[app.id] || ""}
                onChange={(e) =>
                  setNotes((prev) => ({
                    ...prev,
                    [app.id]: e.target.value
                  }))
                }
              />

              <div style={styles.actions}>
                <button
                  onClick={() => reviewApplication(app.id, "approve")}
                  disabled={reviewingId === app.id || app.status === "approved"}
                  style={styles.approveButton}
                >
                  {reviewingId === app.id ? "İşleniyor..." : "Onayla"}
                </button>

                <button
                  onClick={() => reviewApplication(app.id, "reject")}
                  disabled={reviewingId === app.id || app.status === "rejected"}
                  style={styles.rejectButton}
                >
                  {reviewingId === app.id ? "İşleniyor..." : "Reddet"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.info}>
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

function statusStyle(status) {
  if (status === "approved") return styles.statusApproved;
  if (status === "rejected") return styles.statusRejected;
  return styles.statusPending;
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "44px 32px 80px",
    background:
      "radial-gradient(circle at 18% 12%, rgba(255,255,255,.9), transparent 18%), linear-gradient(180deg, #f8fdff 0%, #eef9ff 36%, #eefaf7 68%, #d7f1f5 100%)",
    color: "#163242"
  },
  header: {
    maxWidth: "1300px",
    margin: "0 auto 26px",
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "center",
    background: "rgba(255,255,255,.76)",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "34px",
    padding: "30px",
    boxShadow: "0 24px 80px rgba(19,68,89,.12)"
  },
  kicker: {
    color: "#0fb7a6",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: 900
  },
  title: {
    fontFamily: "Georgia, serif",
    color: "#0f3b4d",
    fontSize: "44px",
    margin: "10px 0"
  },
  muted: {
    color: "#5d7685",
    lineHeight: 1.7
  },
  refreshButton: {
    border: "none",
    background: "#0fb7a6",
    color: "white",
    borderRadius: "999px",
    padding: "12px 18px",
    fontWeight: 900,
    cursor: "pointer"
  },
  content: {
    maxWidth: "1300px",
    margin: "0 auto",
    background: "rgba(255,255,255,.76)",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "34px",
    padding: "26px",
    boxShadow: "0 24px 80px rgba(19,68,89,.12)"
  },
  emptyBox: {
    background: "white",
    border: "1px dashed rgba(15,59,77,.22)",
    borderRadius: "20px",
    padding: "24px",
    color: "#5d7685"
  },
  list: {
    display: "grid",
    gap: "18px"
  },
  card: {
    background: "white",
    border: "1px solid rgba(15,59,77,.14)",
    borderRadius: "26px",
    padding: "22px"
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "center",
    marginBottom: "18px"
  },
  badge: {
    background: "rgba(15,183,166,.12)",
    color: "#0f766e",
    borderRadius: "999px",
    padding: "8px 12px",
    fontWeight: 900,
    fontSize: "13px"
  },
  statusPending: {
    background: "#fff7ed",
    color: "#9a3412",
    borderRadius: "999px",
    padding: "8px 12px",
    fontWeight: 900,
    fontSize: "13px"
  },
  statusApproved: {
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "999px",
    padding: "8px 12px",
    fontWeight: 900,
    fontSize: "13px"
  },
  statusRejected: {
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "999px",
    padding: "8px 12px",
    fontWeight: 900,
    fontSize: "13px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: "12px",
    marginBottom: "16px"
  },
  info: {
    border: "1px solid rgba(15,59,77,.1)",
    borderRadius: "16px",
    padding: "12px",
    background: "#f8fdff"
  },
  block: {
    borderTop: "1px solid rgba(15,59,77,.1)",
    paddingTop: "14px",
    marginTop: "14px",
    color: "#163242",
    lineHeight: 1.7
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    marginTop: "16px",
    padding: "14px",
    borderRadius: "16px",
    border: "1px solid rgba(15,59,77,.18)",
    boxSizing: "border-box",
    fontSize: "15px"
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap"
  },
  approveButton: {
    border: "none",
    background: "#0fb7a6",
    color: "white",
    borderRadius: "999px",
    padding: "12px 16px",
    fontWeight: 900,
    cursor: "pointer"
  },
  rejectButton: {
    border: "none",
    background: "#b91c1c",
    color: "white",
    borderRadius: "999px",
    padding: "12px 16px",
    fontWeight: 900,
    cursor: "pointer"
  }
};
