import { useCallback, useEffect, useRef, useState } from "react";

const FORMATS = {
  story: { key: "story", label: "1080 × 1920", width: 1080, height: 1920 },
  square: { key: "square", label: "1080 × 1080", width: 1080, height: 1080 },
  portrait: { key: "portrait", label: "1080 × 1350", width: 1080, height: 1350 },
};

const HIGHLIGHT_COLORS = {
  yellow: { label: "Yellow", fill: "rgba(247,230,126,.84)" },
  pink: { label: "Pink", fill: "rgba(246,182,220,.86)" },
  blue: { label: "Blue", fill: "rgba(171,219,255,.86)" },
  green: { label: "Green", fill: "rgba(188,234,182,.86)" },
  purple: { label: "Purple", fill: "rgba(213,190,255,.86)" },
  orange: { label: "Orange", fill: "rgba(255,205,155,.88)" },
};

const NOTE_COLORS = {
  neonPink: { label: "Neon Pink", ink: "#ff14b8", glow: "rgba(255,20,184,.78)" },
  purple: { label: "Purple", ink: "#9157ff", glow: "rgba(145,87,255,.74)" },
  blue: { label: "Blue", ink: "#2aa8ff", glow: "rgba(42,168,255,.76)" },
  green: { label: "Green", ink: "#27d86a", glow: "rgba(39,216,106,.76)" },
  orange: { label: "Orange", ink: "#ff8a2f", glow: "rgba(255,138,47,.76)" },
  white: { label: "White", ink: "#ffffff", glow: "rgba(255,255,255,.84)" },
  bloodRed: { label: "Blood Red", ink: "#d21632", glow: "rgba(210,22,50,.82)" },
  amber: { label: "Amber", ink: "#ffb347", glow: "rgba(255,179,71,.82)" },
  gold: { label: "Gold", ink: "#d4af37", glow: "rgba(212,175,55,.78)" },
  acidGreen: { label: "Acid Green", ink: "#b8ff2c", glow: "rgba(184,255,44,.82)" },
  coldBlue: { label: "Cold Blue", ink: "#8ed8ff", glow: "rgba(142,216,255,.82)" },
  black: { label: "Black", ink: "#111111", glow: "rgba(0,0,0,.18)" },
};

const NOTE_FONTS = {
  patrickHand: { label: "Patrick Hand", family: '"Patrick Hand", cursive' },
  indieFlower: { label: "Indie Flower", family: '"Indie Flower", cursive' },
  shadowsIntoLight: { label: "Shadows Into Light", family: '"Shadows Into Light", cursive' },
  kalam: { label: "Kalam", family: '"Kalam", cursive' },
  dancingScript: { label: "Dancing Script", family: '"Dancing Script", cursive' },
  permanentMarker: { label: "Permanent Marker", family: '"Permanent Marker", cursive' },
};

const SHIMMER_LEVELS = {
  off: { label: "Off", blur: 0, sparks: 0 },
  soft: { label: "Soft", blur: 10, sparks: 1 },
  strong: { label: "Strong", blur: 18, sparks: 2 },
};

const DECOR_OPTIONS = {
  none: { label: "None", glyph: "" },
  hearts: { label: "Hearts", glyph: "💕" },
  star: { label: "Star", glyph: "✦" },
  sparkle: { label: "Sparkle", glyph: "✨" },
  crown: { label: "Crown", glyph: "♛" },
  fan: { label: "Fan", glyph: "🪭" },
  rose: { label: "Rose", glyph: "🌹" },
  teacup: { label: "Teacup", glyph: "☕" },
  ring: { label: "Ring", glyph: "💍" },
  skull: { label: "Skull", glyph: "☠" },
  knife: { label: "Knife", glyph: "🗡" },
  blood: { label: "Blood Drop", glyph: "🩸" },
  wolf: { label: "Wolf", glyph: "🐺" },
  moon: { label: "Moon", glyph: "🌙" },
  claw: { label: "Claw", glyph: "🐾" },
  chain: { label: "Chain", glyph: "⛓" },
  flame: { label: "Flame", glyph: "🔥" },
  ghost: { label: "Ghost", glyph: "👻" },
  web: { label: "Spiderweb", glyph: "🕸" },
  stitches: { label: "Stitches", glyph: "🪡" },
  eye: { label: "Eye", glyph: "👁" },
  window: { label: "Window", glyph: "🪟" },
  cross: { label: "Cross", glyph: "✝" },
};

const GENRE_PRESETS = {
  regency: {
    label: "Regency Romance",
    noteColor: "neonPink",
    highlightColor: "yellow",
    noteFont: "patrickHand",
    decors: ["hearts", "star", "sparkle", "crown", "fan", "rose", "teacup", "ring"],
  },
  darkRomance: {
    label: "Dark Romance",
    noteColor: "bloodRed",
    highlightColor: "pink",
    noteFont: "permanentMarker",
    decors: ["hearts", "claw", "wolf", "moon", "blood", "chain", "flame", "star"],
  },
  darkHorror: {
    label: "Dark Horror Romance",
    noteColor: "bloodRed",
    highlightColor: "purple",
    noteFont: "kalam",
    decors: ["blood", "knife", "skull", "wolf", "moon", "chain", "claw", "ghost", "star"],
  },
  horror: {
    label: "Horror",
    noteColor: "acidGreen",
    highlightColor: "blue",
    noteFont: "shadowsIntoLight",
    decors: ["skull", "knife", "blood", "ghost", "web", "stitches", "eye", "window", "cross"],
  },
};

const PAGE_COLOR = "#fff7e6";

