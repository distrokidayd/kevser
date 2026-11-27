import {auth} from "@clerk/nextjs/server";
import {db,fail,isAdmin} from "../../../lib/publisherAccess";
export async function GET(){
  const {userId}=await auth();
  if(!isAdmin(userId))return fail("Yönetici erişimi gerekiyor.",403);
  const {data,error}=await db().from("publisher_applications").select("*,publisher_acceptances(application_id)").order("created_at",{ascending:false});
  if(error)return fail("Başvuru listesi okunamadı.",503);
  return Response.json({success:true,applications:data},{headers:{"Cache-Control":"private, no-store"}});
}
