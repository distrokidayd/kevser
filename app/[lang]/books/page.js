import Link from "next/link";

export default function BooksPage({ params }) {
  const lang = params?.lang || "tr";

  const books = [
    {
      id: 1,
      title: "Ömer Hayyam — Rubailer",
      desc: "Şerh, yorum, tahlil ve tartışma alanı.",
      href: `/${lang}/books/omerhayyam/rubailer`,
      type: "Kitap",
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <p style={styles.eyebrow}>Kevser Books</p>
        <h1 style={styles.title}>Kitaplar / Tahlil</h1>
        <p style={styles.subtitle}>
          Kitaplar, çeviri katkıları, şerh, yorum, tahlil ve tartışma alanları.
          Kitap içindeki mühür kodu ile kitabı hesabına ekleyen üyeler ilgili
          kitapta yorum ve şerh yazabilir.
        </p>
      </section>

      <section style={styles.grid}>
        <Link href={`/${lang}/books/translation-pool`} style={styles.translationCard}>
          <p style={styles.cardLabel}>Katkı Alanı</p>
          <h2>Çeviri Katkı Kartı</h2>
          <p>
            Okuyucular klasik eserlerin çeviri, şerh ve tahlil süreçlerine katkı
            verebilir.
          </p>
        </Link>

        {books.map((book) => (
          <Link key={book.id} href={book.href} style={styles.bookCard}>
            <div style={styles.cover}>
              <span>Kevser</span>
              <strong>Rubailer</strong>
              <small>Ömer Hayyam</small>
            </div>

            <div>
              <p style={styles.cardLabel}>{book.type}</p>
              <h2>{book.title}</h2>
              <p>{book.desc}</p>
            </div>
          </Link>
        ))}
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
  header: {
    maxWidth: "1100px",
    margin: "0 auto 28px auto",
    border: "1px solid #333",
    borderRadius: "28px",
    padding: "32px",
    background: "#111",
  },
  eyebrow: {
    margin: 0,
    color: "#f5b400",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "13px",
    fontWeight: "bold",
  },
  title: {
    fontSize: "42px",
    margin: "12px 0",
  },
  subtitle: {
    color: "#ccc",
    lineHeight: "1.7",
    maxWidth: "850px",
  },
  grid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  translationCard: {
    border: "1px solid rgba(245,180,0,0.35)",
    borderRadius: "24px",
    padding: "24px",
    background: "rgba(245,180,0,0.08)",
    color: "white",
    textDecoration: "none",
    minHeight: "260px",
  },
  bookCard: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "20px",
    background: "#111",
    color: "white",
    textDecoration: "none",
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: "18px",
    minHeight: "260px",
  },
  cover: {
    height: "180px",
    borderRadius: "18px",
    border: "1px solid #8a6a12",
    background: "linear-gradient(135deg, #3b230f, #050505)",
    color: "#f5b400",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "center",
    padding: "16px",
    fontWeight: "bold",
  },
  cardLabel: {
    color: "#f5b400",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
};
