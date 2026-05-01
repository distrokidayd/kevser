import Link from "next/link";

export default function HomePage({ params }) {
  const lang = params?.lang || "tr";

  return (
    <main style={styles.page}>
      <section id="biz" style={styles.section}>
        <div style={styles.visual}>
          <div style={styles.placeholder}>
            <span style={styles.icon}>🌧️</span>
            Buluttan denize damla görseli
          </div>
        </div>

        <div style={styles.copyPanel}>
          <div style={styles.kicker}>Biz Kimiz</div>
          <h1 style={styles.heroTitle}>
            Kevser <span style={styles.accent}>Publishing House</span>
          </h1>

          <p style={styles.lead}>
            Kevser Publishing House, başta geleneksel kitapları çeşitli
            dillerde derleyen yazarları, yayınevlerini ve okuyucuları
            buluşturan çok dilli dijital yayın platformudur.
          </p>

          <p style={styles.lead}>
            Kevser üzerinden yayınlanan her eser, sonraki baskılarında seçilmiş
            okur yorumları, şerhleri ve tahlilleriyle zenginleşebilir.
          </p>

          <div style={styles.buttons}>
            <Link href={`/${lang}/books`} style={styles.primaryButton}>
              Kitaplar / Tahlil
            </Link>

            <Link href={`/${lang}/store`} style={styles.secondaryButton}>
              Mağazaya Git
            </Link>
          </div>
        </div>
      </section>

      <section id="okuyucu" style={styles.sectionReverse}>
        <div style={styles.visual}>
          <div style={styles.placeholder}>
            <span style={styles.icon}>📖</span>
            Aktif okuyucu görseli
          </div>
        </div>

        <div style={styles.copyPanel}>
          <div style={styles.kicker}>Okuyucular İçin Kevser</div>
          <h2 style={styles.sectionTitle}>
            Kitap <span style={styles.accent}>seninle okunsun</span>
          </h2>

          <p style={styles.lead}>
            Kevser’de okuyucu yalnızca kitabı okuyan ve ondan feyz alan kişi
            değildir; okuduğundan aldığı manayı başka okurlara ulaştırmaya
            yardım eden aktif bir katılımcıdır.
          </p>

          <p style={styles.lead}>
            Kevser’in okuyucu mottosu: <strong>“Kitap seninle okunsun.”</strong>
          </p>

          <ul style={styles.bullets}>
            <li style={styles.bulletItem}>
              Kitabı mühür koduyla sahiplenen okur, ilgili eserin yorum ve
              tahlil alanına katkı verebilir.
            </li>
            <li style={styles.bulletItem}>
              Yorumlar okuyucunun ana dilinde görüntülenebilir; orijinal metin
              her zaman gösterilebilir.
            </li>
            <li style={styles.bulletItem}>
              Seçkin okur katkıları, eserin sonraki baskılarında
              değerlendirilebilir.
            </li>
          </ul>
        </div>
      </section>

      <section id="yayinevleri" style={styles.section}>
        <div style={styles.visual}>
          <div style={styles.placeholder}>
            <span style={styles.icon}>🏛️</span>
            Yayınevi görseli
          </div>
        </div>

        <div style={styles.copyPanel}>
          <div style={styles.kicker}>Yayın Evleri İçin Kevser</div>
          <h2 style={styles.sectionTitle}>
            Aidatsız <span style={styles.accent}>mühürlü dağıtım</span>
          </h2>

          <p style={styles.lead}>
            Yayın evleri Kevser’e herhangi bir aidat ödemeden başvurabilir.
            Kabul edilen yayınevleri, limit dahilinde kitaplarını Kevser mühür
            sistemiyle platforma gönderebilir.
          </p>

          <ul style={styles.bullets}>
            <li style={styles.bulletItem}>
              Başlangıç limiti: 40+ kitap gönderimi için uygun yapı.
            </li>
            <li style={styles.bulletItem}>
              Her kitap Kevser mühür sistemiyle okura bağlanır.
            </li>
            <li style={styles.bulletItem}>
              Kevser mağazasında diğer mağazalara oranla düşük komisyon hedeflenir.
            </li>
          </ul>

          <div style={styles.buttons}>
            <Link href={`/${lang}/publishers`} style={styles.primaryButton}>
              Yayın Evin Varsa Başvur
            </Link>
          </div>
        </div>
      </section>

      <section id="yayinci" style={styles.sectionReverse}>
        <div style={styles.visual}>
          <div style={styles.placeholder}>
            <span style={styles.icon}>🎙️</span>
            Yayıncı / Stüdyo görseli
          </div>
        </div>

        <div style={styles.copyPanel}>
          <div style={styles.kicker}>Yayıncılar İçin Kevser</div>
          <h2 style={styles.sectionTitle}>
            %10 Kevser payı, <span style={styles.accent}>sürekli gelir imkânı</span>
          </h2>

          <p style={styles.lead}>
            Kevser’de yayıncılar eser, sesli içerik, şerh, tahlil ve moderasyon
            süreçlerinde görev alabilir. Kevser platform payı %10 olarak
            planlanır.
          </p>

          <ul style={styles.bullets}>
            <li style={styles.bulletItem}>
              Yayıncı başvurusu sözleşme ve sesli kabul ile yapılır.
            </li>
            <li style={styles.bulletItem}>
              Onaylanan yayıncı Stüdyo Dashboard’a erişir.
            </li>
            <li style={styles.bulletItem}>
              Hakemlik ve değerlendirme süreçleri gelir modeline dahil edilebilir.
            </li>
          </ul>

          <div style={styles.buttons}>
            <Link href={`/${lang}/profile`} style={styles.primaryButton}>
              Yayıncı / Stüdyo Başvurusu
            </Link>
          </div>
        </div>
      </section>

      <section id="gelir" style={styles.section}>
        <div style={styles.visual}>
          <div style={styles.placeholder}>
            <span style={styles.icon}>⚖️</span>
            Gelir ve hakemlik görseli
          </div>
        </div>

        <div style={styles.copyPanel}>
          <div style={styles.kicker}>Gelir Paylaşımı & Hakemlik</div>
          <h2 style={styles.sectionTitle}>
            Şeffaf paylaşım, <span style={styles.accent}>nitelikli denetim</span>
          </h2>

          <p style={styles.lead}>
            Kevser’in gelir paylaşımı; eser sahibi, yayıncı, platform ve
            hakemlik emeği arasında şeffaf bir sözleşme mantığıyla düzenlenir.
          </p>

          <div style={styles.faq}>
            <div style={styles.faqRow}>
              Gelir paylaşımı nasıl belirlenir? <span style={styles.plus}>+</span>
            </div>
            <div style={styles.faqRow}>
              Hakemler kimlerden oluşur? <span style={styles.plus}>+</span>
            </div>
            <div style={styles.faqRow}>
              Şikayet ve itiraz süreci nasıl işler? <span style={styles.plus}>+</span>
            </div>
            <div style={styles.faqRow}>
              Yayıncı pasif gelirini nereden takip eder?{" "}
              <span style={styles.plus}>+</span>
            </div>
          </div>
        </div>
      </section>

      <footer id="iletisim" style={styles.footer}>
        <div style={styles.footerGrid}>
          <div>
            <h3 style={styles.footerTitle}>Kevser Publishing House</h3>
            <p style={styles.footerText}>
              Çok dilli dijital yayın, kitap/tahlil, mağaza, yayıncı/stüdyo ve
              hakemlik platformu.
            </p>
            <p style={styles.footerText}>
              <strong>Adres:</strong> Adres bilgisi eklenecek.
            </p>
          </div>

          <div>
            <h3 style={styles.footerTitle}>FAQ</h3>
            <a href="#biz" style={styles.footerLink}>Kevser nedir?</a>
            <a href="#okuyucu" style={styles.footerLink}>Okuyucu nasıl katkı verir?</a>
            <a href="#yayinevleri" style={styles.footerLink}>Yayın evi nasıl başvurur?</a>
            <a href="#gelir" style={styles.footerLink}>Gelir paylaşımı nasıl işler?</a>
          </div>

          <div>
            <h3 style={styles.footerTitle}>Contact</h3>
            <p style={styles.footerText}>E-posta: info@kevser.example</p>
            <p style={styles.footerText}>Telefon: +90 000 000 00 00</p>
            <p style={styles.footerText}>
              Maide Vakfı alt domain sayfası ayrıca hazırlanacak.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    color: "#163242",
    background:
      "radial-gradient(circle at 18% 12%, rgba(255,255,255,.9), transparent 18%), linear-gradient(180deg, #f8fdff 0%, #eef9ff 36%, #eefaf7 68%, #d7f1f5 100%)",
    position: "relative",
    overflow: "hidden",
  },
  section: {
    minHeight: "82vh",
    padding: "82px 7vw",
    display: "grid",
    gridTemplateColumns: "1fr 1.08fr",
    gap: "7vw",
    alignItems: "center",
  },
  sectionReverse: {
    minHeight: "82vh",
    padding: "82px 7vw",
    display: "grid",
    gridTemplateColumns: "1.08fr 1fr",
    gap: "7vw",
    alignItems: "center",
  },
  visual: {
    minHeight: "405px",
    border: "1px solid rgba(15,59,77,.13)",
    borderRadius: "34px",
    background:
      "radial-gradient(circle at 40% 25%, rgba(255,255,255,.92), transparent 22%), linear-gradient(180deg, rgba(255,255,255,.7), rgba(223,244,255,.48))",
    boxShadow: "0 24px 80px rgba(19, 68, 89, .12)",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
  },
  placeholder: {
    textAlign: "center",
    color: "rgba(15,59,77,.35)",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "11px",
    fontWeight: "900",
  },
  icon: {
    display: "block",
    fontSize: "58px",
    marginBottom: "18px",
  },
  copyPanel: {
    background: "rgba(255,255,255,.72)",
    border: "1px solid rgba(15,59,77,.13)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 24px 80px rgba(19, 68, 89, .12)",
  },
  kicker: {
    color: "#0b8f86",
    letterSpacing: "5px",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: "900",
    marginBottom: "18px",
  },
  heroTitle: {
    margin: "0 0 28px",
    lineHeight: ".98",
    fontFamily: "Georgia, serif",
    color: "#0f3b4d",
    letterSpacing: "-1px",
    fontSize: "clamp(56px, 7vw, 106px)",
  },
  sectionTitle: {
    margin: "0 0 28px",
    lineHeight: ".98",
    fontFamily: "Georgia, serif",
    color: "#0f3b4d",
    letterSpacing: "-1px",
    fontSize: "clamp(44px, 5.4vw, 78px)",
  },
  accent: {
    color: "#0fb7a6",
    display: "block",
  },
  lead: {
    color: "#5d7685",
    fontSize: "18px",
    lineHeight: "1.9",
    maxWidth: "720px",
  },
  buttons: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "32px",
  },
  primaryButton: {
    textDecoration: "none",
    padding: "14px 20px",
    borderRadius: "999px",
    fontWeight: "900",
    border: "1px solid #0fb7a6",
    color: "white",
    background: "#0fb7a6",
  },
  secondaryButton: {
    textDecoration: "none",
    padding: "14px 20px",
    borderRadius: "999px",
    fontWeight: "900",
    border: "1px solid rgba(15,59,77,.16)",
    color: "#0f3b4d",
    background: "white",
  },
  bullets: {
    listStyle: "none",
    padding: 0,
    margin: "30px 0 0",
  },
  bulletItem: {
    borderBottom: "1px solid rgba(15,59,77,.1)",
    padding: "16px 0",
    color: "#5d7685",
    lineHeight: "1.7",
  },
  faq: {
    marginTop: "32px",
    borderTop: "1px solid rgba(15,59,77,.1)",
  },
  faqRow: {
    padding: "18px 0",
    borderBottom: "1px solid rgba(15,59,77,.1)",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    color: "#0f3b4d",
    fontWeight: "900",
  },
  plus: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    border: "1px solid #0fb7a6",
    color: "#0fb7a6",
    flex: "0 0 auto",
  },
  footer: {
    background: "rgba(255,255,255,.66)",
    borderTop: "1px solid rgba(15,59,77,.13)",
    padding: "76px 7vw 50px",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: "40px",
    maxWidth: "1200px",
    margin: "auto",
  },
  footerTitle: {
    marginTop: 0,
    color: "#0f3b4d",
    fontFamily: "Georgia, serif",
    fontSize: "28px",
  },
  footerText: {
    color: "#5d7685",
    lineHeight: "1.8",
  },
  footerLink: {
    color: "#5d7685",
    lineHeight: "1.8",
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
  },
};
