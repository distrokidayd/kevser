export const metadata = {
  title: "Kevser Publishing House",
  description: "Digital publishing platform for books, audiobooks and reader commentary."
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}
