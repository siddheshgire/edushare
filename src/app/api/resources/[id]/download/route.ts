import { NextRequest, NextResponse } from "next/server";
import { mockStore } from "@/lib/store/mock-store";

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

  return NextResponse.json({
    success: true,
    data: {
      resourceId: id,
      fileName: resource.file_name,
      fileType: resource.file_type,
      downloadCount: newCount,
      downloadUrl: `/api/resources/${id}/download?stream=true`,
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

  // Return a sample academic text/PDF payload
  const content = resource.content_text || `${resource.title}\n${resource.description}`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${resource.file_name || "edushare-resource.txt"}"`,
    },
  });
}
