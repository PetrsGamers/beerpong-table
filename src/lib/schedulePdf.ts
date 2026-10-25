import type { jsPDF } from "jspdf";
import type { RowInput } from "jspdf-autotable";

export type ScheduleRow = {
  round: number;
  tableNumber: number;
  team1Name: string;
  team2Name: string;
  score: string | null;
};

type Rgb = [number, number, number];
const BLACK: Rgb = [0, 0, 0];
const WHITE: Rgb = [255, 255, 255];
const ROUND_BLUE: Rgb = [99, 174, 251];
const STRIPE_GREY: Rgb = [243, 243, 243];
const LINE_GREY: Rgb = [221, 221, 221];
const TABLE_NUMBER_BLUE: Rgb = [21, 85, 151];
const COLON_ORANGE: Rgb = [255, 65, 0];

const MARGIN = 11;
const CELL_PADDING = { top: 2.4, bottom: 2.4, left: 2, right: 2 };

// Liberation Sans matches Helvetica's metrics and, unlike the built-in PDF
// fonts, covers Czech diacritics
async function addFont(doc: jsPDF, file: string, style: string) {
  const buffer = await (await fetch(`/fonts/${file}`)).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + 0x8000))
    );
  }
  doc.addFileToVFS(file, btoa(binary));
  doc.addFont(file, "LiberationSans", style);
}

function fileSlug(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "turnaj";
}

async function createDoc(options: {
  format: string | number[];
  orientation?: "portrait" | "landscape";
}) {
  // loaded on demand to keep jsPDF out of the page bundle
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ unit: "mm", ...options });
  await Promise.all([
    addFont(doc, "LiberationSans-Regular.ttf", "normal"),
    addFont(doc, "LiberationSans-Bold.ttf", "bold"),
  ]);
  return { doc, autoTable };
}

function groupByRound(schedule: ScheduleRow[]): ScheduleRow[][] {
  const rounds = new Map<number, ScheduleRow[]>();
  for (const m of schedule) {
    rounds.set(m.round, [...(rounds.get(m.round) ?? []), m]);
  }
  return Array.from(rounds.values());
}

// A4 document in the style of the league's printed schedules
export async function downloadSchedulePdf(
  tournamentName: string,
  schedule: ScheduleRow[]
): Promise<void> {
  const { doc, autoTable } = await createDoc({ format: "a4" });

  // a blue header row per round, followed by one row per table
  const body: RowInput[] = [];
  const roundHeaderRows = new Set<number>();
  schedule.forEach((m, i) => {
    if (i === 0 || schedule[i - 1].round !== m.round) {
      roundHeaderRows.add(body.length);
      body.push([{ content: `${m.round}.kolo`, colSpan: 4 }]);
    }
    body.push([
      String(m.tableNumber),
      m.team1Name,
      m.score ?? ":",
      m.team2Name,
    ]);
  });

  const headerStyles = {
    fillColor: ROUND_BLUE,
    textColor: WHITE,
    fontStyle: "bold" as const,
    fontSize: 9,
  };

  autoTable(doc, {
    margin: MARGIN,
    head: [[{ content: tournamentName, colSpan: 4 }]],
    showHead: "firstPage",
    body,
    theme: "plain",
    rowPageBreak: "avoid",
    styles: {
      font: "LiberationSans",
      fontSize: 10,
      textColor: BLACK,
      halign: "center",
      valign: "middle",
      cellPadding: CELL_PADDING,
      lineColor: LINE_GREY,
      lineWidth: { bottom: 0.25 },
    },
    headStyles: {
      fillColor: BLACK,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 9,
      lineWidth: 0,
    },
    columnStyles: {
      0: { cellWidth: 14.6, fontSize: 8, textColor: TABLE_NUMBER_BLUE },
      1: { cellWidth: 79 },
      2: { cellWidth: 14.6, fontStyle: "bold", textColor: COLON_ORANGE },
      3: { cellWidth: "auto" },
    },
    didParseCell: ({ section, row, cell }) => {
      if (section !== "body") return;
      if (roundHeaderRows.has(row.index)) {
        Object.assign(cell.styles, headerStyles);
        return;
      }
      // stripes alternate across all body rows, round headers included
      cell.styles.fillColor = row.index % 2 === 1 ? STRIPE_GREY : WHITE;
    },
    didDrawCell: ({ section, row, cell }) => {
      // "Hřiště" heads the table-number column, while the round name stays
      // centred across the whole row
      if (section !== "body" || !roundHeaderRows.has(row.index)) return;
      doc.setFont("LiberationSans", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...WHITE);
      // autotable centres the full line height, not just the em box
      const lineHeightShift =
        ((doc.getLineHeightFactor() - 1) / 2) * (9 / doc.internal.scaleFactor);
      doc.text(
        "Hřiště",
        cell.x + CELL_PADDING.left,
        cell.y + cell.height / 2 - lineHeightShift,
        { baseline: "middle" }
      );
    },
  });

  doc.save(`rozpis-${fileSlug(tournamentName)}.pdf`);
}

