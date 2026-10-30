import {
  UserProfile,
  Subject,
  Resource,
  ResourceRequest,
  ResourceReport,
  ModerationLog,
  PlatformStats,
  ModerationStatus,
  RequestStatus,
} from "@/types";

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    name: "Data Structures & Algorithms",
    code: "CS301",
    description: "Arrays, Linked Lists, Trees, Graphs, Dynamic Programming and Complexity Analysis",
    department: "Computer Science & Engineering",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    name: "Database Management Systems",
    code: "CS403",
    description: "Relational Algebra, SQL, Normalization, ACID Transactions, and Concurrency Control",
    department: "Computer Science & Engineering",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
    name: "Operating Systems",
    code: "CS402",
    description: "Processes, Threads, CPU Scheduling, Memory Virtualization, Deadlocks, and File Systems",
    department: "Computer Science & Engineering",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
    name: "Computer Networks",
    code: "CS501",
    description: "OSI/TCP-IP Models, Routing Algorithms, Transport Layer Protocols, and Network Security",
    department: "Computer Science & Engineering",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
    name: "Machine Learning & AI",
    code: "CS701",
    description: "Supervised & Unsupervised Learning, Neural Networks, Loss Functions, and Transformers",
    department: "Artificial Intelligence",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66",
    name: "Software Engineering & Agile",
    code: "CS502",
    description: "System Modeling, Design Patterns, CI/CD, Agile/Scrum Principles, and Testing QA",
    department: "Information Technology",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77",
    name: "Digital Logic & Computer Org",
    code: "CS201",
    description: "Boolean Algebra, Logic Gates, Multiplexers, CPU Datapath, and Assembly Architecture",
    department: "Computer Science & Engineering",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: "20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88",
    name: "Cloud Computing & DevOps",
    code: "CS601",
    description: "Virtualization, Containers, Microservices, Kubernetes, and Serverless Architecture",
    department: "Cloud & Systems",
    created_at: "2026-01-10T09:00:00Z",
  },
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: "user-student-001",
    email: "student@edushare.edu",
    full_name: "Aarav Sharma",
    role: "student",
    selected_semester: 5,
    college_name: "National Institute of Technology",
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "user-admin-001",
    email: "admin@edushare.edu",
    full_name: "Prof. Sunita Rao (Moderator)",
    role: "admin",
    selected_semester: 1,
    college_name: "EduShare Academic Consortium",
    created_at: "2026-01-01T08:00:00Z",
  },
  {
    id: "user-student-002",
    email: "priya.patel@edushare.edu",
    full_name: "Priya Patel",
    role: "student",
    selected_semester: 3,
    college_name: "Government Engineering College",
    created_at: "2026-02-01T11:20:00Z",
  },
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: "res-001",
    owner_id: "user-student-001",
    owner_name: "Aarav Sharma",
    title: "Complete Dynamic Programming & Graph Theory Revision Notes",
    description:
      "Comprehensive handwritten revision notes covering 0/1 Knapsack, Longest Common Subsequence, Dijkstra's algorithm, Floyd-Warshall, and topological sorting with time complexity proofs.",
    subject_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    subject_name: "Data Structures & Algorithms",
    semester: 3,
    category: "Revision Notes",
    storage_path: "resources/dsa_dp_graph_notes.pdf",
    file_name: "DSA_DP_Graph_Revision.pdf",
    file_type: "application/pdf",
    file_size: 3450000,
    tags: ["Algorithms", "Dynamic Programming", "Graphs", "Complexity"],
    moderation_status: "approved",
    download_count: 142,
    view_count: 489,
    content_text: `DATA STRUCTURES & ALGORITHMS: DYNAMIC PROGRAMMING & GRAPHS
Chapter 1: Dynamic Programming Principles
1.1 Overlapping Subproblems: When an algorithm visits the same subproblems repeatedly instead of generating new subproblems.
1.2 Optimal Substructure: An optimal solution to any instance of an optimization problem is composed of optimal solutions to its subproblems.
1.3 Memoization (Top-Down): Storing results of recursive calls in an auxiliary cache table to prevent duplicate calculations.
1.4 Tabulation (Bottom-Up): Iteratively filling an array starting from base cases up to the desired target state.
Key Problem Archetypes:
- 0/1 Knapsack: O(n*W) time complexity, where n is item count and W is maximum capacity constraint.
- Longest Common Subsequence (LCS): O(m*n) table construction using dp[i][j] = dp[i-1][j-1] + 1 when characters match.
Chapter 2: Graph Shortest Path Algorithms
2.1 Dijkstra Algorithm: Single source shortest path on weighted graphs with non-negative edge weights. Time complexity O((V + E) log V) with binary min-heap.
2.2 Bellman-Ford: Handles negative edge weights, detects negative cycles in O(V * E) time.
2.3 Floyd-Warshall: All-pairs shortest path dynamic programming approach running in O(V^3) time using intermediate vertices.`,
    created_at: "2026-02-10T14:30:00Z",
    updated_at: "2026-02-10T14:30:00Z",
  },
  {
    id: "res-002",
    owner_id: "user-student-002",
    owner_name: "Priya Patel",
    title: "Database Normalization (1NF to BCNF) & SQL Transaction Guide",
    description:
      "Step-by-step solved examples on Functional Dependencies, candidate key discovery, BCNF decomposition without loss of functional dependencies, and ACID properties with 2-Phase Locking.",
    subject_id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    subject_name: "Database Management Systems",
    semester: 4,
    category: "Lecture Notes",
    storage_path: "resources/dbms_normalization_transactions.pdf",
    file_name: "DBMS_Normalization_ACID.pdf",
    file_type: "application/pdf",
    file_size: 2180000,
    tags: ["DBMS", "SQL", "Normalization", "BCNF", "Transactions"],
    moderation_status: "approved",
    download_count: 98,
    view_count: 320,
    content_text: `DATABASE MANAGEMENT SYSTEMS: NORMALIZATION & TRANSACTIONS
Unit 3: Relational Database Design & Normalization
- Functional Dependency (X -> Y): For any two tuples t1 and t2, if t1[X] = t2[X], then t1[Y] must equal t2[Y].
- Armstrong's Axioms: Reflexivity, Augmentation, Transitivity.
- 1st Normal Form (1NF): All attributes must contain atomic (indivisible) values. No repeating groups.
- 2nd Normal Form (2NF): Must be in 1NF and have NO partial dependency (no non-prime attribute should depend on a proper subset of any candidate key).
- 3rd Normal Form (3NF): Must be in 2NF and have NO transitive dependency (if X -> A, then X is superkey or A is prime attribute).
- Boyce-Codd Normal Form (BCNF): For every non-trivial functional dependency X -> Y, X MUST be a superkey.
Unit 4: Transaction Processing & Concurrency
- ACID Properties: Atomicity (all-or-nothing), Consistency (preserves invariants), Isolation (concurrent execution yields serializable schedule), Durability (committed changes persist).
- Two-Phase Locking (2PL): Growing phase (acquire locks), Shrinking phase (release locks). Guarantees serializability.`,
    created_at: "2026-02-12T16:00:00Z",
    updated_at: "2026-02-12T16:00:00Z",
  },
  {
    id: "res-003",
    owner_id: "user-student-001",
    owner_name: "Aarav Sharma",
    title: "Operating Systems 2025 Mid-Term Previous Year Question Paper with Solutions",
    description:
      "Fully solved university examination question paper for OS. Contains detailed answers for CPU scheduling problems, Banker's algorithm matrix calculations, and page replacement FIFO vs LRU.",
    subject_id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
    subject_name: "Operating Systems",
    semester: 4,
    category: "Previous Year Question Papers",
    storage_path: "resources/os_pyq_2025_solutions.pdf",
    file_name: "OS_Midterm_Solved_2025.pdf",
    file_type: "application/pdf",
    file_size: 4120000,
    tags: ["OS", "PYQ", "Bankers Algorithm", "CPU Scheduling", "Virtual Memory"],
    moderation_status: "approved",
    download_count: 215,
    view_count: 640,
    content_text: `OPERATING SYSTEMS UNIVERSITY EXAM 2025 - MODEL SOLUTIONS
Section A: Scheduling & Concurrency
Q1: Explain round robin scheduling with context switch overhead.
Answer: RR assigns fixed time quantum q. If process burst > q, it is preempted. If q is too small, context switch overhead dominates. If q is large, it behaves like FCFS.
Q2: Banker's Deadlock Avoidance Algorithm.
Given Allocation matrix, Max matrix, and Available vector:
Need Matrix = Max - Allocation.
Safety test algorithm checks if a safe sequence exists where Need[i] <= Available.
Section B: Memory Management
Q3: Compare LRU vs FIFO page replacement.
FIFO suffers from Belady's Anomaly where increasing physical page frames can lead to more page faults. LRU does not suffer from Belady's anomaly because it is a stack algorithm.`,
    created_at: "2026-02-14T09:15:00Z",
    updated_at: "2026-02-14T09:15:00Z",
  },
  {
    id: "res-004",
    owner_id: "user-student-002",
    owner_name: "Priya Patel",
    title: "Computer Networks Socket Programming & TCP Congestion Control Lab Manual",
    description:
      "Laboratory experiments manual containing Python socket programming code, Wireshark packet capture analysis, subnetting practice, and TCP Reno vs Tahoe congestion window diagrams.",
    subject_id: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
    subject_name: "Computer Networks",
    semester: 5,
    category: "Lab Manuals",
    storage_path: "resources/cn_socket_lab_manual.pdf",
    file_name: "CN_Lab_Manual_Sockets_Wireshark.pdf",
    file_type: "application/pdf",
    file_size: 2950000,
    tags: ["Networking", "TCP/IP", "Sockets", "Wireshark", "Lab Manual"],
    moderation_status: "approved",
    download_count: 76,
    view_count: 190,
    content_text: `COMPUTER NETWORKS PRACTICAL LAB MANUAL
Experiment 1: Client-Server Socket Communication in Python
Implementation of multi-threaded TCP server using socket library.
Experiment 2: Packet Sniffing & Header Analysis with Wireshark
Analyzing 3-Way Handshake (SYN, SYN-ACK, ACK), FIN termination sequence, and IP header TTL fields.
Experiment 3: TCP Congestion Control Simulation
- Slow Start: cwnd doubles every RTT until threshold ssthresh.
- Congestion Avoidance: additive increase (cwnd += 1 MSS per RTT).
- Fast Retransmit: Triggered by 3 duplicate ACKs without waiting for retransmission timer expiry.`,
    created_at: "2026-02-18T12:00:00Z",
    updated_at: "2026-02-18T12:00:00Z",
  },
  {
    id: "res-005",
    owner_id: "user-student-001",
    owner_name: "Aarav Sharma",
    title: "Foundations of Deep Learning: Neural Network Backprop & Attention Mechanisms",
    description:
      "Mathematical breakdown of gradient descent, backpropagation through computational graphs, cross-entropy loss, and Scaled Dot-Product Attention in Transformer architectures.",
    subject_id: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
    subject_name: "Machine Learning & AI",
    semester: 7,
    category: "Reference Books and Materials",
    storage_path: "resources/deep_learning_attention.pdf",
    file_name: "Deep_Learning_Attention_Backprop.pdf",
    file_type: "application/pdf",
    file_size: 5600000,
    tags: ["AI", "Deep Learning", "Transformers", "Backpropagation", "Attention"],
    moderation_status: "approved",
    download_count: 184,
    view_count: 512,
    content_text: `DEEP LEARNING AND MODERN AI ARCHITECTURES
Chapter 1: Gradient Descent and Chain Rule Backpropagation
Loss function minimization using stochastic gradient descent: w = w - eta * dL/dw.
Backpropagation relies on the calculus chain rule over Directed Acyclic Computation Graphs.
Chapter 2: Attention Is All You Need
Scaled Dot-Product Attention:
Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V
Where Q is query matrix, K is key matrix, V is value matrix, and d_k is key dimensionality scaling factor preventing vanishing softmax gradients.
Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.`,
    created_at: "2026-02-20T17:45:00Z",
    updated_at: "2026-02-20T17:45:00Z",
  },
  {
    id: "res-006",
    owner_id: "user-student-002",
    owner_name: "Priya Patel",
    title: "Draft Cloud Native Kubernetes Deployment Practice Sheets",
    description:
      "Unreviewed student draft of container orchestration exercises, Dockerfiles, Pod specifications, and Service cluster IP configs.",
    subject_id: "20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88",
    subject_name: "Cloud Computing & DevOps",
    semester: 6,
    category: "Assignments and Practice Problems",
    storage_path: "resources/k8s_practice.pdf",
    file_name: "Kubernetes_DevOps_Practice.pdf",
    file_type: "application/pdf",
    file_size: 1820000,
    tags: ["Kubernetes", "DevOps", "Docker", "Containers"],
    moderation_status: "pending",
    download_count: 0,
    view_count: 12,
    content_text: `KUBERNETES PRACTICE AND CONTAINER ORCHESTRATION
Worksheet covering deployment YAML manifests, ConfigMaps, Secrets management, and ingress routing controllers.`,
    created_at: "2026-02-25T11:00:00Z",
    updated_at: "2026-02-25T11:00:00Z",
  },
];

