import {auth} from "@clerk/nextjs/server";
import {db,fail,isAdmin} from "../../../../lib/publisherAccess";
export async function GET(req,{params}){
  const {userId}=await auth();
  if(!userId)return fail("Oturum açmalısınız.",401);
  const {id}=await params;
  if(!/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(id))return fail("Dosya bulunamadı.",404);
  const client=db();
  let q=client.from("publisher_applications").select("id").eq("id",id);
  if(!isAdmin(userId))q=q.eq("user_id",userId);
  const app=await q.maybeSingle();
  if(app.error)return fail("Başvuru okunamadı.",503);
  if(!app.data)return fail("Dosya bulunamadı.",404);
  const audio=new URL(req.url).searchParams.get("file")==="voice";
  const {data,error}=await client.from("publisher_acceptances").select(audio?"audio_type,audio_bytes":"agreement_text").eq("application_id",id).maybeSingle();
  if(error)return fail("Kayıt okunamadı.",503);
  if(!data)return fail("Bu başvuruda kalıcı kabul dosyası yok.",404);
  const headers={"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"};
  if(!audio)return new Response(data.agreement_text,{headers:{...headers,"Content-Type":"text/plain; charset=utf-8"}});
  return new Response(Buffer.from(data.audio_bytes.slice(2),"hex"),{headers:{...headers,"Content-Type":data.audio_type}});
}
