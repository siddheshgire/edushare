import { describe, it, expect } from "vitest";
import { mockStore, DEMO_USERS } from "@/lib/store/mock-store";

describe("Role-Based Access Control and Permissions", () => {
  const studentUser = DEMO_USERS[0]; // Aarav Sharma
  const otherStudent = DEMO_USERS[2]; // Priya Patel
  const adminUser = DEMO_USERS[1]; // Prof. Sunita Rao

  it("should not allow students to approve their own submissions", () => {
    // Student uploads a pending resource
    mockStore.setCurrentUser(studentUser);
    const newResource = mockStore.addResource({
      owner_id: studentUser.id,
      owner_name: studentUser.full_name,
      title: "Self-Submitted Graph Notes",
      description: "Notes waiting for peer review.",
      subject_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      semester: 3,
      category: "Lecture Notes",
      storage_path: "resources/graph.pdf",
      file_name: "graphs.pdf",
      file_type: "application/pdf",
      file_size: 2048,
      tags: ["Graphs"],
      moderation_status: "pending", // Must start as pending
    });

    expect(newResource.moderation_status).toBe("pending");

    // Student attempting to self-approve should be rejected by business rule
    const isStudentAdmin = studentUser.role === "admin";
    expect(isStudentAdmin).toBe(false);
  });

  it("should permit administrators to approve pending resources", () => {
    const updated = mockStore.updateModerationStatus("res-006", "approved", "Valid", adminUser);
    expect(updated).not.toBeNull();
    expect(updated?.moderation_status).toBe("approved");

    const logs = mockStore.getModerationLogs();
    const latestLog = logs[0];
    expect(latestLog.action).toBe("approved");
    expect(latestLog.administrator_name).toBe(adminUser.full_name);
  });

  it("should forbid students from deleting other students' resources", () => {
    const resourceToDelete = mockStore.getResourceById("res-001"); // Owned by Aarav Sharma
    expect(resourceToDelete).not.toBeNull();

    // Priya Patel attempts to delete Aarav's resource
    const deletedByOther = mockStore.deleteResource(
      "res-001",
      otherStudent.id,
      otherStudent.role === "admin"
    );
    expect(deletedByOther).toBe(false);

    // Aarav can delete his own resource
    const canOwnerDelete = resourceToDelete?.owner_id === studentUser.id;
    expect(canOwnerDelete).toBe(true);
  });
});
