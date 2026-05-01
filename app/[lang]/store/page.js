import Link from "next/link";

export default function StorePage({ params }) {
  const lang = params?.lang || "tr";

  const books = [
    {
      id: 1,
      title: "Ömer Hayyam — Rubailer",
      author: "Ömer Hayyam",
      price: "120₺",
      href: `/${lang}/books/omerhayyam/rubailer`,
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <h1>Mağaza</h1>
        <p>Tüm kitaplar burada satılır ve tahlil alanına bağlanır.</p>
      </section>

      <section style={styles.layout}>
        <div style={styles.grid}>
          {books.map((book) => (
            <div key={book.id} style={styles.card}>
              <div style={styles.cover}>
                <strong>{book.title}</strong>
                <span>{book.author}</span>
              </div>

              <div style={styles.info}>
                <h3>{book.title}</h3>
                <p>{book.price}</p>

                <div style={styles.buttons}>
                  <button style={styles.buy}>Sepete Ekle</button>

                  <Link href={book.href} style={styles.analyze}>
                    Tahlil’e Git
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside style={styles.banner}>
          <h2>Kitabı Oku, Tahlile Katıl</h2>
          <p>
            Satın aldığın kitaplar hesabına tanımlanır. Ardından şerh, yorum ve
            tartışma alanında katkı verebilirsin.
          </p>

          <button style={styles.buy}>Kitap Satın Al</button>
        </aside>
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
    marginBottom: "30px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #333",
    borderRadius: "20px",
    padding: "16px",
    background: "#111",
  },
  cover: {
    height: "160px",
    background: "#222",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "12px",
  },
  info: {},
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  buy: {
    background: "#f5b400",
    color: "#000",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  analyze: {
    border: "1px solid #f5b400",
    padding: "10px",
    borderRadius: "10px",
    color: "#f5b400",
    textDecoration: "none",
  },
  banner: {
    border: "1px solid #333",
    borderRadius: "20px",
    padding: "20px",
    background: "#111",
  },
};
