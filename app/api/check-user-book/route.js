import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user) {
      return Response.json({ ok: true, hasBook: false });
    }

    const { book_slug } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: book } = await supabase
      .from("books")
      .select("id")
      .eq("slug", book_slug)
      .single();

    if (!book) {
      return Response.json({ ok: false });
    }

    const { data } = await supabase
      .from("user_books")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_id", book.id)
      .maybeSingle();

    return Response.json({
      ok: true,
      hasBook: !!data
    });

  } catch (err) {
    return Response.json({ ok: false, error: err.message });
  }
}
