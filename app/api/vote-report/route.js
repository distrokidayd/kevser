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

    const alreadyVoted = currentVotes.some(
      (vote) => vote.userId === userId
    );

    if (alreadyVoted) {
      return Response.json(
        { success: false, error: "Zaten oy verdiniz." },
        { status: 400 }
      );
    }

    const newVotes = [
      ...currentVotes,
      {
        userId,
        decision,
        votedAt: new Date().toISOString(),
      },
    ];

    const approveCount = newVotes.filter(
      (v) => v.decision === "approve"
    ).length;

    const rejectCount = newVotes.filter(
      (v) => v.decision === "reject"
    ).length;

    let newStatus = report.status || "pending";

    // 🔥 KRİTİK: 2 ONAY → ASKıya AL
    if (approveCount >= 2) {
      newStatus = "suspended";

      // 👉 İÇERİĞİ ASKıya AL
      await supabase
        .from("contributions")
        .update({ status: "suspended" })
        .eq("id", report.content_id);
    }

    if (rejectCount >= 2) {
      newStatus = "rejected";
    }

    await supabase
      .from("reports")
      .update({
        publisher_votes: newVotes,
        status: newStatus,
      })
      .eq("id", reportId);

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
