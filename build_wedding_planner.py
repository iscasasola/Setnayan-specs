#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Setnayan — The Complete Wedding Planner (18-month countdown) PDF generator."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    Flowable, PageBreak, CondPageBreak, KeepTogether,
)
from reportlab.platypus.flowables import HRFlowable

# ----------------------------------------------------------------------------
# Brand palette — Setnayan "Clean Editorial"
# ----------------------------------------------------------------------------
ALABASTER = colors.HexColor("#FAF7F1")
PAPER     = colors.HexColor("#FFFFFF")
OBSIDIAN  = colors.HexColor("#1C1B19")
INK_SOFT  = colors.HexColor("#4A453E")
GOLD      = colors.HexColor("#B8965A")
GOLD_DEEP = colors.HexColor("#9A7C45")
GOLD_TINT = colors.HexColor("#EFE7D4")
MULBERRY  = colors.HexColor("#6E2C4B")
LINE      = colors.HexColor("#D9D2C4")
LINE_SOFT = colors.HexColor("#E7E1D5")
GREY      = colors.HexColor("#8A8378")

# ----------------------------------------------------------------------------
# Fonts
# ----------------------------------------------------------------------------
def reg():
    sup = "/System/Library/Fonts/Supplemental/"
    sysf = "/System/Library/Fonts/"
    try:
        pdfmetrics.registerFont(TTFont("Didot",        sup + "Didot.ttc", subfontIndex=0))
        pdfmetrics.registerFont(TTFont("Didot-Italic", sup + "Didot.ttc", subfontIndex=1))
        pdfmetrics.registerFont(TTFont("Didot-Bold",   sup + "Didot.ttc", subfontIndex=2))
        DISPLAY, DISPLAY_I, DISPLAY_B = "Didot", "Didot-Italic", "Didot-Bold"
    except Exception:
        DISPLAY, DISPLAY_I, DISPLAY_B = "Times-Roman", "Times-Italic", "Times-Bold"
    try:
        pdfmetrics.registerFont(TTFont("Georgia",    sup + "Georgia.ttf"))
        pdfmetrics.registerFont(TTFont("Georgia-B",  sup + "Georgia Bold.ttf"))
        pdfmetrics.registerFont(TTFont("Georgia-I",  sup + "Georgia Italic.ttf"))
        pdfmetrics.registerFont(TTFont("Georgia-BI", sup + "Georgia Bold Italic.ttf"))
        pdfmetrics.registerFontFamily("Georgia", normal="Georgia", bold="Georgia-B",
                                      italic="Georgia-I", boldItalic="Georgia-BI")
        BODY, BODY_B, BODY_I = "Georgia", "Georgia-B", "Georgia-I"
    except Exception:
        BODY, BODY_B, BODY_I = "Times-Roman", "Times-Bold", "Times-Italic"
    try:
        pdfmetrics.registerFont(TTFont("Avenir",   sysf + "Avenir Next.ttc", subfontIndex=7))
        pdfmetrics.registerFont(TTFont("Avenir-M", sysf + "Avenir Next.ttc", subfontIndex=5))
        pdfmetrics.registerFont(TTFont("Avenir-D", sysf + "Avenir Next.ttc", subfontIndex=2))
        pdfmetrics.registerFont(TTFont("Avenir-B", sysf + "Avenir Next.ttc", subfontIndex=0))
        SANS, SANS_M, SANS_D, SANS_B = "Avenir", "Avenir-M", "Avenir-D", "Avenir-B"
    except Exception:
        SANS = SANS_M = SANS_D = SANS_B = "Helvetica"
    # "Money" font — Avenir/Georgia lack the peso glyph (U+20B1); HelveticaNeue has it.
    try:
        # Only Regular (0) and Bold (1) carry the peso glyph; Medium/Light do not.
        pdfmetrics.registerFont(TTFont("Money",   sysf + "HelveticaNeue.ttc", subfontIndex=0))
        pdfmetrics.registerFont(TTFont("Money-M", sysf + "HelveticaNeue.ttc", subfontIndex=1))
        MONEY, MONEY_M = "Money", "Money-M"
    except Exception:
        MONEY = MONEY_M = "Helvetica"
    return dict(DISPLAY=DISPLAY, DISPLAY_I=DISPLAY_I, DISPLAY_B=DISPLAY_B,
                BODY=BODY, BODY_B=BODY_B, BODY_I=BODY_I,
                SANS=SANS, SANS_M=SANS_M, SANS_D=SANS_D, SANS_B=SANS_B,
                MONEY=MONEY, MONEY_M=MONEY_M)

F = reg()

# ----------------------------------------------------------------------------
# Geometry
# ----------------------------------------------------------------------------
PW, PH = A4
LM, RM, TM, BM = 46, 46, 58, 50
CW = PW - LM - RM   # content width

def tracked(s, n=2):
    return (" " * n).join(list(s))

def tcentred(c, cx, y, s, font, size, cs, color):
    w = pdfmetrics.stringWidth(s, font, size) + cs * (len(s) - 1)
    t = c.beginText(cx - w / 2.0, y)
    t.setFont(font, size); t.setCharSpace(cs); t.setFillColor(color)
    t.textOut(s); c.drawText(t)

