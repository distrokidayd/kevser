import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function KitapEditoru() {
  const { userId } = await auth();
  const owner = process.env.KEVSER_BOOK_EDITOR_OWNER_ID || process.env.ADMIN_USER_ID;
  if (!owner || !userId || userId !== owner) notFound();
  const local = "http://127.0.0.1:48762/";
  const href = process.env.KEVSER_BOOK_EDITOR_URL || local;
  if (href !== local && !href.startsWith("https://")) notFound();

  return (
    <main style={{background:"#f6f4ee",color:"#283c32",minHeight:"75vh",padding:"8vh 7vw"}}>
      <section style={{maxWidth:660,margin:"0 auto",background:"#fff",padding:"clamp(24px,5vw,58px)",borderTop:"4px solid #9f8050"}}>
        <p>Kevser Yayın Evi · Yazar stüdyosu</p>
        <h1 style={{fontFamily:"Georgia,serif",fontSize:"2.4rem"}}>Kitabımı düzenle</h1>
        <p>Gönderilerini, ayet işaretlerini ve ön sözü düzenleyebilir, bir EPUB dosyasını açıp okuyabilirsin.</p>
        {href === local && <p>Bu bilgisayarda <strong>Kitabimi Duzenle.cmd</strong> dosyasını çalıştırdıktan sonra editörü aç.</p>}
        <a href={href} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"12px 20px",background:"#294f42",color:"white",borderRadius:6}}>Kitap editörünü aç ↗</a>
      </section>
    </main>
  );
}
