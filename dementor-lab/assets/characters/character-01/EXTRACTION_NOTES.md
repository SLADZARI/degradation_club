# Character 01 — extraction / rebuild notes

Source inspected: uploaded `character-01-rig-template(3).jpeg`, 703×1024.

The supplied file is a **flattened JPEG**, not a layered SVG/PNG/Figma export. It visibly contains full-opacity chosen elements plus semi-transparent/ghosted alternatives. Because those alternatives are already composited against the character, they cannot be losslessly separated back into their original vector layers from this file alone.

For the playable vertical slice we rebuilt the clearly readable high-confidence elements as independent semantic SVG groups:

- `hat` — tall black mitre-style headwear with light line/cross;
- `glasses` — black shutter/slatted glasses;
- `beard` — moustache + pointed beard/goatee;
- `accessory` — crossed smoking accessories + smoke marks;
- `outfit` — beige overshirt, striped long sleeves, white inner shirt, dark shorts;
- `shoes` — black sneakers with light sole/laces.

The runtime face contract remains separate from appearance: eyes, brows and mouth variants are controlled by metrics. Body rig groups remain independently addressable for motion.

If the original layered SVG/Figma export becomes available later, replace the rebuilt geometry inside these same canonical group IDs rather than changing runtime APIs or panel semantics.
