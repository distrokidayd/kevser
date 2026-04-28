import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { contributionId, targetLanguage } = await req.json();

    if (!contributionId || !targetLanguage) {
      return Response.json(
        {
          success: false,
          error: "contributionId ve targetLanguage zorunludur.",
        },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("contribution_translations")
      .select("*")
      .eq("contribution_id", contributionId)
      .eq("target_language", targetLanguage)
      .maybeSingle();

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      translation: data || null,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
