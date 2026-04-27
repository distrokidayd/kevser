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

    const { agreementText } = await req.json();

    if (!agreementText || !agreementText.trim()) {
      return Response.json(
        { success: false, error: "Anlaşma metni boş olamaz." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase
      .from("platform_settings")
      .upsert(
        [
          {
            key: "publisher_agreement",
            value: agreementText.trim(),
            updated_at: new Date().toISOString(),
          },
        ],
        {
          onConflict: "key",
        }
      );

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      agreementText: agreementText.trim(),
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
