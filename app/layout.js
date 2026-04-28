import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./components/Navbar";
import CreateProfile from "./components/CreateProfile";
import { LanguageProvider } from "./context/LanguageContext";

export const metadata = {
  title: "Kevser",
  description: "Publishing platform"
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="tr">
        <body style={{ margin: 0, background: "black" }}>
          <LanguageProvider>
            <CreateProfile />
            <Navbar />
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
