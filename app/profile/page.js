"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();

  const [sealCode, setSealCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function addBook() {
    if (!sealCode) return;

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/add-book-by-seal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        seal_code: sealCode
      })
    });

    const data = await res.json();

    setResult(data);
    setLoading(false);
  }

  if (!isSignedIn) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "40px"
      }}>
        <h1>Giriş yapmanız gerekiyor</h1>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "black",
      color: "white",
      padding: "40px"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        <h1>Profil</h1>

        <p style={{ color: "#aaa" }}>
          Hoşgeldin {user?.firstName || user?.username}
        </p>

        {/* 🔥 MÜHÜR İLE KİTAP EKLE */}
        <div style={{
          marginTop: "40px",
          border: "1px solid #333",
          borderRadius: "20px",
          padding: "30px",
          background: "#111"
        }}>
          <h2>Kitap Ekle (Mühür Kodu)</h2>

          <input
            value={sealCode}
            onChange={(e) => setSealCode(e.target.value)}
            placeholder="Örn: 0759-0007-S01-01-TR-0042-000001-SZ"
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid #333",
              background: "black",
              color: "white"
            }}
          />

          <button
            onClick={addBook}
            disabled={loading}
            style={{
              marginTop: "16px",
              background: "#f5b400",
              color: "black",
              border: "none",
              borderRadius: "12px",
              padding: "12px 20px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? "Ekleniyor..." : "Kitabı Hesabıma Ekle"}
          </button>

          {/* SONUÇ */}
          {result && (
            <div style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #333",
              background: "black"
            }}>
              {result.ok ? (
                <p style={{ color: "#4ade80" }}>
                  {result.alreadyAdded
                    ? "Bu kitap zaten hesabınızda"
                    : "Kitap başarıyla eklendi"}
                </p>
              ) : (
                <p style={{ color: "#f87171" }}>
                  Hata: {result.error}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
