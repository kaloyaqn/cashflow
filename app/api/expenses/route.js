// app/api/expenses/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function GET(request) {
  // 1. Check NextAuth session server-side
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Extract user ID and limit
  const userId = session.user.id || session.user.sub;
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 24;

  // 3. Query expenses strictly for the current user
  const { data, error } = await supabase
    .from("expenses")
    .select(`
      id,
      user_id,
      amount,
      description,
      date,
      category_id,
      categories(id, name, icon)
    `)
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data, { status: 200 });
}

export async function POST(request) {
  // 1. Check NextAuth session server-side
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Extract user ID and the request body
  const userId = session.user.id || session.user.sub;
  const body = await request.json();

  // 3. Append user_id to the expense data
  const expenseWithUserId = { ...body, user_id: userId };

  // 4. Insert expense for the current user
  const { data, error } = await supabase
    .from("expenses")
    .insert(expenseWithUserId)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data, { status: 201 });
}
