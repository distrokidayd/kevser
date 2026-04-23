export default function ArticlesPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "black",
      color: "white",
      padding: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        maxWidth: "700px",
        textAlign: "center",
        border: "1px solid #333",
        borderRadius: "20px",
        padding: "40px",
        background: "#111"
      }}>
        <h1 style={{ fontSize: "42px" }}>Makaleler</h1>
        <p style={{ color: "#aaa", marginTop: "16px", lineHeight: "1.7" }}>
          Kevser makale alanı yapım aşamasındadır. Bu bölümde ileride üyelerin kitaplar,
          çeviriler, şerhler ve klasik eserler üzerine yazdığı makaleler yayınlanacaktır.
        </p>
      </div>
    </main>
  );
}
