import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  return Response.json({
    ok: true,
    message: "create-profile api is working. Use POST to create profile."
  });
}

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return Response.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
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

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email,
      username,
      role: "user"
    })
    .select();

  if (error) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    profile: data
  });
}
