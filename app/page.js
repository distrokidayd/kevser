export default function HomePage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "black",
      color: "white",
      padding: "40px"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>

        <h1 style={{ fontSize: "56px", fontWeight: "bold" }}>
          Kevser Publishing House
        </h1>

        <p style={{
          marginTop: "20px",
          fontSize: "18px",
          color: "#aaa",
          lineHeight: "1.7"
        }}>
          Çok dilli dijital yayıncılık platformu. Okuyucular, klasik eserlerin
          çevirilerine katkı yapabilir, yorum ve şerh ekleyebilir ve tartışmalara katılabilir.
        </p>

        {/* GELİŞTİRME NOTU */}
        <div style={{
          marginTop: "30px",
          border: "1px solid #333",
          borderRadius: "16px",
          padding: "20px",
          background: "#111"
        }}>
          <strong>⚠️ Site geliştirme aşamasındadır.</strong>
          <p style={{ marginTop: "10px", color: "#aaa" }}>
            Yeni özellikler ve kullanıcı sistemleri yakında eklenecektir.
          </p>
        </div>

        {/* SEKMELER */}
        <div style={{
          marginTop: "50px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px"
        }}>

          <a href="/books" style={card}>
            <h3>Books</h3>
            <p>Klasik eserler ve çeviri katkı sistemi</p>
          </a>

          <a href="/audiobooks" style={card}>
            <h3>Audiobooks</h3>
            <p>Sesli kitap platform bağlantıları</p>
          </a>

          <a href="/articles" style={card}>
            <h3>Makaleler</h3>
            <p>Yakında aktif olacak</p>
          </a>

        </div>

      </div>
    </main>
  );
}

const card = {
  border: "1px solid #333",
  borderRadius: "16px",
  padding: "30px",
  background: "#111",
  color: "white",
  textDecoration: "none",
  cursor: "pointer"
};
