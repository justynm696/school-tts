import sys
from PIL import Image, ImageEnhance, ImageOps

def enhance_image(input_path, output_path):
    # Open image
    img = Image.open(input_path).convert('RGB')
    
    # 1. Crop edges (approx 5% from each side to remove frames)
    width, height = img.size
    left = int(width * 0.05)
    top = int(height * 0.05)
    right = width - int(width * 0.05)
    bottom = height - int(height * 0.05)
    img = img.crop((left, top, right, bottom))
    
    # 2. Convert to grayscale
    img = ImageOps.grayscale(img)
    
    # 3. Increase Contrast aggressively
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(3.0)
    
    # 4. Increase Brightness slightly to make background pure white
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.5)
    
    # 5. Colorize: map black/dark grey to dark blue, and white to white
    # The 1st floor uses a blueish tone. 
    # Let's map 0 to dark blue (e.g., #1E5A8E), and 255 to white.
    img = ImageOps.colorize(img, black="#1a4b77", white="white")
    
    # Save the enhanced image
    img.save(output_path)
    print(f"Enhanced {input_path} -> {output_path}")

files = ["floor_2nd.jpg", "floor_3rd.jpg", "floor_4th.jpg"]
for f in files:
    enhance_image(f, f"enhanced_{f}")

