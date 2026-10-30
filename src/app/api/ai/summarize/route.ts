import { NextRequest, NextResponse } from "next/server";
import { generateDocumentSummary, isAIAssistantConfigured } from "@/lib/ai/service";
import { aiSummaryRequestSchema } from "@/lib/validation/ai";
import { mockStore } from "@/lib/store/mock-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = aiSummaryRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { resourceId, documentText } = validated.data;
    const resource = mockStore.getResourceById(resourceId);

    if (!resource) {
      return NextResponse.json({ success: false, message: "Resource not found" }, { status: 404 });
    }

    const result = await generateDocumentSummary(
      resourceId,
      resource.title,
      documentText || resource.content_text || resource.description
    );

    return NextResponse.json({
      ...result,
      isConfigured: isAIAssistantConfigured(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}
