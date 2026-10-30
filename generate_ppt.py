import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Palette
    COLOR_BG_DARK = RGBColor(11, 25, 44)       # Deep Slate Navy #0B192C
    COLOR_PRIMARY = RGBColor(30, 62, 98)       # Royal Blue #1E3E62
    COLOR_ACCENT = RGBColor(255, 101, 0)       # Energetic Coral #FF6500
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_TEXT_MUTED = RGBColor(160, 174, 192) # Light Grey
    COLOR_CARD_BG = RGBColor(20, 38, 64)       # Card background
    COLOR_BORDER = RGBColor(45, 75, 115)       # Border tone
    COLOR_SUCCESS = RGBColor(46, 213, 115)     # Mint Green

    def set_slide_background(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_header(slide, title_text, category_text):
        # Category badge
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_ACCENT
        
        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(28)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE

    blank_layout = prs.slide_layouts[6]

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, COLOR_BG_DARK)
    
    # Sub-theme badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.2), Inches(5.8), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = COLOR_CARD_BG
    badge.line.color.rgb = COLOR_BORDER
    tf_b = badge.text_frame
    p_b = tf_b.paragraphs[0]
    p_b.text = "Digital Learning & Educational Resource Accessibility"
    p_b.font.size = Pt(11)
    p_b.font.bold = True
    p_b.font.color.rgb = COLOR_ACCENT
    p_b.alignment = PP_ALIGN.CENTER

    # Title
    tbox = s1.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.7), Inches(1.5))
    tf = tbox.text_frame
    p = tf.paragraphs[0]
    p.text = "EduShare"
    p.font.size = Pt(56)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE
    
    # Tagline
    p2 = tf.add_paragraph()
    p2.text = "Learn Together. Share Knowledge. Grow Together."
    p2.font.size = Pt(24)
    p2.font.color.rgb = COLOR_ACCENT
    p2.font.bold = True

    # Description
    desc_box = s1.shapes.add_textbox(Inches(0.8), Inches(3.6), Inches(10), Inches(1.2))
    tf_desc = desc_box.text_frame
    p_desc = tf_desc.paragraphs[0]
    p_desc.text = "An AI-assisted open educational resource-sharing platform engineered to eliminate academic material silos and deliver grounded curriculum study assistance."
    p_desc.font.size = Pt(16)
    p_desc.font.color.rgb = COLOR_TEXT_MUTED

    # Meta cards at bottom
    meta_cards = [
        ("Presenter", "Siddhesh Gire\nsiddhesh.gire2501132072@student.sspu.ac.in"),
        ("Technology Stack", "Next.js 15, TypeScript, Tailwind\nSupabase & Google Gemini 2.5 Flash"),
        ("Project Status", "Prototype Testing in Progress\nAutomated Verification Passed (20/20)")
    ]
    for i, (head, val) in enumerate(meta_cards):
        left = Inches(0.8 + i * 3.9)
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(5.1), Inches(3.6), Inches(1.5))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_BORDER
        tf_c = card.text_frame
        p_h = tf_c.paragraphs[0]
        p_h.text = head.upper()
        p_h.font.size = Pt(10)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_ACCENT
        
        p_v = tf_c.add_paragraph()
        p_v.text = val
        p_v.font.size = Pt(12)
        p_v.font.color.rgb = COLOR_WHITE

    # ==========================================
    # SLIDE 2: Problem Statement & Friction
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, COLOR_BG_DARK)
    add_header(s2, "The Academic Bottleneck in Higher Education", "Problem Statement & Market Need")

    problems = [
        ("Fragmented & Siloed Materials", "WhatsApp groups, Telegram channels, and chaotic Google Drive folders lead to broken links, buried exam papers, and wasted study hours with zero taxonomy."),
        ("Ungrounded AI Hallucinations", "Generic LLM chatbots invent citations and produce incorrect equations. Students need an AI assistant anchored strictly to verified lecture notes and syllabus guides."),
        ("No Peer Contribution System", "Students who want specific reference notes or previous-year questions have no structured way to request them or incentivize peer assistance."),
        ("Zero Copyright & Content Governance", "Unregulated repositories risk hosting copyright-infringing textbooks or inappropriate content without administrative review or community abuse reporting.")
    ]

    for i, (title, detail) in enumerate(problems):
        row = i // 2
        col = i % 2
        left = Inches(0.8 + col * 5.9)
        top = Inches(1.8 + row * 2.5)
        
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.6), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_BORDER
        
        tf_p = card.text_frame
        tf_p.word_wrap = True
        p_h = tf_p.paragraphs[0]
        p_h.text = f"0{i+1}.  {title}"
        p_h.font.size = Pt(15)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_WHITE
        
        p_d = tf_p.add_paragraph()
        p_d.text = "\n" + detail
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 3: The Solution & Innovation
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, COLOR_BG_DARK)
    add_header(s3, "EduShare: The Unified AI Learning Ecosystem", "Proposed Solution & Value Proposition")

    pillars = [
        ("Centralized Academic Taxonomy", "Organized by University, Department, Semester, and Subject. Instant multi-attribute search over curated notes, question banks, and lab manuals."),
        ("Grounded Gemini 2.5 Flash Assistant", "Extracts structured key takeaways, generates 3-question conceptual mastery quizzes, and provides strictly anchored Q&A with prompt-injection defense."),
        ("Peer-to-Peer Request Marketplace", "Students request missing study materials with course tags. Peers fulfill requests with direct uploads, creating a collaborative community."),
        ("Enterprise Trust & Moderation", "Full multi-role RBAC (Student, Admin, Guest), moderation queues with batch approval/rejection, DMCA reporting, and live database health monitoring.")
    ]

    for i, (title, detail) in enumerate(pillars):
        row = i // 2
        col = i % 2
        left = Inches(0.8 + col * 5.9)
        top = Inches(1.8 + row * 2.5)
        
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.6), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_ACCENT if i == 1 else COLOR_BORDER
        
        tf_s = card.text_frame
        tf_s.word_wrap = True
        p_h = tf_s.paragraphs[0]
        p_h.text = title
        p_h.font.size = Pt(15)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_ACCENT if i == 1 else COLOR_WHITE
        
        p_d = tf_s.add_paragraph()
        p_d.text = "\n" + detail
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 4: System Architecture & Technical Stack
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, COLOR_BG_DARK)
    add_header(s4, "Full-Stack Enterprise Architecture", "Technical System Design")

    layers = [
        ("Frontend & App Layer", "Next.js 15 (App Router)\nTypeScript + Tailwind CSS\nLucide React Icons\nResponsive Desktop/Mobile UI\nFast client & server caching"),
        ("Database & Security", "Supabase Cloud PostgreSQL 15\nRow-Level Security (RLS) on all tables\nMulti-role RBAC (Student, Admin)\nLive Health Check API endpoint\nFull Audit Logging"),
        ("Object Storage & Media", "Supabase Storage Bucket\nStrict 25MB file upload limit\nMulti-format: PDF, DOCX, PPTX\nAtomic download counters\nFair-use licensing agreement"),
        ("AI Core & Assistant", "Google Gemini 2.5 Flash\nLive Dynamic Model Handshake\nStrict anti-jailbreak sanitization\nStructured JSON takeaway parsing\n3-Question Self-Assessment Quizzes")
    ]

    for i, (title, detail) in enumerate(layers):
        left = Inches(0.8 + i * 2.95)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(2.75), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_BORDER
        
        tf_l = card.text_frame
        tf_l.word_wrap = True
        p_h = tf_l.paragraphs[0]
        p_h.text = title
        p_h.font.size = Pt(14)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_ACCENT
        
        p_d = tf_l.add_paragraph()
        p_d.text = "\n" + detail
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE

    # ==========================================
    # SLIDE 5: Key Platform Features & Workflows
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, COLOR_BG_DARK)
    add_header(s5, "Core Modules & Interactive Workflows", "Platform Capabilities")

    features = [
        ("Curriculum Discovery", "Filter notes, question banks, and syllabus guides by branch, semester, and file type with debounced search."),
        ("Grounded AI Assistant", "Interactive takeaways, 3-question mastery quiz, and citation-anchored study questions powered by Gemini 2.5."),
        ("Peer Study Requests", "Post missing syllabus requests with semester tags; peers discover open requests and fulfill with direct uploads."),
        ("Student Personal Hub", "Track contributed uploads, view download analytics, and manage synchronized personal bookmarks in one place."),
        ("Admin Moderation Portal", "Review pending student uploads with single-click approve/reject actions and resolve community abuse reports."),
        ("Live Health & Security", "Diagnostic monitor tracking live database connection, storage bucket health, and zero-trust RLS enforcement.")
    ]

    for i, (title, detail) in enumerate(features):
        row = i // 3
        col = i % 3
        left = Inches(0.8 + col * 3.9)
        top = Inches(1.8 + row * 2.5)
        
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_BORDER
        
        tf_f = card.text_frame
        tf_f.word_wrap = True
        p_h = tf_f.paragraphs[0]
        p_h.text = title
        p_h.font.size = Pt(14)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_ACCENT
        
        p_d = tf_f.add_paragraph()
        p_d.text = "\n" + detail
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 6: Verification, Testing & Roadmap
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, COLOR_BG_DARK)
    add_header(s6, "Quality Verification & Future Evolution", "Testing, Deployment & Roadmap")

    # Left: Testing & Status Box
    t_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8))
    t_box.fill.solid()
    t_box.fill.fore_color.rgb = COLOR_CARD_BG
    t_box.line.color.rgb = COLOR_SUCCESS
    
    tf_t = t_box.text_frame
    tf_t.word_wrap = True
    p_th = tf_t.paragraphs[0]
    p_th.text = "TESTING & CURRENT STATUS"
    p_th.font.size = Pt(14)
    p_th.font.bold = True
    p_th.font.color.rgb = COLOR_SUCCESS
    
    p_td = tf_t.add_paragraph()
    p_td.text = """
* Automated Test Suite: 20/20 Vitest Tests Passed
  - Input validation & 25MB boundary checks
  - Multi-role permission matrix & RBAC
  - Multi-dimensional taxonomy filtering
  - Gemini prompt-injection defense & grounding
  - Live Supabase client & fallback integration

* Production Build Verification:
  - 17/17 Next.js routes statically generated (Exit 0)
  - Zero critical lint or type errors

* Prototype Deployment Status:
  - Prototype deployed & active user testing in progress
  - Live repository synced on GitHub
    """
    p_td.font.size = Pt(11)
    p_td.font.color.rgb = COLOR_WHITE

    # Right: Roadmap Box
    r_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8))
    r_box.fill.solid()
    r_box.fill.fore_color.rgb = COLOR_CARD_BG
    r_box.line.color.rgb = COLOR_BORDER
    
    tf_r = r_box.text_frame
    tf_r.word_wrap = True
    p_rh = tf_r.paragraphs[0]
    p_rh.text = "STRATEGIC FUTURE ROADMAP"
    p_rh.font.size = Pt(14)
    p_rh.font.bold = True
    p_rh.font.color.rgb = COLOR_ACCENT
    
    p_rd = tf_r.add_paragraph()
    p_rd.text = """
* Phase 1 (Near-Term):
  - Institutional Single Sign-On (SSO) integration (.edu/.ac.in)
  - Full-text vector search with pgvector for semantic note indexing

* Phase 2 (Growth & Engagement):
  - Gamified peer recognition: Contributor badges & verified author status
  - In-browser interactive annotation & collaborative PDF highlighting

* Phase 3 (Ecosystem Scale):
  - Multi-lingual audio summaries using Gemini speech synthesis
  - Offline-first Progressive Web App (PWA) with background sync
  - Cross-university curriculum equivalency mapping
    """
    p_rd.font.size = Pt(11)
    p_rd.font.color.rgb = COLOR_WHITE

    # Save
    out_path = os.path.join(os.path.dirname(__file__), "EduShare_Project_Presentation.pptx")
    prs.save(out_path)
    print(f"Presentation generated successfully at: {out_path}")

if __name__ == "__main__":
    create_deck()
