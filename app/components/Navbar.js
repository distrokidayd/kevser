import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "20px",
      borderBottom: "1px solid #333",
      background: "black",
      color: "white"
    }}>

      <div style={{ fontWeight: "bold" }}>
        Kevser
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <a href="/" style={link}>Home</a>
        <a href="/books" style={link}>Books</a>
        <a href="/audiobooks" style={link}>Audiobooks</a>
        <a href="/articles" style={link}>Makaleler</a>
        <a href="/publishers" style={link}>Publishers</a>

        <SignedOut>
          <SignInButton>
            <button style={button}>Giriş Yap</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

    </div>
  );
}

const link = {
  color: "white",
  textDecoration: "none"
};

const button = {
  background: "white",
  color: "black",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  cursor: "pointer"
};
