#!/usr/bin/env python3
"""Render the Setnayan NPC submission markdown documents to styled PDFs + one merged packet."""
import os, sys, html
import markdown
from xhtml2pdf import pisa
from pypdf import PdfReader, PdfWriter

CORPUS = os.path.expanduser("~/Documents/Claude/Projects/Setnayan")
OUT = os.path.join(CORPUS, "NPC_Submission_PDF_2026-07-16")
os.makedirs(OUT, exist_ok=True)

# Stamped into every page footer so a reader can tell the pack's currency from the
# artifact itself, not from a folder name. Bump when you regenerate.
REGEN_DATE = "2026-08-17"
MERGED_NAME = f"Setnayan_NPC_Submission_Complete_{REGEN_DATE}.pdf"

# (source markdown path relative to CORPUS, output pdf basename, human title)
DOCS = [
    ("NPC_Privacy_Compliance_Dossier_2026-07-12.md", "00_Executive_Dossier", "Privacy Compliance Dossier (Executive Submission)"),
    ("NPC_Compliance/00_README_NPC_Compliance_Pack.md", "01_README_Compliance_Pack", "NPC Compliance Pack — README"),
    # ⚠ ADOPTED, NOT DRAFT. Corrected 2026-08-17. These three had an _ADOPTED_
    # twin from 2026-07-24 carrying every DPO correction, while this list still
    # named the superseded _DRAFT_ — so the shipped pack was rendered from the
    # unadopted text and re-shipped its retired claims (notably the Privacy
    # Manual's "90 days hot → 5 years cold / 5-year hard limit" photo row, which
    # DPS-05 retired on 2026-08-07 and which contradicts the live /privacy page).
    # Regenerating alone would NOT have fixed that: the source pointer was the bug.
    # If a doc gains an _ADOPTED_ twin, repoint it HERE in the same commit.
    ("NPC_Compliance/01_Privacy_Manual_ADOPTED_2026-07-24.md", "02_Privacy_Manual", "Privacy Manual"),
    ("NPC_Compliance/02_Records_of_Processing_Activities_DRAFT_2026-07-05.md", "03_Records_of_Processing_Activities", "Records of Processing Activities (ROPA)"),
    ("NPC_Compliance/03_DPO_Designation_and_NPCRS_ADOPTED_2026-07-24.md", "04_DPO_Designation_and_NPC_Registration_Sheet", "DPO Designation & NPC Registration Sheet"),
    ("NPC_Compliance/04_Data_Breach_Management_Policy_ADOPTED_2026-07-24.md", "05_Data_Breach_Management_Policy", "Data Breach Management Policy"),
    ("NPC_Compliance/05_DPIA_Register_DRAFT_2026-07-05.md", "06_DPIA_Register", "DPIA Register"),
    ("NPC_Compliance/06_DPIA_Face_Vectors_DRAFT_2026-07-05.md", "07_DPIA_Face_Vectors", "DPIA — Face Vectors"),
    ("NPC_Compliance/07_Compliance_Facts_Register.md", "08_Compliance_Facts_Register", "Compliance Facts Register"),
    ("NPC_Compliance/08_DPIA_AntiFraud_Trust_Integrity_2026-07-07.md", "09_DPIA_AntiFraud_Trust_Integrity", "DPIA — Anti-Fraud, Trust & Integrity"),
    ("Data_Retention_Schedule_2026-07-11.md", "10_Data_Retention_Schedule", "Data Retention Schedule"),
    ("Privacy_Reconciliation_Home_and_Data_Flows_2026-07-13.md", "11_Privacy_Reconciliation", "Privacy Reconciliation — Home & Data Flows"),
    ("Device_Fingerprint_Data_Use_DPO_Review_2026-07-12.md", "12_Device_Fingerprint_DPO_Review", "Device-Fingerprint Data Use — DPO Review"),
]

