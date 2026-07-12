# Taste decisions — teed up for Ege (PR #8)

The machine-verifiable surface is done: legibility, accessibility (axe 0 violations),
reduced-motion, CLS 0, no console errors, real archive media, a branded OG card, and
JSON-LD are all shipped and verified. What separates "very good" from awwwards SOTD is
**craft and feel** — pacing, type, and the signature moment. Those are taste calls, which
are yours. Below is each one framed as a concrete choice against what current SOTD winners
consistently do, so you can decide from the PR #8 prod screenshots. I have **not** made any
of these edits. Point me at a pick (or a reference frame) and I'll execute.

---

## 1. The signature moment — is the rose bloom *earned*?

**Now:** the field morphs into the rose in the `#system` act; the caption resolves on bloom.
It's genuinely the "how did they do that" moment — the strongest asset on the page.

**What winners do:** the signature moment gets *air* and a *hold* — silence before, a beat on
the payoff, often a scroll-scrub that lets the visitor control the reveal frame-by-frame.

**Decision:**
- **(A) Keep** the current auto-timed bloom.
- **(B) Scrub the bloom to scroll** — the rose forms exactly as fast as you scroll, so the
  visitor drives it. This is the single highest-leverage change toward SOTD; it turns a nice
  animation into an *interaction*. (My recommendation — but it touches the READ-ONLY field's
  drive, so I'd need your go-ahead and a reference frame.)
- **(C) Add a longer silent hold** before the bloom (more empty scroll distance) so it lands
  with more weight.

## 2. Pacing / scroll rhythm

**Now:** sections are evenly spaced (`py-[12vh]`–`py-[14vh]`). Even rhythm reads as
"professional." Winners use **uneven** rhythm — a cramped, dense section next to a vast empty
one — to create tension and release.

**Decision:**
- **(A) Keep** even spacing.
- **(B) Introduce one big breath** — e.g. a full-viewport of near-empty field between the
  archive and the flagship, so the flagship arrives after a pause. Cheap to try, high feel-impact.

## 3. Type — the statement treatment

**Now:** Clash Display, condensed, uppercase, tight tracking. Clean and on-grammar. The
"NOT DEMOS." dim line is a nice rhythm device.

**What winners do:** one *unrepeatable* type move — a ligature, an oversized punctuation mark,
a single italic word, mixed weights mid-word, or a line that breaks the grid.

**Decision:**
- **(A) Keep** the current uniform treatment.
- **(B) One accent** — e.g. set "Proof attached." in a contrasting cut (italic serif, or a
  hairline weight) so the thesis line has a distinct voice. One move only; more would read as noise.

## 4. Intro brighten — drama vs. AA

**Now:** I raised the scroll-brighten floor from `0.16` -> `0.5` to pass WCAG AA contrast. That
made it less dramatic (dim->bright is now subtle->bright).

**Decision:**
- **(A) Keep** `0.5` (AA-safe, current).
- **(B) Go darker** (`0.3`) for more drama, accepting the contrast trade — the `sr-only`
  accessible copy means screen-reader users are unaffected either way; this is purely the
  sighted-visual reveal depth. Your call on drama-vs-AA.

## 5. Copy voice — flagship

**Now:** "The brain is the interface." + a receipts-dense paragraph. Accurate and dense.
Winners often cut hero/flagship copy to the bone — one line, let the work speak.

**Decision:**
- **(A) Keep** the full paragraph.
- **(B) Cut to 2 sentences** and move the detail into the expandable archive row.

---

### How to drive this
Reply with picks like "1B, 2B, 4A" and (for anything touching the field or type) a reference
frame or SOTD link so I'm anchored to your taste, not mine. I'll execute against the pick and
verify each in the prod-build loop.
