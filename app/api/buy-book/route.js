import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function generateSeal() {
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
        { success: false, error: "Giriş gerekli." },
        { status: 401 }
      );
    }

    const { book_slug } = await req.json();

    if (!book_slug) {
      return Response.json(
        { success: false, error: "Kitap gerekli." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const seal = generateSeal();

    // mühür oluştur
    const { error: sealError } = await supabase
      .from("seal_codes")
      .insert([
        {
          code: seal,
          book_slug,
          is_used: true,
          used_by: userId,
        },
      ]);

    if (sealError) {
      return Response.json(
        { success: false, error: sealError.message },
        { status: 500 }
      );
    }

    // kullanıcıya kitabı tanımla
    const { error: userBookError } = await supabase
      .from("user_books")
      .insert([
        {
          user_id: userId,
          book_slug,
          seal_code: seal,
        },
      ]);

    if (userBookError) {
      return Response.json(
        { success: false, error: userBookError.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      seal,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
