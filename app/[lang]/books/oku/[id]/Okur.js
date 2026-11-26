"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import styles from "../../katalog.module.css";

const elements=(root,name)=>Array.from(root.getElementsByTagNameNS("*",name));
const xml=s=>new DOMParser().parseFromString(s,"application/xml");
function pathFrom(base,href){
  const url=new URL(href,"https://epub.invalid/"+base);
  return decodeURIComponent(url.pathname.slice(1));
}
function plain(body){
  const lines=[];
  const breaks=new Set(["p","div","section","article","li","tr","h1","h2","h3","h4","h5","h6","blockquote","pre"]);
  function walk(node){
    if(node.nodeType===3){lines.push(node.nodeValue);return}
    const tag=node.localName;
    if(tag==="script"||tag==="style")return;
    if(tag==="br"){lines.push("\n");return}
    if(breaks.has(tag))lines.push("\n");
    for(const child of node.childNodes)walk(child);
    if(breaks.has(tag))lines.push("\n");
  }
  walk(body);return lines.join("").replace(/\r/g,"").replace(/\n[ \t]+\n/g,"\n\n").replace(/\n{3,}/g,"\n\n").trim();
}
async function parseBook(buffer){
  const {default:JSZip}=await import("jszip");
  const zip=await JSZip.loadAsync(buffer);
  const entry=async path=>{const item=zip.file(path);if(!item)throw Error("EPUB bölümü bulunamadı.");return xml(await item.async("string"))};
  const container=await entry("META-INF/container.xml");
  const opf=elements(container,"rootfile")[0].getAttribute("full-path");
  const pkg=await entry(opf);
  const files=new Map(elements(pkg,"item").map(i=>[i.id||i.getAttribute("id"),pathFrom(opf,i.getAttribute("href"))]));
  const ncx=files.get(elements(pkg,"spine")[0]?.getAttribute("toc"));
  const labels=new Map();
  if(ncx){for(const nav of elements(await entry(ncx),"navPoint")){
    const src=elements(nav,"content")[0]?.getAttribute("src");
    if(src){const path=pathFrom(ncx,src);if(!labels.has(path))labels.set(path,elements(nav,"text")[0]?.textContent?.trim())}
  }}
  const pages=[];
  for(const item of elements(pkg,"itemref")){
    const path=files.get(item.getAttribute("idref"));if(!path)continue;
    const doc=await entry(path),body=elements(doc,"body")[0];if(!body)continue;
    const text=plain(body);if(!text)continue;
    const heading=elements(body,"h1")[0]||elements(body,"h2")[0];
    pages.push({text,title:(labels.get(path)||heading?.textContent?.trim()||("Bölüm "+(pages.length+1))).slice(0,120)});
  }
  if(!pages.length)throw Error("Okunabilir bölüm bulunamadı.");
  return pages;
}
export default function Okur({book,lang}){
  const [pages,setPages]=useState([]),[pos,setPos]=useState(0),[error,setError]=useState("");
  useEffect(()=>{const controller=new AbortController();let active=true;
    (async()=>{const response=await fetch("/eserler/"+book.id+".epub",{signal:controller.signal});
      if(!response.ok)throw Error("Dosya açılamadı.");const result=await parseBook(await response.arrayBuffer());
      if(active){let saved=0;try{saved=Number(localStorage.getItem("kevser-sayfa-"+book.id))||0}catch{}
        setPos(Math.max(0,Math.min(result.length-1,saved)));setPages(result)}
    })().catch(e=>{if(active)setError(e.message)});return()=>{active=false;controller.abort()}
  },[book.id]);
  function go(n){setPos(n);try{localStorage.setItem("kevser-sayfa-"+book.id,String(n))}catch{}}
  return <main className={styles.page}><div className={styles.reader}><Link href={`/${lang}/books`}>← Kitaplığa dön</Link>
    <header><h1>{book.title}</h1><p>{book.author} · {book.language==="it"?"İtalyanca":"İngilizce"}</p></header>
    <div className={styles.links}><a href={`/eserler/${book.id}.epub`} download>EPUB indir</a><a href={book.source}>Kaynak kaydı ↗</a><a href={book.edition}>Baskı kaydı ↗</a></div>
    <details><summary>Baskı bilgisi</summary><p>{book.original}</p><p>Bu dosya Project Gutenberg metninin GITenberg EPUB baskısıdır. Kaynak kaydındaki hak bilgisi: {book.rights}</p></details>
    {error?<p role="alert">{error} Yukarıdaki EPUB bağlantısını kullanabilirsin.</p>:!pages.length?<p role="status">Kitap açılıyor…</p>:<>
    <div className={styles.filters}><button disabled={!pos} onClick={()=>go(pos-1)}>← Önceki</button><label>Bölüm<select value={pos} onChange={e=>go(+e.target.value)}>{pages.map((p,i)=><option key={i} value={i}>{i+1} · {p.title}</option>)}</select></label><button disabled={pos===pages.length-1} onClick={()=>go(pos+1)}>Sonraki →</button></div>
    <article className={styles.paper} lang={book.language}><pre>{pages[pos].text}</pre></article></>}
  </div></main>
}
