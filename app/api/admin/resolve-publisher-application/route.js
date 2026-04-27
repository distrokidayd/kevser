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

    const { applicationId, action } = await req.json();

    if (!applicationId || !action) {
      return Response.json(
        { success: false, error: "applicationId ve action zorunludur." },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return Response.json(
        { success: false, error: "Geçersiz admin kararı." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: application, error: appError } = await supabase
      .from("publisher_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !application) {
      return Response.json(
        { success: false, error: "Yayıncı başvurusu bulunamadı." },
        { status: 404 }
      );
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const { error: updateApplicationError } = await supabase
      .from("publisher_applications")
      .update({
        status: newStatus,
        admin_decision: action,
        admin_decided_by: userId,
        admin_decided_at: new Date().toISOString(),
      })
      .eq("id", applicationId);

    if (updateApplicationError) {
      return Response.json(
        { success: false, error: updateApplicationError.message },
        { status: 500 }
      );
    }

    if (action === "approve") {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          [
            {
              user_id: application.user_id,
              role: "publisher",
              full_name: application.full_name,
              email: application.email,
              phone: application.phone || "",
              address: application.address || "",
              pen_name: application.pen_name || "",
              religion: application.religion || "",
              denomination: application.denomination || "",
            },
          ],
          {
            onConflict: "user_id",
          }
        );

      if (profileError) {
        return Response.json(
          { success: false, error: profileError.message },
          { status: 500 }
        );
      }
    }

    return Response.json({
      success: true,
      status: newStatus,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
