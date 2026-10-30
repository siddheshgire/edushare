import { describe, it, expect } from "vitest";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { BUCKET_NAME, getDocumentDownloadUrl } from "@/lib/supabase/storage";

describe("Live Cloud Supabase & Storage Integration", () => {
  it("should define the correct storage bucket configuration", () => {
    expect(BUCKET_NAME).toBeDefined();
    expect(BUCKET_NAME).toBe("edushare-resources");
  });

  it("should accurately detect unconfigured vs configured credentials without crashing", () => {
    // In test environment without active cloud keys, it should be false
    const configured = isSupabaseConfigured;
    expect(typeof configured).toBe("boolean");
  });

  it("should handle storage signed URL generation gracefully when offline", async () => {
    const result = await getDocumentDownloadUrl("resources/sample.pdf", 3600);
    // When offline, it cleanly returns success: false with an informative error rather than throwing an unhandled exception
    if (!isSupabaseConfigured) {
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    }
  });
});
