import { createServerSupabaseClient } from "./server";
import { createAdminClient } from "./admin";

export const BUCKET_NAME = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "edushare-resources";

/**
 * Uploads a document to Supabase Storage
 */
export async function uploadDocumentToStorage(
  filePath: string,
  fileBuffer: Buffer | Blob | Uint8Array,
  contentType: string
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    // Prefer admin client for storage upload if configured, otherwise server client
    const supabase = createAdminClient() || (await createServerSupabaseClient());
    if (!supabase) {
      return { success: false, error: "Supabase client not configured" };
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, path: data.path };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to upload document" };
  }
}

/**
 * Generates a secure, time-limited signed URL for authorized file downloads
 */
export async function getDocumentDownloadUrl(
  filePath: string,
  expiresInSeconds = 3600 // 1 hour valid link
): Promise<{ success: boolean; signedUrl?: string; error?: string }> {
  try {
    const supabase = createAdminClient() || (await createServerSupabaseClient());
    if (!supabase) {
      return { success: false, error: "Supabase client not configured" };
    }

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, signedUrl: data.signedUrl };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to generate download URL" };
  }
}

/**
 * Deletes a document from Supabase Storage
 */
export async function deleteDocumentFromStorage(
  filePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient() || (await createServerSupabaseClient());
    if (!supabase) {
      return { success: false, error: "Supabase client not configured" };
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete document" };
  }
}
