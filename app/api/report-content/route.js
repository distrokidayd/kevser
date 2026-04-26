import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user) {
      return Response.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { contribution_id, reply_id, reason } = await req.json();

    if (!contribution_id && !reply_id) {
      return Response.json(
        { ok: false, error: "Şikayet edilecek içerik bulunamadı" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("reports")
      .insert({
        contribution_id: contribution_id || null,
        reply_id: reply_id || null,
        reported_by: user.id,
        reason: reason || "Uygunsuz içerik"
      })
      .select();

    if (error) {
      return Response.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      data
    });

  } catch (err) {
    return Response.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
