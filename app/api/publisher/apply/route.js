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

    const body = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase.from("publisher_applications").insert([
      {
        user_id: userId,
        full_name: body.fullName || "",
        email: body.email || "",
        phone: body.phone || "",
        website: body.website || "",
        social_links: body.socialLinks || "",
        experience: body.experience || "",
        reason: body.reason || "",
        agreement_accepted: Boolean(body.agreementAccepted),
        voice_acceptance_note: body.voiceAcceptanceNote || "",
        status: "pending",
      },
    ]);

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    await supabase
      .from("profiles")
      .update({
        publisher_status: "pending",
      })
      .eq("user_id", userId);

    return Response.json({
      success: true,
      message: "Başvurunuz admin paneline gönderildi.",
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
