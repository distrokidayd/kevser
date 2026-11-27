import {auth} from "@clerk/nextjs/server";
import {db,fail,isAdmin} from "../../../lib/publisherAccess";
export async function POST(req){
  const {userId}=await auth();
  if(!isAdmin(userId))return fail("Yönetici erişimi gerekiyor.",403);
  const body=await req.json().catch(()=>({}));
  const decision=body.decision??body.action;
  if(!body.applicationId||!["approve","reject"].includes(decision))return fail("Geçersiz başvuru veya karar.",400);
  const note=String(body.adminNote||"").trim();
  const {data,error}=await db().rpc("kevser_review_publisher",{application:body.applicationId,reviewer:userId,decision,note});
  if(error)return fail(error.code==="P0001"?error.message:"Karar kaydedilemedi.",error.code==="P0001"?409:400);
  return Response.json({success:true,status:data});
}
