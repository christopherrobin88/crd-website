# CRD tree credit

The "Developed by Christopher Robin Design" credit. The official lockup, with the tree split into parts so it can move. It sways when it scrolls into view, leans away from the pointer, and lets a leaf go now and then.

## Files

| File | What it is | Raw | Gzip |
|---|---|---|---|
| `crd-credit.js` | Behaviour (vanilla JS, no dependencies) | 13,513 B | 4,692 B |
| `crd-credit.css` | Layout, theme variables, focus style | 2,977 B | 1,062 B |
| `crd-tree.svg` | Official lockup, grouped for animation | 29,611 B | 9,653 B |
| `demo.html` | Cream and ink demo, tall page | | |
| `evidence/` | Recording, stills, verification results | | |

JS plus CSS: 5,586 B gzip, under the 8 KB budget. The SVG is separate. Its path data is the official lockup's, and it is 9.6 KB gzipped on its own (the original is 9.6 KB too).

## Drop-in use

Copy `crd-credit.js`, `crd-credit.css` and `crd-tree.svg` into the same folder (for example `assets/` or `/crd-credit/`). Link the CSS in `<head>` and the script before `</body>`:

```html
<link rel="stylesheet" href="assets/crd-credit.css">
<!-- ... -->
<script src="assets/crd-credit.js" defer></script>
```

The script enhances an existing `#crd-credit` element. That can be the link itself, or a wrapper with the link inside, which is the usual footer pattern:

```html
<div class="crd-credit" id="crd-credit">
  <a href="https://christopherrobindesign.com" target="_blank" rel="noopener"
     aria-label="Christopher Robin Design">
    <span>Developed by</span>
    <img src="assets/crd-lockup.svg" alt="" width="170" height="72">
  </a>
</div>
```

If the `img` still points at `crd-lockup.svg`, the script looks for `crd-tree.svg` in the same folder (or next to `crd-credit.js`). You can also set `data-crd-src` on the link. If the SVG cannot be fetched (for example from `file://`), the static image stays and the credit is still shown.

You can also write the link as `<a class="crd-credit" id="crd-credit" ...>`. Both forms work.

## Theming

- Default: official colours, for cream or bone backgrounds.
- Ink or dark backgrounds: add the class `crd-credit--on-ink` to the link, or set `data-theme="ink"` on an ancestor. This remaps fills only. The geometry is unchanged.
- Custom colours: override the variables `--crd-ink`, `--crd-leaf`, `--crd-gold`, `--crd-credit-text`, `--crd-credit-accent` and `--crd-focus`. Set them on `.crd-credit`, or on a parent with a selector of the form `.parent .crd-credit{...}` (a parent-only declaration is overridden by the link's own default).

## Behaviour

- **Scroll in:** a soft sway pivoting from the trunk base (about 3 degrees, 1.2 to 1.8 s to settle). One or two leaves let go. Plays once per page load when the credit is 60% visible.
- **Pointer (desktop):** within about 150 px of the credit, the trunk and branches lean away from the pointer, and the leaves lean a little further, each slightly differently. The tree eases back when the pointer leaves.
- **Linger or fast pass:** about 1.2 s close, or a quick sweep past, lets one leaf fall. A falling leaf is a copy that drifts down and fades out. The original fades out, then fades back in 1.5 to 3 s later.
- **Limits:** at least 2.2 s between falls, and at most 3 leaves detached at once.
- **Touch:** a tap gives a sway and one leaf, under the same limits. The link still opens the site.
- **Reduced motion:** the logo is shown in full and nothing moves. No animation frames are requested, and no leaves fall.
- **Keyboard:** the link is focusable, with a 2 px outline on `:focus-visible`. Its accessible name is "Christopher Robin Design".

## Tuning

The constants are at the top of `crd-credit.js`: `RANGE` (150 px), `SWAY_LEAN` (4 degrees), `LEAF_LEAN` (9 degrees), `PIVOT` (trunk base in tree coordinates, `[222, 440]`), `MAX_FALLEN` (3), `MIN_GAP` (2200 ms), `LINGER_MS` (1200 ms) and `FAST_PASS` (1.1 px/ms).

## Notes

- The limits apply per credit. A page with two credits can drop two leaves at the same moment.
- `crd-tree.svg` is the official lockup with ids and wrapper groups added. The path data, fills and translates are copied unchanged. The `<title>` element is removed, because it would show as a hover tooltip.
- The "DESIGN" line uses Playfair Display, falling back to Georgia. Add the font to the site if you want it exact.

## Re-running the checks

From the job folder, with a static server on `127.0.0.1:8765` serving that folder:

```
node tree-credit/build/verify.mjs
```

It writes `tree-credit/evidence/verify-results.json`.