const DEFAULT_SPEC = `PASSAGE 3 — "Maze Heat" (Chapter 13, Yellow)

Copy this text:
"I have thought about this every night." His hands found her ankles beneath her yellow skirts, his fingers wrapping around bare skin. "I have woken up hard and aching with your name on my lips."
"Dominic." His name caught in her throat as she felt the cool air on her legs.
"I want to taste you." His hands slid higher, over her stockings and past her garters. "I want to bury my face between your thighs and make you forget your own name."
"Someone could see," she gasped, heat flooding her face as she glanced toward the maze path.
"No one will hear you but me." He ducked beneath her skirts and disappeared into the yellow silk.

Highlight in YELLOW:

"I have thought about this every night."
"I have woken up hard and aching with your name on my lips."
"I want to bury my face between your thighs and make you forget your own name."
"No one will hear you but me."

Dotted underline:

"I want to taste you."

Glitter neon pink annotations:

Write every night above the first line with tiny hearts
Write SCANDALOUS above "I want to taste you"
Write yes my lord next to "No one will hear you but me" with a star`;

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeText(value) {
  return (value || "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanLines(value) {
  return (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function extractQuotedPhrases(line) {
  const matches = [...(line || "").matchAll(/["“](.+?)["”]/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);

  if (matches.length) return matches;

  const fallback = stripOuterQuotes((line || "").trim());
  return fallback ? [fallback] : [];
}

function splitWriteInstructions(value) {
  return (value || "")
    .split(/(?=\bWrite\s+)/i)
    .map((item) => item.trim())
    .filter(Boolean);
}

function stripOuterQuotes(value) {
  const trimmed = (value || "").trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("“") && trimmed.endsWith("”"))) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function guessHighlightColor(value) {
  const v = (value || "").toLowerCase().trim();
  if (v.includes("yellow")) return "yellow";
  if (v.includes("pink")) return "pink";
  if (v.includes("blue")) return "blue";
  if (v.includes("green")) return "green";
  if (v.includes("purple")) return "purple";
  if (v.includes("orange")) return "orange";
  return "yellow";
}

function getGenrePreset(genreKey) {
  return GENRE_PRESETS[genreKey] || GENRE_PRESETS.regency;
}

function defaultFontForNoteText(text, genreKey = "regency") {
  const clean = (text || "").replace(/[^A-Za-z]/g, "");
  if (clean.length >= 5 && clean === clean.toUpperCase()) return "permanentMarker";
  return getGenrePreset(genreKey).noteFont;
}

function guessNoteColor(value, fallback = "neonPink") {
  const v = (value || "").toLowerCase().trim();
  if (v.includes("blood red") || v.includes("crimson") || v.includes("red")) return "bloodRed";
  if (v.includes("neon pink") || v.includes("pink")) return "neonPink";
  if (v.includes("gold")) return "gold";
  if (v.includes("amber")) return "amber";
  if (v.includes("acid green")) return "acidGreen";
  if (v.includes("cold blue")) return "coldBlue";
  if (v.includes("purple")) return "purple";
  if (v.includes("blue")) return "blue";
  if (v.includes("green")) return "green";
  if (v.includes("orange")) return "orange";
  if (v.includes("white")) return "white";
  if (v.includes("black")) return "black";
  return fallback;
}

function detectDecor(raw = "", genreKey = "regency") {
  const value = raw.toLowerCase();
  const checks = [
    ["tiny hearts", "hearts"], ["hearts", "hearts"], ["heart", "hearts"],
    ["sparkles", "sparkle"], ["sparkle", "sparkle"], ["star", "star"],
    ["crown", "crown"], ["fan", "fan"], ["rose", "rose"], ["teacup", "teacup"], ["tea cup", "teacup"], ["ring", "ring"],
    ["skull", "skull"], ["knife", "knife"], ["dagger", "knife"], ["blood drop", "blood"], ["blood drops", "blood"], ["blood", "blood"],
    ["wolf", "wolf"], ["moon", "moon"], ["claw", "claw"], ["paw", "claw"], ["chain", "chain"], ["flame", "flame"], ["fire", "flame"],
    ["ghost", "ghost"], ["web", "web"], ["stitches", "stitches"], ["stitch", "stitches"], ["eye", "eye"], ["window", "window"], ["cross", "cross"],
  ];
  for (const [needle, decor] of checks) {
    if (value.includes(needle)) return decor;
  }
  return "none";
}

function getDecorGlyph(decor) {
  return DECOR_OPTIONS[decor]?.glyph || "";
}

function sanitizeFilename(raw) {
  const base = (raw || "kindle-annotation").replace(/[\/\\?%*:|<>]/g, "-").trim();
  return base || "kindle-annotation";
}

function parseSpec(specText, genreKey = "regency") {
  const lines = (specText || "").split("\n");
  const firstNonEmpty = lines.find((line) => line.trim()) || `PASSAGE 1 — "Untitled" (Chapter 1, Yellow)`;

  const titleMatch = firstNonEmpty.match(/—\s*["“](.+?)["”]\s*\((.+?),\s*([^)]+)\)/i);
  const parsedTitle = titleMatch?.[1]?.trim() || "Untitled";
  const parsedChapter = titleMatch?.[2]?.trim() || "Chapter 1";
  const genrePreset = getGenrePreset(genreKey);
  const parsedPrimaryHighlight = guessHighlightColor(titleMatch?.[3] || genrePreset.highlightColor || "yellow");

  let mode = "";
  let currentHighlightColor = parsedPrimaryHighlight;
  let currentAnnotationColor = genrePreset.noteColor;
  let currentAnnotationShimmer = "strong";

  const passageLines = [];
  const highlightEntries = [];
  const underlineEntries = [];
  const noteInstructions = [];

  const addHighlightPhrases = (value) => {
    extractQuotedPhrases(value).forEach((phrase) => {
      highlightEntries.push({ phrase, color: currentHighlightColor });
    });
  };

  const addUnderlinePhrases = (value) => {
    extractQuotedPhrases(value).forEach((phrase) => {
      underlineEntries.push({ phrase });
    });
  };

  const addNoteInstructions = (value) => {
    splitWriteInstructions(value).forEach((raw) => {
      noteInstructions.push({
        raw,
        color: currentAnnotationColor,
        shimmer: currentAnnotationShimmer,
      });
    });
  };

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) continue;
    if (line === firstNonEmpty.trim()) continue;

    const copyMatch = rawLine.match(/^\s*Copy this text:\s*(.*)$/i);
    if (copyMatch) {
      mode = "passage";
      if (copyMatch[1]?.trim()) passageLines.push(copyMatch[1].trim());
      continue;
    }

    const highlightMatch = line.match(/^Highlight in\s+([A-Za-z ]+):\s*(.*)$/i);
    if (highlightMatch) {
      mode = "highlight";
      currentHighlightColor = guessHighlightColor(highlightMatch[1]);
      if (highlightMatch[2]?.trim()) addHighlightPhrases(highlightMatch[2]);
      continue;
    }

    const underlineMatch = line.match(/^Dotted underline:\s*(.*)$/i);
    if (underlineMatch) {
      mode = "underline";
      if (underlineMatch[1]?.trim()) addUnderlinePhrases(underlineMatch[1]);
      continue;
    }

    const annotationMatch = line.match(/^(.*?)annotations:\s*(.*)$/i);
    if (annotationMatch) {
      mode = "notes";
      const heading = annotationMatch[1]?.toLowerCase() || "";
      currentAnnotationColor = guessNoteColor(heading, genrePreset.noteColor);
      currentAnnotationShimmer = heading.includes("glitter") ? "strong" : "soft";
      if (annotationMatch[2]?.trim()) addNoteInstructions(annotationMatch[2]);
      continue;
    }

    if (mode === "passage") {
      passageLines.push(rawLine.trim());
      continue;
    }

    if (mode === "highlight") {
      addHighlightPhrases(line);
      continue;
    }

    if (mode === "underline") {
      addUnderlinePhrases(line);
      continue;
    }

    if (mode === "notes") {
      addNoteInstructions(line);
    }
  }

  const passage = passageLines.join("\n").trim();

  const firstLineFallback =
    highlightEntries[0]?.phrase ||
    stripOuterQuotes((passageLines[0] || "").trim()) ||
    normalizeText(passage).split(".")[0] + ".";

  const lastLineFallback =
    highlightEntries[highlightEntries.length - 1]?.phrase ||
    normalizeText(passage).split(".").filter(Boolean).slice(-1)[0]?.trim() + ".";

  const notes = noteInstructions.map((item) => {
    const raw = item.raw;
    const quoteMatches = [...raw.matchAll(/["“](.+?)["”]/g)].map((match) => match[1]);
    const writeMatch = raw.match(/^Write\s+(.+?)(?:\s+(above|next to|near)\s+(.+?))?(?:\s+with\s+(.+))?$/i);

    let text = "";
    let target = firstLineFallback;
    let decor = "none";

    if (writeMatch) {
      text = writeMatch[1]?.trim() || "note";
      const positionTarget = writeMatch[3]?.trim() || "";
      const tail = writeMatch[4]?.trim() || "";

      if (quoteMatches.length > 0) {
        target = quoteMatches[0];
      } else if (/first line/i.test(positionTarget)) {
        target = firstLineFallback;
      } else if (/last line/i.test(positionTarget)) {
        target = lastLineFallback;
      } else if (positionTarget) {
        target = positionTarget.replace(/^the\s+/i, "").trim();
      }

      decor = detectDecor(`${tail} ${raw}`, genreKey);
    } else {
      text = raw;
    }

    return {
      id: uid(),
      text,
      target: stripOuterQuotes(target),
      color: item.color,
      shimmer: item.shimmer,
      decor,
      size: 30,
      rotation: text.toLowerCase() === "scandalous" ? -3 : 0,
      font: defaultFontForNoteText(text, genreKey),
      x: 0,
      y: 0,
    };
  });

  return {
    saveTitle: firstNonEmpty.trim(),
    title: parsedTitle,
    chapter: parsedChapter,
    footer: `${parsedTitle} · ${parsedChapter}`,
    format: "story",
    lineGap: 22,
    noteSize: 30,
    genre: genreKey,
    passage,
    highlights: highlightEntries,
    underlines: underlineEntries,
    notes,
    defaultHighlightColor: parsedPrimaryHighlight,
  };
}

