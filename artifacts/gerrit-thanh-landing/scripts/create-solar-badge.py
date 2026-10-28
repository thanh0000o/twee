"""Render SOLAR lettering with the supplied badge's blue/yellow light-sweep style."""
import math
import subprocess
import sys
import tempfile
from pathlib import Path

GLYPHS = {
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
}


def frame_svg(frame):
    phase = frame / 20 * math.tau
    lettering, rays = [], []
    for index, letter in enumerate("SOLAR"):
        for col in range(5):
            x = 15 + index * 12 + col * 2
            brightness = .78 + .22 * math.cos(phase - x / 88 * math.tau)
            colour = f"rgb({int(238*brightness)},{int(238*brightness)},32)"
            rows = [row for row, bits in enumerate(GLYPHS[letter]) if bits[col] == "1"]
            if not rows:
                continue
            bottom = 8 + (max(rows) + 1) * 2
            offset = 9 * math.sin(phase - x / 88 * math.tau)
            rays.append(
                f'<path d="M{x} {bottom}h2L{x+2+offset:.2f} 30H{x+offset:.2f}z" '
                f'fill="url(#beam)" opacity="{brightness*.48:.3f}"/>'
            )
            for row in rows:
                lettering.append(
                    f'<rect x="{x}" y="{8+row*2}" width="2" height="2" fill="{colour}"/>'
                )
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="88" height="31">'
        '<defs><linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">'
        '<stop stop-color="#eeee70" stop-opacity=".8"/>'
        '<stop offset="1" stop-color="#eeee70" stop-opacity="0"/>'
        '</linearGradient></defs>'
        '<rect width="88" height="31" fill="#000"/>'
        '<rect x="2" y="2" width="84" height="27" fill="#000080"/>'
        + "".join(rays)
        + '<g shape-rendering="crispEdges">'
        + "".join(lettering)
        + '<path d="M1 30V1h86" fill="none" stroke="#fff" stroke-width="1"/>'
        + '</g></svg>'
    )


destination = Path(sys.argv[1])
with tempfile.TemporaryDirectory() as directory:
    frames = []
    for frame in range(20):
        svg = Path(directory) / f"frame-{frame:02d}.svg"
        png = svg.with_suffix(".png")
        svg.write_text(frame_svg(frame))
        subprocess.run(["magick", str(svg), str(png)], check=True)
        frames.append(str(png))
    subprocess.run(
        ["magick", "-delay", "10", *frames, "-loop", "0", "-layers", "Optimize", str(destination)],
        check=True,
    )
