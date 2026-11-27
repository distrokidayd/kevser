"use client";
import Link from "next/link";
import {useState} from "react";
import books from "../../lib/klasikler.json";
import styles from "./katalog.module.css";

export default function Katalog({lang}){
  const [query,setQuery]=useState("");
  const [language,setLanguage]=useState("");
  const norm=s=>s.toLocaleLowerCase("tr").normalize("NFD").replace(/\p{M}/gu,"").replaceAll("ı","i");
  const filtered=books.filter(b=>(!language||b.language===language)&&norm([b.title,b.author,b.original].join(" ")).includes(norm(query.trim())));
  return <main className={styles.page}><div className={styles.wrap}>
    <header className={styles.hero}><div><h1>Klasikler kitaplığı</h1><p>Ömer Hayyam’dan Dante’ye, şiir ve düşünce eserleri.</p></div>
    <div className={styles.actions}><Link href={`/${lang}/books/omerhayyam/rubailer`}>Rubailer · Tahlil ve tartışma</Link><Link href={`/${lang}/books/translation-pool`}>Çeviri defteri</Link></div></header>
    <div className={styles.filters}><label>Kitap veya yazar ara<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Eser adı, yazar…"/></label>
    <label>Baskı dili<select value={language} onChange={e=>setLanguage(e.target.value)}><option value="">Bütün diller</option><option value="en">İngilizce</option><option value="it">İtalyanca</option></select></label><span role="status">{filtered.length} eser</span></div>
    {!filtered.length&&<p>Bu aramayla eşleşen eser bulunamadı.</p>}
    <section className={styles.grid}>{filtered.map(b=><article key={b.id} className={styles.card}>
      <Link href={`/${lang}/books/oku/${b.id}`} aria-label={b.title+" kitabını aç"}><img src={`/eserler/${b.cover}`} alt="" loading="lazy"/></Link>
      <div><small>{b.language==="it"?"İtalyanca":"İngilizce"} · EPUB</small><h2><Link href={`/${lang}/books/oku/${b.id}`}>{b.title}</Link></h2><p>{b.author}</p>
      <div className={styles.links}><Link href={`/${lang}/books/oku/${b.id}`}>Oku →</Link><a href={`/eserler/${b.id}.epub`} download>EPUB indir</a></div></div>
    </article>)}</section></div></main>
}
