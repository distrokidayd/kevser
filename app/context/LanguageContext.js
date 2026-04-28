"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext({
  siteLanguage: "Türkçe",
  loadingLanguage: true,
  reloadLanguage: async () => {},
});

export function LanguageProvider({ children }) {
  const [siteLanguage, setSiteLanguage] = useState("Türkçe");
  const [loadingLanguage, setLoadingLanguage] = useState(true);

  async function loadSiteLanguage() {
    try {
      setLoadingLanguage(true);

      const res = await fetch("/api/get-site-language");
      const data = await res.json();

      if (data.success) {
        setSiteLanguage(data.siteLanguage || "Türkçe");
      }
    } catch (error) {
      console.error("Site dili alınamadı:", error);
      setSiteLanguage("Türkçe");
    } finally {
      setLoadingLanguage(false);
    }
  }

  useEffect(() => {
    loadSiteLanguage();
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        siteLanguage,
        loadingLanguage,
        reloadLanguage: loadSiteLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
