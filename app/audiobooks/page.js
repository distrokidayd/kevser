"use client";

import { useState } from "react";

export default function AudiobooksPage() {
  const [expanded, setExpanded] = useState(null);

  const platforms = [
    {
      name: "Spotify",
      desc: "Spotify audiobook player burada gömülü olacak.",
      color: "#1db954"
    },
    {
      name: "YouTube",
      desc: "YouTube video / player burada yer alacak.",
      color: "#ff0000"
    },
    {
      name: "Audible",
      desc: "Audible link / player alanı.",
      color: "#f8991c"
    },
    {
      name: "Apple Books",
      desc: "Apple Books bağlantısı.",
      color: "#999"
    },
    {
      name: "Google Books",
      desc: "Google Books bağlantısı.",
      color: "#4285f4"
    }
  ];

  const panels = [
    {
      id: "commentary",
      title: "Şerh / Yorum Gönder ve Oyla",
      body: "Seslendirme, vurgu ve içerik hakkında yorum yap."
    },
    {
      id: "discussion",
      title: "Şerh / Yorum Tartışması",
      body: "Diğer kullanıcılarla tartışmaya katıl."
    }
  ];

  const visible = expanded
    ? panels.filter(p => p.id === expanded)
    : panels;

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "40px" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "42px" }}>Audiobooks</h1>
          <p style={{ color: "#aaa", marginTop: "10px" }}>
            Sesli kitap platform bağlantıları ve oynatıcılar.
          </p>
        </div>

        {/* PLATFORM GRID */}
        <section style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px"
        }}>
          {platforms.map((p) => (
            <div key={p.name} style={{
              border: "1px solid #333",
              borderRadius: "16px",
              padding: "20px",
              background: "#111"
            }}>
              <div style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: p.color
              }}>
                {p.name}
              </div>
              <p style={{ marginTop: "10px", color: "#bbb" }}>{p.desc}</p>
            </div>
          ))}
        </section>

        {/* PANELS */}
        <section style={{
          display: "grid",
          gridTemplateColumns: expanded ? "1fr" : "1fr 1fr",
          gap: "24px",
          marginTop: "50px"
        }}>
          {visible.map((panel) => {
            const isExpanded = expanded === panel.id;

            return (
              <div key={panel.id}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : panel.id)}
                  style={{
                    width: "100%",
                    padding: "20px",
                    borderRadius: "16px",
                    background: "#222",
                    color: "white",
                    fontSize: "18px",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  {panel.title}
                </button>

                <div style={{
                  marginTop: "10px",
                  background: "white",
                  color: "black",
                  padding: "20px",
                  borderRadius: "16px"
                }}>
                  <div style={{ textAlign: "right" }}>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : panel.id)}
                      style={{ color: "blue", border: "none", background: "none", cursor: "pointer" }}
                    >
                      {isExpanded ? "Küçült" : "Büyüt"}
                    </button>
                  </div>

                  <p>{panel.body}</p>

                  <textarea
                    placeholder="Yaz..."
                    style={{
                      width: "100%",
                      height: "120px",
                      marginTop: "15px"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </section>

      </div>
    </main>
  );
}
