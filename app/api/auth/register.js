import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
  try {
    // 1. Parse the incoming JSON
    const { email, password, first_name, last_name } = await request.json();

    
    // 2. Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // 3. Attempt to sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: first_name,
            last_name: last_name,
          },
        },
      })

    console.log('data', data, 'error', error);

    // 4. Handle errors from Supabase
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 5. Return the user/session data as JSON
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    // 6. Catch any unexpected errors and return them as JSON
    return NextResponse.json(
      { error: err.message || "Registration failed" },
      { status: 500 }
    );
  }
}
