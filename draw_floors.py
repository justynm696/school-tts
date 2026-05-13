"""
Generates digital floor plan SVGs for 2nd, 3rd, and 4th floors
matching the style of the existing 1st floor PNG drawing.
"""

W, H = 1050, 820
BLUE = "#1E3A5F"
MID  = "#2B5F8F"
LITE = "#C8D8E8"
GRAY = "#8899AA"
WHITE= "#FFFFFF"
BG   = "#F4F8FC"

def hdr_svg():
    """Common school header block"""
    return f"""
  <!-- Header -->
  <rect x="0" y="0" width="{W}" height="{H}" fill="{WHITE}"/>
  <!-- seal placeholder -->
  <circle cx="85" cy="68" r="52" fill="{LITE}" stroke="{BLUE}" stroke-width="3"/>
  <circle cx="85" cy="68" r="38" fill="{WHITE}" stroke="{BLUE}" stroke-width="2"/>
  <text x="85" y="64" font-size="8" fill="{BLUE}" text-anchor="middle" font-family="Arial" font-weight="bold">CENTRAL LUZON</text>
  <text x="85" y="75" font-size="8" fill="{BLUE}" text-anchor="middle" font-family="Arial" font-weight="bold">COLLEGE</text>
  <text x="85" y="86" font-size="6" fill="{BLUE}" text-anchor="middle" font-family="Arial">OF SCIENCE</text>
  <!-- ISO text -->
  <text x="85" y="132" font-size="9" fill="{BLUE}" text-anchor="middle" font-family="Arial" font-weight="bold">ISO 9001:2015</text>
  <text x="85" y="144" font-size="9" fill="{BLUE}" text-anchor="middle" font-family="Arial" font-weight="bold">CERTIFIED</text>
  <!-- School name -->
  <text x="{W//2}" y="48" font-size="18" fill="{BLUE}" text-anchor="middle" font-family="Arial" font-weight="bold">CENTRAL LUZON COLLEGE OF SCIENCE AND TECHNOLOGY, OLONGAPO CITY, INC.</text>
  <!-- FLOOR MAP -->
  <text x="{W//2}" y="100" font-size="42" fill="{BLUE}" text-anchor="middle" font-family="Arial" font-weight="bold" letter-spacing="8">FLOOR MAP</text>
  <!-- SOCOTEC placeholder -->
  <circle cx="{W-80}" cy="58" r="38" fill="{LITE}" stroke="{BLUE}" stroke-width="2"/>
  <text x="{W-80}" y="55" font-size="10" fill="{BLUE}" text-anchor="middle" font-family="Arial" font-weight="bold">SOCOTEC</text>
  <text x="{W-80}" y="68" font-size="8" fill="{BLUE}" text-anchor="middle" font-family="Arial">INTL CERT</text>
  <!-- horizontal rule -->
  <line x1="30" y1="155" x2="{W-30}" y2="155" stroke="{BLUE}" stroke-width="2"/>
"""

def footer_svg():
    return f"""
  <!-- Footer tagline -->
  <text x="{W//2}" y="{H-18}" font-size="20" fill="{BLUE}" text-anchor="middle" font-family="Arial" font-weight="bold">We Teach. We Train. We Touch. We Transform.</text>
  <line x1="30" y1="{H-36}" x2="{W-30}" y2="{H-36}" stroke="{BLUE}" stroke-width="2"/>
"""

def rect(x,y,w,h,fill=WHITE,stroke=BLUE,sw=2.5):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>\n'

def label(x,y,lines,size=12,bold=True,color=BLUE,anchor="middle"):
    bw = "bold" if bold else "normal"
    svg = ""
    yy = y - (len(lines)-1)*size*0.6
    for line in lines:
        svg += f'<text x="{x}" y="{yy}" font-size="{size}" fill="{color}" text-anchor="{anchor}" font-family="Arial" font-weight="{bw}">{line}</text>\n'
        yy += size*1.3
    return svg

def door_bottom(x,y,w):
    cx = x + w*0.25
    return f'<path d="M{cx},{y} A{w*0.25},{w*0.25} 0 0,1 {cx+w*0.25},{y-w*0.25}" fill="none" stroke="{BLUE}" stroke-width="1.5"/>\n'

def door_top(x,y,w):
    cx = x + w*0.25
    return f'<path d="M{cx},{y} A{w*0.25},{w*0.25} 0 0,0 {cx+w*0.25},{y+w*0.25}" fill="none" stroke="{BLUE}" stroke-width="1.5"/>\n'

