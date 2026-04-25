import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

function generateChecksum(code) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let hash = 0;

  for (let i = 0; i < code.length; i++) {
    hash = (hash + code.charCodeAt(i) * (i + 1)) % chars.length;
  }

  return chars[hash] + chars[(hash + 7) % chars.length];
}

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user) {
      return Response.json({ ok: false, error: "Unauthorized" });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const body = await req.json();

    const {
      publisher_code,
      author_code,
      genre_code,
      content_area,
      language_code,
      contributor_code,
      product_number,
      book_id
    } = body;

    const baseCode = `${publisher_code}-${author_code}-${genre_code}-${content_area}-${language_code}-${contributor_code}-${product_number}`;

    const checksum = generateChecksum(baseCode);

    const fullCode = `${baseCode}-${checksum}`;

    const { data, error } = await supabase
      .from("seal_codes")
      .insert({
        code: fullCode,
        publisher_code,
        author_code,
        genre_code,
        content_area,
        language_code,
        contributor_code,
        product_number,
        checksum,
        book_id,
        created_by: user.id
      })
      .select();

    if (error) {
      return Response.json({ ok: false, error: error.message });
    }

    return Response.json({
      ok: true,
      code: fullCode,
      data
    });
  } catch (err) {
    return Response.json({ ok: false, error: err.message });
  }
}
