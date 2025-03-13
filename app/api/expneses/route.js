import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

// Initialize a Supabase client with the *service role* key (server-side only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function GET(request) {
  // 1. Check NextAuth session server-side
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Get the user's ID from the NextAuth session
  const userId = session.user.id;

  // 3. Query Supabase with the service role key, filtering by user_id
  const { data, error } = await supabase
    .from("expenses")
    .select(`
      id,
      user_id,
      amount,
      description,
      date,
      categories(id, name, icon)
    `)
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 4. Return the user-specific expenses
  return NextResponse.json(data, { status: 200 });
}
