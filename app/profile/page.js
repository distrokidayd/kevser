"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("books");
  const [expandedMessageBox, setExpandedMessageBox] = useState(null);

  const isPublisher = false;

  const tabs = [
    { id: "profile", label: "Profil" },
    { id: "books", label: "Kitaplarım" },
    { id: "addBook", label: "Kitap Ekle" },
    { id: "contributions", label: "Katkılarım" },
    { id: "friends", label: "Arkadaşlar" },
    { id: "messages", label: "Mesajlar" },
    { id: "notifications", label: "Bildirimler" },
    { id: "publisher", label: "Yayıncı Ol" },
    { id: "studio", label: "Studio", disabled: !isPublisher },
  ];

  const myBooks = [
    {
      title: "Rubailer",
      author: "Ömer Hayyam",
      status: "Katkı açık",
      nextBulkMessage: "2 gün 14 saat sonra",
      readers: 184,
    },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "40px" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "40px" }}>
          <h1>Kullanıcı Profili</h1>
          <p style={{ color: "#aaa" }}>Üye paneli</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "20px" }}>

          {/* SIDEBAR */}
          <div style={{ border: "1px solid #333", padding: "10px" }}>
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                style={{
                  padding: "10px",
                  marginBottom: "6px",
                  cursor: tab.disabled ? "not-allowed" : "pointer",
                  background: activeTab === tab.id ? "#f5b400" : "#111",
                  color: tab.disabled ? "#555" : "white",
                }}
              >
                {tab.label}
              </div>
            ))}
          </div>

          {/* CONTENT */}
          <div style={{ border: "1px solid #333", padding: "20px" }}>

            {activeTab === "books" && (
              <div>
                <h2>Kitaplarım</h2>

                {myBooks.map((book) => (
                  <div key={book.title} style={{ marginTop: "20px", border: "1px solid #333", padding: "15px" }}>
                    <div>{book.author} - {book.title}</div>
                    <div style={{ color: "#aaa" }}>Okuyan: {book.readers}</div>

                    <div style={{ marginTop: "10px" }}>
                      <button style={{ marginRight: "10px" }}>Kitaba Git</button>
                      <button>Aynı Kitabı Alanlara Mesaj</button>
                    </div>

                    <div style={{ marginTop: "10px", color: "#f5b400" }}>
                      Toplu mesaj hakkı: {book.nextBulkMessage}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <h2>Mesajlar</h2>

                {[
                  { id: "sent", title: "Gönderilen" },
                  { id: "received", title: "Gelen" },
                  { id: "book", title: "Aynı Kitap" },
                  { id: "community", title: "Topluluk" }
                ]
                  .filter(b => !expandedMessageBox || b.id === expandedMessageBox)
                  .map((box) => {

                    const isExpanded = expandedMessageBox === box.id;

                    return (
                      <div key={box.id} style={{
                        border: "1px solid #333",
                        marginTop: "15px",
                        padding: "15px"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>{box.title}</div>
                          <button onClick={() =>
                            setExpandedMessageBox(isExpanded ? null : box.id)
                          }>
                            {isExpanded ? "Küçült" : "Büyüt"}
                          </button>
                        </div>

                        <div style={{ marginTop: "10px" }}>
                          {box.id === "community" && (
                            <div>
                              <div>@user1 <button>Arkadaş Ekle</button></div>
                              <div>Mesaj içeriği...</div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
