// app/api/expenses/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function GET() {
  // Check NextAuth session server-side
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // Get user ID from session (using token.sub if needed)
  const userId = session.user.id || session.user.sub;
  
  // Query expenses for the current user
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
    .limit(24);
  
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = session.user.id || session.user.sub;
  const body = await request.json();
  
  // Append user_id to the expense data
  const expenseWithUserId = { ...body, user_id: userId };
  
  const { data, error } = await supabase
    .from("expenses")
    .insert(expenseWithUserId)
    .select();
  
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json(data, { status: 201 });
}
