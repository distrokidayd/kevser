import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function generateSealCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "KEV-";

  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

export async function POST(req) {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json(
        { success: false, error: "Giriş yapılmamış." },
        { status: 401 }
      );
    }

    const { bookId } = await req.json();

    if (!bookId) {
      return Response.json(
        { success: false, error: "bookId zorunludur." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let code = generateSealCode();

    const { data, error } = await supabase
      .from("seal_codes")
      .insert([
        {
          code,
          book_id: bookId,
          created_by: userId,
          used: false,
        },
      ])
      .select()
      .single();

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      code: data.code,
      seal: data,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
