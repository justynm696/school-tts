import os

def create_svg(filename, title, top_rooms, bottom_rooms, left_room, right_rooms=None):
    width = 1200
    height = 600
    wall_color = "#1E5A8E"
    text_color = "#1E5A8E"
    bg_color = "white"
    
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" style="background-color: {bg_color}; font-family: Arial, sans-serif;">\n'
    
    # Header
    svg += f'<text x="{width/2}" y="50" font-size="32" font-weight="bold" fill="{text_color}" text-anchor="middle">CENTRAL LUZON COLLEGE OF SCIENCE AND TECHNOLOGY, OLONGAPO CITY, INC.</text>\n'
    svg += f'<text x="{width/2}" y="100" font-size="48" font-weight="bold" fill="{text_color}" text-anchor="middle" letter-spacing="5">FLOOR MAP</text>\n'
    
    # Outer Border
    svg += f'<rect x="50" y="150" width="{width-100}" height="{height-200}" fill="none" stroke="{wall_color}" stroke-width="4"/>\n'
    
    # Floor Title
    svg += f'<text x="70" y="190" font-size="36" font-weight="bold" fill="{text_color}">{title}</text>\n'
    
    # Left Room (Library / Skills Lab / MOLA)
    left_width = 250
    left_height = height - 200 - 40
    svg += f'<rect x="50" y="210" width="{left_width}" height="{left_height}" fill="#f0f5fa" stroke="{wall_color}" stroke-width="3"/>\n'
    
    # Split left room text into multiple lines if needed
    y_offset = 210 + left_height/2 - (len(left_room.split("|"))*15)
    for line in left_room.split("|"):
        svg += f'<text x="{50 + left_width/2}" y="{y_offset}" font-size="20" font-weight="bold" fill="{text_color}" text-anchor="middle">{line}</text>\n'
        y_offset += 30
    
    # Corridor
    corridor_y1 = 330
    corridor_y2 = 430
    
    # Draw arrows in corridor
    for x in range(350, width-150, 150):
        svg += f'<path d="M{x},{corridor_y1 + 50} L{x+30},{corridor_y1 + 50} M{x+20},{corridor_y1+40} L{x+30},{corridor_y1+50} L{x+20},{corridor_y1+60}" stroke="{wall_color}" stroke-width="3" fill="none" opacity="0.5"/>\n'
    
    # Top Rooms
    room_width = (width - 100 - left_width) / len(top_rooms)
    start_x = 50 + left_width
    for i, room in enumerate(top_rooms):
        rx = start_x + (i * room_width)
        ry = 150
        rh = corridor_y1 - ry
        if room:  # If not empty (like stairs/empty space)
            svg += f'<rect x="{rx}" y="{ry}" width="{room_width}" height="{rh}" fill="white" stroke="{wall_color}" stroke-width="3"/>\n'
            
            y_off = ry + rh/2 - (len(room.split("|"))*10)
            for line in room.split("|"):
                svg += f'<text x="{rx + room_width/2}" y="{y_off}" font-size="16" font-weight="bold" fill="{text_color}" text-anchor="middle">{line}</text>\n'
                y_off += 20
                
            # Door
            svg += f'<path d="M{rx+10},{ry+rh} A20,20 0 0,1 {rx+30},{ry+rh-20} L{rx+30},{ry+rh}" fill="none" stroke="{wall_color}" stroke-width="2"/>\n'

    # Bottom Rooms
    room_width_bot = (width - 100 - left_width) / len(bottom_rooms)
    for i, room in enumerate(bottom_rooms):
        rx = start_x + (i * room_width_bot)
        ry = corridor_y2
        rh = (height - 50) - corridor_y2
        if room:
            svg += f'<rect x="{rx}" y="{ry}" width="{room_width_bot}" height="{rh}" fill="white" stroke="{wall_color}" stroke-width="3"/>\n'
            
            y_off = ry + rh/2 - (len(room.split("|"))*10)
            for line in room.split("|"):
                svg += f'<text x="{rx + room_width_bot/2}" y="{y_off}" font-size="16" font-weight="bold" fill="{text_color}" text-anchor="middle">{line}</text>\n'
                y_off += 20
                
            # Door
            svg += f'<path d="M{rx+10},{ry} A20,20 0 0,0 {rx+30},{ry+20} L{rx+30},{ry}" fill="none" stroke="{wall_color}" stroke-width="2"/>\n'

    svg += '</svg>'
    
    with open(filename, 'w') as f:
        f.write(svg)

# 2ND FLOOR
create_svg(
    "floor_2nd_digital.svg",
    "2ND FLOOR",
    left_room="SCHOOL|LIBRARY &|INFORMATION|CENTER",
    top_rooms=["SPEECH LAB|RM 208", "COMPUTER|LAB|RM 209", "RM|210", "STAIRS|RESTROOM", "CRIME|LAB|RM 211", "PHYSICS|LAB|RM 212"],
    bottom_rooms=["STAIRS", "RM|206", "RM|205", "RM|204", "RM|203", "RM|202", "MOOT|COURT|RM 201"]
)

# 3RD FLOOR
create_svg(
    "floor_3rd_digital.svg",
    "3RD FLOOR",
    left_room="SKILLS|LAB",
    top_rooms=["RM|310", "RM|311", "RM|312", "RM|313", "RM|314", "RESTROOM", "RM|315", "RM|316"],
    bottom_rooms=["RM|307", "STAIRS", "RM|306", "RM|305", "RM|304", "RM|303", "RM|302", "RM|301"]
)

# 4TH FLOOR
create_svg(
    "floor_4th_digital.svg",
    "4TH FLOOR",
    left_room="MOLA|AUDITORIUM",
    top_rooms=["RM|408", "RM|409", "RM|410", "STAIRS", "RM|411", "RM|412|GMDSS"],
    bottom_rooms=["STAIRS", "RM406|MOCK|BRIDGE", "RM|405", "RM404|PLOTTING|RM", "SIMULATOR|ENGINE", "SIMULATOR|BRIDGE"]
)

print("SVG files generated successfully.")