def tleft(c, x, y, s, font, size, cs, color):
    t = c.beginText(x, y)
    t.setFont(font, size); t.setCharSpace(cs); t.setFillColor(color)
    t.textOut(s); c.drawText(t)

# ----------------------------------------------------------------------------
# Paragraph styles
# ----------------------------------------------------------------------------
S = {}
S['kicker']   = ParagraphStyle('kicker', fontName=F['SANS_D'], fontSize=8, leading=12,
                               textColor=GOLD_DEEP, spaceAfter=3)
S['title']    = ParagraphStyle('title', fontName=F['DISPLAY_B'], fontSize=21, leading=24,
                               textColor=OBSIDIAN, spaceAfter=2)
S['subtitle'] = ParagraphStyle('subtitle', fontName=F['BODY_I'], fontSize=10.5, leading=15,
                               textColor=INK_SOFT, spaceAfter=6)
S['h2']       = ParagraphStyle('h2', fontName=F['DISPLAY_B'], fontSize=14, leading=17,
                               textColor=OBSIDIAN, spaceBefore=10, spaceAfter=4)
S['body']     = ParagraphStyle('body', fontName=F['BODY'], fontSize=9.6, leading=14.5,
                               textColor=OBSIDIAN, spaceAfter=4)
S['body_s']   = ParagraphStyle('body_s', fontName=F['BODY'], fontSize=8.6, leading=12.5,
                               textColor=INK_SOFT)
S['item']     = ParagraphStyle('item', fontName=F['BODY'], fontSize=9.4, leading=13,
                               textColor=OBSIDIAN)
S['item_note']= ParagraphStyle('item_note', fontName=F['BODY_I'], fontSize=8.2, leading=11,
                               textColor=GREY)
S['price']    = ParagraphStyle('price', fontName=F['MONEY'], fontSize=8.5, leading=12,
                               textColor=GOLD_DEEP, alignment=TA_RIGHT)
S['phase_when']= ParagraphStyle('phase_when', fontName=F['SANS_D'], fontSize=8, leading=11,
                               textColor=GOLD_DEEP)
S['phase_title']= ParagraphStyle('phase_title', fontName=F['DISPLAY_B'], fontSize=17, leading=20,
                               textColor=OBSIDIAN)
S['phase_sub']= ParagraphStyle('phase_sub', fontName=F['BODY_I'], fontSize=9, leading=12,
                               textColor=INK_SOFT)
S['th']       = ParagraphStyle('th', fontName=F['SANS_D'], fontSize=7.6, leading=10,
                               textColor=OBSIDIAN)
S['th_r']     = ParagraphStyle('th_r', parent=S['th'], alignment=TA_RIGHT)
S['th_light'] = ParagraphStyle('th_light', fontName=F['SANS_D'], fontSize=7.8, leading=10,
                               textColor=ALABASTER)
S['th_light_r']= ParagraphStyle('th_light_r', parent=S['th_light'], alignment=TA_RIGHT)
S['cell']     = ParagraphStyle('cell', fontName=F['BODY'], fontSize=8.8, leading=11.5,
                               textColor=OBSIDIAN)
S['cell_sans']= ParagraphStyle('cell_sans', fontName=F['SANS_M'], fontSize=8.4, leading=11,
                               textColor=OBSIDIAN)
S['cell_r']   = ParagraphStyle('cell_r', fontName=F['MONEY'], fontSize=8.3, leading=11,
                               textColor=OBSIDIAN, alignment=TA_RIGHT)
S['tier']     = ParagraphStyle('tier', fontName=F['DISPLAY_B'], fontSize=11, leading=13,
                               textColor=OBSIDIAN)
S['amount']   = ParagraphStyle('amount', fontName=F['MONEY_M'], fontSize=9.5, leading=13,
                               textColor=GOLD_DEEP, alignment=TA_RIGHT)
S['foot']     = ParagraphStyle('foot', fontName=F['SANS'], fontSize=7, leading=9, textColor=GREY)

P = "₱"  # peso sign — only the "Money" font carries this glyph

def peso(s):
    """Wrap the peso sign in the Money font so it renders inside Avenir/Georgia paragraphs."""
    return s.replace("₱", '<font name="%s">₱</font>' % F['MONEY'])

# ----------------------------------------------------------------------------
# Custom flowables
# ----------------------------------------------------------------------------
class CheckBox(Flowable):
    def __init__(self, size=8.5):
        super().__init__()
        self.size = size
    def wrap(self, aw, ah):
        return (self.size, self.size)
    def draw(self):
        c = self.canv
        c.setStrokeColor(GOLD)
        c.setLineWidth(0.9)
        c.roundRect(0, -0.5, self.size, self.size, 1.6, stroke=1, fill=0)

class Diamond(Flowable):
    def __init__(self, size=5, color=GOLD):
        super().__init__(); self.size=size; self.color=color
    def wrap(self, aw, ah):
        return (self.size, self.size)
    def draw(self):
        c=self.canv; s=self.size
        c.setFillColor(self.color); c.setStrokeColor(self.color)
        c.translate(s/2, s/2); c.rotate(45)
        c.rect(-s*0.32, -s*0.32, s*0.64, s*0.64, stroke=0, fill=1)

