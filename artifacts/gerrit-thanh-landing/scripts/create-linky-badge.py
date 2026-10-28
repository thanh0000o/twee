"""Replace the left-hand lettering while retaining the original GIF animation."""
import subprocess
import sys
import tempfile
from pathlib import Path

GLYPHS = {
    "l": ["10000", "10000", "10000", "10000", "10000", "10000", "11110"],
    "i": ["00100", "00000", "01100", "00100", "00100", "00100", "01110"],
    "n": ["00000", "00000", "11110", "10001", "10001", "10001", "10001"],
    "k": ["10000", "10000", "10010", "10100", "11000", "10100", "10010"],
    "y": ["00000", "10001", "10001", "01111", "00001", "10001", "01110"],
    "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
    "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
    "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
}


def text_pixels(text, x, y):
    pixels = []
    for index, letter in enumerate(text):
        colour = "#ff0000" if index == 0 else "#ffffff"
        for row, bits in enumerate(GLYPHS[letter]):
            for col, bit in enumerate(bits):
                if bit == "1":
                    pixels.append((x + index * 6 + col, y + row, colour))
    # Separate outline and fill passes keep the one-pixel letters crisp.
    outline = "".join(
        f'<rect x="{x-1}" y="{y-1}" width="3" height="3" fill="#000"/>'
        for x, y, _ in pixels
    )
    fill = "".join(
        f'<rect x="{x}" y="{y}" width="1" height="1" fill="{colour}"/>'
        for x, y, colour in pixels
    )
    return outline + fill


source, destination = map(Path, sys.argv[1:3])
overlay = (
    '<svg xmlns="http://www.w3.org/2000/svg" width="88" height="31">'
    '<g shape-rendering="crispEdges">'
    '<path fill="#aaa" d="M0 0h36v31H0zM36 10h5v21h-5z"/>'
    + text_pixels("linky", 4, 7)
    + text_pixels("2001", 7, 20)
    + "</g></svg>"
)
with tempfile.TemporaryDirectory() as directory:
    svg = Path(directory) / "lettering.svg"
    svg.write_text(overlay)
    overlay_png = Path(directory) / "lettering.png"
    subprocess.run(["magick", "-background", "none", str(svg), str(overlay_png)], check=True)
    subprocess.run(
        ["magick", str(source), "-coalesce", str(Path(directory) / "frame-%02d.png")],
        check=True,
    )
    frames = sorted(Path(directory).glob("frame-*.png"))
    for frame in frames:
        edited = Path(directory) / f"edited-{frame.name}"
        subprocess.run(
            ["magick", str(frame), str(overlay_png), "-compose", "over", "-composite", str(edited)],
            check=True,
        )
    subprocess.run(
        [
            "magick", "-delay", "10",
            *(str(Path(directory) / f"edited-{frame.name}") for frame in frames),
            "-loop", "0", "-layers", "Optimize", str(destination),
        ],
        check=True,
    )
