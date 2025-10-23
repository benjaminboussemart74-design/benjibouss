import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_MINISTERS_RESOURCE = process.env.SUPABASE_MINISTERS_RESOURCE ?? "ministers";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json(
      {
        error: "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY in your environment.",
      },
      { status: 500 }
    );
  }

  try {
    const endpoint = new URL(`/rest/v1/${SUPABASE_MINISTERS_RESOURCE}`, SUPABASE_URL);
    endpoint.searchParams.set("select", "*");

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok) {
      const message = typeof payload === "object" && payload !== null ? payload : { error: "Unknown error" };
      return NextResponse.json(message, { status: response.status });
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch ministers from Supabase", error);
    return NextResponse.json({ error: "Unable to fetch ministers from Supabase." }, { status: 500 });
  }
}
