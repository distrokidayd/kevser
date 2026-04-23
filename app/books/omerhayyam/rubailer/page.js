"use client";

import { useState } from "react";

export default function BookPage() {
  const [expandedPanel, setExpandedPanel] = useState(null);

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
      title: "Yorum / Şerh / Çeviri Tartışması",
      body: "Tartışma alanı. Üyeler yorumlar, şerhler ve çeviri önerileri üzerine tartışmaya katılabilir.",
      color: "#04251b",
      text: "white"
    }
  ];

  const visiblePanels = expandedPanel
    ? panels.filter((panel) => panel.id === expandedPanel)
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

                  <button style={{
                    marginTop: "14px",
                    padding: "12px 24px",
                    background: "black",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer"
                  }}>
                    Gönder
                  </button>
                </div>
              </div>
            );
          })}
        </section>

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
