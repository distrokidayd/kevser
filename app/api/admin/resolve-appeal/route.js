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

    const { appealId, action } = await req.json();

    if (!appealId || !action) {
      return Response.json(
        { success: false, error: "appealId ve action zorunludur." },
        { status: 400 }
      );
    }

    if (!["accept", "reject"].includes(action)) {
      return Response.json(
        { success: false, error: "Geçersiz itiraz kararı." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: appeal, error: appealError } = await supabase
      .from("appeals")
      .select("*")
      .eq("id", appealId)
      .single();

    if (appealError || !appeal) {
      return Response.json(
        { success: false, error: "İtiraz bulunamadı." },
        { status: 404 }
      );
    }

    const contributionStatus = action === "accept" ? "active" : "suspended";
    const appealStatus = action === "accept" ? "accepted" : "rejected";

    const { error: contributionError } = await supabase
      .from("contributions")
      .update({
        status: contributionStatus,
      })
      .eq("id", appeal.contribution_id);

    if (contributionError) {
      return Response.json(
        { success: false, error: contributionError.message },
        { status: 500 }
      );
    }

    const { error: updateAppealError } = await supabase
      .from("appeals")
      .update({
        status: appealStatus,
        admin_decision: action,
        admin_decided_by: userId,
        admin_decided_at: new Date().toISOString(),
      })
      .eq("id", appealId);

    if (updateAppealError) {
      return Response.json(
        { success: false, error: updateAppealError.message },
        { status: 500 }
      );
    }

    if (appeal.report_id) {
      await supabase
        .from("reports")
        .update({
          status: action === "accept" ? "resolved_restored" : "admin_suspended",
          admin_decision: action === "accept" ? "restore_from_appeal" : "keep_suspended_from_appeal",
          admin_decided_by: userId,
          admin_decided_at: new Date().toISOString(),
        })
        .eq("id", appeal.report_id);
    }

    return Response.json({
      success: true,
      appealStatus,
      contributionStatus,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
