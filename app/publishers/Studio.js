"use client";
import {useEffect,useRef,useState} from "react";
import books from "../lib/klasikler.json";
import EpubDesk from "./EpubDesk";
import s from "./studio.module.css";

const menus=[["desk","Çalışma masası"],["pool","Havuz"],["earn","Gelirler"],["profile","Profil ve dosyalar"]];
function dateText(ms){return new Date(ms).toLocaleDateString("tr-TR")}
export default function Studio({lang="tr",account,ownerLink=null,demo=false}){
 const [tab,tabTo]=useState("desk"),[query,setQuery]=useState(""),[request,setRequest]=useState(null),[job,setJob]=useState(null),[stored,setStored]=useState(false),[notice,say]=useState(""),[reports,setReports]=useState(null),[poolError,setPoolError]=useState(""),[voting,voteFor]=useState(null);
 const desk=useRef(null),dirty=useRef(false),pending=useRef(false);
 const key="kevser-studio-work:"+account;
 useEffect(()=>{try{const j=JSON.parse(localStorage.getItem(key));if(j&&books.some(b=>b.id===j.id)&&Number.isFinite(j.start))setJob(j)}catch{}setStored(true)},[key]);
 function remember(j){try{if(j)localStorage.setItem(key,JSON.stringify(j));else localStorage.removeItem(key);setJob(j)}catch{say("Tarayıcı çalışma kaydını saklayamadı.")}}
 function choose(item){if(dirty.current&&!confirm("İndirilmemiş düzenlemeler var. Başka bir kitap açılsın mı?"))return;setRequest({...item});tabTo("desk");requestAnimationFrame(()=>desk.current?.scrollIntoView({behavior:"smooth",block:"start"}))}
 async function refresh(){
   if(demo)return;
   setPoolError("");setReports(null);
   try{const r=await fetch("/api/get-reports",{cache:"no-store"}),d=await r.json();if(!r.ok||!d.success)throw Error(d.error||"Havuz okunamadı.");setReports(d.reports||[])}catch(e){setPoolError(e.message)}
 }
 useEffect(()=>{if(tab==="pool")refresh()},[tab]);
 async function vote(id,decision){if(pending.current)return;pending.current=true;voteFor(id);
 try{const r=await fetch("/api/vote-report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reportId:id,decision})}),d=await r.json();if(!r.ok||!d.success)throw Error(d.error||"Oy kaydedilemedi.");await refresh();say("Oy kaydedildi.")}catch(e){say(e.message)}finally{voteFor(null);pending.current=false}}
 const normalize=t=>t.toLocaleLowerCase("tr").normalize("NFD").replace(/\p{M}/gu,"").replaceAll("ı","i");
 const filtered=books.filter(b=>normalize(b.title+" "+b.author+" "+b.original).includes(normalize(query)));
 const current=books.find(b=>b.id===job?.id),days=job?.extended?20:15;
 function start(b){if(job&&!confirm("Bu cihazdaki mevcut çalışma planını değiştirmek istiyor musun?"))return;
 remember({id:b.id,start:Date.now(),extended:false});say("Bu cihazda 15 günlük çalışma planı başladı.")}
 return <main className={s.shell}><aside className={s.rail}><div className={s.brand}><b>K</b><span>Kevser<small>YAYIN EVİ</small></span></div><nav aria-label="Stüdyo">{menus.map(([id,name])=><button key={id} aria-current={tab===id?"page":undefined} onClick={()=>tabTo(id)}>{name}</button>)}</nav><a href={`/${lang}/books`}>Kitaplığa dön ↗</a></aside>
 <div className={s.content}><header className={s.head}><div><p className={s.kicker}>Kevser Yayın Evi</p><h1>Yayıncı stüdyosu</h1></div>{ownerLink&&<a className={s.secondary} href={ownerLink} target="_blank" rel="noreferrer">Kitabımı düzenle ↗</a>}</header>
 {notice&&<p className={s.notice} role="status">{notice}</p>}
 <div hidden={tab!=="desk"}>
 <section className={s.feature}><div><p className={s.kicker}>{current?"Bu cihazdaki çalışmam":"Geleneksel eserler"}</p><h2>{current?.title||"Rubailer"}</h2><p>{current?.author||"Ömer Hayyam"} · {(current?.language||"en")==="it"?"İtalyanca":"İngilizce"} baskı</p>
 {current&&<p>Çalışma bitişi · {dateText(job.start+days*86400000)}</p>}
 <div className={s.buttons}><button className={s.gold} onClick={()=>choose({record:current||books[0]})}>Çalışma masasında aç →</button>{current&&!job.extended&&<button onClick={()=>remember({...job,extended:true})}>5 gün uzat</button>}{current&&<button onClick={()=>{if(confirm("Çalışma planı tamamlansın mı?"))remember(null)}}>Planı tamamla</button>}</div></div><img src={"/eserler/"+(current||books[0]).cover} alt={(current?.title||"Rubailer")+" kitap kapağı"}/></section>
 <section className={s.panel}><div className={s.row}><h2>Eser seçimi</h2><input type="search" aria-label="Eser veya yazar ara" value={query} placeholder="Eser veya yazar ara" onChange={e=>setQuery(e.target.value)}/></div>
 <div className={s.shelf}>{filtered.map(b=><div key={b.id} className={s.book}><img src={"/eserler/"+b.cover} alt="" loading="lazy"/><div><strong>{b.title}</strong><small>{b.author}</small><div className={s.links}><button onClick={()=>choose({record:b})}>Aç</button><button disabled={!stored} onClick={()=>start(b)}>Plana al</button></div></div></div>)}</div>{!filtered.length&&<p>Eşleşen eser bulunamadı.</p>}</section>
 <div ref={desk}><EpubDesk request={request} dirtyRef={dirty} choose={choose}/></div></div>
 {tab==="pool"&&<section className={s.panel}><div className={s.row}><h2>Şikâyet havuzu</h2>{!demo&&<button onClick={refresh}>Yenile</button>}</div>{demo?<p>Şikâyet kayıtları yalnızca yetkili yayıncı oturumunda gösterilir.</p>:poolError?<p role="alert">{poolError}</p>:reports===null?<p>Havuz yükleniyor…</p>:!reports.length?<p>Havuzda kayıt yok.</p>:reports.map(r=><article className={s.report} key={r.id}><strong>{r.reason||"Şikâyet"}</strong><p>{r.status||"pending"} · {dateText(r.created_at)}</p><p>Onay {(r.publisher_votes||[]).filter(v=>v.decision==="approve").length} · Ret {(r.publisher_votes||[]).filter(v=>v.decision==="reject").length}</p>{(!r.status||r.status==="pending")&&<div className={s.buttons}><button disabled={voting!==null} onClick={()=>vote(r.id,"approve")}>Onayla</button><button disabled={voting!==null} onClick={()=>vote(r.id,"reject")}>Reddet</button></div>}</article>)}</section>}
 {tab==="earn"&&<section className={s.panel}><h2>Gelirler</h2><p>Hakediş hesabı henüz bağlı değil. Yorumlu baskılardan ayrılacak katkı paylarının burada izlenmesi planlanıyor.</p></section>}
 {tab==="profile"&&<section className={s.panel}><h2>Profil ve kalıcı dosyalar</h2><p>Yayıncı başvurun, kabul ettiğin sözleşme ve ses kaydın profilinde bulunur.</p><a href={`/${lang}/profile?tab=publisher`}>Yayıncı profilini aç →</a></section>}
 </div></main>
}
