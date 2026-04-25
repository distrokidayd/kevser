import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { book_slug } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: book, error: bookError } = await supabase
      .from("books")
      .select("id")
      .eq("slug", book_slug)
      .single();

    if (bookError || !book) {
      return Response.json({
        ok: false,
        error: "Kitap bulunamadı"
      });
    }

    const { data, error } = await supabase
      .from("contributions")
      .select("*")
      .eq("book_id", book.id)
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json({
        ok: false,
        error: error.message
      });
    }

    return Response.json({
      ok: true,
      data
    });

  } catch (err) {
    return Response.json({
      ok: false,
      error: err.message
    });
  }
}