CSS = """
@page {
  size: a4 portrait;
  margin: 2.4cm 1.9cm 2.1cm 1.9cm;
  @frame footer_frame { -pdf-frame-content: footerContent; left: 1.9cm; right: 1.9cm; bottom: 1.1cm; height: 1cm; }
}
body { font-family: Helvetica, Arial, sans-serif; font-size: 9.3pt; line-height: 1.45; color: #1a1a1a; }
h1 { font-size: 17pt; color: #111; border-bottom: 2pt solid #8a6d3b; padding-bottom: 5pt; margin: 0 0 10pt 0; }
h2 { font-size: 12.5pt; color: #222; margin: 15pt 0 5pt 0; border-bottom: 0.6pt solid #ccc; padding-bottom: 2pt; }
h3 { font-size: 10.6pt; color: #333; margin: 11pt 0 3pt 0; }
h4 { font-size: 9.6pt; color: #444; margin: 8pt 0 3pt 0; }
p { margin: 0 0 6pt 0; }
ul, ol { margin: 0 0 6pt 16pt; }
li { margin: 0 0 2pt 0; }
strong { color: #111; }
code { font-family: Courier, monospace; font-size: 8.4pt; background: #f2f0ec; }
hr { border: none; border-top: 0.6pt solid #ddd; margin: 10pt 0; }
blockquote { margin: 6pt 0 6pt 10pt; padding-left: 8pt; border-left: 2pt solid #8a6d3b; color: #444; }
table { width: 100%; border-collapse: collapse; margin: 6pt 0 10pt 0; font-size: 8.1pt; }
th { background: #efeae0; color: #111; font-weight: bold; text-align: left; padding: 3pt 4pt; border: 0.5pt solid #bbb; }
td { padding: 3pt 4pt; border: 0.5pt solid #ccc; vertical-align: top; }
#footerContent { font-size: 7.5pt; color: #999; text-align: center; }
.doc-meta { font-size: 8pt; color: #777; margin: 0 0 12pt 0; }
"""

def convert(md_rel, out_base, title):
    src = os.path.join(CORPUS, md_rel)
    if not os.path.exists(src):
        # ⚠ Was `print SKIP; return None` until 2026-08-17 — a renamed or mistyped
        # source silently dropped a whole document from the merged packet, and the
        # run still exited 0. A compliance pack quietly missing its ROPA looks
        # exactly like a successful build. Fail loudly instead.
        raise SystemExit(f"FATAL: source missing for '{title}': {md_rel}")
    with open(src, encoding="utf-8") as f:
        text = f.read()
    body = markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "sane_lists", "nl2br", "attr_list"],
    )
    footer = html.escape(f"Setnayan · NPC Submission · {title} · regenerated {REGEN_DATE}")
    doc = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>{CSS}</style></head>
<body>
<div id="footerContent">{footer} — Page <pdf:pagenumber/> of <pdf:pagecount/></div>
{body}
</body></html>"""
    out_path = os.path.join(OUT, out_base + ".pdf")
    with open(out_path, "wb") as f:
        res = pisa.CreatePDF(doc, dest=f, encoding="utf-8")
    if res.err:
        print(f"  ERROR converting {md_rel}: {res.err}"); return None
    print(f"  ok: {out_base}.pdf")
    return out_path

def main():
    print(f"Output dir: {OUT}")
    produced = []
    for md_rel, out_base, title in DOCS:
        p = convert(md_rel, out_base, title)
        if p: produced.append(p)
    # Merge into one packet.
    if produced:
        writer = PdfWriter()
        for p in produced:
            for page in PdfReader(p).pages:
                writer.add_page(page)
        merged = os.path.join(OUT, MERGED_NAME)
        with open(merged, "wb") as f:
            writer.write(f)
        total = len(writer.pages)
        print(f"\nMerged packet: {os.path.basename(merged)} ({total} pages, {len(produced)} documents)")
    if len(produced) != len(DOCS):
        raise SystemExit(
            f"FATAL: produced {len(produced)} of {len(DOCS)} documents — the packet is incomplete."
        )
    print(f"\nDONE — {len(produced)}/{len(DOCS)} PDFs in {OUT}")

if __name__ == "__main__":
    main()
