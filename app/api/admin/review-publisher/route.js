import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { userId } = auth();

    // Basit admin kontrolü (şimdilik manuel)
    const ADMIN_ID = process.env.ADMIN_USER_ID;

    if (!userId || userId !== ADMIN_ID) {
      return Response.json(
        { success: false, error: "Yetkisiz erişim." },
        { status: 403 }
      );
    }

    const { applicationId, decision, adminNote } = await req.json();

    if (!applicationId || !decision) {
      return Response.json(
        { success: false, error: "Eksik veri." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Başvuruyu al
    const { data: appData, error: appError } = await supabase
      .from("publisher_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !appData) {
      return Response.json(
        { success: false, error: "Başvuru bulunamadı." },
        { status: 404 }
      );
    }

    // DURUM GÜNCELLE
    const status = decision === "approve" ? "approved" : "rejected";

    await supabase
      .from("publisher_applications")
      .update({
        status,
        admin_note: adminNote || "",
        reviewed_by: userId,
        reviewed_at: new Date(),
      })
      .eq("id", applicationId);

    // PROFİL GÜNCELLE
    await supabase
      .from("profiles")
      .update({
        is_publisher: decision === "approve",
        publisher_status: status,
      })
      .eq("user_id", appData.user_id);

    // KULLANICIYA MESAJ
    const message =
      decision === "approve"
        ? "Yayıncı başvurunuz onaylandı. Artık yayıncı paneline erişebilirsiniz."
        : `Yayıncı başvurunuz reddedildi. Not: ${adminNote || "Belirtilmedi."}`;

    await supabase.from("user_notifications").insert([
      {
        user_id: appData.user_id,
        title: "Yayıncı Başvurusu",
        message,
        type: "publisher",
      },
    ]);

    return Response.json({
      success: true,
      message: "İşlem tamamlandı.",
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