// shrinks the font until the text fits, so long team names stay on one line
function fitFontSize(
  doc: jsPDF,
  text: string,
  maxWidth: number,
  size: number
): number {
  doc.setFontSize(size);
  while (size > 6 && doc.getTextWidth(text) > maxWidth) {
    size -= 0.5;
    doc.setFontSize(size);
  }
  return size;
}

const SLIDE_WIDTH = 320;
const SLIDE_HEIGHT = 180;
const SLIDE_MARGIN = 12;

// 16:9 slideshow, one slide per round, to project during the tournament
export async function downloadScheduleSlidesPdf(
  tournamentName: string,
  schedule: ScheduleRow[]
): Promise<void> {
  const { doc } = await createDoc({
    format: [SLIDE_WIDTH, SLIDE_HEIGHT],
    orientation: "landscape",
  });
  const rounds = groupByRound(schedule);
  const contentWidth = SLIDE_WIDTH - 2 * SLIDE_MARGIN;
  const centerX = SLIDE_WIDTH / 2;

  rounds.forEach((matches, index) => {
    if (index > 0) doc.addPage();
    const round = matches[0].round;
    const next = rounds[index + 1];

    // tournament strip and round band
    doc.setFillColor(...BLACK);
    doc.rect(0, 0, SLIDE_WIDTH, 14, "F");
    doc.setFont("LiberationSans", "bold");
    doc.setTextColor(...WHITE);
    doc.setFontSize(fitFontSize(doc, tournamentName, contentWidth * 0.7, 14));
    doc.text(tournamentName, SLIDE_MARGIN, 7, { baseline: "middle" });
    doc.setFont("LiberationSans", "normal");
    doc.setFontSize(12);
    doc.text(
      `kolo ${index + 1} z ${rounds.length}`,
      SLIDE_WIDTH - SLIDE_MARGIN,
      7,
      {
        align: "right",
        baseline: "middle",
      }
    );

    doc.setFillColor(...ROUND_BLUE);
    doc.rect(0, 14, SLIDE_WIDTH, 28, "F");
    doc.setFont("LiberationSans", "bold");
    doc.setFontSize(16);
    doc.text("Hřiště", SLIDE_MARGIN, 28, { baseline: "middle" });
    doc.setFontSize(44);
    doc.text(`${round}.kolo`, centerX, 28, {
      align: "center",
      baseline: "middle",
    });

    // current round: one striped row per table, sized to fill the space
    const numberWidth = 26;
    const colonWidth = 30;
    const teamWidth = (contentWidth - numberWidth - colonWidth) / 2;
    const team1X = SLIDE_MARGIN + numberWidth + teamWidth / 2;
    const team2X = SLIDE_WIDTH - SLIDE_MARGIN - teamWidth / 2;
    const areaTop = 46;
    const areaHeight = next ? 84 : 112;
    const rowHeight = Math.min(areaHeight / matches.length, 22);
    const teamFontSize = (rowHeight * 0.42) / 0.3528; // mm to pt

    matches.forEach((m, i) => {
      const y = areaTop + i * rowHeight;
      const middle = y + rowHeight / 2;
      doc.setFillColor(...(i % 2 === 0 ? STRIPE_GREY : WHITE));
      doc.rect(SLIDE_MARGIN, y, contentWidth, rowHeight, "F");
      doc.setDrawColor(...LINE_GREY);
      doc.setLineWidth(0.3);
      doc.line(
        SLIDE_MARGIN,
        y + rowHeight,
        SLIDE_WIDTH - SLIDE_MARGIN,
        y + rowHeight
      );

      doc.setFont("LiberationSans", "bold");
      doc.setFontSize(teamFontSize * 0.8);
      doc.setTextColor(...TABLE_NUMBER_BLUE);
      doc.text(String(m.tableNumber), SLIDE_MARGIN + numberWidth / 2, middle, {
        align: "center",
        baseline: "middle",
      });

      doc.setFont("LiberationSans", "normal");
      doc.setTextColor(...BLACK);
      for (const [name, x] of [
        [m.team1Name, team1X],
        [m.team2Name, team2X],
      ] as const) {
        fitFontSize(doc, name, teamWidth - 4, teamFontSize);
        doc.text(name, x, middle, { align: "center", baseline: "middle" });
      }

      doc.setFont("LiberationSans", "bold");
      doc.setFontSize(teamFontSize);
      doc.setTextColor(...COLON_ORANGE);
      doc.text(m.score ?? ":", centerX, middle, {
        align: "center",
        baseline: "middle",
      });
    });

    // next round, smaller, so teams know to get ready
    const footerTop = areaTop + areaHeight + 5;
    doc.setFont("LiberationSans", "bold");
    doc.setTextColor(...TABLE_NUMBER_BLUE);
    if (!next) {
      doc.setFontSize(22);
      doc.text("Poslední kolo turnaje", centerX, footerTop + 14, {
        align: "center",
        baseline: "middle",
      });
      return;
    }
    doc.setFontSize(16);
    doc.text(
      `Další kolo – ${next[0].round}.kolo`,
      SLIDE_MARGIN,
      footerTop + 3,
      {
        baseline: "middle",
      }
    );

    const columns = Math.min(3, next.length);
    const perColumn = Math.ceil(next.length / columns);
    const columnWidth = contentWidth / columns;
    const entriesTop = footerTop + 12;
    const lineHeight = Math.min(
      9,
      (SLIDE_HEIGHT - SLIDE_MARGIN / 2 - entriesTop) / perColumn
    );
    const entryFontSize = (lineHeight * 0.6) / 0.3528; // mm to pt
    next.forEach((m, i) => {
      const x = SLIDE_MARGIN + Math.floor(i / perColumn) * columnWidth;
      const y = entriesTop + (i % perColumn) * lineHeight + lineHeight / 2;
      doc.setFont("LiberationSans", "bold");
      doc.setFontSize(entryFontSize);
      doc.setTextColor(...TABLE_NUMBER_BLUE);
      doc.text(String(m.tableNumber), x, y, { baseline: "middle" });

      // team : team, with the colon in the same orange as the main rows
      const textX = x + entryFontSize * 0.5;
      const colon = " : ";
      doc.setFont("LiberationSans", "normal");
      const size = fitFontSize(
        doc,
        m.team1Name + colon + m.team2Name,
        columnWidth - (textX - x) - 4,
        entryFontSize
      );
      let cursor = textX;
      for (const [part, color, style] of [
        [m.team1Name, BLACK, "normal"],
        [colon, COLON_ORANGE, "bold"],
        [m.team2Name, BLACK, "normal"],
      ] as const) {
        doc.setFont("LiberationSans", style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.text(part, cursor, y, { baseline: "middle" });
        cursor += doc.getTextWidth(part);
      }
    });
  });

  doc.save(`prezentace-${fileSlug(tournamentName)}.pdf`);
}
