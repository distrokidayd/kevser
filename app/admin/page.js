"use client";

import { useState } from "react";

export default function AdminPage() {
  const [form, setForm] = useState({
    publisher_code: "0759",
    author_code: "0007",
    genre_code: "S01",
    content_area: "01",
    language_code: "TR",
    contributor_code: "0042",
    product_number: "000001"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function updateField(name, value) {
    setForm({
      ...form,
      [name]: value
    });
  }

  async function createSeal() {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/admin/create-seal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    setResult(data);
    setLoading(false);
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "black",
      color: "white",
      padding: "40px"
    }}>
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        <h1>Admin Panel</h1>
        <p style={{ color: "#aaa" }}>
          Mühür kodu üretme alanı.
        </p>

        <div style={{
          marginTop: "30px",
          border: "1px solid #333",
          borderRadius: "20px",
          padding: "30px",
          background: "#111"
        }}>
          <h2>Mühür Üret</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "20px"
          }}>
            <Input label="Yayın Evi Kodu" name="publisher_code" value={form.publisher_code} onChange={updateField} />
            <Input label="Yazar Kodu" name="author_code" value={form.author_code} onChange={updateField} />
            <Input label="Tür Kodu" name="genre_code" value={form.genre_code} onChange={updateField} />
            <Input label="Alan Kodu" name="content_area" value={form.content_area} onChange={updateField} />
            <Input label="Dil Kodu" name="language_code" value={form.language_code} onChange={updateField} />
            <Input label="Çevirmen / Editör Kodu" name="contributor_code" value={form.contributor_code} onChange={updateField} />
            <Input label="Ürün / Nüsha Numarası" name="product_number" value={form.product_number} onChange={updateField} />
          </div>

          <button
            onClick={createSeal}
            disabled={loading}
            style={{
              marginTop: "24px",
              background: "#f5b400",
              color: "black",
              border: "none",
              borderRadius: "12px",
              padding: "14px 22px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? "Üretiliyor..." : "Mühür Üret"}
          </button>

          {result && (
            <div style={{
              marginTop: "24px",
              border: "1px solid #333",
              borderRadius: "16px",
              padding: "20px",
              background: "black"
            }}>
              {result.ok ? (
                <>
                  <p style={{ color: "#4ade80" }}>Mühür başarıyla üretildi:</p>
                  <h2 style={{ marginTop: "10px", color: "#f5b400" }}>
                    {result.code}
                  </h2>
                </>
              ) : (
                <>
                  <p style={{ color: "#f87171" }}>Hata:</p>
                  <pre style={{ whiteSpace: "pre-wrap" }}>
                    {result.error}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{
        color: "#aaa",
        marginBottom: "8px",
        fontSize: "14px"
      }}>
        {label}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #333",
          background: "black",
          color: "white"
        }}
      />
    </label>
  );
}
