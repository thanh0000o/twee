"""Extract the owner's reference sheets into small, locally served smileys.

Run from the workspace root. Requires the existing ImageMagick `magick`.
Output icons are capped at 64px; the chat renders them at 18px.
"""
import subprocess
import urllib.request
import argparse
from collections import deque
from pathlib import Path

OUT = Path("artifacts/gerrit-thanh-landing/public/guestbook-smileys")
OUT.mkdir(parents=True, exist_ok=True)
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--messenger-only", action="store_true")
options = parser.parse_args()

def clean_edges(path, group):
    """Remove sheet fragments and the XP chooser's beige tile corners."""
    if group not in ("messenger", "xp"):
        return
    width, height = map(int, subprocess.check_output(
        ["magick", "identify", "-format", "%w %h", str(path)]).split())
    pixels = bytearray(subprocess.check_output(
        ["magick", str(path), "-depth", "8", "rgba:-"]))

    def neighbors(index):
        x, y = index % width, index // width
        return [ny * width + nx for nx, ny in
                [(x-1, y), (x+1, y), (x, y-1), (x, y+1)]
                if 0 <= nx < width and 0 <= ny < height]

    if group == "xp":
        # Only edge-connected neutral tile colours disappear; facial gloss stays.
        queue = deque(i for i in range(width * height)
                      if i % width in (0, width-1) or i // width in (0, height-1))
        seen = set()
        while queue:
            i = queue.popleft()
            if i in seen:
                continue
            seen.add(i)
            rgb = pixels[i*4:i*4+3]
            if pixels[i*4+3] == 0 or (min(rgb) >= 155 and max(rgb)-min(rgb) < 70):
                pixels[i*4+3] = 0
                queue.extend(neighbors(i))
        for i in range(width * height):
            x = (i % width - (width-1)/2) / (width/2)
            y = (i // width - (height-1)/2) / (height/2)
            if x*x + y*y > 1:
                pixels[i*4+3] = 0
    else:
        # A neighbouring figure can split a sheet cell's white background into
        # multiple regions. Clear every edge-connected region, not one corner.
        queue = deque(i for i in range(width * height)
                      if i % width in (0, width-1) or i // width in (0, height-1))
        seen = set()
        while queue:
            i = queue.popleft()
            if i in seen:
                continue
            seen.add(i)
            rgb = pixels[i*4:i*4+3]
            if pixels[i*4+3] == 0 or (min(rgb) >= 235 and max(rgb)-min(rgb) < 24):
                pixels[i*4+3] = 0
                queue.extend(neighbors(i))
        seen = set()
        for start in range(width * height):
            if start in seen or pixels[start*4+3] < 16:
                continue
            queue, component = [start], []
            seen.add(start)
            while queue:
                i = queue.pop()
                component.append(i)
                for neighbor in neighbors(i):
                    if neighbor not in seen and pixels[neighbor*4+3] >= 16:
                        seen.add(neighbor)
                        queue.append(neighbor)
            if len(component) < width * height * .05:
                for i in component:
                    pixels[i*4+3] = 0
    finish = ["-trim", "+repage", "-resize", "64x64>"] if group == "messenger" else []
    subprocess.run(["magick", "-size", f"{width}x{height}", "-depth", "8",
                    "rgba:-", *finish, str(path)], input=pixels, check=True)


def crop(source, name, box):
    x, y, w, h = box
    if name.startswith("messenger-"):
        # Extract and mask at source resolution; only then resample the edges.
        subprocess.run([
            "magick", f"attached_assets/{source}", "-crop", f"{w}x{h}+{x}+{y}",
            "+repage", "-alpha", "set", f"{OUT / name}.png",
        ], check=True)
        clean_edges(OUT / f"{name}.png", "messenger")
        return
    subprocess.run([
        "magick", f"attached_assets/{source}", "-crop", f"{w}x{h}+{x}+{y}",
        "+repage", "-alpha", "set", "-fuzz", "8%", "-fill", "none",
        "-draw", "alpha 0,0 floodfill", "-trim", "+repage",
        "-resize", "64x64>", f"{OUT / name}.png",
    ], check=True)
    clean_edges(OUT / f"{name}.png", name.split("-")[0])


for name, box in ([] if options.messenger_only else [
    ("angry", (4, 5, 209, 199)), ("hopeful", (220, 5, 210, 200)),
    ("blue", (440, 2, 208, 202)), ("sleepy", (3, 211, 212, 206)),
    ("dreamy", (220, 214, 210, 203)), ("surprised", (440, 213, 209, 204)),
]):
    crop("image_1792568498841.png", f"gloss-{name}", box)

messenger = [
    ("red", (5, 5, 97, 120)), ("sunset", (103, 4, 98, 121)),
    ("peach", (201, 4, 98, 122)), ("rose", (299, 4, 100, 122)),
    ("gold", (10, 127, 96, 120)), ("lemon", (106, 127, 95, 120)),
    ("lime", (200, 127, 98, 120)), ("green", (299, 127, 100, 121)),
    ("leaf", (4, 244, 100, 124)), ("aqua", (104, 244, 99, 124)),
    ("blue", (201, 245, 98, 123)), ("ocean", (299, 244, 100, 124)),
    ("lilac", (5, 365, 99, 122)), ("lavender", (105, 364, 96, 123)),
    ("berry", (201, 364, 99, 123)), ("ice", (299, 364, 100, 125)),
    ("blush", (10, 490, 99, 126)), ("silver", (110, 490, 95, 128)),
    ("slate", (204, 490, 96, 128)), ("black", (299, 490, 103, 127)),
]
for name, box in messenger:
    crop("image_1792568563211.png", f"messenger-{name}", box)

if options.messenger_only:
    print("Prepared 20 tightly masked Messenger icons.")
    raise SystemExit(0)

for i, name in enumerate(["laugh", "kiss", "neutral", "sad"]):
    crop("image_1792568612528.png", f"jelly-{name}", (i % 2 * 368, i // 2 * 368, 368, 368))

pixels = [
    ("smile", (25, 30, 90, 93)), ("unamused", (424, 28, 103, 99)),
    ("tongue", (542, 28, 110, 105)), ("blush", (661, 28, 105, 106)),
    ("stunned", (768, 27, 111, 108)), ("angry", (29, 164, 100, 105)),
    ("pleased", (132, 164, 102, 105)), ("horns", (243, 144, 117, 128)),
    ("pirate", (394, 134, 146, 142)), ("ears", (562, 168, 166, 103)),
    ("thinking", (731, 154, 107, 122)), ("grin", (27, 299, 102, 100)),
    ("toothy", (131, 296, 101, 104)), ("green-grin", (233, 297, 94, 102)),
    ("lime-grin", (327, 299, 91, 101)), ("skeptical", (418, 292, 101, 110)),
    ("confused", (521, 280, 99, 130)), ("sad", (620, 293, 103, 112)),
    ("cursing", (725, 279, 111, 128)), ("frown", (28, 417, 104, 107)),
    ("facepalm", (133, 413, 95, 111)), ("love", (231, 404, 136, 141)),
    ("no", (530, 418, 137, 112)), ("yes", (682, 418, 145, 112)),
    ("whistle", (132, 589, 130, 109)), ("laugh", (282, 589, 100, 110)),
    ("angel", (392, 581, 132, 123)), ("sick", (536, 593, 122, 115)),
]
for name, box in pixels:
    crop("image_1792568649710.png", f"pixel-{name}", box)

xp = [
    ("hello", 202, 152), ("smirk", 322, 152), ("happy", 442, 152),
    ("grin", 82, 276), ("sad", 202, 276), ("cheeky", 322, 276),
    ("bright", 442, 276), ("relaxed", 562, 276),
    ("laugh", 82, 397), ("sunny", 202, 397), ("frown", 322, 397),
    ("dizzy", 442, 397), ("worried", 562, 397),
]
for name, x, y in xp:
    crop("image_1792568702695.png", f"xp-{name}", (x, y, 95, 95))

# Original Tango Desktop Project icons, released into the public domain.
# Use the original project's mirror to avoid Wikimedia's download rate limits.
for name in ["smile", "wink", "surprise", "sad", "cool"]:
    output = OUT / f"tango-{name}.png"
    if output.exists():
        continue
    source_name = "glasses" if name == "cool" else name
    url = f"https://raw.githubusercontent.com/Distrotech/tango-icon-theme/master/32x32/emotes/face-{source_name}.png"
    request = urllib.request.Request(url, headers={"User-Agent": "GuestbookAssetPreparation/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        image = response.read()
    subprocess.run(["magick", "-background", "none", "-", "-resize", "64x64>",
                    str(output)], input=image, check=True)

print(f"Prepared {len(list(OUT.glob('*.png')))} guestbook smileys.")
