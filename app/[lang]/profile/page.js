"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [religion, setReligion] = useState("islam");
  const [isSect, setIsSect] = useState(false);
  const [sect, setSect] = useState("");

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1>Profil</h1>
        <button onClick={() => setEditMode(!editMode)} style={styles.button}>
          {editMode ? "Kaydet" : "Düzenle"}
        </button>
      </div>

      {/* PROFİL BİLGİLERİ */}
      <div style={styles.card}>
        <h3>Kimlik Bilgileri</h3>

        <input style={styles.input} placeholder="Ad" disabled={!editMode} />
        <input style={styles.input} placeholder="Soyad" disabled={!editMode} />
        <input style={styles.input} placeholder="Şehir" disabled={!editMode} />
        <input style={styles.input} placeholder="Ülke" disabled={!editMode} />
      </div>

      {/* DİN ALANI */}
      <div style={styles.card}>
        <h3>Din</h3>

        <div style={styles.row}>
          <button
            style={religion === "islam" ? styles.active : styles.choice}
            onClick={() => setReligion("islam")}
          >
            İslam
          </button>

          <button
            style={religion === "christian" ? styles.active : styles.choice}
            onClick={() => setReligion("christian")}
          >
            Hristiyanlık
          </button>

          <button
            style={religion === "jewish" ? styles.active : styles.choice}
            onClick={() => setReligion("jewish")}
          >
            Yahudilik
          </button>

          <button
            style={religion === "other" ? styles.active : styles.choice}
            onClick={() => setReligion("other")}
          >
            Diğer
          </button>
        </div>

        {/* İSLAM SEÇİLİNCE */}
        {religion === "islam" && (
          <>
            <h4>Fırkalardan mısın?</h4>

            <div style={styles.row}>
              <button
                style={!isSect ? styles.active : styles.choice}
                onClick={() => setIsSect(false)}
              >
                Müslüman
              </button>

              <button
                style={isSect ? styles.active : styles.choice}
                onClick={() => setIsSect(true)}
              >
                Fırkalardanım
              </button>
            </div>

            {isSect && (
              <>
                <select
                  style={styles.input}
                  onChange={(e) => setSect(e.target.value)}
                >
                  <option>Fırkanı seç</option>
                  <option>Hanefi</option>
                  <option>Şafii</option>
                  <option>Maliki</option>
                  <option>Hanbeli</option>
                  <option>Caferi</option>
                  <option>Diğer</option>
                </select>

                <input
                  style={styles.input}
                  placeholder="Diğer ise yaz"
                />
              </>
            )}
          </>
        )}

        <p style={styles.warning}>
          Not: Din bilgisi en fazla 2 kez değiştirilebilir.
        </p>
      </div>

      {/* KİTAPLAR */}
      <div style={styles.card}>
        <h3>Kitaplarım</h3>

        <div style={styles.book}>
          <strong>Rubailer</strong>
          <button style={styles.smallBtn}>Tahlil'e Git</button>
        </div>

        <input style={styles.input} placeholder="Mühür kodu gir" />
        <button style={styles.button}>Kitap Ekle</button>
      </div>

      {/* CÜZDAN */}
      <div style={styles.card}>
        <h3>Cüzdan</h3>

        <p>Bakiye: $0.00</p>
        <p>Hediye: $5.00</p>

        <button style={styles.button}>Kripto ile yükle</button>

        <input style={styles.input} placeholder="Kupon kodu gir" />
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#f5fbff",
    minHeight: "100vh"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  card: {
    background: "white",
    padding: "20px",
    marginTop: "20px",
    borderRadius: "12px"
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 15px",
    background: "#0fb7a6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  smallBtn: {
    marginLeft: "10px",
    padding: "5px 10px"
  },
  row: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap"
  },
  choice: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer"
  },
  active: {
    padding: "10px",
    borderRadius: "8px",
    background: "#0fb7a6",
    color: "white",
    cursor: "pointer"
  },
  warning: {
    marginTop: "10px",
    color: "red",
    fontSize: "12px"
  },
  book: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  }
};
