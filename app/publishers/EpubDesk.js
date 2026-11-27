"use client";
import {useEffect,useRef,useState} from "react";
import s from "./studio.module.css";

export default function EpubDesk({request,choose,dirtyRef}){
 const [book,setBook]=useState(null),[title,setTitle]=useState(""),[index,setIndex]=useState(0),[blocks,setBlocks]=useState([]),[page,setPage]=useState(0),[selected,setSelected]=useState(null),[values,setValues]=useState([]),[message,setMessage]=useState(""),[busy,setBusy]=useState(false),[revision,update]=useState(0);
 const loader=useRef(0),section=useRef(0);
 async function load(filePromise){
   const serial=++loader.current;section.current++;setBusy(true);setMessage("Kitap açılıyor…");
   try{const {openEpub}=await import("../lib/studioEpub");const next=await openEpub(await filePromise());const content=await next.chapter(0);
     if(serial!==loader.current)return;
     setBook(next);setTitle(next.title);setIndex(0);setBlocks(content);setPage(0);setSelected(null);dirtyRef.current=false;setMessage("");
   }catch(e){if(serial===loader.current)setMessage(e.message||"EPUB açılamadı.")}
   finally{if(serial===loader.current)setBusy(false)}
 }
 useEffect(()=>{if(request)load(async()=>{
   if(request.file)return request.file;
   const res=await fetch("/eserler/"+request.record.id+".epub");if(!res.ok)throw Error("Katalog dosyası açılamadı.");
   return new File([await res.blob()],request.record.id+".epub")
 })},[request]);
 useEffect(()=>{const guard=e=>{if(dirtyRef.current){e.preventDefault();e.returnValue=""}};window.addEventListener("beforeunload",guard);return()=>window.removeEventListener("beforeunload",guard)},[dirtyRef]);
 async function go(n){const seq=++section.current;try{const next=await book.chapter(n);if(seq!==section.current)return;setBlocks(next);setIndex(n);setPage(0);setSelected(null)}catch(e){setMessage(e.message)}}
 function select(i){setSelected(i);setValues(blocks[i].parts.map(p=>p.value))}
 function apply(){blocks[selected].parts.forEach((p,i)=>p.set(values[i]));dirtyRef.current=true;setSelected(null);update(revision+1);setMessage("Düzeltme baskı kopyasına işlendi.")}
 async function download(){try{setBusy(true);const blob=await book.output(title);const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=book.filename.replace(/\.epub$/i,"")+"-duzenlenmis.epub";a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);dirtyRef.current=false;setMessage("Düzenlenmiş EPUB indirildi.")}catch(e){setMessage(e.message)}finally{setBusy(false)}}
 return <section className={s.panel}><div className={s.row}><h2>EPUB çalışma masası</h2><label className={s.secondary}>Dosya aç<input type="file" accept=".epub,application/epub+zip" className={s.file} disabled={busy||selected!==null} onChange={e=>{const file=e.target.files[0];e.target.value="";if(file)choose({file})}}/></label></div>
 {message&&<p role="status">{message}</p>}
 {!book?<p>Katalogdan bir eser seçebilir veya bilgisayarından EPUB açabilirsin. Düzenlemeler indirdiğin kopyaya yazılır.</p>:<>
 <label>Kitap adı<input value={title} disabled={busy} onChange={e=>{setTitle(e.target.value);dirtyRef.current=true}}/></label>
 <div className={s.controls}><label>Bölüm<select value={index} disabled={busy||selected!==null} onChange={e=>go(+e.target.value)}>{book.chapters.map((c,i)=><option key={i} value={i}>{i+1} · {c.label}</option>)}</select></label><button className={s.primary} disabled={busy||selected!==null} onClick={download}>EPUB kopyasını indir</button></div>
 <div className={s.paper}><p className={s.kicker}>{book.chapters[index].label}</p>
 {!blocks.length&&<p>Bu sayfada düzenlenebilir metin yok.</p>}
 {blocks.slice(page*24,page*24+24).map((b,j)=>{const i=page*24+j;return selected===i?<div key={i}>{values.map((v,k)=><label key={k}>Metin{values.length>1?" · "+(k+1):""}<textarea value={v} onChange={e=>{const text=e.target.value;dirtyRef.current=true;setValues(prev=>prev.map((old,n)=>n===k?text:old))}}/></label>)}<button onClick={apply}>Düzeltmeyi uygula</button> <button onClick={()=>setSelected(null)}>Vazgeç</button></div>:<button className={b.heading?s.headingLine:s.line} key={i} disabled={busy||selected!==null} title="Metni düzenle" onClick={()=>select(i)}>{b.parts.map(p=>p.value).join("")}</button>})}</div>
 {blocks.length>24&&<div className={s.row}><button disabled={!page||selected!==null} onClick={()=>setPage(page-1)}>← Önceki metinler</button><span>{page+1} / {Math.ceil(blocks.length/24)}</span><button disabled={(page+1)*24>=blocks.length||selected!==null} onClick={()=>setPage(page+1)}>Sonraki metinler →</button></div>}
 </>}</section>
}
