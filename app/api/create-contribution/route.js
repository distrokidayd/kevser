import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { content, type, book_slug } = await req.json();

    if (!content || !type || !book_slug) {
      return Response.json({ ok: false, error: "Eksik veri" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // kitabı bul
    const { data: book, error: bookError } = await supabase
      .from("books")
      .select("id")
      .eq("slug", book_slug)
      .single();

    if (bookError || !book) {
      return Response.json({ ok: false, error: "Kitap bulunamadı" }, { status: 404 });
    }

    // kaydet
    const { data, error } = await supabase
      .from("contributions")
      .insert({
        user_id: user.id,
        book_id: book.id,
        type,
        content
      })
      .select();

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }

    return Response.json({
      ok: true,
      data
    });

  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
