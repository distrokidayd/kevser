import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  const owner = process.env.KEVSER_BOOK_EDITOR_OWNER_ID || process.env.ADMIN_USER_ID;
  const headers = { "Cache-Control": "private, no-store" };
  if (!owner || !userId || userId !== owner) {
    return Response.json({ available: false }, { headers });
  }
  const local = "http://127.0.0.1:48762/";
  const href = process.env.KEVSER_BOOK_EDITOR_URL || local;
  if (href !== local && !href.startsWith("https://")) {
    return Response.json({ available: false }, { headers });
  }
  return Response.json({ available: true, href }, { headers });
}
