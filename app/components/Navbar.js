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

      <div style={{ display: "flex", gap: "20px" }}>
        <a href="/" style={{ color: "white", textDecoration: "none" }}>Home</a>
        <a href="/books" style={{ color: "white", textDecoration: "none" }}>Books</a>
        <a href="/publishers" style={{ color: "white", textDecoration: "none" }}>Publishers</a>
      </div>

    </div>
  );
}
