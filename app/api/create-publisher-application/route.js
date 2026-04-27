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

    const {
      fullName,
      email,
      phone,
      address,
      penName,
      religion,
      denomination,
      experience,
      reason,
    } = await req.json();

    if (!fullName || !email || !reason) {
      return Response.json(
        {
          success: false,
          error: "Ad soyad, e-posta ve başvuru sebebi zorunludur.",
        },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: existing } = await supabase
      .from("publisher_applications")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return Response.json(
        {
          success: false,
          error: "Zaten bekleyen bir yayıncı başvurunuz var.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("publisher_applications")
      .insert([
        {
          user_id: userId,
          full_name: fullName,
          email,
          phone: phone || "",
          address: address || "",
          pen_name: penName || "",
          religion: religion || "",
          denomination: denomination || "",
          experience: experience || "",
          reason,
          status: "pending",
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
      application: data,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
