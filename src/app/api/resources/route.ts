import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/store/mock-store";
import { resourceUploadSchema } from "@/lib/validation/resource";

import { ModerationStatus } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const semesterStr = searchParams.get("semester");
  const semester = semesterStr ? parseInt(semesterStr, 10) : undefined;
  const subjectId = searchParams.get("subjectId") || undefined;
  const category = searchParams.get("category") || undefined;
  const statusParam = searchParams.get("status") || "approved";

  const resources = mockStore.getResources({
    search,
    semester,
    subjectId,
    category,
    moderationStatus: statusParam === "all" ? undefined : (statusParam as ModerationStatus),
  });

  return NextResponse.json({ success: true, data: resources });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = resourceUploadSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      subjectId,
      semester,
      category,
      tags,
      fileName,
      fileType,
      fileSize,
    } = validated.data;

    const currentUser = mockStore.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required to upload resources" },
        { status: 401 }
      );
    }

    const newResource = mockStore.addResource({
      owner_id: currentUser.id,
      owner_name: currentUser.full_name,
      title,
      description,
      subject_id: subjectId,
      semester,
      category,
      storage_path: `uploads/${Date.now()}_${fileName}`,
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
      tags,
      moderation_status: "pending", // default to pending for moderation review
      content_text: `Resource Title: ${title}\nDescription: ${description}\nTags: ${tags.join(", ")}`,
    });

    return NextResponse.json({ success: true, data: newResource }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process upload" },
      { status: 500 }
    );
  }
}
