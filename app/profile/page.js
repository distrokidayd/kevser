"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();

  const [activeTab, setActiveTab] = useState("messages");
  const [sealCode, setSealCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedBox, setExpandedBox] = useState(null);

  const [isPublisher, setIsPublisher] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    loadMyProfile();
  }, []);

  async function loadMyProfile() {
    try {
      const res = await fetch("/api/get-my-profile");
      const data = await res.json();

      if (data.success) {
        setProfileData(data.profile);
        setIsPublisher(data.isPublisher);
      }
    } catch (error) {
      console.error("Profil rolü alınamadı:", error);
    } finally {
      setProfileLoading(false);
    }
  }

  async function addBook() {
    if (!sealCode.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/add-book-by-seal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seal_code: sealCode,
      }),
    });

    const data = await res.json();

    setResult(data);
    setLoading(false);
  }

  if (!isSignedIn) {
    return (
      <main style={styles.page}>
        <section style={styles.container}>
          <div style={styles.card}>
            <h1>Giriş yapmanız gerekiyor</h1>
            <p style={styles.muted}>
              Profil, mesajlar ve kitap ekleme alanını kullanmak için giriş yapmalısınız.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const sentMessages = [
    {
      id: 1,
      to: "@kitap_dostu",
      text: "Rubailer üzerine başlattığın yorumu okudum. Çok güzel bir noktaya değinmişsin.",
      time: "Bugün 14:30",
    },
    {
      id: 2,
      to: "@serh_defteri",
      text: "Gülistan hakkında yazdığın tahlile cevap verdim.",
      time: "Dün 21:10",
    },
  ];

  const incomingMessages = [
    {
      id: 1,
      from: "@rubai_okuru",
      text: "Rubailer tartışmasında yazdığın yoruma katılıyorum.",
      time: "Bugün 15:12",
    },
    {
      id: 2,
      from: "@klasik_okur",
      text: "Arkadaşlık isteğimi kabul eder misin? Aynı kitapları okuyoruz.",
      time: "Bugün 12:44",
    },
  ];

  const sameBookMessages = [
    {
      id: 1,
      username: "@hayyam_notlari",
      book: "Rubailer",
      author: "Ömer Hayyam",
      unread: 3,
      text: "Bu kitabı alan okuyucularla Rubailer’deki içtenlik meselesini konuşmak istiyorum.",
      cooldown: "Sonraki toplu mesaj hakkı: 2 gün 14 saat",
    },
  ];

  const communityCalls = [
    {
      id: 1,
      username: "@okur_meclisi",
      text: "Bu hafta Rubailer üzerine ortak şerh çalışması yapmak isteyenleri tartışma alanına bekliyoruz.",
      time: "Bugün",
    },
  ];

  const ownedBooks = [
    {
      id: 1,
      title: "Rubailer",
      author: "Ömer Hayyam",
      language: "Türkçe Çeviri",
      status: "Şerh / yorum / tahlil hakkı açık",
      slug: "/books/omerhayyam/rubailer",
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Kevser Profile</div>
            <h1 style={styles.title}>
              Hoş geldin {user?.firstName || user?.username || "Kevser Üyesi"}
            </h1>
            <p style={styles.muted}>
              Kitapların, mühür kodların, mesajların, dil tercihlerin ve yayıncı durumun burada toplanır.
            </p>
          </div>

          <div style={styles.profileBadge}>
            <div style={styles.avatar}>
              {(user?.firstName?.[0] || user?.username?.[0] || "K").toUpperCase()}
            </div>

            <div>
              <div style={styles.username}>
                {user?.username || user?.primaryEmailAddress?.emailAddress || "Kullanıcı"}
              </div>
              <div style={styles.role}>
                {profileLoading ? "Rol yükleniyor..." : isPublisher ? "Yayıncı" : "Üye"}
              </div>
            </div>
          </div>
        </header>

        <section style={styles.layout}>
          <aside style={styles.sidebar}>
            <div style={styles.sidebarTitle}>Profil Menüsü</div>

            <SideButton
              active={activeTab === "messages"}
              title="Mesajlar"
              onClick={() => setActiveTab("messages")}
            />

            <SideButton
              active={activeTab === "books"}
              title="Kitaplarım"
              onClick={() => setActiveTab("books")}
            />

            <SideButton
              active={activeTab === "profile"}
              title="Profil Düzenle"
              onClick={() => setActiveTab("profile")}
            />

            <SideButton
              active={activeTab === "publisher"}
              title="Yayıncı / Stüdyo"
              onClick={() => setActiveTab("publisher")}
            />
          </aside>

          <section style={styles.content}>
            {activeTab === "messages" && (
              <>
                <PanelHeader
                  title="Mesajlar"
                  desc="Mesaj alanları burada gruplanır. Her kutu eski sistemdeki gibi sayfayı büyütüp küçültebilir."
                />

                <section style={styles.messageGrid}>
                  <MessageBox
                    id="sent"
                    title="Arkadaşlara Gönderilen Mesajlar"
                    expandedBox={expandedBox}
                    setExpandedBox={setExpandedBox}
                  >
                    {sentMessages.map((msg) => (
                      <div key={msg.id} style={styles.messageItem}>
                        <div style={styles.meta}>Kime: {msg.to} • {msg.time}</div>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </MessageBox>

                  <MessageBox
                    id="incoming"
                    title="Arkadaşlardan Gelen Mesajlar"
                    expandedBox={expandedBox}
                    setExpandedBox={setExpandedBox}
                  >
                    {incomingMessages.map((msg) => (
                      <div key={msg.id} style={styles.messageItem}>
                        <div style={styles.meta}>Kimden: {msg.from} • {msg.time}</div>
                        <p>{msg.text}</p>
                        <button style={styles.smallButton}>Cevap Yaz</button>
                      </div>
                    ))}
                  </MessageBox>

                  <MessageBox
                    id="sameBook"
                    title="Aynı Kitabı Alanlara Mesajlar"
                    expandedBox={expandedBox}
                    setExpandedBox={setExpandedBox}
                  >
                    {sameBookMessages.map((msg) => (
                      <div key={msg.id} style={styles.sameBookItem}>
                        <div style={styles.smallCover}>
                          <span>{msg.book}</span>
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={styles.meta}>
                            {msg.username} • {msg.author}
                          </div>

                          <div style={styles.unreadBadge}>
                            {msg.unread} okunmamış mesaj
                          </div>

                          <p>{msg.text}</p>

                          <div style={styles.cooldown}>{msg.cooldown}</div>

                          <div style={styles.actionRow}>
                            <button style={styles.smallButton}>Mesaj Gönder</button>
                            <button style={styles.smallButton}>Arkadaşlık İsteği Gönder</button>
                            <button style={styles.dangerSmallButton}>Bu kişiden mesaj alma</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </MessageBox>

                  <MessageBox
                    id="community"
                    title="Topluluğa Çağrı Mesajları"
                    expandedBox={expandedBox}
                    setExpandedBox={setExpandedBox}
                  >
                    {communityCalls.map((msg) => (
                      <div key={msg.id} style={styles.messageItem}>
                        <div style={styles.meta}>
                          {msg.username} • {msg.time}
                        </div>

                        <p>{msg.text}</p>

                        <div style={styles.actionRow}>
                          <button style={styles.smallButton}>Arkadaşlık İsteği Gönder</button>
                          <button style={styles.smallButton}>Katıl</button>
                          <button style={styles.dangerSmallButton}>Şikayet Et</button>
                        </div>
                      </div>
                    ))}
                  </MessageBox>
                </section>
              </>
            )}

            {activeTab === "books" && (
              <>
                <PanelHeader
                  title="Kitaplarım"
                  desc="Kitabın içindeki mühür kodu burada girilir. Kod hangi kitaba aitse o kitap hesaba eklenir ve yorum/şerh/tahlil hakkı açılır."
                />

                <section style={styles.booksTopGrid}>
                  <div style={styles.bookAddHero}>
                    <div style={styles.heroBadge}>Mühür Kodu</div>
                    <h2>Kitabı Hesabıma Ekle</h2>
                    <p style={styles.muted}>
                      Her basılı veya dijital Kevser kitabının ön kısmında platformu anlatan metin ve kitaba özel mühür kodu bulunur.
                    </p>

                    <input
                      value={sealCode}
                      onChange={(e) => setSealCode(e.target.value)}
                      placeholder="Örn: KEV-7H2M9Q4A"
                      style={styles.input}
                    />

                    <button
                      onClick={addBook}
                      disabled={loading}
                      style={styles.primaryButton}
                    >
                      {loading ? "Ekleniyor..." : "Kitabı Hesabıma Ekle"}
                    </button>

                    {result && (
                      <div style={result.ok ? styles.successBox : styles.errorBox}>
                        {result.ok
                          ? result.alreadyAdded
                            ? "Bu kitap zaten hesabınızda."
                            : "Kitap başarıyla hesabınıza eklendi."
                          : "Hata: " + result.error}
                      </div>
                    )}
                  </div>

                  <div style={styles.ownershipInfo}>
                    <h2>Kitap Sahipliği</h2>
                    <p>
                      Mühür kodu kitabı kullanıcının hesabına bağlar. Böylece yalnızca kitabı gerçekten alan kişi ilgili kitapta yorum, şerh ve tahlil yazabilir.
                    </p>
                  </div>
                </section>

                <section style={styles.cardNoMargin}>
                  <h2>Kitaplarım</h2>

                  {ownedBooks.length === 0 && (
                    <p style={styles.muted}>Henüz hesabınıza eklenmiş kitap yok.</p>
                  )}

                  <div style={styles.bookList}>
                    {ownedBooks.map((book) => (
                      <div key={book.id} style={styles.bookCard}>
                        <div style={styles.bookCover}>{book.title}</div>

                        <div>
                          <div style={styles.meta}>{book.language}</div>
                          <h3>{book.author} — {book.title}</h3>
                          <div style={styles.bookStatus}>{book.status}</div>
                          <p style={styles.muted}>
                            Bu kitap hesabınıza bağlı olduğu için ilgili kitap sayfasında yorum, şerh ve tahlil yazabilirsiniz.
                          </p>

                          <div style={styles.actionRow}>
                            <a href={book.slug} style={styles.linkPrimary}>
                              Kitap Sayfasına Git
                            </a>
                            <button style={styles.smallButton}>Katkılarımı Gör</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeTab === "profile" && (
              <>
                <PanelHeader
                  title="Profil Düzenle"
                  desc="Ana dil, bildiğiniz diller ve profil bilgileriniz burada düzenlenir. Siteye sonraki girişlerinizde seçtiğiniz ana dil esas alınır."
                />

                <ProfileEditSection
                  user={user}
                  isPublisher={isPublisher}
                  profileData={profileData}
                  reloadProfile={loadMyProfile}
                />
              </>
            )}

            {activeTab === "publisher" && (
              <>
                <PanelHeader
                  title="Yayıncı / Stüdyo"
                  desc="Yayıncı değilsen başvuru yaparsın. Admin kabul ederse bu bölüm stüdyo erişimine dönüşür."
                />

                <PublisherStudioSection isPublisher={isPublisher} user={user} />
              </>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}

function ProfileEditSection({ user, isPublisher, profileData, reloadProfile }) {
  const languageOptions = [
    "Türkçe",
    "English",
    "العربية",
    "Deutsch",
    "Français",
    "Español",
    "Русский",
    "فارسی",
    "اردو",
    "中文",
    "Bahasa Indonesia",
    "Malay",
  ];

  const initialKnownLanguages = Array.isArray(profileData?.known_languages)
    ? profileData.known_languages
    : ["Türkçe"];

  const [nativeLanguage, setNativeLanguage] = useState(
    profileData?.native_language || "Türkçe"
  );
  const [knownLanguages, setKnownLanguages] = useState(initialKnownLanguages);
  const [newLanguage, setNewLanguage] = useState("");
  const [savingLanguage, setSavingLanguage] = useState(false);
  const [languageMessage, setLanguageMessage] = useState("");

  useEffect(() => {
    setNativeLanguage(profileData?.native_language || "Türkçe");

    if (Array.isArray(profileData?.known_languages)) {
      setKnownLanguages(profileData.known_languages);
    } else {
      setKnownLanguages(["Türkçe"]);
    }
  }, [profileData]);

  function addKnownLanguage() {
    if (!newLanguage.trim()) return;

    if (!knownLanguages.includes(newLanguage.trim())) {
      setKnownLanguages([...knownLanguages, newLanguage.trim()]);
    }

    setNewLanguage("");
  }

  function removeLanguage(lang) {
    setKnownLanguages(knownLanguages.filter((item) => item !== lang));
  }

  async function saveLanguageSettings() {
    try {
      setSavingLanguage(true);
      setLanguageMessage("");

      const finalKnownLanguages = knownLanguages.includes(nativeLanguage)
        ? knownLanguages
        : [nativeLanguage, ...knownLanguages];

      const res = await fetch("/api/update-language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nativeLanguage,
          knownLanguages: finalKnownLanguages,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setLanguageMessage(data.error || "Dil ayarları kaydedilemedi.");
        return;
      }

      setKnownLanguages(finalKnownLanguages);
      setLanguageMessage("Dil ayarları kaydedildi.");

      if (reloadProfile) {
        await reloadProfile();
      }
    } catch (error) {
      console.error("Dil ayarı kaydetme hatası:", error);
      setLanguageMessage("Dil ayarları kaydedilirken hata oluştu.");
    } finally {
      setSavingLanguage(false);
    }
  }

  return (
    <div style={styles.profileGrid}>
      <div style={styles.formCard}>
        <label style={styles.label}>Görünen Ad</label>
        <input value={user?.firstName || ""} readOnly style={styles.input} />
      </div>

      <div style={styles.formCard}>
        <label style={styles.label}>E-posta</label>
        <input
          value={user?.primaryEmailAddress?.emailAddress || ""}
          readOnly
          style={styles.input}
        />
      </div>

      <div style={styles.formCard}>
        <label style={styles.label}>Ana Dil</label>
        <select
          value={nativeLanguage}
          onChange={(e) => setNativeLanguage(e.target.value)}
          style={styles.input}
        >
          {languageOptions.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>

        <p style={styles.smallMuted}>
          İlk girişte IP Türkiye ise otomatik Türkçe seçilecek. Sonra kullanıcı buradan değiştirebilecek.
        </p>
      </div>

      <div style={styles.formCard}>
        <label style={styles.label}>Profil Durumu</label>
        <input value={isPublisher ? "Yayıncı" : "Aktif Üye"} readOnly style={styles.input} />
      </div>

      <div style={styles.formCardWide}>
        <label style={styles.label}>Bildiği Diller</label>

        <div style={styles.languageRow}>
          <select
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            style={styles.input}
          >
            <option value="">Dil seç</option>
            {languageOptions.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>

          <button onClick={addKnownLanguage} style={styles.primaryButton}>
            Ekle
          </button>
        </div>

        <div style={styles.languageList}>
          {knownLanguages.map((lang) => (
            <span key={lang} style={styles.languagePill}>
              {lang}
              <button onClick={() => removeLanguage(lang)} style={styles.pillRemove}>
                ×
              </button>
            </span>
          ))}
        </div>

        <p style={styles.smallMuted}>
          Anlaşma metinleri, başvuru süreci ve site dili kullanıcının ana diline göre gösterilecek.
        </p>

        <button
          onClick={saveLanguageSettings}
          disabled={savingLanguage}
          style={styles.primaryButton}
        >
          {savingLanguage ? "Kaydediliyor..." : "Dil Ayarlarını Kaydet"}
        </button>

        {languageMessage && (
          <div style={styles.notice}>{languageMessage}</div>
        )}
      </div>
    </div>
  );
}

function PublisherStudioSection({ isPublisher, user }) {
  const [form, setForm] = useState({
    fullName: user?.fullName || user?.firstName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "",
    website: "",
    instagram: "",
    twitter: "",
    youtube: "",
    hasExperience: "",
    experience: "",
    reason: "",
  });

  const [agreementText, setAgreementText] = useState("");
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [voiceAccepted, setVoiceAccepted] = useState(false);
  const [voiceFileName, setVoiceFileName] = useState("");
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  useEffect(() => {
    fetchAgreement();
  }, []);

  async function fetchAgreement() {
    try {
      const res = await fetch("/api/get-agreement");
      const data = await res.json();

      if (data.success) {
        setAgreementText(data.agreementText);
      }
    } catch (error) {
      console.error("Agreement alınamadı:", error);
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function goStudio() {
    if (!isPublisher) {
      alert("Yayıncı olarak kabul edilmeniz gerekiyor.");
      return;
    }

    window.location.href = "/publisher";
  }

  async function submitPublisherApplication() {
    setApplicationMessage("");

    if (!form.fullName || !form.email || !form.reason) {
      setApplicationMessage("Ad soyad, e-posta ve başvuru sebebi zorunludur.");
      return;
    }

    if (!agreementAccepted) {
      setApplicationMessage("Başvuru için Kevser Yayın Evi sözleşmesini kabul etmelisiniz.");
      return;
    }

    if (!voiceAccepted) {
      setApplicationMessage("Başvuru için sesli kabul kaydı veya MP3 onayı gereklidir.");
      return;
    }

    try {
      setApplicationLoading(true);

      const experienceText = `
Website: ${form.website}
Instagram: ${form.instagram}
Twitter/X: ${form.twitter}
YouTube: ${form.youtube}
Yayıncılık deneyimi: ${form.hasExperience}
Deneyim açıklaması: ${form.experience}
Sesli onay: ${voiceFileName || "Mikrofon ile kabul"}
Sözleşme: ${agreementText}
      `;

      const res = await fetch("/api/create-publisher-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: "",
          penName: "",
          religion: "",
          denomination: "",
          experience: experienceText,
          reason: form.reason,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setApplicationMessage(data.error || "Başvuru gönderilemedi.");
        return;
      }

      setApplicationMessage("Yayıncı başvurunuz admin paneline gönderildi.");
    } catch (error) {
      console.error("Yayıncı başvuru hatası:", error);
      setApplicationMessage("Başvuru gönderilirken hata oluştu.");
    } finally {
      setApplicationLoading(false);
    }
  }

  if (isPublisher) {
    return (
      <section style={styles.publisherStudioGrid}>
        <div style={styles.permanentFilesCard}>
          <div style={styles.heroBadgeGreen}>Yayıncı Aktif</div>
          <h2>Kalıcı Dosyalarım</h2>
          <p style={styles.muted}>
            Yayıncı olarak kabul edildiğiniz için başvuru kartı artık kalıcı dosyalar alanına dönüşür.
          </p>

          <div style={styles.filePreview}>
            <strong>Sesli kabul dosyası</strong>
            <p>Başvuru sırasında söylediğiniz “kabul ettim” ses kaydı burada görünecek.</p>
          </div>

          <button style={styles.smallButton}>Dosyalarımı Gör</button>
        </div>

        <div style={styles.studioActiveCard}>
          <div style={styles.heroBadgeGreen}>Stüdyo Açık</div>
          <h2>Stüdyoya Git</h2>
          <p style={styles.muted}>
            Yayıncı paneline erişiminiz aktif.
          </p>

          <button onClick={goStudio} style={styles.linkGreenButton}>
            Stüdyo Dashboard’a Git
          </button>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.publisherStudioGrid}>
      <div style={styles.publisherApplyCard}>
        <div style={styles.heroBadge}>Başvuru</div>
        <h2>Yayıncı Olarak Başvur</h2>

        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>Ad Soyad *</label>
            <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>E-posta *</label>
            <input value={form.email} onChange={(e) => updateField("email", e.target.value)} style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Telefon</label>
            <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Website</label>
            <input value={form.website} onChange={(e) => updateField("website", e.target.value)} style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Instagram</label>
            <input value={form.instagram} onChange={(e) => updateField("instagram", e.target.value)} style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Twitter / X</label>
            <input value={form.twitter} onChange={(e) => updateField("twitter", e.target.value)} style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>YouTube / Kanal</label>
            <input value={form.youtube} onChange={(e) => updateField("youtube", e.target.value)} style={styles.input} />
          </div>

          <div>
            <label style={styles.label}>Yayıncılık Deneyimi</label>
            <select value={form.hasExperience} onChange={(e) => updateField("hasExperience", e.target.value)} style={styles.input}>
              <option value="">Seçiniz</option>
              <option value="var">Var</option>
              <option value="yok">Yok</option>
            </select>
          </div>
        </div>

        <label style={styles.label}>Deneyim Açıklaması</label>
        <textarea value={form.experience} onChange={(e) => updateField("experience", e.target.value)} style={styles.textarea} />

        <label style={styles.label}>Başvuru Sebebi *</label>
        <textarea value={form.reason} onChange={(e) => updateField("reason", e.target.value)} style={styles.textarea} />

        <div style={styles.agreementBox}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={agreementAccepted}
              onChange={() => setAgreementOpen(true)}
            />
            Kevser Yayın Evi platform anlaşma metnini okuyup kabul ediyorum.
          </label>

          <button style={styles.textButton} onClick={() => setAgreementOpen(true)}>
            Anlaşma metnini aç
          </button>
        </div>

        <div style={styles.voiceBox}>
          <h3>Sesli Kabul</h3>
          <p style={styles.muted}>
            Mikrofonla “kabul ettim” denilecek veya MP3 dosyası yüklenecek.
          </p>

          <div style={styles.actionRow}>
            <button
              style={styles.smallButton}
              onClick={() => {
                setVoiceAccepted(true);
                setVoiceFileName("Mikrofon ile kabul edildi");
              }}
            >
              🎤 Mikrofonla Kabul Ettim
            </button>

            <label style={styles.uploadButton}>
              MP3 Yükle
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setVoiceAccepted(true);
                    setVoiceFileName(file.name);
                  }
                }}
              />
            </label>
          </div>

          {voiceAccepted && (
            <div style={styles.successBox}>
              Sesli kabul alındı: {voiceFileName}
            </div>
          )}
        </div>

        <button onClick={submitPublisherApplication} disabled={applicationLoading} style={styles.primaryButton}>
          {applicationLoading ? "Başvuru Gönderiliyor..." : "Başvuruyu Gönder"}
        </button>

        {applicationMessage && <div style={styles.notice}>{applicationMessage}</div>}
      </div>

      <div style={styles.studioDisabledCard}>
        <div style={styles.heroBadgeDisabled}>Stüdyo Kapalı</div>
        <h2>Stüdyoya Git</h2>
        <p style={styles.muted}>
          Yayıncı paneli yalnızca admin tarafından yayıncı olarak kabul edilen kullanıcılar için açılır.
        </p>

        <button onClick={goStudio} style={styles.disabledButton}>
          Stüdyoya Git
        </button>
      </div>

      {agreementOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Kevser Yayın Evi Platform Anlaşması</h2>
            <p style={styles.muted}>Bu metin admin panelinden güncellenecek.</p>

            <div style={styles.agreementText}>
              {agreementText || "Anlaşma metni yükleniyor..."}
            </div>

            <div style={styles.actionRow}>
              <button
                style={styles.primaryButton}
                onClick={() => {
                  setAgreementAccepted(true);
                  setAgreementOpen(false);
                }}
              >
                Okudum ve Kabul Ediyorum
              </button>

              <button
                style={styles.smallButton}
                onClick={() => {
                  setAgreementAccepted(false);
                  setAgreementOpen(false);
                }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SideButton({ active, title, onClick }) {
  return (
    <button onClick={onClick} style={active ? styles.sideButtonActive : styles.sideButton}>
      <strong>{title}</strong>
    </button>
  );
}

function PanelHeader({ title, desc }) {
  return (
    <div style={styles.panelHeader}>
      <h2 style={styles.panelTitle}>{title}</h2>
      <p style={styles.muted}>{desc}</p>
    </div>
  );
}

function MessageBox({ id, title, expandedBox, setExpandedBox, children }) {
  const isExpanded = expandedBox === id;
  const isHidden = expandedBox && !isExpanded;

  if (isHidden) return null;

  return (
    <div style={isExpanded ? styles.messageBoxExpanded : styles.messageBox}>
      <div style={styles.boxHeader}>
        <h2>{title}</h2>

        <button
          onClick={() => setExpandedBox(isExpanded ? null : id)}
          style={styles.expandButton}
        >
          {isExpanded ? "Sayfayı Küçült" : "Sayfayı Büyüt"}
        </button>
      </div>

      <div style={isExpanded ? styles.boxContentExpanded : styles.boxContent}>
        {children}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #050505 0%, #111 60%, #1a1205 100%)",
    color: "white",
    padding: "40px",
  },
  container: {
    maxWidth: "1350px",
    margin: "0 auto",
  },
  card: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
    background: "#111",
  },
  header: {
    border: "1px solid #333",
    borderRadius: "28px",
    padding: "28px",
    background: "#111",
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "center",
    marginBottom: "28px",
  },
  eyebrow: {
    color: "#f5b400",
    letterSpacing: "4px",
    textTransform: "uppercase",
    fontSize: "13px",
    fontWeight: "bold",
  },
  title: {
    fontSize: "38px",
    margin: "10px 0",
  },
  muted: {
    color: "#aaa",
    lineHeight: "1.7",
  },
  smallMuted: {
    color: "#777",
    fontSize: "13px",
    lineHeight: "1.6",
  },
  profileBadge: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    border: "1px solid #333",
    borderRadius: "20px",
    padding: "14px",
    background: "black",
  },
  avatar: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "#f5b400",
    color: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "24px",
  },
  username: {
    fontWeight: "bold",
  },
  role: {
    color: "#aaa",
    fontSize: "13px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "260px minmax(0, 1fr)",
    gap: "22px",
    alignItems: "start",
  },
  sidebar: {
    border: "1px solid #333",
    borderRadius: "26px",
    padding: "18px",
    background: "#101010",
    position: "sticky",
    top: "20px",
  },
  sidebarTitle: {
    color: "#f5b400",
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "14px",
  },
  sideButton: {
    width: "100%",
    border: "1px solid #303030",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "10px",
    color: "#eee",
    background: "#050505",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px",
  },
  sideButtonActive: {
    width: "100%",
    border: "1px solid #f5b400",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "10px",
    color: "black",
    background: "#f5b400",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px",
  },
  content: {
    border: "1px solid #333",
    borderRadius: "28px",
    background: "#111",
    padding: "24px",
    minHeight: "720px",
  },
  panelHeader: {
    borderBottom: "1px solid #242424",
    paddingBottom: "18px",
    marginBottom: "20px",
  },
  panelTitle: {
    margin: 0,
    fontSize: "28px",
  },
  messageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "22px",
  },
  messageBox: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "20px",
    background: "#070707",
    minHeight: "360px",
  },
  messageBoxExpanded: {
    gridColumn: "1 / -1",
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
    background: "#070707",
    minHeight: "760px",
  },
  boxHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "center",
    borderBottom: "1px solid #222",
    paddingBottom: "14px",
  },
  expandButton: {
    border: "1px solid #2563eb",
    color: "#60a5fa",
    background: "transparent",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  boxContent: {
    marginTop: "16px",
    maxHeight: "260px",
    overflow: "hidden",
  },
  boxContentExpanded: {
    marginTop: "16px",
  },
  messageItem: {
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "16px",
    background: "black",
    marginBottom: "14px",
  },
  sameBookItem: {
    display: "flex",
    gap: "16px",
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "16px",
    background: "black",
    marginBottom: "14px",
  },
  smallCover: {
    width: "86px",
    height: "118px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #3b230f, #050505)",
    color: "#f5b400",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    padding: "8px",
    flexShrink: 0,
  },
  meta: {
    color: "#aaa",
    fontSize: "13px",
  },
  unreadBadge: {
    display: "inline-block",
    marginTop: "8px",
    background: "#f5b400",
    color: "black",
    borderRadius: "999px",
    padding: "5px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  cooldown: {
    color: "#777",
    fontSize: "12px",
    marginTop: "8px",
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },
  smallButton: {
    border: "1px solid #333",
    background: "#1f1f1f",
    color: "white",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
  },
  dangerSmallButton: {
    border: "1px solid #7f1d1d",
    background: "#220808",
    color: "#fca5a5",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
  },
  booksTopGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "20px",
    marginBottom: "22px",
  },
  bookAddHero: {
    border: "1px solid rgba(245,180,0,0.35)",
    borderRadius: "24px",
    padding: "24px",
    background: "rgba(245,180,0,0.08)",
  },
  ownershipInfo: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
    background: "#070707",
    color: "#ddd",
    lineHeight: "1.7",
  },
  heroBadge: {
    display: "inline-block",
    background: "#f5b400",
    color: "black",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  heroBadgeGreen: {
    display: "inline-block",
    background: "#22c55e",
    color: "black",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  heroBadgeDisabled: {
    display: "inline-block",
    background: "#444",
    color: "#aaa",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    marginTop: "8px",
    marginBottom: "12px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "black",
    color: "white",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "110px",
    marginTop: "8px",
    marginBottom: "12px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "black",
    color: "white",
    boxSizing: "border-box",
  },
  primaryButton: {
    marginTop: "16px",
    background: "#f5b400",
    color: "black",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  successBox: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "12px",
    background: "#052e16",
    color: "#4ade80",
  },
  errorBox: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "12px",
    background: "#450a0a",
    color: "#f87171",
  },
  cardNoMargin: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
    background: "#070707",
  },
  bookList: {
    display: "grid",
    gap: "16px",
    marginTop: "14px",
  },
  bookCard: {
    display: "grid",
    gridTemplateColumns: "110px 1fr",
    gap: "18px",
    border: "1px solid #333",
    borderRadius: "20px",
    padding: "18px",
    background: "black",
  },
  bookCover: {
    height: "145px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #3b230f, #050505)",
    border: "1px solid #6d5015",
    color: "#f5b400",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    padding: "10px",
  },
  bookStatus: {
    display: "inline-block",
    background: "#052e16",
    color: "#4ade80",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  linkPrimary: {
    display: "inline-block",
    textDecoration: "none",
    background: "#f5b400",
    color: "black",
    borderRadius: "12px",
    padding: "11px 14px",
    fontWeight: "bold",
  },
  linkGreenButton: {
    background: "#166534",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  disabledButton: {
    background: "#333",
    color: "#999",
    border: "1px solid #444",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: "bold",
    cursor: "not-allowed",
  },
  notice: {
    border: "1px solid #333",
    borderRadius: "14px",
    padding: "14px",
    background: "black",
    marginTop: "10px",
    color: "#ddd",
  },
  profileGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },
  formCard: {
    border: "1px solid #333",
    borderRadius: "18px",
    padding: "18px",
    background: "black",
  },
  formCardWide: {
    gridColumn: "1 / -1",
    border: "1px solid #333",
    borderRadius: "18px",
    padding: "18px",
    background: "black",
  },
  label: {
    display: "block",
    color: "#ddd",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  languageRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "10px",
    alignItems: "start",
  },
  languageList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "10px",
  },
  languagePill: {
    background: "#f5b400",
    color: "black",
    borderRadius: "999px",
    padding: "7px 10px",
    fontWeight: "bold",
  },
  pillRemove: {
    marginLeft: "8px",
    border: "none",
    background: "transparent",
    color: "black",
    cursor: "pointer",
    fontWeight: "bold",
  },
  publisherStudioGrid: {
    display: "grid",
    gridTemplateColumns: "1.35fr 0.65fr",
    gap: "20px",
    alignItems: "start",
  },
  publisherApplyCard: {
    border: "1px solid rgba(245,180,0,0.35)",
    borderRadius: "24px",
    padding: "24px",
    background: "rgba(245,180,0,0.08)",
  },
  studioDisabledCard: {
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
    background: "#070707",
    opacity: 0.8,
  },
  studioActiveCard: {
    border: "1px solid rgba(34,197,94,0.35)",
    borderRadius: "24px",
    padding: "24px",
    background: "rgba(34,197,94,0.08)",
  },
  permanentFilesCard: {
    border: "1px solid rgba(34,197,94,0.35)",
    borderRadius: "24px",
    padding: "24px",
    background: "rgba(34,197,94,0.08)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },
  agreementBox: {
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "14px",
    background: "black",
    marginTop: "12px",
  },
  checkboxLabel: {
    display: "block",
    color: "#ddd",
    lineHeight: "1.6",
  },
  textButton: {
    marginTop: "10px",
    background: "transparent",
    border: "none",
    color: "#60a5fa",
    textDecoration: "underline",
    cursor: "pointer",
  },
  voiceBox: {
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "14px",
    background: "black",
    marginTop: "12px",
  },
  uploadButton: {
    border: "1px solid #333",
    background: "#1f1f1f",
    color: "white",
    borderRadius: "10px",
    padding: "8px 10px",
    cursor: "pointer",
    display: "inline-block",
  },
  filePreview: {
    border: "1px solid #333",
    background: "black",
    borderRadius: "16px",
    padding: "16px",
    marginTop: "14px",
    marginBottom: "14px",
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.82)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  modalContent: {
    maxWidth: "680px",
    width: "100%",
    background: "#111",
    border: "1px solid #333",
    borderRadius: "24px",
    padding: "24px",
  },
  agreementText: {
    border: "1px solid #333",
    borderRadius: "16px",
    padding: "18px",
    background: "black",
    color: "#f5b400",
    marginTop: "14px",
  },
};
