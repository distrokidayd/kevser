import {notFound} from "next/navigation";
import books from "../../../../lib/klasikler.json";
import Okur from "./Okur";
export default async function Page({params}){
  const {id,lang}=await params;
  const book=books.find(b=>b.id===id);
  if(!book)notFound();
  return <Okur book={book} lang={lang}/>;
}