export const INITIAL_REQUESTS: ResourceRequest[] = [
  {
    id: "req-001",
    requester_id: "user-student-002",
    requester_name: "Priya Patel",
    title: "Need Handwritten Notes for Compiler Design Syntax-Directed Translation (SDT)",
    description:
      "Looking for clear notes explaining S-attributed and L-attributed definitions with annotated parse tree examples for Semester 6.",
    subject_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    subject_name: "Data Structures & Algorithms",
    semester: 6,
    deadline: "2026-04-15",
    status: "Open",
    created_at: "2026-02-24T10:00:00Z",
    updated_at: "2026-02-24T10:00:00Z",
  },
  {
    id: "req-002",
    requester_id: "user-student-001",
    requester_name: "Aarav Sharma",
    title: "Previous 3 Years End-Semester Papers for Cloud Computing (CS601)",
    description:
      "Urgent request for 2023, 2024, and 2025 question papers covering AWS IAM, VPC peering, and MapReduce distributed computing.",
    subject_id: "20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88",
    subject_name: "Cloud Computing & DevOps",
    semester: 6,
    deadline: "2026-03-30",
    status: "In Progress",
    created_at: "2026-02-22T14:30:00Z",
    updated_at: "2026-02-23T09:00:00Z",
  },
];

export const INITIAL_REPORTS: ResourceReport[] = [
  {
    id: "rep-001",
    reporter_id: "user-student-001",
    reporter_name: "Aarav Sharma",
    resource_id: "res-006",
    resource_title: "Draft Cloud Native Kubernetes Deployment Practice Sheets",
    reason: "Incorrectly categorized",
    description: "The document is marked as Lab Manual but it is actually an unverified assignment worksheet.",
    status: "pending",
    created_at: "2026-02-26T14:00:00Z",
  },
];

