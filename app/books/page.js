"use client";

import { useState } from "react";

export default function BooksPage() {
  const [expandedBooksCard, setExpandedBooksCard] = useState(null);

  const books = [
    { title: "Rubailer", author: "Ömer Hayyam", href: "/books/omerhayyam/rubailer" },
    { title: "Mesnevi Seçmeleri", author: "Mevlânâ", href: "#" },
    { title: "Gülistan", author: "Sadi Şirazi", href: "#" },
    { title: "Bostan", author: "Sadi Şirazi", href: "#" },
    { title: "Divan", author: "Yunus Emre", href: "#" },
    { title: "Leyla ile Mecnun", author: "Fuzuli", href: "#" }
  ];

  return (
    <main style={page}>
      <div style={marqueeWrap}>
        <div style={marqueeText}>
          Kitap artık seninle okunsun • Şerh / Yorum / Tartışma alanına katılmak için kitap görseline tıkla • Okuduğun kitabın yorumlu baskısına katkı ver • Klasik eserleri birlikte yeniden düşünelim • Çeviri katkını yayıncı havuzuna gönder •
        </div>
      </div>

      <section style={container}>
        <div style={header}>
          <div style={eyebrow}>Kevser Books</div>
          <h1 style={title}>Books</h1>
        </div>

        <section style={catalogBox}>
          <div style={expandedBooksCard ? gridExpanded : grid}>

            {(!expandedBooksCard || expandedBooksCard === "translation") && (
              <div style={expandedBooksCard ? translationExpandedCard : card}>
                {!expandedBooksCard && (
                  <div style={translationCover}>
                    <div style={smallGold}>Katkı</div>
                    <div style={coverTitle}>Çeviri</div>

                    <button
                      onClick={() => setExpandedBooksCard("translation")}
                      style={openButton}
                    >
                      Aç
                    </button>
                  </div>
                )}

                {expandedBooksCard === "translation" && (
                  <div>
                    <div style={topLine}>
                      <div>
                        <div style={eyebrow}>Books Katkı Kartı</div>
                        <h2 style={sectionTitle}>Çeviri Katkısı Gönder</h2>
                      </div>

                      <button
                        onClick={() => setExpandedBooksCard(null)}
                        style={blueButton}
                      >
                        Sayfayı Küçült
                      </button>
                    </div>

                    <div style={formBox}>
                      <label style={label}>
                        Çevirisine katkıda bulunmak istediğin kitabı seç
                      </label>

                      <select style={input}>
                        {books.map((book) => (
                          <option key={book.title}>
                            {book.author} — {book.title}
                          </option>
                        ))}
                      </select>

                      <div style={formGrid}>
                        <div>
                          <label style={label}>Sayfa No</label>
                          <input style={input} placeholder="Örn: 42" />
                        </div>

                        <div>
                          <label style={label}>Dil</label>
                          <input style={input} placeholder="TR / EN / FR" />
                        </div>
                      </div>

                      <label style={label}>Orijinal Metin</label>
                      <textarea style={textareaSmall} placeholder="Orijinal cümle veya paragraf..." />

                      <label style={label}>Kendi Çeviri Önerin</label>
                      <textarea style={textareaMedium} placeholder="Daha iyi olduğunu düşündüğün çeviri..." />

                      <label style={label}>Not</label>
                      <textarea style={textareaSmall} placeholder="Bu çeviriyi neden öneriyorsun?" />

                      <button style={submitButton}>
                        Yayıncı Havuzuna Gönder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!expandedBooksCard && books.map((book) => (
              <a key={book.title} href={book.href} style={cardLink}>
                <div style={bookCover}>
                  {book.title}
                </div>

                <div style={bookTitle}>{book.title}</div>
                <div style={bookAuthor}>{book.author}</div>
              </a>
            ))}

          </div>
        </section>
      </section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </main>
  );
}

const page = {
  minHeight: "100vh",
  background: "black",
  color: "white"
};

const marqueeWrap = {
  overflow: "hidden",
  borderBottom: "1px solid rgba(245, 180, 0, 0.25)",
  background: "rgba(245, 180, 0, 0.08)"
};

const marqueeText = {
  whiteSpace: "nowrap",
  color: "#f5b400",
  fontWeight: "bold",
  fontSize: "14px",
  padding: "12px 0",
  display: "inline-block",
  animation: "marquee 24s linear infinite"
};

const container = {
  maxWidth: "1300px",
  margin: "0 auto",
  padding: "40px 24px"
};

const header = {
  border: "1px solid #333",
  borderRadius: "28px",
  padding: "28px",
  background: "#111",
  marginBottom: "32px"
};

const eyebrow = {
  color: "#f5b400",
  letterSpacing: "4px",
  textTransform: "uppercase",
  fontSize: "13px"
};

const title = {
  fontSize: "42px",
  marginTop: "12px",
  marginBottom: 0
};

const catalogBox = {
  border: "1px solid #333",
  borderRadius: "28px",
  padding: "28px",
  background: "#0d0d0d"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
  gap: "24px"
};

const gridExpanded = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "24px"
};

const card = {
  border: "1px solid #333",
  borderRadius: "22px",
  padding: "12px",
  background: "#111"
};

const cardLink = {
  ...card,
  color: "white",
  textDecoration: "none",
  display: "block"
};

const bookCover = {
  aspectRatio: "3 / 4",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #3b230f, #050505)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "16px",
  fontWeight: "bold"
};

const translationCover = {
  aspectRatio: "3 / 4",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #9a5b00, #050505)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "16px"
};

const smallGold = {
  color: "#f5b400",
  letterSpacing: "4px",
  textTransform: "uppercase",
  fontSize: "12px"
};

const coverTitle = {
  marginTop: "12px",
  fontSize: "24px",
  fontWeight: "bold"
};

const openButton = {
  marginTop: "22px",
  border: "1px solid #60a5fa",
  color: "#60a5fa",
  background: "transparent",
  borderRadius: "10px",
  padding: "8px 16px",
  cursor: "pointer",
  fontWeight: "bold"
};

const bookTitle = {
  marginTop: "14px",
  fontWeight: "bold"
};

const bookAuthor = {
  marginTop: "4px",
  color: "#aaa",
  fontSize: "14px"
};

const translationExpandedCard = {
  border: "1px solid rgba(245, 180, 0, 0.35)",
  borderRadius: "24px",
  padding: "24px",
  background: "#111"
};

const topLine = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  alignItems: "center"
};

const sectionTitle = {
  fontSize: "34px",
  marginTop: "10px"
};

const blueButton = {
  border: "1px solid #2563eb",
  color: "#60a5fa",
  background: "transparent",
  borderRadius: "12px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "bold"
};

const formBox = {
  marginTop: "24px",
  borderRadius: "22px",
  background: "white",
  color: "black",
  padding: "28px"
};

const label = {
  display: "block",
  fontSize: "14px",
  fontWeight: "bold",
  marginTop: "16px",
  marginBottom: "8px"
};

const input = {
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "14px",
  fontSize: "15px"
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginTop: "8px"
};

const textareaSmall = {
  width: "100%",
  height: "100px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "14px",
  fontSize: "15px"
};

const textareaMedium = {
  width: "100%",
  height: "140px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "14px",
  fontSize: "15px"
};

const submitButton = {
  marginTop: "20px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "14px 20px",
  cursor: "pointer",
  fontWeight: "bold"
};
