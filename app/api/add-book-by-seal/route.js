import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { seal_code } = await req.json();

    if (!seal_code) {
      return Response.json({ ok: false, error: "Mühür kodu gerekli" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const cleanSeal = seal_code.trim();

    const { data: seal, error: sealError } = await supabase
      .from("seal_codes")
      .select("*")
      .eq("code", cleanSeal)
      .single();

    if (sealError || !seal) {
      return Response.json({ ok: false, error: "Mühür kodu bulunamadı" }, { status: 404 });
    }

    if (!seal.book_id) {
      return Response.json({
        ok: false,
        error: "Bu mühür henüz bir kitaba bağlanmamış"
      }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("user_books")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_id", seal.book_id)
      .maybeSingle();

    if (existing) {
      return Response.json({
        ok: true,
        alreadyAdded: true,
        message: "Bu kitap zaten hesabınızda"
      });
    }

    const { data, error } = await supabase
      .from("user_books")
      .insert({
        user_id: user.id,
        book_id: seal.book_id,
        seal_code: cleanSeal,
        verified: true
      })
      .select();

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }

    return Response.json({
      ok: true,
      message: "Kitap hesabınıza eklendi",
      data
    });

  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
