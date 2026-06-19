#!/usr/bin/env python3
"""Generate a glossy golden-egg favicon set for expectedend.co."""
import math
from PIL import Image, ImageDraw, ImageFilter

SS = 8          # supersample factor
M = 512         # logical master size
R = M * SS      # render resolution

def egg_polygon(cx, cy, w, hb, ht, n=720):
    """Egg silhouette: bottom = ellipse (radius hb), top = taller ellipse (ht).
    Widest point (horizontal radius w) sits at the seam y=cy."""
    pts = []
    # bottom half: angle 0 -> -pi (going right -> down -> left)
    for i in range(n // 2 + 1):
        t = math.pi * i / (n // 2)          # 0..pi
        x = cx + w * math.cos(t)
        y = cy + hb * math.sin(t)           # downward (PIL y grows down)
        pts.append((x, y))
    # top half: left -> up -> right
    for i in range(n // 2 + 1):
        t = math.pi * i / (n // 2)          # 0..pi
        x = cx - w * math.cos(t)
        y = cy - ht * math.sin(t)
        pts.append((x, y))
    return pts

# --- silhouette mask (antialiased via supersample) ---
mask = Image.new("L", (R, R), 0)
md = ImageDraw.Draw(mask)
cx = R / 2
w = R * 0.34
hb = R * 0.36
ht = R * 0.46
cy = R / 2 + (hb - ht) / 2 + R * 0.02      # center the whole egg vertically
poly = egg_polygon(cx, cy, w, hb, ht)
md.polygon(poly, fill=255)

# --- gold gradient (vertical, light top-left -> deep gold bottom) ---
top_gold = (255, 241, 168)     # pale highlight gold
mid_gold = (240, 197, 70)      # core gold
deep_gold = (168, 120, 20)     # shadow gold
grad = Image.new("RGB", (R, R))
gp = grad.load()
y0 = cy - ht
y1 = cy + hb
for y in range(R):
    f = (y - y0) / (y1 - y0)
    f = min(max(f, 0.0), 1.0)
    if f < 0.5:
        k = f / 0.5
        r = int(top_gold[0] + (mid_gold[0] - top_gold[0]) * k)
        g = int(top_gold[1] + (mid_gold[1] - top_gold[1]) * k)
        b = int(top_gold[2] + (mid_gold[2] - top_gold[2]) * k)
    else:
        k = (f - 0.5) / 0.5
        r = int(mid_gold[0] + (deep_gold[0] - mid_gold[0]) * k)
        g = int(mid_gold[1] + (deep_gold[1] - mid_gold[1]) * k)
        b = int(mid_gold[2] + (deep_gold[2] - mid_gold[2]) * k)
    for x in range(R):
        gp[x, y] = (r, g, b)

egg = Image.new("RGBA", (R, R), (0, 0, 0, 0))
egg.paste(grad, (0, 0), mask)

# --- deeper-gold rim for contrast on white tab bars ---
rim = mask.filter(ImageFilter.MaxFilter(1))
edge = mask.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(R * 0.012))
rim_layer = Image.new("RGBA", (R, R), (120, 80, 8, 0))
rim_layer.putalpha(edge.point(lambda p: min(int(p * 1.4), 200)))
rim_layer.putalpha(Image.composite(rim_layer.getchannel("A"), Image.new("L", (R, R), 0), mask))
egg = Image.alpha_composite(egg, rim_layer)

# --- glossy highlight (upper-left soft ellipse) ---
gloss = Image.new("L", (R, R), 0)
gd = ImageDraw.Draw(gloss)
gx, gy = cx - w * 0.34, cy - ht * 0.42
gw, gh = w * 0.46, ht * 0.40
gd.ellipse([gx - gw, gy - gh, gx + gw, gy + gh], fill=190)
gloss = gloss.filter(ImageFilter.GaussianBlur(R * 0.03))
gloss = Image.composite(gloss, Image.new("L", (R, R), 0), mask)
white = Image.new("RGBA", (R, R), (255, 255, 255, 0))
white.putalpha(gloss)
egg = Image.alpha_composite(egg, white)

# small specular dot
spec = Image.new("L", (R, R), 0)
sd = ImageDraw.Draw(spec)
sd.ellipse([gx - gw * 0.28, gy - gh * 0.28, gx + gw * 0.28, gy + gh * 0.28], fill=255)
spec = spec.filter(ImageFilter.GaussianBlur(R * 0.012))
spec = Image.composite(spec, Image.new("L", (R, R), 0), mask)
white2 = Image.new("RGBA", (R, R), (255, 255, 255, 0))
white2.putalpha(spec)
egg = Image.alpha_composite(egg, white2)

# downsample to master
master = egg.resize((M, M), Image.LANCZOS)
master.save("/tmp/golden-egg-preview.png")

# export full set
out = "/Users/denzelrigaud/Projects/expectedend-co/public"
def save(size, name):
    master.resize((size, size), Image.LANCZOS).save(f"{out}/{name}")

save(16, "favicon-16x16.png")
save(32, "favicon-32x32.png")
save(180, "apple-touch-icon.png")
save(192, "android-chrome-192x192.png")
save(512, "android-chrome-512x512.png")
master.save(f"{out}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("done")
