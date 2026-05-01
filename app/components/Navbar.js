"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";
import { useParams } from "next/navigation";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const { siteLanguage } = useLanguage();
  const params = useParams();

  const lang = params?.lang || "tr";

  const t = translations[siteLanguage] || translations["Türkçe"];

  const maideVakfiUrl = "https://maide.kevser.com";

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <Link href={`/${lang}`} style={styles.brand}>
          Kevser
        </Link>

        <a href={maideVakfiUrl} style={styles.foundationLink}>
          Maide Vakfı
        </a>
      </div>

      <div style={styles.links}>
        <Link href={`/${lang}/books`} style={styles.link}>{t.books}</Link>
        <Link href={`/${lang}/store`} style={styles.link}>{t.store}</Link>
        <Link href={`/${lang}/publishers`} style={styles.link}>{t.publishers}</Link>
        <Link href={`/${lang}/audiobooks`} style={styles.link}>{t.audiobooks}</Link>
        <Link href={`/${lang}/articles`} style={styles.link}>{t.articles}</Link>
        <Link href={`/${lang}/profile`} style={styles.link}>{t.profile}</Link>
      </div>

      <div style={styles.auth}>
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <>
            <SignInButton mode="modal">
              <button style={styles.loginButton}>Giriş</button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button style={styles.signupButton}>Üye Ol</button>
            </SignUpButton>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    width: "100%",
    minHeight: "72px",
    padding: "14px 28px",
    background: "#080808",
    borderBottom: "1px solid #2a2a2a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  brand: {
    color: "#f5b400",
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "900",
  },
  foundationLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    borderLeft: "1px solid #333",
    paddingLeft: "14px",
  },
  links: {
    display: "flex",
    gap: "14px",
  },
  link: {
    color: "#e5e5e5",
    textDecoration: "none",
    fontWeight: "700",
  },
  auth: {
    display: "flex",
    gap: "10px",
  },
  loginButton: {
    border: "1px solid #333",
    background: "transparent",
    color: "#fff",
    borderRadius: "10px",
    padding: "9px 12px",
    cursor: "pointer",
  },
  signupButton: {
    background: "#f5b400",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    padding: "9px 12px",
    cursor: "pointer",
  },
};
