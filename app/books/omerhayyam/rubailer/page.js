export default function BookPage() {
  return (
    <main style={{ padding: "40px", color: "white", background: "black", minHeight: "100vh" }}>
      
      <h1>Ömer Hayyam — Rubailer</h1>

      <p style={{ color: "#aaa", marginTop: "10px" }}>
        Bu sayfa kitabı satın alan okuyucuların yorum, şerh ve çeviri düzeltmesi yapabileceği alandır.
      </p>

      {/* Mühür ve ISBN */}
      <div style={{
        marginTop: "30px",
        padding: "20px",
        border: "1px solid #333",
        borderRadius: "12px",
        background: "#111"
      }}>
        <strong>Mühür Numarası:</strong> KVSR-RUB-2026-000184 <br />
        <strong>ISBN:</strong> 978-0-0000-0000-0
      </div>

      {/* Açıklama */}
      <div style={{ marginTop: "30px", lineHeight: "1.6", color: "#ccc" }}>
        Bu kitabı satın aldıysanız ve çeviride hatalı bir ifade gördüyseniz,
        lütfen mühür numarasını kullanarak bu sayfadan bize bildirin.
      </div>

      {/* Yorum alanı */}
      <div style={{
        marginTop: "40px",
        padding: "20px",
        border: "1px solid #333",
        borderRadius: "12px"
      }}>
        <h3>Yorum / Şerh / Çeviri Düzeltmesi</h3>

        <textarea
          placeholder="Yorumunuzu veya çeviri önerinizi yazın..."
          style={{
            width: "100%",
            height: "120px",
            marginTop: "10px",
            background: "black",
            color: "white",
            border: "1px solid #444",
            padding: "10px"
          }}
        />

        <button style={{
          marginTop: "10px",
          padding: "10px 20px",
          background: "white",
          color: "black",
          border: "none",
          cursor: "pointer"
        }}>
          Gönder
        </button>
      </div>

    </main>
  );
}
