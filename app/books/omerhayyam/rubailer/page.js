"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [comments, setComments] = useState([]);
  const [threads, setThreads] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const [replyText, setReplyText] = useState("");
  const [activeThread, setActiveThread] = useState(null);

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

  // 👍 / 👎
  async function vote(id, value) {
    await fetch("/api/vote-contribution", {
      method: "POST",
      body: JSON.stringify({
        contribution_id: id,
        value
      })
    });

    loadComments();
  }

  // 💬 tartışma başlat
  async function startDiscussion(id) {
    await fetch("/api/start-discussion", {
      method: "POST",
      body: JSON.stringify({
        contribution_id: id
      })
    });

    loadThreads();
  }

  // 🧵 reply
  async function sendReply(thread_id) {
    if (!replyText) return;

    await fetch("/api/reply-discussion", {
      method: "POST",
      body: JSON.stringify({
        thread_id,
        content: replyText
      })
    });

    setReplyText("");
    loadThreads();
  }

  // 🚨 şikayet
  async function report({ contribution_id, reply_id }) {
    await fetch("/api/report-content", {
      method: "POST",
      body: JSON.stringify({
        contribution_id,
        reply_id
      })
    });

    alert("Şikayet gönderildi");
  }

  return (
    <main style={{ padding: 30, background: "black", color: "white" }}>
      <h1>Rubailer</h1>

      {/* ================= YORUMLAR ================= */}
      <section>
        <h2>Şerh / Yorum</h2>

        {comments.map((c) => (
          <div key={c.id} style={card}>
            <p>{c.content}</p>

            <div style={{ display: "flex", gap: 10 }}>
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

      {/* ================= TARTIŞMALAR ================= */}
      <section style={{ marginTop: 50 }}>
        <h2>Tartışma Alanı</h2>

        {threads.map((t) => (
          <div key={t.id} style={card}>
            <p><b>Yorum:</b> {t.contributions?.content}</p>

            <button onClick={() => setActiveThread(t.id)}>
              +
            </button>

            {activeThread === t.id && (
              <div style={{ marginTop: 15 }}>
                {/* replies */}
                {t.discussion_replies?.map((r) => (
                  <div key={r.id} style={replyCard}>
                    <p>{r.content}</p>

                    <button
                      onClick={() => report({ reply_id: r.id })}
                    >
                      X
                    </button>
                  </div>
                ))}

                {/* reply input */}
                <textarea
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

const card = {
  border: "1px solid #444",
  padding: 15,
  marginTop: 15,
  borderRadius: 10
};

const replyCard = {
  border: "1px solid #666",
  padding: 10,
  marginTop: 10
};
