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

  // Check if budget belongs to user
  const { data: budgetData, error: checkError } = await supabase
    .from("budgets")
    .select("user_id")
    .eq("id", id)
    .single();

  if (checkError)
    return NextResponse.json({ error: checkError.message }, { status: 400 });

  if (budgetData.user_id !== userId) {
    return NextResponse.json(
      { error: "Cannot update a budget that doesn't belong to you" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("budgets")
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

  // Check if budget belongs to user
  const { data: budgetData, error: checkError } = await supabase
    .from("budgets")
    .select("user_id")
    .eq("id", id)
    .single();

  if (checkError)
    return NextResponse.json({ error: checkError.message }, { status: 400 });

  if (budgetData.user_id !== userId) {
    return NextResponse.json(
      { error: "Cannot delete a budget that doesn't belong to you" },
      { status: 403 }
    );
  }

  // Check if budget is in use
  const { count, error: countError } = await supabase
    .from("expenses")
    .select("id", { count: "exact" })
    .eq("budget_id", id) // Fixed reference to `budget_id`
    .single();

  if (countError)
    return NextResponse.json({ error: countError.message }, { status: 400 });

  if (count > 0) {
    return NextResponse.json(
      { error: "Cannot delete a budget that is in use by expenses" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("budgets") // Fixed incorrect table reference
    .delete()
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "Budget deleted" }, { status: 200 });
}
