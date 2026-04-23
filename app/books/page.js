const books = [
  { title: "Rubailer", author: "Ömer Hayyam", url: "/books/omerhayyam/rubailer" },
  { title: "Mesnevi Seçmeleri", author: "Mevlânâ", url: "/books/mevlana/mesnevi-secmeleri" },
  { title: "Gülistan", author: "Sadi Şirazi", url: "/books/sadisirazi/gulistan" },
  { title: "Bostan", author: "Sadi Şirazi", url: "/books/sadisirazi/bostan" },
  { title: "Divan", author: "Yunus Emre", url: "/books/yunusemre/divan" },
  { title: "Leyla ile Mecnun", author: "Fuzuli", url: "/books/fuzuli/leyla-ile-mecnun" },
  { title: "Mantıku’t-Tayr", author: "Attâr", url: "/books/attar/mantikut-tayr" },
  { title: "Hayy bin Yakzan", author: "İbn Tufeyl", url: "/books/ibntufeyl/hayy-bin-yakzan" }
];

export default function BooksPage() {
  return (
    <main style={{ padding: "40px", color: "white", background: "black", minHeight: "100vh" }}>
      <h1>Books</h1>
      <p style={{ color: "#aaa" }}>
        Kevser Publishing House kitap kataloğu.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "24px",
        marginTop: "32px"
      }}>
        {books.map((book) => (
          <a
            key={book.url}
            href={book.url}
            style={{
              color: "white",
              textDecoration: "none",
              border: "1px solid #333",
              borderRadius: "16px",
              padding: "16px",
              background: "#111"
            }}
          >
            <div style={{
              height: "240px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #3a2a12, #111)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "16px",
              marginBottom: "16px"
            }}>
              <strong>{book.title}</strong>
            </div>
            <div style={{ fontWeight: "bold" }}>{book.title}</div>
            <div style={{ color: "#aaa", marginTop: "6px" }}>{book.author}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
