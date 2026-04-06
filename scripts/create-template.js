'use strict';
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, WidthType, BorderStyle, ShadingType,
  PageNumber, TabStopType, TabStopPosition,
} = require('docx');

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_W = 9360;       // content width in DXA (US Letter 12240 - 2×1440 margins)
const NAVY   = '1B3A5C';
const LBLUE  = 'D5E8F0';
const YELW   = 'FFFDE7';
const LGRAY  = 'F5F5F5';
const PGRAY  = 'E0E0E0';
const CBORD  = 'CCCCCC';

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: CBORD };
const allBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const noBorder   = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders  = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function shading(hex) {
  return { fill: hex, type: ShadingType.CLEAR };
}

// ─── Helper: section header (full-width navy row) ────────────────────────────
function sectionHeader(text) {
  return new Table({
    width: { size: PAGE_W, type: WidthType.DXA },
    columnWidths: [PAGE_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: allBorders,
            width: { size: PAGE_W, type: WidthType.DXA },
            shading: shading(NAVY),
            margins: cellMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({ text, bold: true, color: 'FFFFFF', size: 22, font: 'Arial' }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ─── Helper: label cell ───────────────────────────────────────────────────────
function labelCell(text, w) {
  return new TableCell({
    borders: allBorders,
    width: { size: w, type: WidthType.DXA },
    margins: cellMargins,
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 18, font: 'Arial' })],
      }),
    ],
  });
}

// ─── Helper: input cell (yellow) ─────────────────────────────────────────────
function inputCell(text, w) {
  return new TableCell({
    borders: allBorders,
    width: { size: w, type: WidthType.DXA },
    shading: shading(YELW),
    margins: cellMargins,
    children: [
      new Paragraph({
        children: [new TextRun({ text: text || '', size: 18, font: 'Arial' })],
      }),
    ],
  });
}

// ─── Helper: header cell (blue) ──────────────────────────────────────────────
function headerCell(text, w) {
  return new TableCell({
    borders: allBorders,
    width: { size: w, type: WidthType.DXA },
    shading: shading(LBLUE),
    margins: cellMargins,
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 18, font: 'Arial' })],
      }),
    ],
  });
}

// ─── Helper: data row cell with alternating fill ─────────────────────────────
function dataCell(w, rowIdx) {
  const fill = rowIdx % 2 === 0 ? 'FFFFFF' : LGRAY;
  return new TableCell({
    borders: allBorders,
    width: { size: w, type: WidthType.DXA },
    shading: shading(fill),
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text: '', size: 18, font: 'Arial' })] })],
  });
}

// ─── Helper: small spacer paragraph ──────────────────────────────────────────
function spacer(pt = 80) {
  return new Paragraph({
    spacing: { before: pt, after: pt },
    children: [],
  });
}

// ─── Helper: lined blank row ─────────────────────────────────────────────────
function lineRow() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: CBORD } },
    spacing: { before: 160, after: 160 },
    children: [new TextRun({ text: '', size: 20, font: 'Arial' })],
  });
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
const docHeader = new Header({
  children: [
    new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: CBORD } },
      spacing: { after: 80 },
      children: [
        new TextRun({ text: '[COMPANY LOGO]   [COMPANY NAME]', bold: true, size: 20, font: 'Arial' }),
        new TextRun({ text: '\t', size: 20 }),
        new TextRun({ text: 'RESTORATION REPORT', bold: true, size: 20, font: 'Arial' }),
      ],
    }),
    new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      spacing: { after: 40 },
      children: [
        new TextRun({ text: '', size: 18, font: 'Arial' }),
        new TextRun({ text: '\t', size: 18 }),
        new TextRun({ text: 'Date: ____________   Claim #: ____________', size: 18, font: 'Arial' }),
      ],
    }),
  ],
});

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const docFooter = new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: CBORD } },
      spacing: { before: 80 },
      children: [
        new TextRun({ text: 'Page ', size: 16, font: 'Arial', color: '666666' }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, font: 'Arial', color: '666666' }),
        new TextRun({ text: ' of ', size: 16, font: 'Arial', color: '666666' }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, font: 'Arial', color: '666666' }),
        new TextRun({ text: '   |   This report is prepared for insurance claim purposes', size: 16, font: 'Arial', color: '666666' }),
      ],
    }),
  ],
});

// ─── SECTION 1 — Job & Claim Information ────────────────────────────────────
// 4-column table: label | input | label | input
const col4 = [1440, 2040, 1440, 2040]; // 6960 + 400 spacing = works within PAGE_W
const col4sum = 1440 + 2040 + 1440 + 2400; // adjust
// Use simpler proportional widths summing to PAGE_W=9360
const c1 = [1560, 2120, 1560, 2120]; // sum = 7360 — use this
// Actually let's make it: [1600, 2080, 1600, 2080] = 7360 — still short
// Full width: [2000, 2680, 2000, 2680] = 9360 ✓
const LW = 2000; const VW = 2680; // label width, value width

