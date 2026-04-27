import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { reportId, decision } = await req.json();

    if (!reportId || !decision) {
      return Response.json(
        { success: false, error: "reportId ve decision zorunludur." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: report, error: getError } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .single();

    if (getError || !report) {
      return Response.json(
        { success: false, error: "Şikayet bulunamadı." },
        { status: 404 }
      );
    }

    const currentVotes = Array.isArray(report.publisher_votes)
      ? report.publisher_votes
      : [];

    const newVotes = [...currentVotes, decision];

    const approveCount = newVotes.filter((v) => v === "approve").length;
    const rejectCount = newVotes.filter((v) => v === "reject").length;

    let newStatus = report.status || "pending";

    if (approveCount >= 2) {
      newStatus = "suspended";
    }

    if (rejectCount >= 2) {
      newStatus = "rejected";
    }

    const { error: updateError } = await supabase
      .from("reports")
      .update({
        publisher_votes: newVotes,
        status: newStatus,
      })
      .eq("id", reportId);

    if (updateError) {
      return Response.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      status: newStatus,
      votes: newVotes,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
