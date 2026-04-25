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

  useEffect(() => {
    async function checkBook() {
      if (!isSignedIn || !user) {
        setChecked(true);
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
      }

      setChecked(true);
    }

    checkBook();
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
    } else {
      setMessage("Hata: " + data.error);
    }

    setLoading(null);
  }

  const panels = [
    {
      id: "translation",
      title: "Çeviri Gönder / Çeviri Oyla",
      color: "#f5b400",
      text: "black"
    },
    {
      id: "commentary",
      title: "Yorum / Şerh Gönder ve Oyla",
      color: "#1f1f1f",
      text: "white"
    },
    {
      id: "discussion",
      title: "Tartışma Alanı",
      color: "#04251b",
      text: "white"
    }
  ];

  const visiblePanels = expandedPanel
    ? panels.filter((p) => p.id === expandedPanel)
    : panels;

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "40px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <h1>Rubailer — Ömer Hayyam</h1>

        {checked && !hasBook && (
          <div style={{
            border: "1px solid #333",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "20px",
            background: "#111"
          }}>
            Bu alana katkı yapmak için kitabı hesabına eklemelisin.
          </div>
        )}

        {checked && hasBook && (
          <section style={{
            display: "grid",
            gridTemplateColumns: expandedPanel ? "1fr" : "repeat(3,1fr)",
            gap: "20px",
            marginTop: "30px"
          }}>
            {visiblePanels.map((panel) => {
              const isExpanded = expandedPanel === panel.id;

              return (
                <div key={panel.id}>
                  <button
                    onClick={() => setExpandedPanel(isExpanded ? null : panel.id)}
                    style={{
                      width: "100%",
                      padding: "20px",
                      borderRadius: "12px",
                      border: "1px solid #333",
                      background: panel.color,
                      color: panel.text,
                      cursor: "pointer"
                    }}
                  >
                    {panel.title}
                  </button>

                  <div style={{
                    marginTop: "10px",
                    background: "white",
                    color: "black",
                    padding: "16px",
                    borderRadius: "12px"
                  }}>
                    <textarea
                      value={inputs[panel.id]}
                      onChange={(e) => handleChange(panel.id, e.target.value)}
                      placeholder="Yazınızı girin..."
                      style={{
                        width: "100%",
                        height: "120px",
                        padding: "10px"
                      }}
                    />

                    <button
                      onClick={() => sendContribution(panel.id)}
                      style={{
                        marginTop: "10px",
                        padding: "10px",
                        background: "black",
                        color: "white",
                        border: "none",
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

      </div>
    </main>
  );
}
