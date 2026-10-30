import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/store/mock-store";
import { getDocumentDownloadUrl } from "@/lib/supabase/storage";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const resource = mockStore.getResourceById(id);

  if (!resource) {
    return NextResponse.json({ success: false, message: "Resource not found" }, { status: 404 });
  }

  // Increment download count
  const newCount = mockStore.incrementDownload(id);

  let cloudSignedUrl: string | null = null;
  if (isSupabaseConfigured && resource.storage_path) {
    const signedRes = await getDocumentDownloadUrl(resource.storage_path);
    if (signedRes.success && signedRes.signedUrl) {
      cloudSignedUrl = signedRes.signedUrl;
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      resourceId: id,
      fileName: resource.file_name,
      fileType: resource.file_type,
      downloadCount: newCount,
      downloadUrl: cloudSignedUrl || `/api/resources/${id}/download?stream=true`,
      isCloudStorage: Boolean(cloudSignedUrl),
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const resource = mockStore.getResourceById(id);

  if (!resource) {
    return new NextResponse("Resource not found", { status: 404 });
  }

  // Increment count on actual download
  mockStore.incrementDownload(id);

  if (isSupabaseConfigured && resource.storage_path) {
    const signedRes = await getDocumentDownloadUrl(resource.storage_path);
    if (signedRes.success && signedRes.signedUrl) {
      return NextResponse.redirect(signedRes.signedUrl);
    }
  }

  // Return formatted academic payload
  const content =
    resource.content_text ||
    `=== EDUSHARE ACADEMIC RESOURCE ===\nTitle: ${resource.title}\nSubject: ${resource.subject_name}\nSemester: ${resource.semester}\nCategory: ${resource.category}\n\n${resource.description}`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${resource.file_name || "edushare-resource.txt"}"`,
    },
  });
}
