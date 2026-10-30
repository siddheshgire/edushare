import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/store/mock-store";
import { resourceReportSchema } from "@/lib/validation/report";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = resourceReportSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { resourceId, reason, description } = validated.data;
    const currentUser = mockStore.getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required to report materials" },
        { status: 401 }
      );
    }

    const report = mockStore.addReport({
      reporter_id: currentUser.id,
      reporter_name: currentUser.full_name,
      resource_id: resourceId,
      reason,
      description,
    });

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit report" },
      { status: 500 }
    );
  }
}
