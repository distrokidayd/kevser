"use client";
import {useEffect,useState} from "react";
import books from "../../../lib/klasikler.json";
import styles from "../katalog.module.css";
const empty={book:"246",section:"",language:"Türkçe",source:"",translation:"",note:""};
export default function Ceviri(){
 const [draft,setDraft]=useState(empty),[status,setStatus]=useState("");
 useEffect(()=>{try{const old=JSON.parse(localStorage.getItem("kevser-ceviri-defteri"));if(old&&books.some(b=>b.id===old.book))setDraft({...empty,...old})}catch{}},[]);
 function field(key,value){setDraft({...draft,[key]:value});setStatus("Kaydedilmemiş değişiklik");}
 function save(){try{localStorage.setItem("kevser-ceviri-defteri",JSON.stringify(draft));setStatus("Taslak bu cihazda kaydedildi.")}catch{setStatus("Tarayıcıya kaydedilemedi. Metni indirebilirsiniz.")}}
 function download(){const title=books.find(b=>b.id===draft.book).title;
 const body=[title,draft.section,draft.language,"Kaynak metin",draft.source,"Çeviri",draft.translation,"Çevirmen notu",draft.note].join("\n\n");
 const url=URL.createObjectURL(new Blob([body],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="Kevser-ceviri-"+draft.book+".txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 return <main className={styles.page}><section className={styles.reader}><a href="../books">← Kitaplığa dön</a><h1>Çeviri defteri</h1><p>Bir eserden seçtiğin bölümü ve çevirini bu cihazda taslak olarak saklayabilirsin.</p>
 <label>Eser<select value={draft.book} onChange={e=>field("book",e.target.value)}>{books.map(b=><option key={b.id} value={b.id}>{b.title} · {b.author}</option>)}</select></label>
 <div className={styles.filters}><label>Bölüm veya sayfa<input value={draft.section} onChange={e=>field("section",e.target.value)}/></label><label>Çeviri dili<input value={draft.language} onChange={e=>field("language",e.target.value)}/></label></div>
 {[["source","Kaynak metin"],["translation","Çevirim"],["note","Çevirmen notu"]].map(([key,label])=><label key={key}>{label}<textarea rows={key==="note"?3:6} value={draft[key]} onChange={e=>field(key,e.target.value)}/></label>)}
 <div className={styles.filters}><button onClick={save}>Taslağı kaydet</button><button onClick={download}>Metni indir</button><span role="status">{status}</span></div></section></main>
}
