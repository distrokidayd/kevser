import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import Studio from "../../publishers/Studio";
import {publisherAccess} from "../../lib/publisherAccess";

export default async function Page({params}){
  const {lang}=await params;
  if(!await publisherAccess())redirect("/"+lang+"/profile?tab=publisher");
  const {userId}=await auth();
  const owner=process.env.KEVSER_BOOK_EDITOR_OWNER_ID||process.env.ADMIN_USER_ID;
  const target=process.env.KEVSER_BOOK_EDITOR_URL||"http://127.0.0.1:48762/";
  const link=userId&&userId===owner&&(target==="http://127.0.0.1:48762/"||target.startsWith("https://"))?target:null;
  return <Studio lang={lang} account={userId} ownerLink={link}/>;
}
