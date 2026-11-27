import JSZip from "jszip";

const all=(root,name)=>Array.from(root.getElementsByTagNameNS("*",name));
function parse(text){
  const doc=new DOMParser().parseFromString(text,"application/xml");
  if(all(doc,"parsererror").length)throw Error("Kitabın XML yapısı okunamadı.");
  return doc;
}
function resolve(base,href){
  const u=new URL(href,"https://kitap.invalid/"+base);
  if(u.origin!=="https://kitap.invalid")throw Error("Harici EPUB bileşeni desteklenmiyor.");
  return decodeURIComponent(u.pathname.slice(1));
}
function serialize(doc){return new XMLSerializer().serializeToString(doc)}
export async function openEpub(file){
  const zip=await JSZip.loadAsync(file);
  async function xml(path){
    const item=zip.file(path);
    if(!item||item.dir)throw Error("EPUB bileşeni eksik: "+path);
    return parse(await item.async("string"));
  }
  const container=await xml("META-INF/container.xml");
  const path=all(container,"rootfile")[0]?.getAttribute("full-path");
  if(!path)throw Error("EPUB paket dizini bulunamadı.");
  const pkg=await xml(path);
  const metadata=all(pkg,"metadata")[0];
  const title=all(metadata,"title")[0];
  if(!title)throw Error("Kitap adı bulunamadı.");
  const items=new Map(all(pkg,"item").map(n=>[n.getAttribute("id"),n]));
  const nav=Array.from(items.values()).find(n=>(n.getAttribute("properties")||"").split(/\s+/).includes("nav"));
  const ncx=items.get(all(pkg,"spine")[0]?.getAttribute("toc"));
  const labels=new Map();
  if(nav||ncx){
    const tocPath=resolve(path,(nav||ncx).getAttribute("href"));
    const toc=await xml(tocPath);
    const links=nav?all(toc,"a").map(a=>[a.getAttribute("href"),a.textContent]):all(toc,"navPoint").map(n=>[all(n,"content")[0]?.getAttribute("src"),all(n,"text")[0]?.textContent]);
    for(const [href,label] of links)if(href&&label&&!/^\w+:/.test(href)){const key=resolve(tocPath,href);if(!labels.has(key))labels.set(key,label.trim())}
  }
  const chapters=[];
  for(const ref of all(pkg,"itemref")){
    const item=items.get(ref.getAttribute("idref"));
    if(item?.getAttribute("media-type")!=="application/xhtml+xml")continue;
    const name=resolve(path,item.getAttribute("href"));
    chapters.push({name,label:labels.get(name)||"Bölüm "+(chapters.length+1)});
  }
  if(!chapters.length)throw Error("Düzenlenebilir XHTML bölümü bulunamadı.");
  const docs=new Map(),changed=new Set();
  return {
    title:title.textContent, chapters, filename:file.name||"Kevser.epub",
    async chapter(index){
      const {name}=chapters[index];let doc=docs.get(name);
      if(!doc){doc=await xml(name);docs.set(name,doc)}
      const body=all(doc,"body")[0];
      if(!body)return [];
      const walker=doc.createTreeWalker(body,NodeFilter.SHOW_TEXT);
      const blocks=[];let node;let previous;
      while((node=walker.nextNode())){
        if(!node.textContent.trim()||node.parentElement?.closest("script, style, svg, math"))continue;
        const parent=node.parentElement?.closest("p, pre, blockquote, li, td, th, figcaption, h1, h2, h3, h4, h5, h6, div")||node.parentElement;
        if(previous!==parent){blocks.push({heading:/^h[1-6]$/.test(parent?.localName),parts:[]});previous=parent}
        const target=node;
        blocks.at(-1).parts.push({value:target.nodeValue,set(value){target.nodeValue=value;this.value=value;changed.add(name)}});
      }
      return blocks;
    },
    async output(newTitle){
      if(!newTitle.trim())throw Error("Kitap adı boş olamaz.");
      title.textContent=newTitle.trim();
      const modified=all(metadata,"meta").find(n=>n.getAttribute("property")==="dcterms:modified");
      if(modified)modified.textContent=new Date().toISOString().replace(/\.\d{3}Z$/,"Z");
      const next=new JSZip();
      next.file("mimetype","application/epub+zip",{compression:"STORE"});
      for(const [name,entry] of Object.entries(zip.files)){
        if(entry.dir||name==="mimetype")continue;
        const bytes=name===path?serialize(pkg):changed.has(name)?serialize(docs.get(name)):await entry.async("uint8array");
        next.file(name,bytes,{createFolders:false});
      }
      return next.generateAsync({type:"blob",mimeType:"application/epub+zip",compression:"DEFLATE"});
    }
  };
}