function claimRow(l1, v1, l2, v2) {
  return new TableRow({
    children: [
      labelCell(l1, LW),
      inputCell(v1, VW),
      labelCell(l2, LW),
      inputCell(v2, VW),
    ],
  });
}

const section1Table = new Table({
  width: { size: PAGE_W, type: WidthType.DXA },
  columnWidths: [LW, VW, LW, VW],
  rows: [
    claimRow('Claim Number:', '', 'Date of Loss:', ''),
    claimRow('Insured Name:', '', 'Policy Number:', ''),
    claimRow('Property Address:', '', 'Date Report Written:', ''),
    claimRow('Adjuster Name:', '', 'Adjuster Contact:', ''),
    claimRow('Cause of Loss:', '[ ] Water  [ ] Fire  [ ] Mold  [ ] Storm', 'Referred By:', ''),
    claimRow('Job Number:', '', '', ''),
  ],
});

// ─── SECTION 2 — Property Details ────────────────────────────────────────────
const section2Table = new Table({
  width: { size: PAGE_W, type: WidthType.DXA },
  columnWidths: [LW, VW, LW, VW],
  rows: [
    claimRow('Property Type:', '[ ] Residential  [ ] Commercial', 'Year Built:', ''),
    claimRow('Sq. Footage Affected:', '', 'Number of Rooms:', ''),
    new TableRow({
      children: [
        labelCell('Floors Affected:', LW),
        new TableCell({
          borders: allBorders,
          width: { size: VW + LW + VW, type: WidthType.DXA },
          shading: shading(YELW),
          margins: cellMargins,
          columnSpan: 3,
          children: [new Paragraph({
            children: [new TextRun({ text: '[ ] Basement  [ ] 1st  [ ] 2nd  [ ] 3rd+', size: 18, font: 'Arial' })],
          })],
        }),
      ],
    }),
  ],
});

// ─── SECTION 3 — Initial Assessment ─────────────────────────────────────────
const section3 = [
  new Paragraph({ children: [new TextRun({ text: 'Arrival Conditions:', bold: true, size: 20, font: 'Arial' })] }),
  lineRow(), lineRow(), lineRow(),
  spacer(80),
  new Paragraph({ children: [new TextRun({ text: 'Visible Damage Description:', bold: true, size: 20, font: 'Arial' })] }),
  lineRow(), lineRow(), lineRow(),
  spacer(80),
  new Paragraph({
    children: [
      new TextRun({ text: 'Safety Hazards Noted:  [ ] Yes  [ ] No     If yes, describe: ___________________________', size: 20, font: 'Arial' }),
    ],
  }),
  spacer(60),
  new Paragraph({
    children: [
      new TextRun({ text: 'Initial Moisture Readings Taken:  [ ] Yes  [ ] No', size: 20, font: 'Arial' }),
    ],
  }),
];

// ─── SECTION 4 — Moisture Readings Log ───────────────────────────────────────
const mCols = [2200, 1600, 1400, 1960, 2200]; // sum = 9360
const section4Table = new Table({
  width: { size: PAGE_W, type: WidthType.DXA },
  columnWidths: mCols,
  rows: [
    new TableRow({
      children: [
        headerCell('Room / Location', mCols[0]),
        headerCell('Material', mCols[1]),
        headerCell('Reading (%)', mCols[2]),
        headerCell('Meter Used', mCols[3]),
        headerCell('Technician Initials', mCols[4]),
      ],
    }),
    ...[0,1,2,3,4].map(i => new TableRow({
      children: mCols.map(w => dataCell(w, i)),
    })),
  ],
});

// ─── SECTION 5 — Scope of Work ───────────────────────────────────────────────
const sCols = [840, 3480, 720, 720, 1320, 1280]; // sum = 8360 — adjust
// Recalc: 840+3480+720+720+1320+1280 = 8360, short by 1000
// Use: [900, 3560, 800, 800, 1500, 1800] = 9360 ✓
const scopeCols = [900, 3560, 800, 800, 1500, 1800];
const scopeHeaders = ['Line Item', 'Description', 'Qty', 'Unit', 'Unit Price', 'Total'];
const section5Table = new Table({
  width: { size: PAGE_W, type: WidthType.DXA },
  columnWidths: scopeCols,
  rows: [
    new TableRow({
      children: scopeHeaders.map((h, i) => headerCell(h, scopeCols[i])),
    }),
    ...[0,1,2,3,4,5,6,7].map(i => new TableRow({
      children: scopeCols.map(w => dataCell(w, i)),
    })),
    // Total row: span first 5 cols, then total cell
    new TableRow({
      children: [
        new TableCell({
          borders: allBorders,
          width: { size: scopeCols.slice(0,5).reduce((a,b)=>a+b,0), type: WidthType.DXA },
          columnSpan: 5,
          shading: shading(LGRAY),
          margins: cellMargins,
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: 'TOTAL', bold: true, size: 20, font: 'Arial' })],
          })],
        }),
        new TableCell({
          borders: allBorders,
          width: { size: scopeCols[5], type: WidthType.DXA },
          shading: shading(YELW),
          margins: cellMargins,
          children: [new Paragraph({ children: [new TextRun({ text: '', size: 18, font: 'Arial' })] })],
        }),
      ],
    }),
  ],
});

