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

    const { contribution_id, value } = await req.json();

    if (!contribution_id || ![1, -1].includes(value)) {
      return Response.json(
        { ok: false, error: "Eksik veya hatalı veri" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("contribution_votes")
      .upsert({
        contribution_id,
        user_id: user.id,
        value
      }, {
        onConflict: "contribution_id,user_id"
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
