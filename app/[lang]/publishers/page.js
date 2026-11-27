import Studio from "../../publishers/page";
import {publisherAccess} from "../../lib/publisherAccess";
import {redirect} from "next/navigation";
export default async function Page({params}){
  const {lang}=await params;
  if(!await publisherAccess())redirect("/"+lang+"/profile?tab=publisher");
  return <Studio/>;
}
