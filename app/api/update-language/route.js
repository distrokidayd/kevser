import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json(
        { success: false, error: "Giriş yapılmamış." },
        { status: 401 }
      );
    }

    const { nativeLanguage, knownLanguages } = await req.json();

    if (!nativeLanguage) {
      return Response.json(
        { success: false, error: "Ana dil gerekli." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase
      .from("profiles")
      .update({
        native_language: nativeLanguage,
        known_languages: knownLanguages,
        site_language: nativeLanguage,
      })
      .eq("user_id", userId);

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