function findRanges(text, items, type) {
  const clean = normalizeText(text);
  const lower = clean.toLowerCase();
  const ranges = [];

  items.forEach((item, index) => {
    const phrase = normalizeText(item.phrase);
    if (!phrase) return;

    const start = lower.indexOf(phrase.toLowerCase());
    if (start === -1) return;

    ranges.push({ start, end: start + phrase.length, type, phrase, color: item.color || null, id: `${type}-${index}` });
  });

  return ranges;
}

function buildCharacterMap(passage, highlightItems, underlineItems) {
  const clean = normalizeText(passage);
  const ranges = [...findRanges(clean, highlightItems, "highlight"), ...findRanges(clean, underlineItems, "underline")];

  return [...clean].map((ch, index) => {
    const underline = ranges.find((range) => range.type === "underline" && index >= range.start && index < range.end);
    const highlight = ranges.find((range) => range.type === "highlight" && index >= range.start && index < range.end);
    const range = underline || highlight;

    return { ch, type: range?.type || null, phrase: range?.phrase || null, color: range?.color || null, rangeId: range?.id || null };
  });
}

function wrapLines(ctx, chars, maxWidth) {
  const lines = [];
  let line = [];
  let lineText = "";

  const pushLine = () => {
    while (line.length && line[line.length - 1].ch === " ") line.pop();
    if (line.length) lines.push(line);
    line = [];
    lineText = "";
  };

  chars.forEach((item) => {
    const test = lineText + item.ch;

    if (ctx.measureText(test).width > maxWidth && line.length > 0 && item.ch !== " ") {
      const lastSpace = line.map((x) => x.ch).lastIndexOf(" ");
      if (lastSpace > 8) {
        const keep = line.slice(0, lastSpace);
        const move = line.slice(lastSpace + 1);
        lines.push(keep);
        line = move;
        lineText = move.map((x) => x.ch).join("");
      } else {
        pushLine();
      }
    }

    if (!(line.length === 0 && item.ch === " ")) {
      line.push(item);
      lineText += item.ch;
    }
  });

  pushLine();
  return lines;
}

