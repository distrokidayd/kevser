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

    const { reportId, action } = await req.json();

    if (!reportId || !action) {
      return Response.json(
        { success: false, error: "reportId ve action zorunludur." },
        { status: 400 }
      );
    }

    if (!["keep_suspended", "restore"].includes(action)) {
      return Response.json(
        { success: false, error: "Geçersiz admin kararı." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .single();

    if (reportError || !report) {
      return Response.json(
        { success: false, error: "Şikayet bulunamadı." },
        { status: 404 }
      );
    }

    const contributionStatus =
      action === "keep_suspended" ? "suspended" : "active";

    const reportStatus =
      action === "keep_suspended" ? "admin_suspended" : "resolved_restored";

    await supabase
      .from("contributions")
      .update({
        status: contributionStatus,
      })
      .eq("id", report.content_id);

    const { error: updateReportError } = await supabase
      .from("reports")
      .update({
        status: reportStatus,
        admin_decision: action,
        admin_decided_by: userId,
        admin_decided_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (updateReportError) {
      return Response.json(
        { success: false, error: updateReportError.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      reportStatus,
      contributionStatus,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
