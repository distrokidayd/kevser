import {redirect} from "next/navigation";
export default async function Page({params}){const {lang}=await params;redirect("/"+lang+"/profile?tab=publisher")}