// ─── SECTION 6 — Equipment Placed ────────────────────────────────────────────
const eCols = [2000, 1840, 2240, 1640, 1640]; // sum = 9360
const equipHeaders = ['Equipment Type', 'Serial / ID Number', 'Placement Location', 'Date In', 'Date Out'];
const section6Table = new Table({
  width: { size: PAGE_W, type: WidthType.DXA },
  columnWidths: eCols,
  rows: [
    new TableRow({ children: equipHeaders.map((h,i) => headerCell(h, eCols[i])) }),
    ...[0,1,2,3,4].map(i => new TableRow({ children: eCols.map(w => dataCell(w, i)) })),
  ],
});

// ─── SECTION 7 — Photo Documentation ─────────────────────────────────────────
// 3-col photo table, 2 rows. Each photo cell ~3600px tall using min height on rows.
const photoW = Math.floor(PAGE_W / 3); // 3120 each
const photoCols = [photoW, photoW, PAGE_W - 2*photoW]; // [3120, 3120, 3120]

function photoCell(w) {
  return new TableCell({
    borders: allBorders,
    width: { size: w, type: WidthType.DXA },
    shading: shading(PGRAY),
    margins: cellMargins,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 720, after: 720 },
        children: [new TextRun({ text: '[ PHOTO ]', size: 22, color: '999999', font: 'Arial' })],
      }),
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 1, color: CBORD } },
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: 'Caption: ___________________________', size: 16, color: '666666', font: 'Arial' })],
      }),
    ],
  });
}

const section7Table = new Table({
  width: { size: PAGE_W, type: WidthType.DXA },
  columnWidths: [3120, 3120, 3120],
  rows: [
    new TableRow({ children: [photoCell(3120), photoCell(3120), photoCell(3120)] }),
    new TableRow({ children: [photoCell(3120), photoCell(3120), photoCell(3120)] }),
  ],
});

// ─── SECTION 8 — Technician Sign-Off ─────────────────────────────────────────
const sigCols = [3120, 3120, 3120]; // sum = 9360
const section8Table = new Table({
  width: { size: PAGE_W, type: WidthType.DXA },
  columnWidths: sigCols,
  rows: [
    new TableRow({
      children: [
        inputCell('Lead Technician Name: _______________', sigCols[0]),
        inputCell('Certification #: _______________', sigCols[1]),
        inputCell('Date: _______________', sigCols[2]),
      ],
    }),
    new TableRow({
      children: [
        inputCell('Signature: _______________', sigCols[0]),
        inputCell('', sigCols[1]),
        inputCell('', sigCols[2]),
      ],
    }),
    new TableRow({
      children: [
        inputCell('Customer / Insured Signature: _______________', sigCols[0]),
        inputCell('Printed Name: _______________', sigCols[1]),
        inputCell('Date: _______________', sigCols[2]),
      ],
    }),
  ],
});

// ─── SECTION 9 — Additional Notes ────────────────────────────────────────────
const section9Lines = Array.from({ length: 10 }, () => lineRow());

// ─── ASSEMBLE DOCUMENT ────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Arial', size: 20 },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: { default: docHeader },
      footers: { default: docFooter },
      children: [
        // ── Section 1
        sectionHeader('1.  JOB & CLAIM INFORMATION'),
        section1Table,
        spacer(120),

        // ── Section 2
        sectionHeader('2.  PROPERTY DETAILS'),
        section2Table,
        spacer(120),

        // ── Section 3
        sectionHeader('3.  INITIAL ASSESSMENT'),
        spacer(60),
        ...section3,
        spacer(120),

        // ── Section 4
        sectionHeader('4.  MOISTURE READINGS LOG'),
        section4Table,
        spacer(120),

        // ── Section 5
        sectionHeader('5.  SCOPE OF WORK'),
        section5Table,
        spacer(120),

        // ── Section 6
        sectionHeader('6.  EQUIPMENT PLACED'),
        section6Table,
        spacer(120),

        // ── Section 7
        sectionHeader('7.  PHOTO DOCUMENTATION'),
        spacer(60),
        new Paragraph({
          children: [new TextRun({ text: 'Attach or print photos and caption each with location and description.', size: 18, color: '555555', font: 'Arial' })],
          spacing: { after: 120 },
        }),
        section7Table,
        spacer(120),

        // ── Section 8
        sectionHeader('8.  TECHNICIAN SIGN-OFF'),
        section8Table,
        spacer(120),

        // ── Section 9
        sectionHeader('9.  ADDITIONAL NOTES'),
        spacer(60),
        ...section9Lines,
      ],
    },
  ],
});

// ─── WRITE FILE ───────────────────────────────────────────────────────────────
const outPath = path.resolve(__dirname, '../public/restoration-report-template.docx');
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created:', outPath);
  console.log('Size:', buffer.length, 'bytes');
});
