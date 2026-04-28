"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function TranslatedContent({ contribution }) {
  const { siteLanguage } = useLanguage();

  const [showOriginal, setShowOriginal] = useState(false);
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);

  const sourceLang = contribution.source_language || "auto";

  useEffect(() => {
    if (!siteLanguage) return;

    if (sourceLang === siteLanguage) return;

    loadTranslation();
  }, [siteLanguage]);

  async function loadTranslation() {
    try {
      setLoading(true);

      const res = await fetch("/api/get-contribution-translation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contributionId: contribution.id,
          targetLanguage: siteLanguage,
        }),
      });

      const data = await res.json();

      if (data.translation) {
        setTranslation(data.translation);
        return;
      }

      const createRes = await fetch("/api/create-contribution-translation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contributionId: contribution.id,
          targetLanguage: siteLanguage,
        }),
      });

      const created = await createRes.json();

      if (created.success) {
        setTranslation(created.translation);
      }
    } catch (error) {
      console.error("Çeviri yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  }

  if (sourceLang === siteLanguage) {
    return <p>{contribution.content}</p>;
  }

  return (
    <div>
      {!showOriginal && translation && (
        <p>{translation.translated_content}</p>
      )}

      {showOriginal && <p>{contribution.content}</p>}

      <div style={{ fontSize: "12px", color: "#aaa", marginTop: "6px" }}>
        {!showOriginal && (
          <>
            ↻ {sourceLang} → {siteLanguage} çevrildi ·{" "}
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setShowOriginal(true)}
            >
              Orijinali göster
            </span>
          </>
        )}

        {showOriginal && (
          <>
            Orijinal metin ·{" "}
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setShowOriginal(false)}
            >
              Çeviriyi göster
            </span>
          </>
        )}
      </div>

      {loading && (
        <div style={{ fontSize: "12px", color: "#666" }}>
          Çeviri hazırlanıyor...
        </div>
      )}
    </div>
  );
}
