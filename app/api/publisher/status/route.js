import {auth} from "@clerk/nextjs/server";
import {db,fail,isAdmin} from "../../../lib/publisherAccess";
export async function GET(){
  const {userId}=await auth();
  if(!userId)return fail("Oturum açmalısınız.",401);
  const client=db();
  const [app,profile]=await Promise.all([
    client.from("publisher_applications").select("id,status,admin_note,created_at,publisher_acceptances(application_id)").eq("user_id",userId).order("created_at",{ascending:false}).limit(1).maybeSingle(),
    client.from("profiles").select("role,is_publisher,publisher_status").eq("id",userId).maybeSingle()
  ]);
  if(app.error||profile.error)return fail("Başvuru durumu okunamadı.",503);
  const accepted=app.data?.publisher_acceptances;
  return Response.json({success:true,approved:isAdmin(userId)||Boolean(profile.data?.is_publisher||profile.data?.role==="publisher"),
    status:app.data?.status||profile.data?.publisher_status||"none",note:app.data?.admin_note||"",
    fileId:(Array.isArray(accepted)?accepted.length:accepted?.application_id)?app.data.id:null},{headers:{"Cache-Control":"private, no-store"}});
}
