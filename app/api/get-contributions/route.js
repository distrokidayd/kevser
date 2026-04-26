import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { book_slug } = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // kitabı bul
    const { data: book } = await supabase
      .from("books")
      .select("id")
      .eq("slug", book_slug)
      .single();

    if (!book) {
      return Response.json({ ok: false, error: "Kitap yok" });
    }

    // yorumları çek
    const { data: contributions } = await supabase
      .from("contributions")
      .select("*")
      .eq("book_id", book.id)
      .eq("type", "commentary");

    // oyları çek
    const { data: votes } = await supabase
      .from("contribution_votes")
      .select("*");

    // tartışmaları çek
    const { data: threads } = await supabase
      .from("discussion_threads")
      .select("*");

    // replyleri çek
    const { data: replies } = await supabase
      .from("discussion_replies")
      .select("*");

    const result = contributions.map((c) => {
      // oylar
      const voteScore = votes
        .filter((v) => v.contribution_id === c.id)
        .reduce((sum, v) => sum + v.value, 0);

      // tartışma var mı
      const thread = threads.find((t) => t.contribution_id === c.id);

      let discussionScore = 0;

      if (thread) {
        discussionScore += 10;

        const threadReplies = replies.filter(
          (r) => r.thread_id === thread.id
        );

        threadReplies.forEach((r) => {
          if (r.user_id === c.user_id) {
            discussionScore += 2;
          } else {
            discussionScore += 1;
          }
        });
      }

      return {
        ...c,
        score: voteScore + discussionScore
      };
    });

    // sıralama
    result.sort((a, b) => {
      if (b.score === a.score) {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return b.score - a.score;
    });

    return Response.json({
      ok: true,
      data: result
    });

  } catch (err) {
    return Response.json({
      ok: false,
      error: err.message
    });
  }
}
