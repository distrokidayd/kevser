"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function BookPage() {
  const { user, isSignedIn } = useUser();

  const [expandedPanel, setExpandedPanel] = useState(null);
  const [hasBook, setHasBook] = useState(false);
  const [checked, setChecked] = useState(false);

  const [inputs, setInputs] = useState({
    translation: "",
    commentary: "",
    discussion: ""
  });

  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    async function checkBook() {
      if (!isSignedIn || !user) {
        setChecked(true);
        setHasBook(false);
        return;
      }

      const res = await fetch("/api/check-user-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          book_slug: "omerhayyam-rubailer"
        })
      });

      const data = await res.json();

      if (data.ok && data.hasBook) {
        setHasBook(true);
      } else {
        setHasBook(false);
      }

      setChecked(true);
    }

    async function loadContributions() {
      const res = await fetch("/api/get-contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          book_slug: "omerhayyam-rubailer"
        })
      });

      const data = await res.json();

      if (data.ok) {
        setList(data.data);
      }
    }

    checkBook();
    loadContributions();
  }, [isSignedIn, user]);

  function handleChange(type, value) {
    setInputs({
      ...inputs,
      [type]: value
    });
  }

  async function sendContribution(type) {
    if (!inputs[type]) return;

    setLoading(type);
    setMessage(null);

    const res = await fetch("/api/create-contribution", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: inputs[type],
        type: type,
        book_slug: "omerhayyam-rubailer"
      })
    });

    const data = await res.json();

    if (data.ok) {
      setMessage("Başarıyla gönderildi");
      setInputs({
        ...inputs,
        [type]: ""
      });

      const refresh = await fetch("/api/get-contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          book_slug: "omerhayyam-rubailer"
        })
      });

      const refreshedData = await refresh.json();

      if (refreshedData.ok) {
        setList(refreshedData.data);
      }
    } else {
      setMessage("Hata: " + data.error);
    }

    setLoading(null);
  }

  const leftPages = [
    { title: "Sayfa 12", text: "Kitaptan rastgele bir sayfa örneği burada görünecek." },
    { title: "Sayfa 13", text: "Okuyucu her yenilemede farklı sayfa örnekleri görebilecek." }
  ];

  const rightPages = [
    { title: "Sayfa 14", text: "Bu alan ileride kitaptan seçilen sayfalarla doldurulacak." },
    { title: "Sayfa 15", text: "Sayfalar kapakla aynı hizada gösterilecek." }
  ];

  const panels = [
    {
      id: "translation",
      title: "Çeviri Gönder / Çeviri Oyla",
      body: "Çeviri katkı alanı. Kitabı kendi hesabına eklemiş üyeler burada çeviri önerisi gönderebilir veya mevcut önerilere oy verebilir.",
      color: "#f5b400",
      text: "black"
    },
    {
      id: "commentary",
      title: "Yorum / Şerh Gönder ve Oyla",
      body: "Yorum ve şerh alanı. Kitabı kendi hesabına eklemiş üyeler kitap hakkındaki düşüncelerini, tahlillerini ve şerhlerini paylaşabilir.",
      color: "#1f1f1f",
      text: "white"
    },
    {
      id: "discussion",
      title: "Tartışma Alanı",
      body: "Tartışma alanı. Üyeler yorumlar, şerhler ve çeviri önerileri üzerine tartışmaya katılabilir.",
      color: "#04251b",
      text: "white"
    }
  ];

  const visiblePanels = expandedPanel
    ? panels.filter((p) => p.id === expandedPanel)
    : panels;

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "40px" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px"
        }}>
          <div style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            color: "#d6b15d",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontSize: "14px"
          }}>
            <span>Kevser Books</span>
            <button style={navButton}>←</button>
            <button style={navButton}>→</button>
          </div>
        </div>

        <section style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr 1fr",
          gap: "20px",
          alignItems: "stretch"
        }}>
          <div style={pageGrid}>
            {leftPages.map((page) => (
              <div key={page.title} style={bookPage}>
                <h3>{page.title}</h3>
                <p>{page.text}</p>
              </div>
            ))}
          </div>

          <div style={{
            height: "600px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={cover}>
              <div style={{ textAlign: "center" }}>
                <div style={{ letterSpacing: "5px", color: "#d6b15d", fontSize: "12px" }}>
                  KEVSER PUBLISHING HOUSE
                </div>
                <h1 style={{ fontSize: "52px", marginTop: "120px", color: "#f8df9b" }}>
                  Rubailer
                </h1>
                <p style={{ fontSize: "22px" }}>Ömer Hayyam</p>
              </div>
            </div>
          </div>

          <div style={pageGrid}>
            {rightPages.map((page) => (
              <div key={page.title} style={bookPage}>
                <h3>{page.title}</h3>
                <p>{page.text}</p>
              </div>
            ))}
          </div>
        </section>

        {checked && !hasBook && (
          <div style={{
            border: "1px solid #333",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "40px",
            background: "#111"
          }}>
            <p style={{ color: "#f5b400", margin: 0 }}>
              Bu alana katkı yapmak için kitabı hesabınıza eklemeniz gerekiyor.
            </p>
            <p style={{ color: "#aaa", marginTop: "10px" }}>
              Kitabı satın aldıysanız, profil sayfanızdaki “Kitap Ekle” alanından kitap içindeki mühür kodunu girerek bu kitabı hesabınıza ekleyebilirsiniz.
            </p>
            <a href="/profile" style={{
              display: "inline-block",
              marginTop: "12px",
              background: "#f5b400",
              color: "black",
              padding: "10px 16px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold"
            }}>
              Profile Git
            </a>
          </div>
        )}

        {checked && hasBook && (
          <section style={{
            display: "grid",
            gridTemplateColumns: expandedPanel ? "1fr" : "repeat(3, 1fr)",
            gap: "24px",
            marginTop: "50px"
          }}>
            {visiblePanels.map((panel) => {
              const isExpanded = expandedPanel === panel.id;

              return (
                <div key={panel.id}>
                  <button
                    onClick={() => setExpandedPanel(isExpanded ? null : panel.id)}
                    style={{
                      width: "100%",
                      padding: "24px",
                      borderRadius: "18px",
                      border: "1px solid #333",
                      background: panel.color,
                      color: panel.text,
                      textAlign: "left",
                      fontSize: "20px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    {panel.title}
                  </button>

                  <div style={{
                    marginTop: "14px",
                    background: "white",
                    color: "black",
                    borderRadius: "18px",
                    padding: "24px",
                    minHeight: isExpanded ? "420px" : "260px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => setExpandedPanel(isExpanded ? null : panel.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#005bd3",
                          fontWeight: "bold",
                          cursor: "pointer"
                        }}
                      >
                        {isExpanded ? "Sayfayı Küçült" : "Sayfayı Büyüt"}
                      </button>
                    </div>

                    <p style={{ lineHeight: "1.7" }}>{panel.body}</p>

                    <textarea
                      value={inputs[panel.id]}
                      onChange={(e) => handleChange(panel.id, e.target.value)}
                      placeholder="Katkınızı buraya yazın..."
                      style={{
                        width: "100%",
                        height: isExpanded ? "220px" : "120px",
                        marginTop: "20px",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "10px"
                      }}
                    />

                    <button
                      onClick={() => sendContribution(panel.id)}
                      disabled={loading === panel.id}
                      style={{
                        marginTop: "14px",
                        padding: "12px 24px",
                        background: "black",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer"
                      }}
                    >
                      {loading === panel.id ? "Gönderiliyor..." : "Gönder"}
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {message && (
          <div style={{ marginTop: "20px", color: "#f5b400" }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: "50px" }}>
          <h2>Katkılar</h2>

          {list.length === 0 && (
            <p style={{ color: "#aaa" }}>
              Henüz katkı yok.
            </p>
          )}

          {list.map((item) => (
            <div key={item.id} style={{
              border: "1px solid #333",
              padding: "16px",
              borderRadius: "12px",
              marginTop: "10px",
              background: "#111"
            }}>
              <div style={{ fontSize: "12px", color: "#aaa" }}>
                {item.type} • {new Date(item.created_at).toLocaleString()}
              </div>

              <p style={{ marginTop: "8px" }}>
                {item.content}
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}

const navButton = {
  background: "#111",
  color: "white",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "8px 14px",
  cursor: "pointer"
};

const pageGrid = {
  height: "600px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px"
};

const bookPage = {
  background: "#f4ead7",
  color: "black",
  borderRadius: "16px",
  padding: "22px",
  fontFamily: "Georgia, serif",
  lineHeight: "1.7"
};

const cover = {
  width: "340px",
  height: "600px",
  border: "1px solid #8a6a12",
  borderRadius: "28px",
  background: "linear-gradient(135deg, #3b230f, #090909)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "30px"
};