function lineToRuns(line) {
  const runs = [];
  let text = "";
  let type = line[0]?.type || null;
  let phrase = line[0]?.phrase || null;
  let color = line[0]?.color || null;
  let rangeId = line[0]?.rangeId || null;

  line.forEach((item) => {
    const changed = item.type !== type || item.rangeId !== rangeId;
    if (changed && text) {
      runs.push({ text, type, phrase, color, rangeId });
      text = "";
      type = item.type;
      phrase = item.phrase;
      color = item.color;
      rangeId = item.rangeId;
    }
    text += item.ch;
  });

  if (text) runs.push({ text, type, phrase, color, rangeId });
  return runs;
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawHeart(ctx, x, y, size, color, glow, blur) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = glow;
  ctx.shadowBlur = blur;
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.25);
  ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.3);
  ctx.bezierCurveTo(x - size * 0.5, y + size * 0.65, x, y + size * 0.78, x, y + size);
  ctx.bezierCurveTo(x, y + size * 0.78, x + size * 0.5, y + size * 0.65, x + size * 0.5, y + size * 0.3);
  ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSpark(ctx, x, y, size, color, glow, blur) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = glow;
  ctx.shadowBlur = blur;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.24, y - size * 0.24);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + size * 0.24, y + size * 0.24);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size * 0.24, y + size * 0.24);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - size * 0.24, y - size * 0.24);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function layoutFor(format, lineGap) {
  const { width, height } = format;
  const isSquare = width === height;
  const isStory = height / width > 1.6;
  const framePad = isSquare ? 44 : 58;
  const pageInset = isSquare ? 24 : 26;
  const innerPad = isSquare ? 58 : 70;

  const page = {
    x: framePad + pageInset,
    y: framePad + pageInset + 4,
    w: width - (framePad + pageInset) * 2,
    h: height - (framePad + pageInset + 4) * 2,
  };

  const fontSize = isSquare ? 26 : isStory ? 30 : 28;
  const lineHeightBase = isSquare ? 46 : isStory ? 56 : 52;

  return {
    page,
    textX: page.x + innerPad,
    textY: page.y + (isSquare ? 112 : 132),
    textW: page.w - innerPad * 2,
    fontSize,
    lineHeight: lineHeightBase + Number(lineGap || 0),
    headerY: page.y + 54,
    footerY: page.y + page.h - 42,
    safeLeft: page.x + 28,
    safeRight: page.x + page.w - 28,
    safeTop: page.y + 72,
    safeBottom: page.y + page.h - 86,
  };
}

