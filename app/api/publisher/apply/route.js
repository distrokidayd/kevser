import {auth} from "@clerk/nextjs/server";
import {db,fail} from "../../../lib/publisherAccess";

const audioTypes=new Set(["audio/mpeg","audio/mp3","audio/mp4","audio/x-m4a","audio/wav","audio/x-wav","audio/webm","audio/ogg"]);
export async function POST(req){
  const {userId}=await auth();
  if(!userId)return fail("Oturum açmalısınız.",401);
  let parts;
  try { parts=await req.formData(); } catch {return fail("Başvuru formunu yeniden açın.",400)}
  const form={};
  for(const field of ["fullName","email","phone","website","socialLinks","experience","reason","agreement"]){
    form[field]=String(parts.get(field)||"");
    if(form[field].length>60000)return fail("Form alanı çok uzun.",400);
  }
  if(!form.fullName.trim()||!form.email.trim()||!form.reason.trim()||parts.get("accepted")!=="yes")return fail("Başvuru bilgilerini ve sözleşme kabulünü tamamlayın.",400);
  const file=parts.get("voice");
  if(!file||typeof file.arrayBuffer!=="function"||!audioTypes.has(file.type)||!file.size||file.size>3145728)return fail("En çok 3 MB boyutunda MP3, M4A, WAV, OGG veya WebM ses dosyası seçin.",400);
  const {data,error}=await db().rpc("kevser_submit_publisher",{member:userId,form,audio:Buffer.from(await file.arrayBuffer()).toString("base64"),mime:file.type});
  if(error)return fail(error.code==="P0001"?error.message:"Başvuru kaydedilemedi.",error.code==="P0001"?409:503);
  return Response.json({success:true,id:data});
}
