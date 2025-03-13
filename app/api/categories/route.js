// app/api/categories/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = session.user.id || session.user.sub;
  // Get categories for the current user and default categories
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order("name");
  
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
  const categoryWithUserId = { ...body, user_id: userId };
  
  const { data, error } = await supabase
    .from("categories")
    .insert(categoryWithUserId)
    .select();
  
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json(data, { status: 201 });
}
