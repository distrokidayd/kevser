import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Kevser",
  description: "Publishing platform"
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="tr">
        <body style={{ margin: 0, background: "black" }}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