function buildLineSlots(lineCount, layout, noteSize) {
  return Array.from({ length: lineCount }, (_, index) => {
    const baseline = layout.textY + index * layout.lineHeight;
    const gapTop = baseline + Math.max(10, noteSize * 0.14);
    const gapBottom = baseline + layout.lineHeight - Math.max(12, noteSize * 0.22);
    const gapHeight = Math.max(1, gapBottom - gapTop);

    return { lineIndex: index, baseline, gapTop, gapBottom, gapHeight, noteBaseline: gapTop + gapHeight * 0.68 };
  });
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function getNoteFontFamily(note) {
  return NOTE_FONTS[note.font]?.family || NOTE_FONTS.patrickHand.family;
}

function measureNoteBox(note) {
  const measureCanvas = document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  const size = Number(note.size || 30);
  ctx.font = `700 ${size}px ${getNoteFontFamily(note)}`;
  const baseWidth = ctx.measureText(note.text || "").width;
  const glyph = getDecorGlyph(note.decor);
  const extra = glyph ? Math.max(42, size * 1.1) : 24;

  return { width: baseWidth + extra, height: size + 18 };
}

function findTargetBox(hitBoxes, target) {
  const cleanTarget = normalizeText(target).toLowerCase();
  if (!cleanTarget) return null;

  const exact = hitBoxes.find((box) => normalizeText(box.phrase || box.text).toLowerCase() === cleanTarget);
  if (exact) return exact;

  const loose = hitBoxes.find((box) => {
    const cleanBox = normalizeText(box.text).toLowerCase();
    return cleanTarget.includes(cleanBox) || cleanBox.includes(cleanTarget);
  });

  return loose || hitBoxes[0] || null;
}

function measureDocument(doc) {
  const format = FORMATS[doc.format];
  const layout = layoutFor(format, doc.lineGap);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const characters = buildCharacterMap(doc.passage, doc.highlights, doc.underlines);

  ctx.font = `${layout.fontSize}px Georgia, serif`;
  const lines = wrapLines(ctx, characters, layout.textW);
  const hitBoxes = [];

  let y = layout.textY;
  lines.forEach((line, lineIndex) => {
    const runs = lineToRuns(line);
    let cursor = layout.textX;

    runs.forEach((run) => {
      const width = ctx.measureText(run.text).width;
      if (run.type === "highlight" || run.type === "underline") {
        hitBoxes.push({ ...run, x: cursor, y: y - layout.fontSize, width, height: layout.fontSize + 14, lineIndex });
      }
      cursor += width;
    });

    y += layout.lineHeight;
  });

  const lineSlots = buildLineSlots(lines.length, layout, Number(doc.noteSize || 30));
  return { format, layout, lines, hitBoxes, lineSlots };
}

function autoPlaceNotes(doc, notes) {
  const { layout, hitBoxes, lineSlots } = measureDocument(doc);
  const placed = [];

  return notes.map((note, index) => {
    const box = findTargetBox(hitBoxes, note.target);
    const measure = measureNoteBox(note);
    const preferredLine = box ? box.lineIndex : index;
    const rightX = box ? box.x + box.width + 22 : layout.textX + layout.textW * 0.62;
    const leftX = box ? box.x - measure.width - 22 : layout.textX;
    const preferredX = rightX + measure.width <= layout.safeRight ? rightX : leftX;

    const candidates = [];
    const start = clamp(preferredLine, 0, Math.max(0, lineSlots.length - 1));
    candidates.push(start);
    for (let offset = 1; offset < lineSlots.length; offset += 1) {
      const down = start + offset;
      const up = start - offset;
      if (down < lineSlots.length) candidates.push(down);
      if (up >= 0) candidates.push(up);
    }

    let chosen = null;

    for (const lineIndex of candidates) {
      const slot = lineSlots[lineIndex];
      const y = clamp(slot.noteBaseline - measure.height * 0.72, layout.safeTop, layout.safeBottom - measure.height);
      const xOptions = [preferredX, layout.textX + layout.textW - measure.width, layout.textX, layout.safeRight - measure.width, layout.safeLeft];

      for (const rawX of xOptions) {
        const x = clamp(rawX, layout.safeLeft, layout.safeRight - measure.width);
        const rect = { x, y, w: measure.width, h: measure.height };
        const collision = placed.some((item) => rectsOverlap(rect, item));
        if (!collision) {
          chosen = { x, y, w: measure.width, h: measure.height };
          break;
        }
      }

      if (chosen) break;
    }

    if (!chosen) {
      chosen = {
        x: clamp(preferredX, layout.safeLeft, layout.safeRight - measure.width),
        y: clamp(layout.textY, layout.safeTop, layout.safeBottom - measure.height),
        w: measure.width,
        h: measure.height,
      };
    }

    placed.push(chosen);
    return { ...note, x: chosen.x, y: chosen.y };
  });
}

function drawFrame(ctx, format, layout) {
  const { width, height } = format;
  const outerPad = Math.max(32, Math.round(width * 0.038));

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#d6cabd");
  bg.addColorStop(1, "#8a7e74");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#111111";
  roundRect(ctx, outerPad, outerPad, width - outerPad * 2, height - outerPad * 2, 52);
  ctx.fill();

  ctx.fillStyle = "#262626";
  roundRect(ctx, outerPad + 18, outerPad + 18, width - (outerPad + 18) * 2, height - (outerPad + 18) * 2, 38);
  ctx.fill();

  ctx.fillStyle = PAGE_COLOR;
  roundRect(ctx, layout.page.x, layout.page.y, layout.page.w, layout.page.h, 8);
  ctx.fill();

  ctx.fillStyle = "rgba(90,70,40,.043)";
  for (let y = layout.page.y; y < layout.page.y + layout.page.h; y += 4) {
    ctx.fillRect(layout.page.x, y, layout.page.w, 1);
  }
}

function drawText(ctx, doc) {
  const format = FORMATS[doc.format];
  const layout = layoutFor(format, doc.lineGap);
  const characters = buildCharacterMap(doc.passage, doc.highlights, doc.underlines);

  ctx.fillStyle = "#7a6b59";
  ctx.font = "italic 20px Georgia, serif";
  ctx.fillText(`${doc.chapter} · ${doc.title}`, layout.textX, layout.headerY);

  ctx.font = `${layout.fontSize}px Georgia, serif`;
  ctx.textBaseline = "alphabetic";

  const lines = wrapLines(ctx, characters, layout.textW);
  let y = layout.textY;

  lines.forEach((line) => {
    const runs = lineToRuns(line);
    let cursor = layout.textX;

    runs.forEach((run) => {
      const width = ctx.measureText(run.text).width;

      if (run.type === "highlight") {
        const fill = HIGHLIGHT_COLORS[run.color || doc.defaultHighlightColor || "yellow"]?.fill || HIGHLIGHT_COLORS.yellow.fill;
        ctx.fillStyle = fill;
        ctx.fillRect(cursor - 3, y - layout.fontSize + 6, width + 6, layout.fontSize + 8);
      }

      ctx.fillStyle = "#111111";
      ctx.fillText(run.text, cursor, y);

      if (run.type === "underline") {
        ctx.save();
        ctx.strokeStyle = NOTE_COLORS.neonPink.ink;
        ctx.shadowColor = NOTE_COLORS.neonPink.glow;
        ctx.shadowBlur = 7;
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.moveTo(cursor, y + 9);
        ctx.lineTo(cursor + width, y + 9);
        ctx.stroke();
        ctx.restore();
      }

      cursor += width;
    });

    y += layout.lineHeight;
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#171717";
  ctx.font = "700 28px Arial, sans-serif";
  ctx.fillText(doc.footer, format.width / 2, layout.footerY);
}

function drawOneNote(ctx, note) {
  const color = NOTE_COLORS[note.color] || NOTE_COLORS.neonPink;
  const shimmer = SHIMMER_LEVELS[note.shimmer] || SHIMMER_LEVELS.soft;
  const fontSize = Number(note.size || 30);
  const glyph = getDecorGlyph(note.decor);

  ctx.save();
  ctx.translate(note.x, note.y + fontSize * 0.84);
  ctx.rotate(((Number(note.rotation || 0)) * Math.PI) / 180);
  ctx.font = `700 ${fontSize}px ${getNoteFontFamily(note)}`;
  ctx.fillStyle = color.ink;
  ctx.shadowColor = color.glow;
  ctx.shadowBlur = shimmer.blur;
  ctx.fillText(note.text, 0, 0);

  if (shimmer.sparks > 0) drawSpark(ctx, -18, -8, 12, color.ink, color.glow, shimmer.blur);

  if (shimmer.sparks > 1) {
    const w = ctx.measureText(note.text).width;
    drawSpark(ctx, w + 18, -14, 8, color.ink, color.glow, shimmer.blur);
  }

  if (glyph) {
    const w = ctx.measureText(note.text).width;
    if (note.decor === "hearts") {
      drawHeart(ctx, w + 18, -28, 20, color.ink, color.glow, shimmer.blur);
      drawHeart(ctx, w + 46, -4, 14, color.ink, color.glow, shimmer.blur);
    } else if (note.decor === "star") {
      drawSpark(ctx, w + 18, -12, 12, color.ink, color.glow, shimmer.blur);
    } else {
      ctx.font = `${Math.max(18, fontSize * 0.72)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.fillText(glyph, w + 14, -4);
    }
  }

  ctx.restore();
}

function drawScene(ctx, doc, notes, options = {}) {
  const { renderNotes = true } = options;
  const format = FORMATS[doc.format];
  const layout = layoutFor(format, doc.lineGap);

  ctx.clearRect(0, 0, format.width, format.height);
  drawFrame(ctx, format, layout);

  ctx.save();
  drawText(ctx, doc);
  if (renderNotes) notes.forEach((note) => drawOneNote(ctx, note));
  ctx.restore();
}

function shimmerStyle(note) {
  const color = NOTE_COLORS[note.color] || NOTE_COLORS.neonPink;
  const shimmer = SHIMMER_LEVELS[note.shimmer] || SHIMMER_LEVELS.soft;
  if (shimmer.blur === 0) return "none";
  return `0 0 ${Math.max(4, shimmer.blur)}px ${color.glow}, 0 0 ${Math.max(10, shimmer.blur + 4)}px ${color.glow}`;
}

async function exportCanvas(doc, notes) {
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // keep exporting even if font readiness fails
    }
  }

  const format = FORMATS[doc.format];
  const canvas = document.createElement("canvas");
  canvas.width = format.width;
  canvas.height = format.height;
  const ctx = canvas.getContext("2d");

  drawScene(ctx, doc, notes, { renderNotes: true });

  const filename = `${sanitizeFilename(doc.saveTitle)}.png`;

  const downloadURL = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        downloadURL(url);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
      } else {
        downloadURL(canvas.toDataURL("image/png"));
      }
    }, "image/png");
  } else {
    downloadURL(canvas.toDataURL("image/png"));
  }
}

function NoteOverlay({ note, scale, selected, onSelect, onMove }) {
  const startRef = useRef(null);
  const color = NOTE_COLORS[note.color] || NOTE_COLORS.neonPink;

  const onPointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(note.id);
    startRef.current = { px: event.clientX, py: event.clientY, x: note.x, y: note.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!startRef.current) return;
    const dx = (event.clientX - startRef.current.px) / scale;
    const dy = (event.clientY - startRef.current.py) / scale;
    onMove(note.id, startRef.current.x + dx, startRef.current.y + dy);
  };

  const endDrag = () => {
    startRef.current = null;
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(note.id);
      }}
      style={{
        position: "absolute",
        left: note.x * scale,
        top: note.y * scale,
        transform: `rotate(${note.rotation || 0}deg)`,
        fontFamily: getNoteFontFamily(note),
        fontWeight: 700,
        fontSize: note.size * scale,
        lineHeight: 1,
        color: color.ink,
        textShadow: shimmerStyle(note),
        cursor: "move",
        userSelect: "none",
        touchAction: "none",
        outline: selected ? "2px dashed rgba(255,255,255,.92)" : "none",
        outlineOffset: 3,
        whiteSpace: "nowrap",
      }}
    >
      {note.shimmer !== "off" && (
        <span style={{ position: "absolute", left: -16 * scale, top: -10 * scale, fontSize: 14 * scale }}>✦</span>
      )}

      <span>{note.text}</span>

      {note.decor !== "none" && getDecorGlyph(note.decor) && (
        <span style={{ marginLeft: 6 * scale, fontSize: note.size * 0.68 * scale }}>{getDecorGlyph(note.decor)}</span>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".16em", color: "#bda98b", marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  background: "#fff8e8",
  color: "#111",
  border: "1px solid rgba(0,0,0,.08)",
  borderRadius: 8,
  padding: "10px 12px",
};

const textareaStyle = {
  width: "100%",
  resize: "vertical",
  background: "#fff8e8",
  color: "#111",
  border: "1px solid rgba(0,0,0,.08)",
  borderRadius: 8,
  padding: "10px 12px",
  lineHeight: 1.45,
  minHeight: 220,
};

const toolBtn = {
  background: "rgba(255,255,255,.10)",
  color: "#efe2cf",
  border: "none",
  borderRadius: 8,
  padding: "10px 12px",
  cursor: "pointer",
};

export default function App() {
  const [fontReady, setFontReady] = useState(false);
  const [specText, setSpecText] = useState(DEFAULT_SPEC);
  const [doc, setDoc] = useState(() => parseSpec(DEFAULT_SPEC));
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [previewWidth, setPreviewWidth] = useState(620);
  const [selectedGenre, setSelectedGenre] = useState("regency");
  const canvasRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Indie+Flower&family=Shadows+Into+Light&family=Kalam:wght@300;400;700&family=Dancing+Script:wght@400;700&family=Permanent+Marker&display=swap');`;
    document.head.appendChild(style);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setFontReady(true));
    } else {
      setFontReady(true);
    }

    return () => style.remove();
  }, []);

  const buildFromSpec = useCallback((raw, genreKey = selectedGenre) => {
    const parsed = parseSpec(raw, genreKey);
    const placedNotes = autoPlaceNotes(parsed, parsed.notes);
    setDoc(parsed);
    setNotes(placedNotes);
    setSelectedId(placedNotes[0]?.id || null);
  }, [selectedGenre]);

  useEffect(() => {
    if (fontReady) buildFromSpec(DEFAULT_SPEC, "regency");
  }, [fontReady]);

  const format = FORMATS[doc.format];
  const scale = previewWidth / format.width;
  const previewHeight = format.height * scale;
  const selectedNote = notes.find((note) => note.id === selectedId) || null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = format.width;
    canvas.height = format.height;
    const ctx = canvas.getContext("2d");
    // Preview canvas is text-only. Notes are shown once as draggable HTML overlays.
    drawScene(ctx, doc, [], { renderNotes: false });
  }, [doc, notes, format.width, format.height]);

  const updateDoc = (key, value) => {
    setDoc((old) => ({ ...old, [key]: value }));
  };

  const updateNote = (id, patch) => {
    setNotes((old) => old.map((note) => (note.id === id ? { ...note, ...patch } : note)));
  };

  const moveNote = (id, x, y) => {
    const { layout } = measureDocument(doc);

    setNotes((old) =>
      old.map((note) => {
        if (note.id !== id) return note;
        const box = measureNoteBox(note);
        return {
          ...note,
          x: clamp(Math.round(x), layout.safeLeft, layout.safeRight - box.width),
          y: clamp(Math.round(y), layout.safeTop, layout.safeBottom - box.height),
        };
      })
    );
  };

  const duplicateSelected = () => {
    if (!selectedNote) return;
    const copy = { ...selectedNote, id: uid(), x: selectedNote.x + 22, y: selectedNote.y + 22 };
    setNotes((old) => [...old, copy]);
    setSelectedId(copy.id);
  };

  const deleteSelected = () => {
    if (!selectedNote) return;
    setNotes((old) => old.filter((note) => note.id !== selectedNote.id));
    setSelectedId(null);
  };

  const addNote = () => {
    const { layout } = measureDocument(doc);
    const note = {
      id: uid(),
      text: "new note",
      target: "",
      color: getGenrePreset(selectedGenre).noteColor,
      shimmer: "soft",
      decor: "none",
      size: Number(doc.noteSize || 30),
      rotation: 0,
      font: getGenrePreset(selectedGenre).noteFont,
      x: layout.textX + layout.textW * 0.62,
      y: layout.textY + 40,
    };
    setNotes((old) => [...old, note]);
    setSelectedId(note.id);
  };

  const applyGenrePreset = (genreKey) => {
    setSelectedGenre(genreKey);
    setDoc((old) => ({ ...old, genre: genreKey, defaultHighlightColor: getGenrePreset(genreKey).highlightColor }));
  };

  const rebuildFromPrompt = () => buildFromSpec(specText, selectedGenre);

  const exportPNG = async () => {
    await exportCanvas(doc, notes);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#17120f", color: "#efe2cf" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.22)" }}>
        <div>
          <div style={{ fontSize: 14, letterSpacing: ".18em", textTransform: "uppercase", color: "#f0cfaa" }}>Kindle Annotation Builder</div>
          <div style={{ fontSize: 11, color: "#a9967c" }}>Preview is zoomable. Notes are HTML-only in preview. Export burns notes into the PNG. Genre presets now switch the decor vibe too.</div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={rebuildFromPrompt} style={toolBtn}>Build Screenshot</button>
          <button onClick={exportPNG} style={{ background: "#ff4fcf", color: "#111", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 700, cursor: "pointer", boxShadow: "0 0 20px rgba(255,20,184,.28)" }}>Export PNG</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "430px 1fr 320px", minHeight: "calc(100vh - 66px)" }}>
        <div style={{ padding: 16, borderRight: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.08)", overflowY: "auto" }}>
          <Field label="Paste the full prompt block">
            <textarea value={specText} onChange={(e) => setSpecText(e.target.value)} rows={18} style={textareaStyle} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Genre preset">
              <select value={selectedGenre} onChange={(e) => applyGenrePreset(e.target.value)} style={inputStyle}>
                {Object.entries(GENRE_PRESETS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
              </select>
            </Field>

            <Field label="Format">
              <select value={doc.format} onChange={(e) => updateDoc("format", e.target.value)} style={inputStyle}>
                {Object.values(FORMATS).map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Save filename">
            <input value={doc.saveTitle} onChange={(e) => updateDoc("saveTitle", e.target.value)} style={inputStyle} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label={`Line space (${doc.lineGap}px)`}>
              <input type="range" min="10" max="44" value={doc.lineGap} onChange={(e) => updateDoc("lineGap", Number(e.target.value))} style={{ width: "100%" }} />
            </Field>

            <Field label={`Default note size (${doc.noteSize}px)`}>
              <input type="range" min="22" max="44" value={doc.noteSize} onChange={(e) => updateDoc("noteSize", Number(e.target.value))} style={{ width: "100%" }} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            <Field label={`Preview zoom (${previewWidth}px wide)`}>
              <input type="range" min="430" max="900" value={previewWidth} onChange={(e) => setPreviewWidth(Number(e.target.value))} style={{ width: "100%" }} />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={rebuildFromPrompt} style={toolBtn}>Rebuild Notes</button>
            <button onClick={addNote} style={toolBtn}>Add Note</button>
            <button onClick={exportPNG} style={{ ...toolBtn, background: "#ff4fcf", color: "#111", fontWeight: 700 }}>Export PNG</button>
          </div>

          <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "rgba(255,79,207,.10)", border: "1px solid rgba(255,79,207,.25)", fontSize: 12, lineHeight: 1.45, color: "#ffd6f3" }}>
            Genre presets now work for Regency Romance, Dark Romance, Dark Horror Romance, and Horror. Build Screenshot will re-read your pasted block using the selected preset. The canvas preview still stays text-only, so the draggable notes are the only notes you see in preview.
          </div>

          <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", fontSize: 12, lineHeight: 1.5, color: "#efe2cf" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Preset decor library</div>
            <div><b>{GENRE_PRESETS[selectedGenre].label}</b></div>
            <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {GENRE_PRESETS[selectedGenre].decors.map((decorKey) => (
                <span key={decorKey} style={{ padding: "4px 8px", borderRadius: 999, background: "rgba(255,255,255,.08)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span>{getDecorGlyph(decorKey)}</span>
                  <span>{DECOR_OPTIONS[decorKey]?.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: 18, display: "flex", flexDirection: "column", alignItems: "center", overflow: "auto" }}>
          <div style={{ fontSize: 12, color: "#a9967c", marginBottom: 10 }}>Drag notes anywhere inside the Kindle page.</div>

          <div onClick={() => setSelectedId(null)} style={{ position: "relative", width: previewWidth, height: previewHeight, borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.45)" }}>
            <canvas ref={canvasRef} style={{ width: previewWidth, height: previewHeight, display: "block" }} />

            {notes.map((note) => (
              <NoteOverlay key={note.id} note={note} scale={scale} selected={selectedId === note.id} onSelect={setSelectedId} onMove={moveNote} />
            ))}
          </div>
        </div>

        <div style={{ padding: 16, borderLeft: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.08)", overflowY: "auto" }}>
          <div style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: ".16em", color: "#f0cfaa", marginBottom: 4 }}>Selected note</div>
          <div style={{ fontSize: 12, color: "#a9967c", marginBottom: 12 }}>{selectedNote ? "Edit the selected note." : "Click a note to edit it."}</div>

          {selectedNote ? (
            <>
              <Field label="Text">
                <input value={selectedNote.text} onChange={(e) => updateNote(selectedNote.id, { text: e.target.value })} style={inputStyle} />
              </Field>

              <Field label="Target phrase">
                <input value={selectedNote.target} onChange={(e) => updateNote(selectedNote.id, { target: e.target.value })} style={inputStyle} />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Color">
                  <select value={selectedNote.color} onChange={(e) => updateNote(selectedNote.id, { color: e.target.value })} style={inputStyle}>
                    {Object.entries(NOTE_COLORS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                  </select>
                </Field>

                <Field label="Font">
                  <select value={selectedNote.font || "patrickHand"} onChange={(e) => updateNote(selectedNote.id, { font: e.target.value })} style={inputStyle}>
                    {Object.entries(NOTE_FONTS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                  </select>
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Shimmer">
                  <select value={selectedNote.shimmer} onChange={(e) => updateNote(selectedNote.id, { shimmer: e.target.value })} style={inputStyle}>
                    {Object.entries(SHIMMER_LEVELS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                  </select>
                </Field>

                <Field label="Decor">
                  <select value={selectedNote.decor} onChange={(e) => updateNote(selectedNote.id, { decor: e.target.value })} style={inputStyle}>
                    {Object.entries(DECOR_OPTIONS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
                  </select>
                </Field>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label={`Rotation (${selectedNote.rotation || 0}°)`}>
                  <input type="range" min="-20" max="20" value={selectedNote.rotation || 0} onChange={(e) => updateNote(selectedNote.id, { rotation: Number(e.target.value) })} style={{ width: "100%" }} />
                </Field>

                <Field label={`Size (${selectedNote.size}px)`}>
                  <input type="range" min="22" max="44" value={selectedNote.size} onChange={(e) => updateNote(selectedNote.id, { size: Number(e.target.value) })} style={{ width: "100%" }} />
                </Field>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={duplicateSelected} style={toolBtn}>Duplicate</button>
                <button onClick={deleteSelected} style={{ ...toolBtn, background: "#6d1515" }}>Delete</button>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: "#a9967c", lineHeight: 1.45 }}>
              Paste the block on the left.<br />
              Click <b>Build Screenshot</b>.<br />
              Then drag notes or tweak them here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
