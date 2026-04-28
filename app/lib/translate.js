export async function translateText({ text, sourceLang = "auto", targetLang }) {
  try {
    if (!text || !targetLang) {
      return {
        success: false,
        error: "Metin ve hedef dil gerekli",
      };
    }

    // 🔥 ÜCRETSİZ API (LibreTranslate public endpoint)
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: mapLanguage(targetLang),
        format: "text",
      }),
    });

    const data = await res.json();

    if (!data.translatedText) {
      return {
        success: false,
        error: "Çeviri başarısız",
      };
    }

    return {
      success: true,
      translatedText: data.translatedText,
      provider: "libretranslate_free",
    };
  } catch (error) {
    console.error("Çeviri hatası:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}

// 🌍 Dil mapping (çok önemli)
function mapLanguage(lang) {
  const map = {
    "Türkçe": "tr",
    "English": "en",
    "العربية": "ar",
    "Deutsch": "de",
    "Français": "fr",
    "Español": "es",
    "Русский": "ru",
    "فارسی": "fa",
    "اردو": "ur",
    "中文": "zh",
    "Bahasa Indonesia": "id",
    "Malay": "ms",
  };

  return map[lang] || "en";
}