export const INITIAL_MODERATION_LOGS: ModerationLog[] = [
  {
    id: "log-001",
    administrator_id: "user-admin-001",
    administrator_name: "Prof. Sunita Rao",
    action: "approved",
    target_type: "resource",
    target_id: "res-001",
    target_title: "Complete Dynamic Programming & Graph Theory Revision Notes",
    reason: "High academic quality and accurate diagrams",
    created_at: "2026-02-10T15:00:00Z",
  },
  {
    id: "log-002",
    administrator_id: "user-admin-001",
    administrator_name: "Prof. Sunita Rao",
    action: "approved",
    target_type: "resource",
    target_id: "res-002",
    target_title: "Database Normalization (1NF to BCNF) & SQL Transaction Guide",
    reason: "Verified content and proper attributions",
    created_at: "2026-02-12T16:30:00Z",
  },
];

// In-Memory & LocalStorage persistent reactive client store
class EduShareStore {
  private users: UserProfile[] = [...DEMO_USERS];
  private currentUser: UserProfile | null = DEMO_USERS[0]; // default student
  private subjects: Subject[] = [...INITIAL_SUBJECTS];
  private resources: Resource[] = [...INITIAL_RESOURCES];
  private bookmarks: { [userId: string]: string[] } = {
    "user-student-001": ["res-002", "res-003"],
  };
  private requests: ResourceRequest[] = [...INITIAL_REQUESTS];
  private reports: ResourceReport[] = [...INITIAL_REPORTS];
  private moderationLogs: ModerationLog[] = [...INITIAL_MODERATION_LOGS];

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("edushare_resources", JSON.stringify(this.resources));
      localStorage.setItem("edushare_bookmarks", JSON.stringify(this.bookmarks));
      localStorage.setItem("edushare_requests", JSON.stringify(this.requests));
      localStorage.setItem("edushare_reports", JSON.stringify(this.reports));
      localStorage.setItem("edushare_logs", JSON.stringify(this.moderationLogs));
      if (this.currentUser) {
        localStorage.setItem("edushare_user", JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem("edushare_user");
      }
    } catch {
      // ignore storage errors
    }
  }

  private loadFromStorage() {
    try {
      const storedRes = localStorage.getItem("edushare_resources");
      if (storedRes) this.resources = JSON.parse(storedRes);

      const storedBm = localStorage.getItem("edushare_bookmarks");
      if (storedBm) this.bookmarks = JSON.parse(storedBm);

      const storedReq = localStorage.getItem("edushare_requests");
      if (storedReq) this.requests = JSON.parse(storedReq);

      const storedRep = localStorage.getItem("edushare_reports");
      if (storedRep) this.reports = JSON.parse(storedRep);

      const storedLogs = localStorage.getItem("edushare_logs");
      if (storedLogs) this.moderationLogs = JSON.parse(storedLogs);

      const storedUser = localStorage.getItem("edushare_user");
      if (storedUser) this.currentUser = JSON.parse(storedUser);
    } catch {
      // fallback to initial defaults
    }
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  setCurrentUser(user: UserProfile | null) {
    this.currentUser = user;
    this.saveToStorage();
  }

  loginAs(role: "student" | "admin" | "guest", customProfile?: Partial<UserProfile>) {
    if (role === "guest") {
      this.currentUser = null;
    } else if (role === "admin") {
      this.currentUser = { ...DEMO_USERS[1], ...customProfile };
    } else {
      this.currentUser = { ...DEMO_USERS[0], ...customProfile };
    }
    this.saveToStorage();
    return this.currentUser;
  }

  getSubjects(): Subject[] {
    return this.subjects;
  }

  getResources(options?: {
    search?: string;
    semester?: number;
    subjectId?: string;
    category?: string;
    moderationStatus?: ModerationStatus;
    ownerId?: string;
    onlyBookmarkedBy?: string;
  }): Resource[] {
    let list = [...this.resources];

    // Filter by moderation status (unless viewing personal or admin moderation queue)
    if (options?.moderationStatus) {
      list = list.filter((r) => r.moderation_status === options.moderationStatus);
    }

    if (options?.ownerId) {
      list = list.filter((r) => r.owner_id === options.ownerId);
    }

    if (options?.semester) {
      list = list.filter((r) => r.semester === options.semester);
    }

    if (options?.subjectId) {
      list = list.filter((r) => r.subject_id === options.subjectId);
    }

    if (options?.category) {
      list = list.filter((r) => r.category === options.category);
    }

    if (options?.onlyBookmarkedBy) {
      const bookmarkedIds = this.bookmarks[options.onlyBookmarkedBy] || [];
      list = list.filter((r) => bookmarkedIds.includes(r.id));
    }

    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      list = list.filter((r) => {
        return (
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.subject_name && r.subject_name.toLowerCase().includes(q)) ||
          r.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }

    // Attach bookmark status for active user
    const activeUserId = this.currentUser?.id;
    return list.map((r) => ({
      ...r,
      is_bookmarked: activeUserId ? (this.bookmarks[activeUserId] || []).includes(r.id) : false,
    }));
  }

  getResourceById(id: string): Resource | null {
    const r = this.resources.find((item) => item.id === id);
    if (!r) return null;
    const activeUserId = this.currentUser?.id;
    return {
      ...r,
      is_bookmarked: activeUserId ? (this.bookmarks[activeUserId] || []).includes(r.id) : false,
    };
  }

  addResource(input: Omit<Resource, "id" | "created_at" | "updated_at" | "download_count" | "view_count">): Resource {
    const subject = this.subjects.find((s) => s.id === input.subject_id);
    const newResource: Resource = {
      ...input,
      id: `res-${Date.now()}`,
      subject_name: subject?.name || input.subject_name || "Computer Science",
      download_count: 0,
      view_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.resources.unshift(newResource);
    this.saveToStorage();
    return newResource;
  }

  updateModerationStatus(
    resourceId: string,
    status: ModerationStatus,
    reason?: string,
    admin?: UserProfile
  ): Resource | null {
    const idx = this.resources.findIndex((r) => r.id === resourceId);
    if (idx === -1) return null;

    this.resources[idx].moderation_status = status;
    if (reason) this.resources[idx].rejection_reason = reason;
    this.resources[idx].updated_at = new Date().toISOString();

    const log: ModerationLog = {
      id: `log-${Date.now()}`,
      administrator_id: admin?.id || "user-admin-001",
      administrator_name: admin?.full_name || "EduShare Administrator",
      action: status === "approved" ? "approved" : status === "rejected" ? "rejected" : "removed",
      target_type: "resource",
      target_id: resourceId,
      target_title: this.resources[idx].title,
      reason: reason || `Resource status set to ${status}`,
      created_at: new Date().toISOString(),
    };
    this.moderationLogs.unshift(log);
    this.saveToStorage();
    return this.resources[idx];
  }

  deleteResource(resourceId: string, userId: string, isAdmin = false): boolean {
    const idx = this.resources.findIndex((r) => r.id === resourceId);
    if (idx === -1) return false;

    // Check ownership or admin
    if (!isAdmin && this.resources[idx].owner_id !== userId) {
      return false;
    }

    this.resources.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  toggleBookmark(userId: string, resourceId: string): boolean {
    if (!this.bookmarks[userId]) {
      this.bookmarks[userId] = [];
    }
    const idx = this.bookmarks[userId].indexOf(resourceId);
    let bookmarked = false;
    if (idx > -1) {
      this.bookmarks[userId].splice(idx, 1);
      bookmarked = false;
    } else {
      this.bookmarks[userId].push(resourceId);
      bookmarked = true;
    }
    this.saveToStorage();
    return bookmarked;
  }

  incrementDownload(resourceId: string): number {
    const idx = this.resources.findIndex((r) => r.id === resourceId);
    if (idx !== -1) {
      this.resources[idx].download_count += 1;
      this.saveToStorage();
      return this.resources[idx].download_count;
    }
    return 0;
  }

  getRequests(): ResourceRequest[] {
    return [...this.requests];
  }

  addRequest(input: Omit<ResourceRequest, "id" | "created_at" | "updated_at">): ResourceRequest {
    const subject = this.subjects.find((s) => s.id === input.subject_id);
    const newReq: ResourceRequest = {
      ...input,
      id: `req-${Date.now()}`,
      subject_name: subject?.name || input.subject_name || "General",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.requests.unshift(newReq);
    this.saveToStorage();
    return newReq;
  }

  updateRequestStatus(requestId: string, status: RequestStatus): ResourceRequest | null {
    const idx = this.requests.findIndex((r) => r.id === requestId);
    if (idx === -1) return null;
    this.requests[idx].status = status;
    this.requests[idx].updated_at = new Date().toISOString();
    this.saveToStorage();
    return this.requests[idx];
  }

  getReports(): ResourceReport[] {
    return [...this.reports];
  }

  addReport(input: Omit<ResourceReport, "id" | "status" | "created_at">): ResourceReport {
    const targetResource = this.resources.find((r) => r.id === input.resource_id);
    const newReport: ResourceReport = {
      ...input,
      id: `rep-${Date.now()}`,
      resource_title: targetResource?.title || "Resource",
      status: "pending",
      created_at: new Date().toISOString(),
    };
    this.reports.unshift(newReport);
    this.saveToStorage();
    return newReport;
  }

  resolveReport(reportId: string, action: "resolve" | "dismiss", admin?: UserProfile): boolean {
    const idx = this.reports.findIndex((r) => r.id === reportId);
    if (idx === -1) return false;

    this.reports[idx].status = action === "resolve" ? "resolved" : "dismissed";
    this.reports[idx].reviewed_by = admin?.full_name || "Administrator";
    this.reports[idx].reviewed_at = new Date().toISOString();

    const log: ModerationLog = {
      id: `log-${Date.now()}`,
      administrator_id: admin?.id || "user-admin-001",
      administrator_name: admin?.full_name || "Administrator",
      action: action === "resolve" ? "resolved_report" : "dismissed_report",
      target_type: "report",
      target_id: reportId,
      target_title: this.reports[idx].resource_title,
      reason: `Report marked as ${this.reports[idx].status}`,
      created_at: new Date().toISOString(),
    };
    this.moderationLogs.unshift(log);
    this.saveToStorage();
    return true;
  }

  getModerationLogs(): ModerationLog[] {
    return [...this.moderationLogs];
  }

  getStats(): PlatformStats {
    const approvedCount = this.resources.filter((r) => r.moderation_status === "approved").length;
    const pendingCount = this.resources.filter((r) => r.moderation_status === "pending").length;
    const reportedCount = this.reports.filter((r) => r.status === "pending").length;
    const openReqsCount = this.requests.filter((r) => r.status === "Open" || r.status === "In Progress").length;
    const totalDownloads = this.resources.reduce((acc, curr) => acc + curr.download_count, 0);

    return {
      total_students: 1240, // active community members
      total_resources: approvedCount,
      total_downloads: totalDownloads,
      pending_submissions: pendingCount,
      reported_resources: reportedCount,
      open_requests: openReqsCount,
    };
  }
}

// Global singleton instance
export const mockStore = new EduShareStore();
