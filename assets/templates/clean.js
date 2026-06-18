// Builds Arun's branded PowerPoint template — matches the portfolio site.
// Palette: indigo #534AB7 family. Headers: Sora. Body: Inter.
// Layouts: Title, Section divider, Content (bullets), Big stat, Two-column, Case study, Closing.
const pptxgen = require("pptxgenjs");

const C = {
  indigo900: "26215C",
  indigo800: "3C3489",
  indigo600: "534AB7",
  indigo400: "7F77DD",
  indigo200: "AFA9EC",
  indigo50:  "EEEDFE",
  teal:      "5DCAA5",
  coral:     "F0997B",
  ink:       "1A1A2E",
  inkSoft:   "4A4A5E",
  inkFaint:  "8A8A9A",
  white:     "FFFFFF",
  bgSoft:    "F7F7FB",
};
const HEAD = "Sora";
const BODY = "Inter";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Arun Teja Kamisetti";
pres.title = "Arun Teja Kamisetti — Deck Template";
const W = 13.3, H = 7.5;

// Little Kai mark (matches the site companion) — rasterized PNG next to this script
const path = require("path");
const KAI = path.join(__dirname, "kai.png");

function footer(slide, n, dark) {
  const col = dark ? C.indigo200 : C.inkFaint;
  slide.addText("Arun Teja Kamisetti", { x: 0.6, y: H - 0.5, w: 5, h: 0.3, fontFace: BODY, fontSize: 9, color: col, align: "left", margin: 0 });
  slide.addText(String(n), { x: W - 1.2, y: H - 0.5, w: 0.6, h: 0.3, fontFace: BODY, fontSize: 9, color: col, align: "right", margin: 0 });
}

/* ---------- 1. TITLE ---------- */
let s = pres.addSlide();
s.background = { color: C.indigo900 };
s.addShape(pres.shapes.OVAL, { x: W - 4.2, y: -2.2, w: 6, h: 6, fill: { color: C.indigo600, transparency: 70 } });
s.addShape(pres.shapes.OVAL, { x: -1.8, y: H - 2.6, w: 4.5, h: 4.5, fill: { color: C.indigo400, transparency: 80 } });
s.addText("DECK TITLE GOES HERE", { x: 0.9, y: 2.4, w: 9.8, h: 1.6, fontFace: HEAD, fontSize: 46, bold: true, color: C.white, align: "left", margin: 0 });
s.addText("A short, sharp subtitle that frames the story.", { x: 0.92, y: 4.0, w: 9, h: 0.6, fontFace: BODY, fontSize: 18, color: C.indigo200, align: "left", margin: 0 });
s.addText([
  { text: "Arun Teja Kamisetti", options: { bold: true, color: C.white } },
  { text: "   ·   Aspiring AI Product Manager   ·   Month 2026", options: { color: C.indigo200 } },
], { x: 0.92, y: 5.0, w: 10, h: 0.4, fontFace: BODY, fontSize: 13, align: "left", margin: 0 });
s.addImage({ path: KAI, x: W - 2.4, y: H - 2.5, w: 1.5, h: 1.5 });

/* ---------- 2. SECTION DIVIDER ---------- */
s = pres.addSlide();
s.background = { color: C.indigo600 };
s.addText("01", { x: 0.9, y: 2.3, w: 2, h: 1.2, fontFace: HEAD, fontSize: 60, bold: true, color: C.indigo200, align: "left", margin: 0 });
s.addText("Section title", { x: 0.92, y: 3.5, w: 10, h: 1, fontFace: HEAD, fontSize: 38, bold: true, color: C.white, align: "left", margin: 0 });
s.addText("One line on what this section covers.", { x: 0.92, y: 4.5, w: 9, h: 0.5, fontFace: BODY, fontSize: 16, color: C.indigo50, align: "left", margin: 0 });
footer(s, 2, true);

/* ---------- 3. CONTENT (bullets + side panel) ---------- */
s = pres.addSlide();
s.background = { color: C.white };
s.addText("Slide title here", { x: 0.6, y: 0.5, w: 8.5, h: 0.8, fontFace: HEAD, fontSize: 30, bold: true, color: C.ink, align: "left", margin: 0 });
s.addText([
  { text: "First key point — keep it to one idea per line.", options: { bullet: { characterCode: "2022" }, color: C.inkSoft, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Second point with the supporting detail.", options: { bullet: { characterCode: "2022" }, color: C.inkSoft, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Third point — end with the implication.", options: { bullet: { characterCode: "2022" }, color: C.inkSoft, breakLine: true, paraSpaceAfter: 14 } },
  { text: "Fourth point if you need it.", options: { bullet: { characterCode: "2022" }, color: C.inkSoft } },
], { x: 0.6, y: 1.6, w: 7.4, h: 4.5, fontFace: BODY, fontSize: 17, align: "left", valign: "top" });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.5, y: 1.6, w: 4.2, h: 4.3, fill: { color: C.indigo50 }, rectRadius: 0.12 });
s.addText("Callout", { x: 8.8, y: 1.9, w: 3.6, h: 0.4, fontFace: HEAD, fontSize: 14, bold: true, color: C.indigo800, align: "left", margin: 0 });
s.addText("Use this panel for a takeaway, a quote, or a key visual. Swap the fill for an image with rounded corners.", { x: 8.8, y: 2.4, w: 3.6, h: 3.2, fontFace: BODY, fontSize: 14, color: C.indigo800, align: "left", valign: "top", margin: 0 });
footer(s, 3, false);

