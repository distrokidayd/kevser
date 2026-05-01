"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const res = await fetch("/api/get-my-books");
      const data = await res.json();

      if (data.success) {
        setBooks(data.books || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <h1>Profil</h1>

      <section style={styles.section}>
        <h2>Kitaplarım</h2>

        {loading && <p>Yükleniyor...</p>}

        {!loading && books.length === 0 && (
          <p>Henüz kitabın yok. Mağazadan ekleyebilirsin.</p>
        )}

        <div style={styles.grid}>
          {books.map((book) => (
            <div key={book.id} style={styles.card}>
              <h3>{book.book_slug}</h3>
              <p>Mühür: {book.seal_code}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "black",
    color: "white",
    padding: "40px",
  },
  section: {
    marginTop: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },
  card: {
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "12px",
    background: "#111",
  },
};
