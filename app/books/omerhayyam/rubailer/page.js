"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [comments, setComments] = useState([]);
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    loadComments();
    loadThreads();
  }, []);

  async function loadComments() {
    const res = await fetch("/api/get-contributions", {
      method: "POST",
      body: JSON.stringify({ book_slug: "omerhayyam-rubailer" })
    });
    const data = await res.json();
    if (data.ok) setComments(data.data);
  }

  async function loadThreads() {
    const res = await fetch("/api/get-discussions", {
      method: "POST",
      body: JSON.stringify({ book_slug: "omerhayyam-rubailer" })
    });
    const data = await res.json();
    if (data.ok) setThreads(data.data);
  }

  async function vote(id, value) {
    await fetch("/api/vote-contribution", {
      method: "POST",
      body: JSON.stringify({ contribution_id: id, value })
    });
    loadComments();
  }

  async function startDiscussion(id) {
    await fetch("/api/start-discussion", {
      method: "POST",
      body: JSON.stringify({ contribution_id: id })
    });
    loadThreads();
  }

  async function sendReply(thread_id) {
    if (!replyText) return;

    await fetch("/api/reply-discussion", {
      method: "POST",
      body: JSON.stringify({ thread_id, content: replyText })
    });

    setReplyText("");
    loadThreads();
  }

  async function report(data) {
    await fetch("/api/report-content", {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  return (
    <main style={page}>
      <h1 style={title}>Ömer Hayyam — Rubailer</h1>

      {/* ================= YORUM ALANI ================= */}
      <section style={panel}>
        <h2>Şerh / Tahlil / Yorum Alanı</h2>

        {comments.map((c) => (
          <div key={c.id} style={card}>
            <p style={text}>{c.content}</p>

            <div style={actions}>
              <button onClick={() => vote(c.id, 1)}>👍</button>
              <button onClick={() => vote(c.id, -1)}>👎</button>

              <button onClick={() => startDiscussion(c.id)}>
                Tartışma Başlat
              </button>

              <button onClick={() => report({ contribution_id: c.id })}>
                Şikayet
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ================= TARTIŞMA ================= */}
      <section style={panelGreen}>
        <h2>Tartışma Alanı</h2>

        {threads.map((t) => (
          <div key={t.id} style={card}>
            <p style={text}>
              <b>Yorum:</b> {t.contributions?.content}
            </p>

            <button
              style={plus}
              onClick={() =>
                setActiveThread(activeThread === t.id ? null : t.id)
              }
            >
              {activeThread === t.id ? "-" : "+"}
            </button>

            {activeThread === t.id && (
              <div style={threadBox}>
                {t.discussion_replies?.map((r) => (
                  <div key={r.id} style={replyCard}>
                    <p>{r.content}</p>

                    <button
                      style={xBtn}
                      onClick={() => report({ reply_id: r.id })}
                    >
                      X
                    </button>
                  </div>
                ))}

                <textarea
                  style={textarea}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />

                <button onClick={() => sendReply(t.id)}>
                  Gönder
                </button>
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}

/* ================= STYLE ================= */

const page = {
  background: "black",
  color: "white",
  minHeight: "100vh",
  padding: "40px"
};

const title = {
  fontSize: "32px",
  marginBottom: "30px"
};

const panel = {
  border: "1px solid #333",
  borderRadius: "20px",
  padding: "20px",
  marginBottom: "40px",
  background: "#111"
};

const panelGreen = {
  border: "1px solid #065f46",
  borderRadius: "20px",
  padding: "20px",
  background: "#042f2e"
};

const card = {
  border: "1px solid #444",
  borderRadius: "12px",
  padding: "15px",
  marginTop: "15px"
};

const text = {
  lineHeight: "1.6"
};

const actions = {
  display: "flex",
  gap: "10px",
  marginTop: "10px"
};

const plus = {
  marginTop: "10px"
};

const threadBox = {
  marginTop: "15px",
  border: "1px solid #555",
  padding: "10px"
};

const replyCard = {
  border: "1px solid #666",
  padding: "10px",
  marginBottom: "10px"
};

const textarea = {
  width: "100%",
  height: "80px",
  marginTop: "10px"
};

const xBtn = {
  marginTop: "5px",
  color: "red"
};