def arrow_right(x,y,length=55):
    ex = x+length
    return (f'<line x1="{x}" y1="{y}" x2="{ex}" y2="{y}" stroke="{GRAY}" stroke-width="2.5"/>'
            f'<polygon points="{ex},{y-5} {ex+10},{y} {ex},{y+5}" fill="{GRAY}"/>\n')

def stairs(x,y,w=36,h=44):
    svg = rect(x,y,w,h,fill=LITE)
    step_h = h/6
    for i in range(1,6):
        svg += f'<line x1="{x}" y1="{y+i*step_h}" x2="{x+w}" y2="{y+i*step_h}" stroke="{BLUE}" stroke-width="1"/>\n'
    return svg


# ─────────────────────────────────────────────────────
# 2ND FLOOR
# ─────────────────────────────────────────────────────
def floor2():
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n'
    svg += hdr_svg()

    FX, FY, FW, FH = 30, 165, W-60, H-215

    # Outer building boundary
    svg += rect(FX, FY, FW, FH, fill=BG, stroke=BLUE, sw=4)

    # Floor label
    svg += f'<text x="{FX+14}" y="{FY+30}" font-size="22" fill="{BLUE}" font-family="Arial" font-weight="bold">2ND FLOOR</text>\n'

    # Staircase left
    svg += stairs(FX+4, FY+4, 36, 120)

    # ── LIBRARY (left large room) ──
    LX, LY, LW, LH = FX+44, FY+4, 210, FH-8
    svg += rect(LX, LY, LW, LH, fill=WHITE)
    svg += label(LX+LW//2, LY+LH//2-20,
                 ["SCHOOL","LIBRARY &","INFORMATION","CENTER"], size=14)

    # Corridor band
    CORR_Y = FY + int(FH*0.52)
    CORR_H = 80
    svg += rect(LX+LW, CORR_Y, FW-(LX+LW-FX)-4, CORR_H, fill=LITE, stroke=BLUE, sw=1)
    # Arrows
    for ax in range(LX+LW+20, FX+FW-60, 90):
        svg += arrow_right(ax, CORR_Y+40)

    # ── TOP ROOMS (above corridor) ──
    top_rooms = [
        ("SPEECH LAB\nRM 208", 1.0),
        ("COMPUTER\nLAB\nRM 209", 1.0),
        ("RM\n210", 0.8),
        ("STAIRS", -1),      # stairs
        ("CRIME\nLAB\nRM 211", 1.0),
        ("PHYSICS\nLAB\nRM 212", 1.0),
    ]
    avail_w = FX+FW - (LX+LW) - 4
    stair_w = 42
    norm_count = sum(1 for _,s in top_rooms if s>0)
    norm_w = (avail_w - stair_w) / norm_count
    cx = LX+LW
    for name, scale in top_rooms:
        if scale < 0:
            svg += stairs(cx, FY+4, stair_w, CORR_Y-FY-4)
            cx += stair_w
        else:
            rw = norm_w * scale
            svg += rect(cx, FY+4, rw, CORR_Y-FY-4, fill=WHITE)
            svg += label(cx+rw//2, FY+4+(CORR_Y-FY-4)//2-10,
                         name.split("\n"), size=12)
            svg += door_bottom(cx, CORR_Y, rw)
            cx += rw

    # ── BOTTOM ROOMS (below corridor) ──
    bot_rooms = [
        ("STAIRS", -1),
        ("RM\n206", 1.0),
        ("RM\n205", 1.0),
        ("RM\n204", 1.0),
        ("RM\n203", 1.0),
        ("RM\n202", 1.0),
        ("MOOT\nCOURT\nRM 201", 1.2),
    ]
    bot_y = CORR_Y + CORR_H
    bot_h = FY+FH - bot_y - 4
    cx = LX+LW
    stair_w2 = 42
    norm_count2 = sum(1 for _,s in bot_rooms if s>0)
    norm_w2 = (avail_w - stair_w2) / sum(s for _,s in bot_rooms if s>0) * 1.0
    norm_w2 = (avail_w - stair_w2) / (norm_count2 + 0.2)
    for name, scale in bot_rooms:
        if scale < 0:
            svg += stairs(cx, bot_y, stair_w2, bot_h)
            cx += stair_w2
        else:
            rw = norm_w2 * scale
            svg += rect(cx, bot_y, rw, bot_h, fill=WHITE)
            svg += label(cx+rw//2, bot_y+bot_h//2-10,
                         name.split("\n"), size=12)
            svg += door_top(cx, bot_y, rw)
            cx += rw

    svg += footer_svg()
    svg += '</svg>'
    return svg


