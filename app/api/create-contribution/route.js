import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { detectLanguage } from "../../lib/detectLanguage";

export async function POST(req) {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json(
        { ok: false, error: "Giriş yapılmamış." },
        { status: 401 }
      );
    }

    const { content, type, book_slug } = await req.json();

    if (!content || !type || !book_slug) {
      return Response.json(
        { ok: false, error: "Eksik veri." },
        { status: 400 }
      );
    }

    const sourceLanguage = await detectLanguage(content);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("contributions")
      .insert([
        {
          user_id: userId,
          content,
          type,
          book_slug,
          score: 0,
          status: "active",
          source_language: sourceLanguage || "auto",
        },
      ])
      .select()
      .single();

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      data,
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