# ----------------------------------------------------------------------------
# Builders
# ----------------------------------------------------------------------------
def checklist(items):
    """items: list of (text, price_or_None) or (text, price, note)."""
    rows = []
    for it in items:
        text = it[0]; price = it[1] if len(it) > 1 else None
        note = it[2] if len(it) > 2 else None
        body = Paragraph(text, S['item'])
        if note:
            cell = [body, Paragraph(note, S['item_note'])]
        else:
            cell = body
        pr = Paragraph(price, S['price']) if price else Paragraph("", S['price'])
        rows.append([CheckBox(), cell, pr])
    t = Table(rows, colWidths=[18, CW - 18 - 132, 132])
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (0,-1), 0),
        ('LEFTPADDING', (1,0), (1,-1), 4),
        ('RIGHTPADDING', (2,0), (2,-1), 0),
        ('LINEBELOW', (0,0), (-1,-2), 0.4, LINE_SOFT),
    ]))
    return t

def phase(when, title, sub):
    els = [CondPageBreak(96),
           HRFlowable(width='100%', thickness=1.1, color=GOLD, spaceBefore=2, spaceAfter=5),
           Paragraph(tracked(when.upper(), 1), S['phase_when']),
           Spacer(1, 1),
           Paragraph(title, S['phase_title'])]
    if sub:
        els += [Spacer(1, 1), Paragraph(sub, S['phase_sub'])]
    els += [Spacer(1, 5)]
    return els

def section(kicker, title, subtitle=None):
    els = [Paragraph(tracked(kicker.upper(), 1), S['kicker']),
           Paragraph(title, S['title'])]
    if subtitle:
        els.append(Paragraph(subtitle, S['subtitle']))
    els.append(HRFlowable(width='100%', thickness=0.7, color=LINE, spaceBefore=4, spaceAfter=10))
    return els

def fill_rows(pairs, label_w=150):
    """pairs: list of label strings -> label + ruled blank line."""
    data = []
    for lab in pairs:
        data.append([Paragraph(lab, ParagraphStyle('fl', fontName=F['SANS_M'], fontSize=9,
                     leading=20, textColor=INK_SOFT)), ""])
    t = Table(data, colWidths=[label_w, CW - label_w])
    t.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (0,-1), 0),
        ('LINEBELOW', (1,0), (1,-1), 0.6, LINE),
    ]))
    return t

def tracker(headers, colWidths, nrows, row_h=21, fixed_rows=None):
    """Generic fillable table. fixed_rows: optional pre-filled rows (list of lists of Paragraphs)."""
    head = []
    for h in headers:
        if isinstance(h, tuple):
            head.append(Paragraph(peso(h[0]), S['th_r']))
        else:
            head.append(Paragraph(peso(h), S['th']))
    data = [head]
    style = [
        ('BACKGROUND', (0,0), (-1,0), GOLD_TINT),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,0), 6),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('TOPPADDING', (0,1), (-1,-1), 5),
        ('BOTTOMPADDING', (0,1), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, LINE),
        ('LINEAFTER', (0,0), (-2,-1), 0.5, LINE_SOFT),
        ('BOX', (0,0), (-1,-1), 0.8, LINE),
        ('LINEBELOW', (0,0), (-1,0), 1.0, GOLD),
    ]
    rh = [22]
    if fixed_rows:
        for r in fixed_rows:
            data.append(r); rh.append(row_h)
    for _ in range(nrows):
        data.append([""] * len(headers)); rh.append(row_h)
    t = Table(data, colWidths=colWidths, rowHeights=rh, repeatRows=1)
    t.setStyle(TableStyle(style))
    return t

