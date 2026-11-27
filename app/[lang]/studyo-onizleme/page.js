import {notFound} from "next/navigation";
import Studio from "../../publishers/Studio";
export default async function Page({params}){
  if(process.env.VERCEL_ENV!=="preview"&&process.env.NODE_ENV!=="development")notFound();
  const {lang}=await params;
  return <Studio lang={lang} account="tasarim-onizlemesi" demo/>;
}
