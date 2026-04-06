import os
from PIL import Image
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from pypdf import PdfReader, PdfWriter

W, H = letter  # 612 x 792

NAVY   = colors.HexColor("#1B3A5C")
ORANGE = colors.HexColor("#E8943A")
WHITE  = colors.white
LIGHT  = colors.HexColor("#D5E8F0")
DARK   = colors.HexColor("#0E2A45")

BASE        = r"C:\Users\Gentillo\RestorationReportWeb"
cover_path  = os.path.join(BASE, "scripts", "cover_page_temp.pdf")
logo_src    = os.path.join(BASE, "public", "RestorationReportLogo.png")
logo_clean  = os.path.join(BASE, "scripts", "logo_clean.png")
# Source is the original bare guide (no cover). Keep a clean copy in Downloads.
# Output overwrites the public file with cover prepended.
guide_path  = os.path.join(r"C:\Users\Gentillo\Downloads", "5-documentation-mistakes-guide.pdf")
output_path = os.path.join(BASE, "public", "5-documentation-mistakes-guide.pdf")

# ── Step 1: Remove white background from logo ────────────────────────────────
img = Image.open(logo_src).convert("RGBA")
data = img.getdata()
new_data = []
for r, g, b, a in data:
    # Replace near-white pixels with transparent
    if r > 230 and g > 230 and b > 230:
        new_data.append((r, g, b, 0))
    else:
        new_data.append((r, g, b, a))
img.putdata(new_data)
img.save(logo_clean, "PNG")

# ── Step 2: Build cover page ─────────────────────────────────────────────────
c = canvas.Canvas(cover_path, pagesize=letter)

# Full navy background
c.setFillColor(NAVY)
c.rect(0, 0, W, H, fill=1, stroke=0)

# Orange top accent bar (6pt)
c.setFillColor(ORANGE)
c.rect(0, H - 6, W, 6, fill=1, stroke=0)

# Orange bottom accent bar (6pt)
c.rect(0, 0, W, 6, fill=1, stroke=0)

# ── Header area: logo + brand name ───────────────────────────────────────────
LOGO_SIZE = 0.72 * inch   # 51.8 pt
LOGO_X    = 0.55 * inch
LOGO_Y    = H - 0.45 * inch - LOGO_SIZE  # top of logo at 0.45" from top

# Draw logo (transparent bg)
c.drawImage(logo_clean, LOGO_X, LOGO_Y,
            width=LOGO_SIZE, height=LOGO_SIZE,
            preserveAspectRatio=True, mask='auto')

# Brand name to the right of logo, vertically centered
text_x = LOGO_X + LOGO_SIZE + 0.18 * inch
c.setFillColor(WHITE)
c.setFont("Helvetica-Bold", 15)
c.drawString(text_x, LOGO_Y + 0.32 * inch, "RESTORATION")
c.setFont("Helvetica", 13)
c.setFillColor(LIGHT)
c.drawString(text_x, LOGO_Y + 0.10 * inch, "REPORT")

# Orange divider — safely BELOW the logo bottom
c.setStrokeColor(ORANGE)
c.setLineWidth(1.5)
divider_y = LOGO_Y - 0.22 * inch
c.line(0.55 * inch, divider_y, W - 0.55 * inch, divider_y)

# ── "FREE RESOURCE BUNDLE" badge ─────────────────────────────────────────────
badge_y = divider_y - 0.55 * inch
c.setFillColor(ORANGE)
c.roundRect(0.55 * inch, badge_y, 2.55 * inch, 0.34 * inch, 4, fill=1, stroke=0)
c.setFillColor(WHITE)
c.setFont("Helvetica-Bold", 10)
c.drawString(0.72 * inch, badge_y + 0.1 * inch, "FREE RESOURCE BUNDLE")

# ── Main headline ─────────────────────────────────────────────────────────────
hl_y = badge_y - 0.7 * inch
c.setFillColor(WHITE)
c.setFont("Helvetica-Bold", 46)
c.drawString(0.55 * inch, hl_y,              "5 Documentation")
c.drawString(0.55 * inch, hl_y - 0.65 * inch, "Mistakes That")
c.setFillColor(ORANGE)
c.drawString(0.55 * inch, hl_y - 1.3 * inch, "Get Claims Denied")

# ── Subtitle ──────────────────────────────────────────────────────────────────
sub_y = hl_y - 1.7 * inch
c.setFillColor(LIGHT)
c.setFont("Helvetica", 15)
c.drawString(0.55 * inch, sub_y, "And How to Fix Them Before Your Next Job")

# Thin divider
c.setStrokeColor(colors.HexColor("#2E5A8A"))
c.setLineWidth(0.75)
div2_y = sub_y - 0.35 * inch
c.line(0.55 * inch, div2_y, W - 0.55 * inch, div2_y)

# ── "What's Inside" box ───────────────────────────────────────────────────────
box_y = div2_y - 1.75 * inch
box_h = 1.62 * inch
c.setFillColor(DARK)
c.roundRect(0.55 * inch, box_y, W - 1.1 * inch, box_h, 6, fill=1, stroke=0)

# Orange left accent stripe inside box
c.setFillColor(ORANGE)
c.roundRect(0.55 * inch, box_y, 0.06 * inch, box_h, 3, fill=1, stroke=0)

c.setFillColor(ORANGE)
c.setFont("Helvetica-Bold", 11)
c.drawString(0.85 * inch, box_y + box_h - 0.32 * inch, "WHAT'S INSIDE THIS BUNDLE:")

items = [
    ("\u2713", "5 Documentation Mistakes Guide", "(this PDF)"),
    ("\u2713", "Insurance-Ready Report Template", "(Word doc, fillable)"),
    ("\u2713", "Pre-Submission Checklist", ""),
]
for i, (check, title, note) in enumerate(items):
    item_y = box_y + box_h - 0.66 * inch - i * 0.36 * inch
    c.setFillColor(ORANGE)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(0.85 * inch, item_y, check + "  ")
    c.setFillColor(WHITE)
    c.drawString(0.95 * inch, item_y, title)
    if note:
        c.setFillColor(LIGHT)
        c.setFont("Helvetica", 9)
        c.drawString(0.95 * inch + c.stringWidth(title, "Helvetica-Bold", 11) + 0.1 * inch, item_y + 1, note)

# ── Bottom tagline ────────────────────────────────────────────────────────────
c.setFillColor(LIGHT)
c.setFont("Helvetica", 11)
c.drawCentredString(W / 2, box_y - 0.45 * inch,
    "Built for restoration contractors who are tired of losing money to adjuster kickbacks.")

# Website
c.setFillColor(ORANGE)
c.setFont("Helvetica-Bold", 13)
c.drawCentredString(W / 2, box_y - 0.78 * inch, "restorationreport.com")

c.save()

# ── Step 3: Merge cover + guide ───────────────────────────────────────────────
writer = PdfWriter()
writer.add_page(PdfReader(cover_path).pages[0])
for page in PdfReader(guide_path).pages:
    writer.add_page(page)

temp = output_path + ".tmp"
with open(temp, "wb") as f:
    writer.write(f)
os.replace(temp, output_path)

# Cleanup
os.remove(cover_path)
os.remove(logo_clean)

print(f"Done — {len(writer.pages)} pages -> {output_path}")