# ─────────────────────────────────────────────────────
# 3RD FLOOR
# ─────────────────────────────────────────────────────
def floor3():
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n'
    svg += hdr_svg()

    FX, FY, FW, FH = 30, 165, W-60, H-215
    svg += rect(FX, FY, FW, FH, fill=BG, stroke=BLUE, sw=4)
    svg += f'<text x="{FX+14}" y="{FY+30}" font-size="22" fill="{BLUE}" font-family="Arial" font-weight="bold">3RD FLOOR</text>\n'

    svg += stairs(FX+4, FY+4, 36, 120)

    # Skills Lab
    LX, LY, LW, LH = FX+44, FY+4, 175, FH-8
    svg += rect(LX, LY, LW, LH, fill=WHITE)
    svg += label(LX+LW//2, LY+LH//2-10, ["SKILLS","LAB"], size=16)

    CORR_Y = FY + int(FH*0.52)
    CORR_H = 80
    svg += rect(LX+LW, CORR_Y, FW-(LX+LW-FX)-4, CORR_H, fill=LITE, stroke=BLUE, sw=1)
    for ax in range(LX+LW+20, FX+FW-50, 90):
        svg += arrow_right(ax, CORR_Y+40)
    # Up arrow (staircase)
    mid_x = LX+LW + (FX+FW-(LX+LW))//2
    svg += f'<line x1="{mid_x+60}" y1="{CORR_Y+CORR_H-10}" x2="{mid_x+60}" y2="{CORR_Y+10}" stroke="{GRAY}" stroke-width="2.5"/>'
    svg += f'<polygon points="{mid_x+55},{CORR_Y+15} {mid_x+60},{CORR_Y+4} {mid_x+65},{CORR_Y+15}" fill="{GRAY}"/>\n'

    # Top rooms: 310,311,312,313,314, [stairs+restroom], 315, 316
    avail_w = FX+FW - (LX+LW) - 4
    top_rooms = [
        ("RM\n310",1),("RM\n311",1),("RM\n312",1),
        ("RM\n313",1),("RM\n314",1),
        ("STAIRS", -1),
        ("RM\n315",1),("RM\n316",1),
    ]
    stair_w = 44
    norm_cnt = sum(1 for _,s in top_rooms if s>0)
    norm_w = (avail_w - stair_w) / norm_cnt
    cx = LX+LW
    for name, scale in top_rooms:
        if scale < 0:
            svg += stairs(cx, FY+4, stair_w, CORR_Y-FY-4)
            # restroom block
            svg += rect(cx, FY+4+int((CORR_Y-FY-4)*0.55), stair_w, int((CORR_Y-FY-4)*0.45), fill=LITE)
            svg += label(cx+stair_w//2, FY+4+int((CORR_Y-FY-4)*0.77), ["WR"], size=9)
            cx += stair_w
        else:
            rw = norm_w
            svg += rect(cx, FY+4, rw, CORR_Y-FY-4, fill=WHITE)
            svg += label(cx+rw//2, FY+4+(CORR_Y-FY-4)//2-8, name.split("\n"), size=13)
            svg += door_bottom(cx, CORR_Y, rw)
            cx += rw

    # Bottom rooms: 307, [stairs], 306,305,304,303,302,301
    bot_rooms = [
        ("RM\n307",1),
        ("STAIRS",-1),
        ("RM\n306",1),("RM\n305",1),("RM\n304",1),
        ("RM\n303",1),("RM\n302",1),("RM\n301",1),
    ]
    bot_y = CORR_Y + CORR_H
    bot_h = FY+FH - bot_y - 4
    norm_cnt2 = sum(1 for _,s in bot_rooms if s>0)
    norm_w2 = (avail_w - stair_w) / norm_cnt2
    cx = LX+LW
    for name, scale in bot_rooms:
        if scale < 0:
            svg += stairs(cx, bot_y, stair_w, bot_h)
            cx += stair_w
        else:
            rw = norm_w2
            svg += rect(cx, bot_y, rw, bot_h, fill=WHITE)
            svg += label(cx+rw//2, bot_y+bot_h//2-8, name.split("\n"), size=13)
            svg += door_top(cx, bot_y, rw)
            cx += rw

    svg += footer_svg()
    svg += '</svg>'
    return svg


# ─────────────────────────────────────────────────────
# 4TH FLOOR
# ─────────────────────────────────────────────────────
def floor4():
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">\n'
    svg += hdr_svg()

    FX, FY, FW, FH = 30, 165, W-60, H-215
    svg += rect(FX, FY, FW, FH, fill=BG, stroke=BLUE, sw=4)
    svg += f'<text x="{FX+14}" y="{FY+30}" font-size="22" fill="{BLUE}" font-family="Arial" font-weight="bold">4TH FLOOR</text>\n'

    svg += stairs(FX+4, FY+4, 36, 120)

    # MOLA Auditorium (large left room)
    LX, LY, LW, LH = FX+44, FY+4, 200, FH-8
    svg += rect(LX, LY, LW, LH, fill=WHITE)
    svg += label(LX+LW//2, LY+LH//2-14, ["MOLA","AUDITORIUM"], size=15)

    CORR_Y = FY + int(FH*0.52)
    CORR_H = 80
    avail_w = FX+FW - (LX+LW) - 4
    svg += rect(LX+LW, CORR_Y, avail_w, CORR_H, fill=LITE, stroke=BLUE, sw=1)
    for ax in range(LX+LW+20, FX+FW-50, 90):
        svg += arrow_right(ax, CORR_Y+40)
    # Up arrow
    up_x = LX+LW+avail_w//2+30
    svg += f'<line x1="{up_x}" y1="{CORR_Y+CORR_H-10}" x2="{up_x}" y2="{CORR_Y+10}" stroke="{GRAY}" stroke-width="2.5"/>'
    svg += f'<polygon points="{up_x-5},{CORR_Y+15} {up_x},{CORR_Y+4} {up_x+5},{CORR_Y+15}" fill="{GRAY}"/>\n'

    # Top rooms: 408,409,410, [stairs], 411, 412 GMDSS
    top_rooms = [
        ("RM\n408",1),("RM\n409",1),("RM\n410",1),
        ("STAIRS",-1),
        ("RM\n411",1),("RM 412\nGMDSS",1.1),
    ]
    stair_w = 44
    norm_cnt = sum(1 for _,s in top_rooms if s>0)
    extra = 0.1  # one room is 1.1x
    norm_w = (avail_w - stair_w) / (norm_cnt + extra)
    cx = LX+LW
    for name, scale in top_rooms:
        if scale < 0:
            svg += stairs(cx, FY+4, stair_w, CORR_Y-FY-4)
            cx += stair_w
        else:
            rw = norm_w * scale
            svg += rect(cx, FY+4, rw, CORR_Y-FY-4, fill=WHITE)
            svg += label(cx+rw//2, FY+4+(CORR_Y-FY-4)//2-8, name.split("\n"), size=13)
            svg += door_bottom(cx, CORR_Y, rw)
            cx += rw

    # Bottom rooms: [stairs], RM406 MOCK BRIDGE, RM405, RM404 PLOTTING, ENGINE SIM, BRIDGE SIM
    bot_rooms = [
        ("STAIRS",-1),
        ("RM 406\nMOCK\nBRIDGE",1.1),
        ("RM\n405",1),
        ("RM 404\nPLOTTING\nRM",1.1),
        ("ENGINE\nSIMULATOR",1),
        ("BRIDGE\nSIMULATOR",1),
    ]
    bot_y = CORR_Y + CORR_H
    bot_h = FY+FH - bot_y - 4
    norm_cnt2 = sum(1 for _,s in bot_rooms if s>0)
    extra2 = 0.2
    norm_w2 = (avail_w - stair_w) / (norm_cnt2 + extra2)
    cx = LX+LW
    for name, scale in bot_rooms:
        if scale < 0:
            svg += stairs(cx, bot_y, stair_w, bot_h)
            cx += stair_w
        else:
            rw = norm_w2 * scale
            svg += rect(cx, bot_y, rw, bot_h, fill=WHITE)
            svg += label(cx+rw//2, bot_y+bot_h//2-10, name.split("\n"), size=12)
            svg += door_top(cx, bot_y, rw)
            cx += rw

    svg += footer_svg()
    svg += '</svg>'
    return svg


# Write files
for name, content in [("floor_2nd_digital.svg", floor2()),
                       ("floor_3rd_digital.svg", floor3()),
                       ("floor_4th_digital.svg", floor4())]:
    with open(name, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"OK Generated {name}")
