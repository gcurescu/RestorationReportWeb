import os
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

BASE = r"C:\Users\Gentillo\RestorationReportWeb"
cover_path  = os.path.join(BASE, "scripts", "cover_page_temp.pdf")
logo_path   = os.path.join(BASE, "public", "RestorationReportLogo.png")
guide_path  = os.path.join(BASE, "public", "5-documentation-mistakes-guide.pdf")
output_path = os.path.join(BASE, "public", "5-documentation-mistakes-guide.pdf")

c = canvas.Canvas(cover_path, pagesize=letter)

# Full navy background
c.setFillColor(NAVY)
c.rect(0, 0, W, H, fill=1, stroke=0)

# Orange top bar
c.setFillColor(ORANGE)
c.rect(0, H - 10, W, 10, fill=1, stroke=0)

# Orange bottom bar
c.rect(0, 0, W, 8, fill=1, stroke=0)

# Logo — top left (80x80 px, scaled nicely)
logo_size = 0.75 * inch
c.drawImage(logo_path, 0.55 * inch, H - 0.55 * inch - logo_size,
            width=logo_size, height=logo_size, preserveAspectRatio=True, mask='auto')

# Brand name next to logo
c.setFillColor(WHITE)
c.setFont("Helvetica-Bold", 14)
c.drawString(0.55 * inch + logo_size + 0.15 * inch, H - 0.42 * inch, "RESTORATION")
c.drawString(0.55 * inch + logo_size + 0.15 * inch, H - 0.58 * inch, "REPORT")

# Horizontal rule under header
c.setStrokeColor(ORANGE)
c.setLineWidth(1.5)
c.line(0.55 * inch, H - 0.75 * inch, W - 0.55 * inch, H - 0.75 * inch)

# "FREE RESOURCE BUNDLE" badge
badge_y = H - 1.65 * inch
c.setFillColor(ORANGE)
c.roundRect(0.55 * inch, badge_y, 2.5 * inch, 0.33 * inch, 4, fill=1, stroke=0)
c.setFillColor(WHITE)
c.setFont("Helvetica-Bold", 10)
c.drawString(0.72 * inch, badge_y + 0.095 * inch, "FREE RESOURCE BUNDLE")

# Main headline
c.setFillColor(WHITE)
c.setFont("Helvetica-Bold", 44)
c.drawString(0.55 * inch, H - 2.65 * inch, "5 Documentation")
c.drawString(0.55 * inch, H - 3.22 * inch, "Mistakes That")
c.setFillColor(ORANGE)
c.drawString(0.55 * inch, H - 3.79 * inch, "Get Claims Denied")

# Subtitle
c.setFillColor(LIGHT)
c.setFont("Helvetica", 16)
c.drawString(0.55 * inch, H - 4.3 * inch, "And How to Fix Them Before Your Next Job")

# Divider
c.setStrokeColor(colors.HexColor("#2E5A8A"))
c.setLineWidth(1)
c.line(0.55 * inch, H - 4.65 * inch, W - 0.55 * inch, H - 4.65 * inch)

# What's inside box
box_y = H - 6.55 * inch
c.setFillColor(colors.HexColor("#0E2A45"))
c.roundRect(0.55 * inch, box_y, W - 1.1 * inch, 1.65 * inch, 6, fill=1, stroke=0)

c.setFillColor(ORANGE)
c.setFont("Helvetica-Bold", 11)
c.drawString(0.85 * inch, box_y + 1.33 * inch, "WHAT'S INSIDE THIS BUNDLE:")

items = [
    "✓   5 Documentation Mistakes Guide  (this PDF)",
    "✓   Insurance-Ready Report Template  (Word doc)",
    "✓   Pre-Submission Checklist",
]
c.setFillColor(WHITE)
c.setFont("Helvetica", 11)
for i, item in enumerate(items):
    c.drawString(0.85 * inch, box_y + 0.95 * inch - i * 0.3 * inch, item)

# Tagline
c.setFillColor(LIGHT)
c.setFont("Helvetica", 12)
c.drawCentredString(W / 2, 1.1 * inch,
    "Built for restoration contractors who are tired of losing money to adjuster kickbacks.")

# Website
c.setFillColor(ORANGE)
c.setFont("Helvetica-Bold", 13)
c.drawCentredString(W / 2, 0.7 * inch, "restorationreport.com")

c.save()

# Merge: cover page + existing guide pages
writer = PdfWriter()

cover_reader = PdfReader(cover_path)
writer.add_page(cover_reader.pages[0])

guide_reader = PdfReader(guide_path)
for page in guide_reader.pages:
    writer.add_page(page)

# Write to a temp file first, then replace
temp_out = output_path + ".tmp"
with open(temp_out, "wb") as f:
    writer.write(f)

os.replace(temp_out, output_path)
os.remove(cover_path)

print(f"Done — {len(writer.pages)} pages, saved to {output_path}")