# ----------------------------------------------------------------------------
# Page furniture
# ----------------------------------------------------------------------------
def draw_cover(c, doc):
    c.saveState()
    c.setFillColor(ALABASTER); c.rect(0, 0, PW, PH, stroke=0, fill=1)
    # frame
    m = 30
    c.setStrokeColor(GOLD); c.setLineWidth(1.4)
    c.rect(m, m, PW - 2*m, PH - 2*m, stroke=1, fill=0)
    c.setLineWidth(0.5)
    c.rect(m+5, m+5, PW - 2*m - 10, PH - 2*m - 10, stroke=1, fill=0)
    cx = PW / 2
    # wordmark
    tcentred(c, cx, PH - 118, "SETNAYAN", F['SANS_D'], 13, 6, OBSIDIAN)
    tcentred(c, cx, PH - 134, "LIVING MEMORIES", F['SANS'], 7.5, 2.5, GOLD_DEEP)
    # small motif
    c.setFillColor(GOLD)
    for i, dx in enumerate((-7, 7)):
        c.saveState(); c.translate(cx + dx, PH - 180); c.rotate(45)
        c.rect(-3, -3, 6, 6, stroke=0, fill=1); c.restoreState()
    # title
    c.setFillColor(OBSIDIAN)
    c.setFont(F['DISPLAY_B'], 47); c.drawCentredString(cx, PH - 268, "The Complete")
    c.setFont(F['DISPLAY_B'], 47); c.drawCentredString(cx, PH - 318, "Wedding Planner")
    c.setFillColor(GOLD_DEEP); c.setFont(F['DISPLAY_I'], 17)
    c.drawCentredString(cx, PH - 352, "Eighteen Months to ‘I Do’")
    # divider
    c.setStrokeColor(GOLD); c.setLineWidth(0.8)
    c.line(cx - 70, PH - 372, cx + 70, PH - 372)
    # fill-in lines
    c.setFillColor(GREY); c.setFont(F['SANS'], 8)
    labels = ["THE WEDDING OF", "WEDDING DATE", "VENUE"]
    ys = [PH - 430, PH - 478, PH - 526]
    lw = 320
    for lab, y in zip(labels, ys):
        tcentred(c, cx, y + 12, lab, F['SANS'], 7.5, 1.5, GREY)
        c.setStrokeColor(LINE); c.setLineWidth(0.8)
        c.line(cx - lw/2, y, cx + lw/2, y)
    # bottom tagline
    c.setFillColor(OBSIDIAN); c.setFont(F['DISPLAY_I'], 15)
    c.drawCentredString(cx, m + 64, "“Set na ’yan.”")
    tcentred(c, cx, m + 44, "SETNAYAN.COM", F['SANS'], 7.5, 1.5, GREY)
    c.restoreState()

def draw_footer(c, doc):
    c.saveState()
    y = 30
    c.setStrokeColor(LINE); c.setLineWidth(0.6)
    c.line(LM, y + 12, PW - RM, y + 12)
    tleft(c, LM, y, "SETNAYAN  ·  THE COMPLETE WEDDING PLANNER", F['SANS'], 7, 0.8, GREY)
    c.setFillColor(GREY); c.setFont(F['SANS_M'], 7.5)
    c.drawRightString(PW - RM, y, "%d" % (doc.page - 1))
    # tiny gold diamond center
    c.setFillColor(GOLD)
    c.saveState(); c.translate(PW/2, y + 1.5); c.rotate(45)
    c.rect(-2, -2, 4, 4, stroke=0, fill=1); c.restoreState()
    c.restoreState()

