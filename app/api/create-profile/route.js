import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return Response.json({ ok: false, error: "No user" });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const email = user.emailAddresses?.[0]?.emailAddress || null;
    const username =
      user.username ||
      user.firstName ||
      email?.split("@")[0] ||
      "kevser_user";

    console.log("USER:", user.id, email, username);

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email,
        username,
        role: "user",
      })
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return Response.json({ ok: false, error: error.message });
    }

    return Response.json({ ok: true, data });
  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json({ ok: false, error: err.message });
  }
}