/* ---------- 4. BIG STAT ---------- */
s = pres.addSlide();
s.background = { color: C.white };
s.addText("The metric that matters", { x: 0.6, y: 0.5, w: 10, h: 0.7, fontFace: HEAD, fontSize: 26, bold: true, color: C.ink, align: "left", margin: 0 });
const stats = [
  { n: "220 → 1", l: "models evaluated to one" },
  { n: "0 → 1", l: "product, BRD shipped" },
  { n: "100%", l: "conviction" },
];
stats.forEach((st, i) => {
  const x = 0.6 + i * 4.15;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.0, w: 3.8, h: 3.0, fill: { color: C.bgSoft }, line: { color: C.indigo50, width: 1 }, rectRadius: 0.12 });
  s.addText(st.n, { x, y: 2.5, w: 3.8, h: 1.2, fontFace: HEAD, fontSize: 44, bold: true, color: C.indigo600, align: "center", margin: 0 });
  s.addText(st.l, { x: x + 0.2, y: 3.8, w: 3.4, h: 0.8, fontFace: BODY, fontSize: 14, color: C.inkSoft, align: "center", margin: 0 });
});
footer(s, 4, false);

/* ---------- 5. TWO-COLUMN (before / after) ---------- */
s = pres.addSlide();
s.background = { color: C.white };
s.addText("Before vs. after", { x: 0.6, y: 0.5, w: 10, h: 0.7, fontFace: HEAD, fontSize: 26, bold: true, color: C.ink, align: "left", margin: 0 });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.7, w: 5.9, h: 4.3, fill: { color: C.bgSoft }, rectRadius: 0.12 });
s.addText("Before", { x: 0.9, y: 2.0, w: 5, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: C.inkFaint, align: "left", margin: 0 });
s.addText([
  { text: "Pain point one", options: { bullet: { characterCode: "2022" }, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Pain point two", options: { bullet: { characterCode: "2022" }, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Pain point three", options: { bullet: { characterCode: "2022" } } },
], { x: 0.9, y: 2.6, w: 5.3, h: 3.2, fontFace: BODY, fontSize: 15, color: C.inkSoft, valign: "top" });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.8, y: 1.7, w: 5.9, h: 4.3, fill: { color: C.indigo50 }, rectRadius: 0.12 });
s.addText("After", { x: 7.1, y: 2.0, w: 5, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: C.indigo600, align: "left", margin: 0 });
s.addText([
  { text: "Improvement one", options: { bullet: { characterCode: "2022" }, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Improvement two", options: { bullet: { characterCode: "2022" }, breakLine: true, paraSpaceAfter: 12 } },
  { text: "Improvement three", options: { bullet: { characterCode: "2022" } } },
], { x: 7.1, y: 2.6, w: 5.3, h: 3.2, fontFace: BODY, fontSize: 15, color: C.indigo800, valign: "top" });
footer(s, 5, false);

/* ---------- 6. CASE STUDY (Problem→Approach→Impact) ---------- */
s = pres.addSlide();
s.background = { color: C.white };
s.addText("Case study", { x: 0.6, y: 0.5, w: 10, h: 0.7, fontFace: HEAD, fontSize: 26, bold: true, color: C.ink, align: "left", margin: 0 });
const steps = [
  { h: "Problem", b: "What was broken and why it mattered." },
  { h: "Approach", b: "How I framed it and what I did." },
  { h: "Impact", b: "The measured outcome." },
];
steps.forEach((st, i) => {
  const x = 0.6 + i * 4.15;
  s.addShape(pres.shapes.OVAL, { x, y: 1.9, w: 0.5, h: 0.5, fill: { color: C.indigo600 } });
  s.addText(String(i + 1), { x, y: 1.9, w: 0.5, h: 0.5, fontFace: HEAD, fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s.addText(st.h, { x: x + 0.65, y: 1.9, w: 3, h: 0.5, fontFace: HEAD, fontSize: 18, bold: true, color: C.indigo800, align: "left", valign: "middle", margin: 0 });
  s.addText(st.b, { x, y: 2.7, w: 3.8, h: 2.5, fontFace: BODY, fontSize: 14, color: C.inkSoft, align: "left", valign: "top", margin: 0 });
});
footer(s, 6, false);

/* ---------- 7. CLOSING ---------- */
s = pres.addSlide();
s.background = { color: C.indigo900 };
s.addImage({ path: KAI, x: 0.8, y: 2.6, w: 1.7, h: 1.7 });
s.addText("Thank you.", { x: 2.8, y: 2.6, w: 9, h: 1, fontFace: HEAD, fontSize: 40, bold: true, color: C.white, align: "left", margin: 0 });
s.addText([
  { text: "Arun Teja Kamisetti", options: { color: C.white, bold: true, breakLine: true } },
  { text: "arunteja2000@gmail.com", options: { color: C.indigo200, breakLine: true } },
  { text: "github.com/ArunTejaKamisetti  ·  linkedin.com/in/aruntejakamisetti", options: { color: C.indigo200 } },
], { x: 2.82, y: 3.7, w: 9, h: 1.5, fontFace: BODY, fontSize: 15, align: "left", margin: 0 });

pres.writeFile({ fileName: "Arun_Deck_Template.pptx" }).then((f) => console.log("Saved:", f));
