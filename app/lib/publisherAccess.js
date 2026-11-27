import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export function db() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {persistSession:false,autoRefreshToken:false}
  });
}
export function isAdmin(userId) {
  return Boolean(userId && userId === process.env.ADMIN_USER_ID);
}
export async function publisherAccess() {
  const {userId} = await auth();
  if (!userId) return false;
  if (isAdmin(userId)) return true;
  const {data,error} = await db().from("profiles").select("role,is_publisher").eq("id",userId).maybeSingle();
  return !error && Boolean(data?.is_publisher || data?.role === "publisher");
}
export function fail(message,status) {
  return Response.json({success:false,error:message},{status,headers:{"Cache-Control":"private, no-store"}});
}
