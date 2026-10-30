-- EduShare Seed Data Migration 003
-- Initial Subjects and Curriculum Taxonomy

INSERT INTO public.subjects (id, name, code, description, department)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Data Structures & Algorithms', 'CS301', 'Arrays, Linked Lists, Trees, Graphs, Sorting, Dynamic Programming and Complexity Analysis', 'Computer Science & Engineering'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Database Management Systems', 'CS403', 'Relational Algebra, SQL, Normalization, ACID Transactions, and Concurrency Control', 'Computer Science & Engineering'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Operating Systems', 'CS402', 'Processes, Threads, CPU Scheduling, Memory Virtualization, Deadlocks, and File Systems', 'Computer Science & Engineering'),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Computer Networks', 'CS501', 'OSI/TCP-IP Models, Routing Algorithms, Transport Layer Protocols, and Network Security', 'Computer Science & Engineering'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Machine Learning & AI', 'CS701', 'Supervised & Unsupervised Learning, Neural Networks, Loss Functions, and Transformers', 'Artificial Intelligence'),
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Software Engineering & Agile', 'CS502', 'System Modeling, Design Patterns, CI/CD, Agile/Scrum Principles, and Testing QA', 'Information Technology'),
    ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Digital Logic & Computer Org', 'CS201', 'Boolean Algebra, Logic Gates, Multiplexers, CPU Datapath, and Assembly Architecture', 'Computer Science & Engineering'),
    ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'Cloud Computing & DevOps', 'CS601', 'Virtualization, Containers, Microservices, Kubernetes, and Serverless Architecture', 'Cloud & Systems')
ON CONFLICT (code) DO NOTHING;