# ----------------------------------------------------------------------------
# Document assembly
# ----------------------------------------------------------------------------
def build(path):
    doc = BaseDocTemplate(path, pagesize=A4, leftMargin=LM, rightMargin=RM,
                          topMargin=TM, bottomMargin=BM,
                          title="The Complete Wedding Planner",
                          author="Setnayan", subject="18-Month Wedding Planning Checklist")
    frame = Frame(LM, BM, CW, PH - TM - BM, id='main',
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([
        PageTemplate(id='cover', frames=[frame], onPage=draw_cover),
        PageTemplate(id='content', frames=[frame], onPage=draw_footer),
    ])

    st = []
    # ---- page 1 uses the 'cover' template; switch to 'content' for page 2 onward ----
    # NextPageTemplate MUST precede the PageBreak, or page 2 inherits the cover art.
    st.append(_NextTemplate('content'))
    st.append(PageBreak())                       # ends cover page

    # ===================== WELCOME / HOW TO USE =====================
    st += section("Welcome", "How to use this planner",
                  "Eighteen months sounds like a lot of time — until the legal paperwork, the "
                  "fully-booked venues, and the guest list all arrive at once. This planner breaks "
                  "the whole journey into clear countdown phases so nothing important sneaks up on you.")
    how = [
        ("<b>Work the phases in order.</b> Each phase is anchored to how many months remain before your "
         "wedding date. Start at whichever phase matches your timeline today — if you have fewer than "
         "18 months, simply begin where you are and catch up on earlier tasks first."),
        ("<b>Tick as you go.</b> Every task has a checkbox. Cost-bearing tasks show a realistic "
         "Philippine price range on the right so you can budget as you book."),
        ("<b>Fill in the worksheets.</b> The trackers — budget, vendors, payments, guests, and legal "
         "documents — are yours to write in. Print this planner, or type directly into the lines on "
         "a tablet."),
        ("<b>Mind the legal window.</b> The Marriage License has a 10-day posting period and is valid for "
         "only 120 days. Church certificates expire after about 6 months. The <i>4–2 Months</i> phase "
         "is the real deadline — treat it as immovable."),
    ]
    for h in how:
        st.append(Table([[Diamond(), Paragraph(h, S['body'])]], colWidths=[16, CW-16],
                  style=TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),3),
                                    ('LEFTPADDING',(0,0),(0,-1),0),('LEFTPADDING',(1,0),(1,-1),4),
                                    ('BOTTOMPADDING',(0,0),(-1,-1),5)])))
    st.append(Spacer(1, 6))
    note = ("All prices in this planner are real-world Philippine market estimates (Metro Manila, "
            "2025–2026) for <i>external vendors</i> — money you pay suppliers directly. Provinces "
            "typically run 20–40% lower. Treat every figure as a starting range, not a fixed quote.")
    st.append(_callout(note))

    # ===================== OUR WEDDING AT A GLANCE =====================
    st.append(PageBreak())
    st += section("Worksheet 01", "Our wedding at a glance",
                  "The headline facts every vendor will ask for. Fill this in first — it anchors every "
                  "decision that follows.")
    st.append(fill_rows([
        "Partner 1", "Partner 2", "Wedding date", "Ceremony type",
        "Ceremony venue", "Reception venue", "Estimated guest count",
        "Total budget", "Theme / palette", "Wedding hashtag",
        "Coordinator", "Coordinator contact", "Maid of honour", "Best man",
    ]))

    # ===================== BUDGET OVERVIEW =====================
    st.append(PageBreak())
    st += section("Worksheet 02", "Budget overview",
                  "Catering and venue together eat 50–60% of almost every wedding budget — control "
                  "those two and you control the whole thing. Always hold back a 10–15% contingency.")
    st.append(Paragraph("What a Philippine wedding really costs", S['h2']))
    tier_rows = [
        [Paragraph("TIER", S['th_light']), Paragraph("STYLE", S['th_light']),
         Paragraph("GUESTS", S['th_light']), Paragraph("REALISTIC ALL-IN", S['th_light_r'])],
        [Paragraph("Practical", S['tier']), Paragraph("Intimate, budget-savvy vendors", S['cell']),
         Paragraph("~80–100", S['cell_sans']), Paragraph(P+"350,000 – "+P+"550,000", S['amount'])],
        [Paragraph("Mid", S['tier']), Paragraph("Where most couples land", S['cell']),
         Paragraph("~150", S['cell_sans']), Paragraph(P+"800,000 – "+P+"1,300,000", S['amount'])],
        [Paragraph("Premium", S['tier']), Paragraph("Hotel ballroom, top-tier suppliers", S['cell']),
         Paragraph("200+", S['cell_sans']), Paragraph(P+"1,500,000 – "+P+"3,500,000+", S['amount'])],
    ]
    tt = Table(tier_rows, colWidths=[78, CW-78-78-150, 78, 150])
    tt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), OBSIDIAN),
        ('TEXTCOLOR', (0,0), (-1,0), ALABASTER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8), ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 9), ('RIGHTPADDING', (0,0), (-1,-1), 9),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [PAPER, ALABASTER]),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, LINE),
        ('BOX', (0,0), (-1,-1), 0.8, LINE),
    ]))
    # header text needs light colour
    tt.setStyle(TableStyle([('TEXTCOLOR',(0,0),(-1,0), ALABASTER)]))
    st.append(tt)
    st.append(Spacer(1, 12))
    st.append(Paragraph("Budget tracker", S['h2']))
    st.append(Paragraph("Set a target for each category, then log what you actually spend.", S['body_s']))
    st.append(Spacer(1, 5))
    cats = ["Ceremony & church", "Reception venue", "Catering", "Coordinator / planner",
            "Photo & video", "Hair & makeup", "Bride attire", "Groom & entourage attire",
            "Florals & styling", "Cake & sweets", "Music & entertainment", "Host / emcee",
            "Lights & sound", "Invitations & stationery", "Transportation", "Wedding rings",
            "Legal & church fees", "Honeymoon", "Favours & gifts", "Contingency (10–15%)"]
    fixed = [[Paragraph(c, S['cell']), "", "", ""] for c in cats]
    fixed.append([Paragraph("<b>TOTAL</b>", S['cell']), "", "", ""])
    st.append(tracker(["CATEGORY", ("BUDGET "+P,), ("ACTUAL "+P,), ("PAID?",)],
                      [CW-110-110-58, 110, 110, 58], 0, fixed_rows=fixed, row_h=19.5))

    # ===================== THE COUNTDOWN =====================
    st.append(PageBreak())
    st += section("The Countdown", "The 18-month plan",
                  "Phase by phase, from first decisions to ‘I do’. Cost-bearing tasks show a "
                  "real-world Philippine price range.")

    # ---- Phase A ----
    st += phase("18–12 Months Before", "Foundations",
                "The big, date-defining decisions — and the vendors that book a year or more ahead.")
    st.append(Paragraph("Decisions to make (free)", S['h2']))
    st.append(checklist([
        ("Agree on the wedding <b>type</b> (church / civil / garden / destination) and rough guest count",),
        ("Set a <b>total budget</b> and who pays for what (couple, parents, sponsors)",),
        ("Shortlist <b>2–3 candidate dates</b> — keep flexibility; venues book fast",),
        ("Draft a <b>preliminary guest list</b> (it only ever grows — start lean)",),
        ("Choose your <b>wedding party</b>: maid of honour, best man, bridesmaids, groomsmen",),
    ]))
    st.append(Paragraph("Book the date-defining vendors", S['h2']))
    st.append(checklist([
        ("<b>Ceremony venue / church</b> — reserve the date & slot", P+"5,000 – "+P+"20,000",
         "Cathedrals & landmark churches run higher"),
        ("<b>Reception venue</b> — confirm same-day availability & catering rules",
         P+"30,000 – "+P+"500,000+"),
        ("<b>Coordinator / planner</b> — on-the-day or full planning",
         P+"15,000 – "+P+"150,000+"),
        ("<b>Photographer & videographer</b> — top names book a year+ ahead",
         P+"30,000 – "+P+"350,000+"),
        ("<b>Caterer</b> (per head) — if not in-house at the venue", P+"650 – "+P+"3,000 / head"),
    ]))
    st.append(Paragraph("Start the legal paper trail", S['h2']))
    st.append(checklist([
        ("Request <b>PSA CENOMAR</b> (Certificate of No Marriage Record) for both", P+"210 each"),
        ("Request <b>PSA Birth Certificate</b> for both", P+"155 each"),
        ("Ask your parish for its <b>complete requirements list & timeline</b>", None,
         "Every parish differs — get this in writing early"),
    ]))

    # ---- Phase B ----
    st += phase("12–9 Months Before", "Look & feel",
                "Lock the style, the glam, and the suppliers that shape how the day looks and sounds.")
    st.append(checklist([
        ("Lock the <b>theme, palette & overall style</b> (build a mood board)",),
        ("Book <b>hair & makeup artist (HMUA)</b> — trial can come later",
         P+"8,000 – "+P+"80,000"),
        ("Order / commission the <b>wedding gown</b> — custom needs 6–9 months of fittings",
         P+"15,000 – "+P+"250,000+"),
        ("Decide <b>entourage attire</b> & where everyone gets theirs", P+"2,000 – "+P+"8,000 / pax"),
        ("Book the <b>host / emcee</b>", P+"10,000 – "+P+"40,000"),
        ("Book <b>ceremony music</b> (string quartet, choir, soloist)", P+"10,000 – "+P+"40,000"),
        ("Book <b>reception music</b> (band, DJ, or mobile bar with sound)", P+"15,000 – "+P+"80,000"),
        ("Book the <b>florist / stylist</b> for ceremony & reception", P+"30,000 – "+P+"400,000+"),
        ("Reserve <b>hotel room blocks</b> for out-of-town guests", P+"3,500 – "+P+"12,000 / night"),
        ("Start the <b>honeymoon plan</b> — especially if it needs visas or peak-season booking",
         P+"30,000 – "+P+"400,000+"),
        ("Finalise & personally invite your <b>principal sponsors</b> (Ninong & Ninang)", None,
         "They sign your marriage contract"),
    ]))

    # ---- Phase C ----
    st += phase("9–6 Months Before", "The details take shape",
                "Firm up the guest list and book the supporting cast.")
    st.append(checklist([
        ("Finalise the <b>guest list</b> & collect complete contact details",),
        ("Design & send <b>Save-the-Dates</b>", P+"0 – "+P+"200 / pc"),
        ("Order the <b>wedding cake</b>", P+"8,000 – "+P+"40,000"),
        ("Book a <b>photobooth</b>", P+"10,000 – "+P+"30,000"),
        ("Book <b>lights & sound</b>", P+"20,000 – "+P+"80,000"),
        ("Book <b>bridal car / transportation</b>", P+"8,000 – "+P+"30,000"),
        ("Order the <b>wedding rings</b> — engraving takes time", P+"15,000 – "+P+"150,000+"),
        ("Book <b>groom & groomsmen attire</b> (barong / suit)", P+"5,000 – "+P+"40,000"),
        ("Begin the <b>pre-marriage seminar / Pre-Cana</b> if required", P+"0 – "+P+"3,000"),
        ("Choose <b>secondary sponsors</b> (candle, veil, cord) & <b>bearers</b> (ring, coin, bible)",),
    ]))

    # ---- Phase D ----
    st += phase("6–4 Months Before", "Build the machine",
                "Put the moving parts together — invitations, fittings, and the run of show.")
    st.append(checklist([
        ("Design & order <b>invitations</b> (and separate sponsor / entourage invites)",
         P+"80 – "+P+"500 / pc"),
        ("Book the <b>prenup / engagement shoot</b> — often bundled with your photo package",
         P+"15,000 – "+P+"50,000"),
        ("First <b>gown fitting</b> + <b>makeup trial</b>", None, "Usually included in the vendor package"),
        ("Choose <b>favours</b> for guests", P+"30 – "+P+"150 / pc"),
        ("Finalise the <b>reception flow / timeline</b> with your coordinator",),
        ("Pick your <b>songs</b>: processional, recessional, first dance, parents’ dances",),
        ("Apply for <b>time off / leave</b> from work for both of you",),
        ("Begin <b>canonical interview</b> scheduling with your priest", None, "Catholic requirement"),
    ]))

    # ---- Phase E ----
    st += phase("4–2 Months Before", "Legal crunch time",
                "The single most time-sensitive window in a Philippine wedding. Miss it and the date is "
                "at risk — treat these deadlines as immovable.")
    st.append(checklist([
        ("<b>Apply for the Marriage License</b> at the LGU where either of you resides",
         P+"100 – "+P+"500",
         "10-day mandatory posting period; valid 120 days nationwide — time it carefully"),
        ("Bring: PSA birth certificates, CENOMAR, valid IDs, proof of pre-marriage seminar",),
        ("Submit <b>church requirements</b> to your parish", None,
         "Now pull the 6-month-valid baptismal & confirmation certificates"),
        ("Confirm <b>church banns</b> are posted",),
        ("Pay your <b>church wedding fee / package</b>", P+"8,000 – "+P+"30,000"),
        ("Finalise & <b>send invitations</b> (~6–8 weeks out; RSVP deadline ~2–3 weeks before)",),
        ("Second <b>gown fitting</b>",),
        ("Buy <b>gifts</b> for your wedding party & parents", P+"500 – "+P+"3,000 / person"),
    ]))

    # ---- Phase F ----
    st += phase("2 Months – 1 Month Before", "Tightening up",
                "Chase the loose ends and confirm every detail in writing.")
    st.append(checklist([
        ("Chase <b>RSVPs</b> — follow up with non-responders personally",),
        ("Build the <b>final seating chart</b> once headcount firms up",),
        ("Hold <b>final vendor meetings</b> — confirm arrival times, deliverables, balances due",),
        ("Give the photo/video team your <b>shot list & must-have moments</b>",),
        ("Give the host the <b>program script, names & pronunciations</b>",),
        ("<b>Final attire fittings</b> — no more weight-changing plans after this",),
        ("<b>Trial run</b> of hair & makeup if you haven’t yet",),
        ("Write your <b>vows</b> and any <b>speeches</b>",),
        ("Confirm the <b>honeymoon</b>: bookings, tickets, visas, passports valid 6+ months",),
    ]))

    # ---- Phase G ----
    st += phase("2 Weeks Before", "Final confirmations",
                "Everything is booked — now make sure everyone shows up where and when they should.")
    st.append(checklist([
        ("<b>Reconfirm every vendor</b> in writing: date, call-time, address, contact, balance",),
        ("Deliver the <b>final headcount</b> to caterer & venue (usually the contractual deadline)",),
        ("Hand the coordinator the <b>master timeline</b> & emergency contact sheet",),
        ("Distribute <b>call-times & roles</b> to the entire entourage",),
        ("Prepare <b>cash envelopes</b> for tips & balances, labelled per vendor",
         P+"500 – "+P+"3,000 / vendor"),
        ("Assemble the <b>wedding-day emergency kit</b>", P+"1,000 – "+P+"3,000",
         "Sewing kit, meds, safety pins, stain remover, blotting paper, snacks, chargers"),
        ("<b>Break in your wedding shoes</b> at home",),
        ("Confirm the <b>officiant’s fee</b> & church donation",),
    ]))

    # ---- Phase H ----
    st += phase("1 Week Before", "Hands off the wheel",
                "Delegate everything so that on the day you answer zero questions.")
    st.append(checklist([
        ("Attend the <b>wedding rehearsal</b> + rehearsal dinner",),
        ("Hand over <b>rings, marriage licence & documents</b> to the coordinator or a trusted person",),
        ("<b>Pack</b> for the wedding night & honeymoon",),
        ("Pre-pay or pre-pack <b>all vendor balances & tips</b>",),
        ("Final <b>beauty prep</b> (nails, grooming — schedule for 1–2 days out)",),
        ("Confirm the <b>officiant holds the marriage licence</b> if required in advance",),
        ("<b>Delegate day-of point-people</b> for every vendor & family question",),
        ("Rest, hydrate, and avoid anything new (food, products, activities)",),
    ]))

    # ---- Phase I ----
    st += phase("The Final Stretch", "Day before · wedding day · after",
                "Be present. The planning is done — now live it.")
    st.append(Paragraph("The day before", S['h2']))
    st.append(checklist([
        ("Lay out <b>everything</b>: attire, shoes, accessories, documents, rings, vows",),
        ("Confirm <b>morning prep meals</b> are arranged",),
        ("Have an <b>early night</b> — no late-night stress",),
    ]))
    st.append(Paragraph("Wedding day", S['h2']))
    st.append(checklist([
        ("Eat a real <b>breakfast</b>",),
        ("Hand the day to your <b>coordinator</b> — your only job is to be present",),
        ("Ensure the <b>marriage contract is signed</b> by you, your spouse, the officiant & sponsors",),
        ("Be in the moment.",),
    ]))
    st.append(Paragraph("After the wedding", S['h2']))
    st.append(checklist([
        ("Settle the <b>balance & tips</b> for any pay-after vendors",),
        ("Claim your <b>PSA-registered Marriage Certificate</b> (follow up a few weeks later)", P+"210"),
        ("Begin <b>name-change documents</b>: PSA › IDs › bank › SSS/PhilHealth/Pag-IBIG › passport",
         P+"150 – "+P+"1,000 / agency"),
        ("Write & send <b>thank-you notes</b>",),
        ("<b>Rate your vendors</b> & preserve photos/videos when they arrive",),
    ]))

    # ===================== LEGAL TRACKER =====================
    st.append(PageBreak())
    st += section("Worksheet 03", "Legal & church document tracker",
                  "The paperwork is cheap — but the validity windows are unforgiving. Track every date.")
    legal = [
        ("PSA Birth Certificate (both)", P+"155 each", "—"),
        ("PSA CENOMAR (both)", P+"210 each", "—"),
        ("Valid government IDs (both)", "—", "—"),
        ("Marriage License (LGU)", P+"100 – "+P+"500", "120 days"),
        ("Pre-Marriage Seminar / Counselling", P+"0 – "+P+"3,000", "—"),
        ("Baptismal Certificate ‘for marriage’", P+"100 – "+P+"300", "~6 months"),
        ("Confirmation Certificate ‘for marriage’", P+"100 – "+P+"300", "~6 months"),
        ("Canonical Interview", "church donation", "—"),
        ("Marriage Banns posted", "included", "—"),
        ("Church Wedding Fee / Package", P+"8,000 – "+P+"30,000", "—"),
        ("Parental Consent / Advice (if 18–25)", "varies", "—"),
        ("PSA Marriage Certificate (after wedding)", P+"210", "—"),
    ]
    rows = [[Paragraph(r[0], S['cell']), Paragraph(r[1], S['cell_r']),
             "", Paragraph(r[2], S['cell_sans'])] for r in legal]
    st.append(tracker(["REQUIREMENT", ("TYPICAL FEE",), "DATE DONE", "VALID FOR"],
                      [CW-118-90-78, 118, 90, 78], 0, fixed_rows=rows, row_h=22))
    st.append(Spacer(1, 8))
    st.append(_callout("The Marriage License is the immovable deadline. Apply 4–2 months out: it needs "
                       "a 10-day posting period before release and then stays valid for exactly 120 days. "
                       "Pull church certificates no earlier than ~6 months before — they expire."))

    # ===================== VENDOR DIRECTORY =====================
    st.append(PageBreak())
    st += section("Worksheet 04", "Vendor directory",
                  "One line per supplier — your single source of truth for who, how much, and what’s left to pay.")
    st.append(tracker(["VENDOR / CATEGORY", "CONTACT NO.", ("CONTRACT "+P,), ("DEPOSIT "+P,),
                       ("BALANCE "+P,), ("BOOKED",)],
                      [CW-92-86-86-86-56, 92, 86, 86, 86, 56], 16, row_h=22))

    # ===================== PAYMENT SCHEDULE =====================
    st.append(PageBreak())
    st += section("Worksheet 05", "Payment schedule",
                  "Map every due date so no balance ever surprises you. Setnayan never holds your money — "
                  "you pay each supplier directly, so keep your own record.")
    st.append(tracker(["ITEM / VENDOR", "DUE DATE", ("AMOUNT "+P,), ("PAID",)],
                      [CW-120-130-66, 120, 130, 66], 18, row_h=22))

    # ===================== GUEST LIST =====================
    st.append(PageBreak())
    st += section("Worksheet 06", "Guest list tracker",
                  "Track invitations and RSVPs as they land. Your final headcount drives catering, "
                  "seating, and the venue contract.")
    st.append(tracker(["GUEST NAME", "CONTACT", ("INVITE SENT",), ("RSVP",), ("TABLE #",)],
                      [CW-110-96-66-66, 110, 96, 66, 66], 26, row_h=21))

    # ===================== NOTES =====================
    st.append(PageBreak())
    st += section("Notes & Ideas", "Notes",
                  "For everything that doesn’t fit a box — inspiration, reminders, second thoughts.")
    st.append(_lined(18))
    st.append(PageBreak())
    st += section("Notes & Ideas", "Notes")
    st.append(_lined(22))

    # ---- closing line ----
    st.append(Spacer(1, 18))
    st.append(HRFlowable(width='40%', thickness=0.8, color=GOLD, spaceBefore=6, spaceAfter=10))
    st.append(Paragraph("“Set na ’yan.”", ParagraphStyle('end', fontName=F['DISPLAY_I'],
              fontSize=15, leading=18, textColor=OBSIDIAN, alignment=TA_CENTER)))
    st.append(Paragraph("Everything’s all set. · setnayan.com",
              ParagraphStyle('end2', fontName=F['SANS'], fontSize=8, leading=12,
              textColor=GREY, alignment=TA_CENTER, spaceBefore=4)))

    doc.build(st)


# ---- helper flowables that need closures over styles ----
from reportlab.platypus.doctemplate import NextPageTemplate as _NextTemplate

def _callout(text):
    inner = Table([[Paragraph(text, ParagraphStyle('co', fontName=F['BODY_I'], fontSize=8.8,
                   leading=13, textColor=INK_SOFT))]], colWidths=[CW-24])
    inner.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),
        ('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9),
        ('BACKGROUND',(0,0),(-1,-1), GOLD_TINT),('LINEBEFORE',(0,0),(0,-1), 2.2, GOLD)]))
    return inner

def _lined(n, gap=26):
    data = [[""] for _ in range(n)]
    t = Table(data, colWidths=[CW], rowHeights=[gap]*n)
    t.setStyle(TableStyle([('LINEBELOW',(0,0),(-1,-1),0.5, LINE_SOFT)]))
    return t


if __name__ == "__main__":
    out = "/Users/icecasasola/Documents/Claude/Projects/Setnayan/Setnayan_Wedding_Planner.pdf"
    build(out)
    print("WROTE", out)
