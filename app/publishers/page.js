export default function PublishersPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "black",
      color: "white",
      padding: "40px"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        border: "1px solid #333",
        borderRadius: "20px",
        padding: "40px",
        background: "#111"
      }}>
        <h1 style={{ fontSize: "42px" }}>Publishers</h1>

        <p style={{ color: "#aaa", marginTop: "16px", lineHeight: "1.7" }}>
          Kevser üzerinden kitap veya sesli kitap yayınlamak isteyen yayıncılar için
          bu alan hazırlanıyor.
        </p>

        <div style={{
          marginTop: "30px",
          border: "1px solid #333",
          borderRadius: "16px",
          padding: "20px",
          background: "black"
        }}>
          <h3>Yayıncı olmak isteyen üyeler</h3>
          <p style={{ color: "#aaa", lineHeight: "1.7" }}>
            Üyeler profil sayfasından yayıncı başvurusu yapabilecek. Başvurusu
            onaylanan üyelerde Studio alanı aktif olacak.
          </p>
        </div>
      </div>
    </main>
  );
}
