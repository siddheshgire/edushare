import { describe, it, expect } from "vitest";
import { mockStore } from "@/lib/store/mock-store";

describe("Resource Filtering and Library Operations", () => {
  it("should filter resources by semester", () => {
    const sem4Resources = mockStore.getResources({ semester: 4, moderationStatus: "approved" });
    expect(sem4Resources.length).toBeGreaterThan(0);
    sem4Resources.forEach((r) => {
      expect(r.semester).toBe(4);
    });
  });

  it("should find resources by keyword search across title, description, and tags", () => {
    const searchResults = mockStore.getResources({ search: "Dijkstra" });
    expect(searchResults.length).toBeGreaterThan(0);
    const found = searchResults.some(
      (r) =>
        r.title.toLowerCase().includes("dijkstra") ||
        r.description.toLowerCase().includes("dijkstra") ||
        r.content_text?.toLowerCase().includes("dijkstra")
    );
    expect(found).toBe(true);
  });

  it("should correctly toggle bookmarks without duplicates", () => {
    const userId = "test-user-123";
    const resourceId = "res-001";

    // First toggle -> add
    const firstState = mockStore.toggleBookmark(userId, resourceId);
    expect(firstState).toBe(true);

    let bookmarkedList = mockStore.getResources({ onlyBookmarkedBy: userId });
    expect(bookmarkedList.some((r) => r.id === resourceId)).toBe(true);

    // Second toggle -> remove
    const secondState = mockStore.toggleBookmark(userId, resourceId);
    expect(secondState).toBe(false);

    bookmarkedList = mockStore.getResources({ onlyBookmarkedBy: userId });
    expect(bookmarkedList.some((r) => r.id === resourceId)).toBe(false);
  });

  it("should increment download count reliably", () => {
    const resource = mockStore.getResourceById("res-002");
    expect(resource).not.toBeNull();
    const initialDownloads = resource!.download_count;

    const newCount = mockStore.incrementDownload("res-002");
    expect(newCount).toBe(initialDownloads + 1);

    const refetched = mockStore.getResourceById("res-002");
    expect(refetched?.download_count).toBe(initialDownloads + 1);
  });
});
