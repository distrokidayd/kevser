export async function detectLanguage(text) {
  try {
    if (!text) return "auto";

    const res = await fetch("https://libretranslate.de/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: text }),
    });

    const data = await res.json();

    if (!Array.isArray(data) || !data[0]?.language) {
      return "auto";
    }

    return mapDetectedLanguage(data[0].language);
  } catch (error) {
    console.error("Dil tespit hatası:", error);
    return "auto";
  }
}

function mapDetectedLanguage(code) {
  const map = {
    tr: "Türkçe",
    en: "English",
    ar: "العربية",
    de: "Deutsch",
    fr: "Français",
    es: "Español",
    ru: "Русский",
    fa: "فارسی",
    ur: "اردو",
    zh: "中文",
    id: "Bahasa Indonesia",
    ms: "Malay",
  };

  return map[code] || "English";
}
