// app/api/expenses/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function GET(request, { params }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = session.user.id || session.user.sub;
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
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(request, { params }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = session.user.id || session.user.sub;
  // Verify that the expense belongs to the user
  const checkRes = await supabase
    .from("expenses")
    .select("user_id")
    .eq("id", id)
    .single();
  if (checkRes.error)
    return NextResponse.json({ error: checkRes.error.message }, { status: 400 });
  if (checkRes.data.user_id !== userId)
    return NextResponse.json(
      { error: "Cannot update an expense that doesn't belong to you" },
      { status: 403 }
    );
  
  const body = await request.json();
  const { data, error } = await supabase
    .from("expenses")
    .update(body)
    .eq("id", id)
    .select();
  
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = session.user.id || session.user.sub;
  // Verify ownership
  const checkRes = await supabase
    .from("expenses")
    .select("user_id")
    .eq("id", id)
    .single();
  if (checkRes.error)
    return NextResponse.json({ error: checkRes.error.message }, { status: 400 });
  if (checkRes.data.user_id !== userId)
    return NextResponse.json(
      { error: "Cannot delete an expense that doesn't belong to you" },
      { status: 403 }
    );
  
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
}
