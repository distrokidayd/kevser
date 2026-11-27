import Katalog from "./Katalog";
export default async function BooksPage({ params }) {
  const { lang } = await params;
  return <Katalog lang={lang}/>;
}
