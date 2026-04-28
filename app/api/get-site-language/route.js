import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({
        success: true,
        siteLanguage: "Türkçe",
        source: "guest_default",
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("profiles")
      .select("site_language,native_language")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      siteLanguage: data?.site_language || data?.native_language || "Türkçe",
      nativeLanguage: data?.native_language || "Türkçe",
      source: data ? "profile" : "default",
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
