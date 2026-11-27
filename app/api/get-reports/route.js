import {publisherAccess,fail} from "../../lib/publisherAccess";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    if(!await publisherAccess())return fail("Yayıncı erişimi gerekiyor.",403);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      reports: data || [],
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
