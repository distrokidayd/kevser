import Link from "next/link";

export default function HomePage({ params }) {
  const lang = params?.lang || "tr";

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Kevser Publishing House</p>

        <h1 style={styles.title}>
          Çok Dilli Dijital Yayıncılık Platformu
        </h1>

        <p style={styles.subtitle}>
          Okuyucular klasik eserlerin çevirilerine katkı yapabilir, yorum ve
          şerh ekleyebilir, tahlil alanlarında tartışmalara katılabilir.
        </p>

        <div style={styles.warning}>
          Site geliştirme aşamasındadır. Yeni özellikler ve kullanıcı sistemleri
          adım adım eklenecektir.
        </div>
      </section>

      <section style={styles.grid}>
        <Link href={`/${lang}/books`} style={styles.card}>
          <h2>Kitaplar / Tahlil</h2>
          <p>Klasik eserler, çeviri katkıları, şerh ve yorum alanları.</p>
        </Link>

        <Link href={`/${lang}/audiobooks`} style={styles.card}>
          <h2>Sesli Kitaplar</h2>
          <p>Sesli kitap platform bağlantıları ve dinleme alanları.</p>
        </Link>

        <Link href={`/${lang}/articles`} style={styles.card}>
          <h2>Makaleler</h2>
          <p>Yakında aktif olacak yazı ve makale alanı.</p>
        </Link>

        <Link href={`/${lang}/publishers`} style={styles.card}>
          <h2>Yayınevleri</h2>
          <p>Yayıncı başvuruları ve yayınevi tanıtım alanları.</p>
        </Link>
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
  hero: {
    maxWidth: "1100px",
    margin: "0 auto 32px auto",
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
    margin: "14px 0",
  },
  subtitle: {
    color: "#ccc",
    lineHeight: "1.7",
    maxWidth: "820px",
  },
  warning: {
    marginTop: "22px",
    border: "1px solid #7a4d12",
    background: "rgba(245,180,0,0.08)",
    color: "#f8d77b",
    borderRadius: "16px",
    padding: "16px",
  },
  grid: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },
  card: {
    border: "1px solid #333",
    borderRadius: "20px",
    padding: "24px",
    background: "#111",
    color: "white",
    textDecoration: "none",
  },
};
