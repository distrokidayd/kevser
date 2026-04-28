"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  const maideVakfiUrl = "https://maide.kevser.com";

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <Link href="/" style={styles.brand}>
          Kevser
        </Link>

        <a href={maideVakfiUrl} style={styles.foundationLink}>
          Maide Vakfı
        </a>
      </div>

      <div style={styles.links}>
        <Link href="/books" style={styles.link}>
          Kitaplar / Chat
        </Link>

        <Link href="/store" style={styles.link}>
          Mağaza
        </Link>

        <Link href="/publishers" style={styles.link}>
          Yayınevleri
        </Link>

        <Link href="/audiobooks" style={styles.link}>
          Sesli Kitaplar
        </Link>

        <Link href="/articles" style={styles.link}>
          Makaleler
        </Link>

        <Link href="/profile" style={styles.link}>
          Profil
        </Link>
      </div>

      <div style={styles.auth}>
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <>
            <SignInButton mode="modal">
              <button style={styles.loginButton}>Giriş Yap</button>
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
    gap: "20px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexShrink: 0,
  },
  brand: {
    color: "#f5b400",
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "900",
    letterSpacing: "1px",
  },
  foundationLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "700",
    borderLeft: "1px solid #333",
    paddingLeft: "14px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  link: {
    color: "#e5e5e5",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "700",
  },
  auth: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },
  loginButton: {
    border: "1px solid #333",
    background: "transparent",
    color: "#fff",
    borderRadius: "10px",
    padding: "9px 12px",
    cursor: "pointer",
    fontWeight: "700",
  },
  signupButton: {
    border: "none",
    background: "#f5b400",
    color: "#000",
    borderRadius: "10px",
    padding: "9px 12px",
    cursor: "pointer",
    fontWeight: "900",
  },
};
