import { createClient } from "@supabase/supabase-js";
import { translateText } from "../../lib/translate";

export async function POST(req) {
  try {
    const { contributionId, targetLanguage } = await req.json();

    if (!contributionId || !targetLanguage) {
      return Response.json(
        { success: false, error: "contributionId ve targetLanguage zorunludur." },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: contribution, error: contributionError } = await supabase
      .from("contributions")
      .select("*")
      .eq("id", contributionId)
      .single();

    if (contributionError || !contribution) {
      return Response.json(
        { success: false, error: "Katkı bulunamadı." },
        { status: 404 }
      );
    }

    const { data: existingTranslation } = await supabase
      .from("contribution_translations")
      .select("*")
      .eq("contribution_id", contributionId)
      .eq("target_language", targetLanguage)
      .maybeSingle();

    if (existingTranslation) {
      return Response.json({
        success: true,
        translation: existingTranslation,
        cached: true,
      });
    }

    const translated = await translateText({
      text: contribution.content,
      sourceLang: contribution.source_language || "auto",
      targetLang: targetLanguage,
    });

    if (!translated.success) {
      return Response.json(
        { success: false, error: translated.error || "Çeviri oluşturulamadı." },
        { status: 500 }
      );
    }

    const { data: insertedTranslation, error: insertError } = await supabase
      .from("contribution_translations")
      .insert([
        {
          contribution_id: contributionId,
          source_language: contribution.source_language || "auto",
          target_language: targetLanguage,
          original_content: contribution.content,
          translated_content: translated.translatedText,
          provider: translated.provider || "free_api",
        },
      ])
      .select()
      .single();

    if (insertError) {
      return Response.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      translation: insertedTranslation,
      cached: false,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
