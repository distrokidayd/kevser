"use client";

import { useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const { isSignedIn } = useUser();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      loadBooks();
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

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

  if (!isSignedIn) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1>Profil</h1>
          <p>Profil sayfasını görmek için giriş yapmalısınız.</p>

          <SignInButton mode="modal">
            <button style={styles.button}>Giriş Yap</button>
          </SignInButton>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1>Profil</h1>

      <section style={styles.section}>
        <h2>Kitaplarım</h2>

        {loading && <p>Yükleniyor...</p>}

        {!loading && books.length === 0 && (
          <p>Henüz kitabın yok. Mağazadan ekleyebilir veya mühür kodu girebilirsin.</p>
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
    padding: "20px",
    background: "#111",
  },
  button: {
    background: "#f5b400",
    color: "black",
    border: "none",
    borderRadius: "10px",
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
