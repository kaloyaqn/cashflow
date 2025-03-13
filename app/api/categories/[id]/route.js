// app/api/categories/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function PATCH(request, { params }) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = session.user.id || session.user.sub;
  // Check if category belongs to user
  const checkRes = await supabase
    .from("categories")
    .select("user_id")
    .eq("id", id)
    .single();
  
  if (checkRes.error)
    return NextResponse.json({ error: checkRes.error.message }, { status: 400 });
  
  if (checkRes.data.user_id !== userId) {
    return NextResponse.json(
      { error: "Cannot update a category that doesn't belong to you" },
      { status: 403 }
    );
  }
  
  const body = await request.json();
  const { data, error } = await supabase
    .from("categories")
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
  // Check if category belongs to user
  const checkRes = await supabase
    .from("categories")
    .select("user_id")
    .eq("id", id)
    .single();
  
  if (checkRes.error)
    return NextResponse.json({ error: checkRes.error.message }, { status: 400 });
  
  if (checkRes.data.user_id !== userId) {
    return NextResponse.json(
      { error: "Cannot delete a category that doesn't belong to you" },
      { status: 403 }
    );
  }
  
  // Check if the category is in use by any expense
  const { count, error: countError } = await supabase
    .from("expenses")
    .select("id", { count: "exact" })
    .eq("category_id", id);
  
  if (countError)
    return NextResponse.json({ error: countError.message }, { status: 400 });
  
  if (count > 0) {
    return NextResponse.json(
      { error: "Cannot delete a category that is in use by expenses" },
      { status: 400 }
    );
  }
  
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);
  
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  
  return NextResponse.json({ message: "Category deleted" }, { status: 200 });
}
