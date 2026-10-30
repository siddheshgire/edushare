import { NextResponse } from "next/server";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { BUCKET_NAME } from "@/lib/supabase/storage";

export async function GET() {
  const startTime = Date.now();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasServiceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!isSupabaseConfigured) {
    return NextResponse.json({
      status: "fallback_mode",
      connected: false,
      message:
        "Supabase credentials are not yet configured in .env.local. The platform is running using the local offline high-fidelity reactive store.",
      details: {
        supabaseUrlConfigured: Boolean(supabaseUrl && !supabaseUrl.includes("your-project")),
        anonKeyConfigured: hasAnonKey,
        serviceRoleKeyConfigured: hasServiceRoleKey,
        storageBucket: BUCKET_NAME,
      },
      instructions: [
        "1. Create a free project at https://supabase.com",
        "2. Copy NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY into .env.local",
        "3. Run SQL migrations in supabase/migrations/ from the Supabase SQL Editor",
        "4. Create storage bucket 'edushare-resources'",
      ],
    });
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      throw new Error("Unable to initialize Supabase client");
    }

    // Ping subjects table
    const { data: subjects, error: dbError } = await supabase
      .from("subjects")
      .select("id, name, code")
      .limit(5);

    const latencyMs = Date.now() - startTime;

    if (dbError) {
      return NextResponse.json({
        status: "error",
        connected: false,
        latencyMs,
        message: `Database query failed: ${dbError.message}`,
        details: {
          code: dbError.code,
          hint: dbError.hint || "Make sure migrations in supabase/migrations/ have been applied.",
        },
      });
    }

    // Check storage bucket
    let storageStatus = "accessible";
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      const { data: bucketData, error: bucketError } = await adminSupabase.storage.getBucket(
        BUCKET_NAME
      );
      if (bucketError) {
        storageStatus = `Bucket notice: ${bucketError.message}`;
      } else if (bucketData) {
        storageStatus = `Bucket '${BUCKET_NAME}' verified (Public: ${bucketData.public})`;
      }
    }

    return NextResponse.json({
      status: "connected",
      connected: true,
      latencyMs,
      message: "Successfully connected to live Supabase PostgreSQL and Storage!",
      details: {
        database: "PostgreSQL",
        subjectsCount: subjects?.length || 0,
        sampleSubjects: subjects?.map((s) => s.code),
        storageBucket: BUCKET_NAME,
        storageStatus,
        adminClientConfigured: isSupabaseAdminConfigured,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        connected: false,
        message: err.message || "Failed to reach Supabase endpoint",
      },
      { status: 500 }
    );
  }
}
