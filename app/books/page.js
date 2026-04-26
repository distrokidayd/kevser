"use client";

import { useState } from "react";

export default function BooksPage() {
  const [expandedBooksCard, setExpandedBooksCard] = useState(null);

  const books = [
    { title: "Rubailer", author: "Ömer Hayyam", href: "/books/omerhayyam/rubailer" },
    { title: "Mesnevi Seçmeleri", author: "Mevlânâ", href: "#" },
    { title: "Gülistan", author: "Sadi Şirazi", href: "#" },
    { title: "Bostan", author: "Sadi Şirazi", href: "#" },
    { title: "Divan", author: "Yunus Emre", href: "#" },
    { title: "Leyla ile Mecnun", author: "Fuzuli", href: "#" }
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="overflow-hidden border-b border-amber-400/20 bg-amber-400/10">
        <div className="marquee py-3 text-sm font-semibold text-amber-300">
          <span>
            Kitap artık seninle okunsun • Şerh / Yorum / Tartışma alanına katılmak için kitap görseline tıkla • Okuduğun kitabın yorumlu baskısına katkı ver • Klasik eserleri birlikte yeniden düşünelim • Çeviri katkını yayıncı havuzuna gönder •
          </span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-7">
          <div className="text-sm uppercase tracking-[0.35em] text-amber-300">
            Kevser Books
          </div>
          <h1 className="mt-3 text-4xl font-semibold">Books</h1>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
          <div className={`grid gap-6 ${expandedBooksCard ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-6"}`}>

            {(!expandedBooksCard || expandedBooksCard === "translation") && (
              <div className={`rounded-[1.5rem] border border-amber-400/20 bg-[#111] p-3 ${expandedBooksCard ? "col-span-full" : ""}`}>
                {!expandedBooksCard && (
                  <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-[1.2rem] bg-gradient-to-br from-amber-800 to-black text-center">
                    <div className="text-xs uppercase tracking-[0.3em] text-amber-300">
                      Katkı
                    </div>
                    <div className="mt-3 text-xl font-bold">Çeviri</div>
                    <button
                      onClick={() => setExpandedBooksCard("translation")}
                      className="mt-5 rounded-lg border border-blue-400 px-4 py-2 text-xs font-semibold text-blue-300"
                    >
                      Aç
                    </button>
                  </div>
                )}

                {expandedBooksCard === "translation" && (
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm uppercase tracking-[0.3em] text-amber-300">
                          Books Katkı Kartı
                        </div>
                        <h2 className="mt-3 text-3xl font-semibold">
                          Çeviri Katkısı Gönder
                        </h2>
                      </div>

                      <button
                        onClick={() => setExpandedBooksCard(null)}
                        className="rounded-xl border border-blue-500/40 px-4 py-2 text-sm font-semibold text-blue-300"
                      >
                        Sayfayı Küçült
                      </button>
                    </div>

                    <div className="mt-6 rounded-[1.3rem] bg-white p-6 text-black">
                      <label className="text-sm font-semibold">
                        Çevirisine katkıda bulunmak istediğin kitabı seç
                      </label>

                      <select className="mt-2 w-full rounded-xl border border-black/10 p-3">
                        {books.map((book) => (
                          <option key={book.title}>
                            {book.author} — {book.title}
                          </option>
                        ))}
                      </select>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-sm font-semibold">Sayfa No</label>
                          <input className="mt-2 w-full rounded-xl border border-black/10 p-3" placeholder="Örn: 42" />
                        </div>

                        <div>
                          <label className="text-sm font-semibold">Dil</label>
                          <input className="mt-2 w-full rounded-xl border border-black/10 p-3" placeholder="TR / EN / FR" />
                        </div>
                      </div>

                      <label className="mt-4 block text-sm font-semibold">
                        Orijinal Metin
                      </label>
                      <textarea className="mt-2 h-24 w-full rounded-xl border border-black/10 p-3" placeholder="Orijinal cümle veya paragraf..." />

                      <label className="mt-4 block text-sm font-semibold">
                        Kendi Çeviri Önerin
                      </label>
                      <textarea className="mt-2 h-28 w-full rounded-xl border border-black/10 p-3" placeholder="Daha iyi olduğunu düşündüğün çeviri..." />

                      <label className="mt-4 block text-sm font-semibold">
                        Not
                      </label>
                      <textarea className="mt-2 h-20 w-full rounded-xl border border-black/10 p-3" placeholder="Bu çeviriyi neden öneriyorsun?" />

                      <button className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white">
                        Yayıncı Havuzuna Gönder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!expandedBooksCard && books.map((book) => (
              <a
                key={book.title}
                href={book.href}
                className="rounded-[1.5rem] border border-white/10 bg-[#111] p-3 text-white no-underline"
              >
                <div className="flex aspect-[3/4] items-center justify-center rounded-[1.2rem] bg-gradient-to-br from-amber-950 to-black p-4 text-center font-semibold">
                  {book.title}
                </div>
                <div className="mt-3 text-sm font-semibold">{book.title}</div>
                <div className="text-xs text-zinc-400">{book.author}</div>
              </a>
            ))}
          </div>
        </section>
      </section>

      <style jsx>{`
        .marquee {
          white-space: nowrap;
          overflow: hidden;
        }

        .marquee span {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 22s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </main>
  );
}
