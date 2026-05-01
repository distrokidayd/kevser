import { redirect } from "next/navigation";

export default function LocalizedRubailerPage({ params }) {
  const lang = params?.lang || "tr";

  redirect("/books/omerhayyam/rubailer");
}
