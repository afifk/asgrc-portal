import { useState, useCallback, useEffect } from 'react'

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  teal: '#0E8A6A',
  blue: '#1A5276',
  ltBlue: '#2E86C1',
  purple: '#7B2D8B',
  amber: '#D35400',
  green: '#1D8348',
  red: '#922B21',
  grey: '#4A5568',
  gold: '#D4AC0D',
}
const STATUS_LABELS = [
  '—',
  'Dwg Issued',
  'Dwg Approved',
  'Produced',
  'Delivered',
  'Installed',
  'QC Passed',
]
const STATUS_COLORS = [
  '#2D3748',
  '#2E86C1',
  '#148F77',
  '#884EA0',
  '#D35400',
  '#1D8348',
  '#D4AC0D',
]

const DOC_TYPES = {
  pdf: { icon: 'PDF', bg: '#922B2120', color: '#922B21' },
  dwg: { icon: 'DWG', bg: '#2E86C120', color: '#2E86C1' },
  xlsx: { icon: 'XLS', bg: '#1D834820', color: '#1D8348' },
  docx: { icon: 'DOC', bg: '#1A527620', color: '#2E86C1' },
  png: { icon: 'IMG', bg: '#7B2D8B20', color: '#7B2D8B' },
  pptx: { icon: 'PPT', bg: '#D3540020', color: '#D35400' },
  mpp: { icon: 'MPP', bg: '#0E8A6A20', color: '#0E8A6A' },
  zip: { icon: 'ZIP', bg: '#D4AC0D20', color: '#D4AC0D' },
}
function getDocType(fname) {
  const ext = fname.split('.').pop().toLowerCase()
  return (
    DOC_TYPES[ext] || {
      icon: ext.toUpperCase(),
      bg: 'var(--card-mid)',
      color: 'var(--muted)',
    }
  )
}
function docStatusColor(s) {
  if (!s) return C.grey
  if (
    s.startsWith('A —') ||
    s === 'Approved' ||
    s === 'Issued for Construction' ||
    s === 'Issued to Factory' ||
    s === 'Answered' ||
    s === 'Completed' ||
    s === 'Current' ||
    s === 'Active'
  )
    return C.green
  if (s.startsWith('B —')) return C.teal
  if (s.startsWith('C') || s === 'Open') return C.red
  if (s === 'Pending review' || s === 'Pending' || s === 'Submitted')
    return C.amber
  return C.grey
}

// ─── Panel grid data ──────────────────────────────────────────────────────────
function makePanels(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      id: `P${String(r + 1).padStart(2, '0')}-${String(c + 1).padStart(2, '0')}`,
      status: Math.min(
        6,
        Math.max(
          0,
          Math.round(
            (cols - c - 1) * 0.45 + (rows - r - 1) * 0.3 + Math.random() * 1.5,
          ),
        ),
      ),
      floor: `L${r + 1}`,
    })),
  )
}
const PANELS = makePanels(8, 14)

// ─── Document libraries per project ──────────────────────────────────────────
const PROJECT_DOCS = {
  'PRJ-2401': {
    folders: [
      {
        id: 'f1',
        name: '01 — Contracts & Commercial',
        docs: [
          {
            id: 'd101',
            name: 'Contract Agreement — Meraas CT-2024-0041.pdf',
            type: 'Contract',
            size: '2.4 MB',
            date: '2024-11-01',
            rev: 'Rev.0',
            status: 'Approved',
            uploader: 'Rabie Mudallaly',
            desc: 'Signed contract document including all commercial terms, scope schedule and appendices.',
          },
          {
            id: 'd102',
            name: 'LOI — Bluewaters Tower B.pdf',
            type: 'Contract',
            size: '480 KB',
            date: '2024-10-20',
            rev: 'Rev.0',
            status: 'Approved',
            uploader: 'Hussein Redjili',
            desc: 'Letter of Intent from Meraas Development confirming project award.',
          },
          {
            id: 'd103',
            name: 'Advance Payment Certificate — AED 840K.pdf',
            type: 'Finance',
            size: '310 KB',
            date: '2024-11-15',
            rev: 'Rev.0',
            status: 'Approved',
            uploader: 'Finance Dept',
            desc: 'Advance payment certificate issued for mobilisation.',
          },
          {
            id: 'd104',
            name: 'Subcontract Agreement — Steel Works.docx',
            type: 'Subcontract',
            size: '1.1 MB',
            date: '2024-12-01',
            rev: 'Rev.1',
            status: 'Approved',
            uploader: 'Khalid Hassan',
            desc: 'Subcontract agreement for steel bracket fabrication and galvanization.',
          },
        ],
      },
      {
        id: 'f2',
        name: '02 — Engineering & Shop Drawings',
        docs: [
          {
            id: 'd201',
            name: 'BD-GRC-SD-041 North Elevation Typical Panel Rev3.dwg',
            type: 'Shop Drawing',
            size: '8.7 MB',
            date: '2026-03-01',
            rev: 'Rev.3',
            status: 'A — Approved',
            uploader: 'Ali Al-Farsi',
            desc: 'North elevation standard panel details including fixing brackets, movement joints and panel ID grid reference.',
          },
          {
            id: 'd202',
            name: 'BD-GRC-SD-041 North Elevation Typical Panel Rev3.pdf',
            type: 'Shop Drawing',
            size: '3.2 MB',
            date: '2026-03-01',
            rev: 'Rev.3',
            status: 'A — Approved',
            uploader: 'Ali Al-Farsi',
            desc: 'PDF export of approved shop drawing for site distribution.',
          },
          {
            id: 'd203',
            name: 'BD-GRC-SD-042 Corner Panel Connection Rev2.dwg',
            type: 'Shop Drawing',
            size: '6.4 MB',
            date: '2026-03-03',
            rev: 'Rev.2',
            status: 'A — Approved',
            uploader: 'Ali Al-Farsi',
            desc: 'Corner panel connection details with steel embedded items and anchor bolt schedule.',
          },
          {
            id: 'd204',
            name: 'BD-GRC-SD-043 Parapet Coping Detail Rev1.dwg',
            type: 'Shop Drawing',
            size: '5.1 MB',
            date: '2026-03-07',
            rev: 'Rev.1',
            status: 'B — Approved w/comments',
            uploader: 'Ali Al-Farsi',
            desc: 'Parapet coping panel details. Approved with minor comments on joint sealant spec.',
          },
          {
            id: 'd205',
            name: 'BD-GRC-SD-044 Soffit Panel Layout Rev2.dwg',
            type: 'Shop Drawing',
            size: '7.8 MB',
            date: '2026-03-14',
            rev: 'Rev.2',
            status: 'Pending review',
            uploader: 'Ali Al-Farsi',
            desc: 'Soffit panel layout submitted for Main Contractor review. Awaiting approval.',
          },
          {
            id: 'd206',
            name: 'BD-GRC-STRUCT-001 Structural Calcs Rev2.pdf',
            type: 'Structural Calc',
            size: '4.3 MB',
            date: '2026-02-10',
            rev: 'Rev.2',
            status: 'A — Approved',
            uploader: 'Ahmed Khalil',
            desc: 'Structural design calculations for GRC panels and bracket connections.',
          },
          {
            id: 'd207',
            name: 'IFC Drawings Package — Meraas BW-B-IFC-003.zip',
            type: 'IFC Drawings',
            size: '42.1 MB',
            date: '2025-01-10',
            rev: 'Rev.3',
            status: 'Issued for Construction',
            uploader: 'Doc Controller',
            desc: 'Issued for Construction drawing package from Main Contractor.',
          },
          {
            id: 'd208',
            name: 'BD-GRC-FAB-L01 to L07 Fabrication Drawings.pdf',
            type: 'Fab Drawings',
            size: '18.6 MB',
            date: '2026-03-10',
            rev: 'Rev.1',
            status: 'Issued to Factory',
            uploader: 'Ali Al-Farsi',
            desc: 'Fabrication drawing set for panels on levels 1–7. Issued to manufacturing floor.',
          },
        ],
      },
      {
        id: 'f3',
        name: '03 — Material Submittals & Approvals',
        docs: [
          {
            id: 'd301',
            name: 'BD-MAT-MS-001 GRC Mix Design Class 1 Rev2.pdf',
            type: 'Material Submittal',
            size: '1.8 MB',
            date: '2025-12-01',
            rev: 'Rev.2',
            status: 'A — Approved',
            uploader: 'Rania Aziz',
            desc: 'GRC mix design submittal including cement, sand, fibre ratios and test results.',
          },
          {
            id: 'd302',
            name: 'BD-MAT-MS-002 E-glass Alkali Resistant Fibre.pdf',
            type: 'Material Submittal',
            size: '920 KB',
            date: '2025-12-10',
            rev: 'Rev.1',
            status: 'A — Approved',
            uploader: 'Rania Aziz',
            desc: 'AR fibre specification and manufacturer data sheet.',
          },
          {
            id: 'd303',
            name: 'BD-MAT-MS-003 White Cement Datasheet.pdf',
            type: 'Material Submittal',
            size: '640 KB',
            date: '2025-12-15',
            rev: 'Rev.1',
            status: 'A — Approved',
            uploader: 'Rania Aziz',
            desc: 'White Portland cement specification and conformance to BS EN 197-1.',
          },
          {
            id: 'd304',
            name: 'BD-MAT-MS-004 Anchor Bolt System Rev1.pdf',
            type: 'Material Submittal',
            size: '2.1 MB',
            date: '2026-01-08',
            rev: 'Rev.1',
            status: 'B — Approved w/comments',
            uploader: 'Rania Aziz',
            desc: 'Anchor bolt and fixing system submittal. Approved with comments on pull-out test requirements.',
          },
          {
            id: 'd305',
            name: 'BD-MAT-TEST-001 Mix Design Test Results.xlsx',
            type: 'Test Report',
            size: '480 KB',
            date: '2026-01-20',
            rev: 'Rev.1',
            status: 'Approved',
            uploader: 'Lab Technician',
            desc: 'Laboratory test results for GRC mix batches 1–12.',
          },
          {
            id: 'd306',
            name: 'BD-MAT-TEST-002 Panel Fire Rating Certificate.pdf',
            type: 'Certificate',
            size: '1.2 MB',
            date: '2026-02-01',
            rev: 'Rev.0',
            status: 'Approved',
            uploader: 'Rania Aziz',
            desc: 'Third-party fire rating certificate. Rating: A2-s1,d0 (EN 13501-1).',
          },
        ],
      },
      {
        id: 'f4',
        name: '04 — QA/QC Records & Inspections',
        docs: [
          {
            id: 'd401',
            name: 'ITP — Inspection & Test Plan Rev3.pdf',
            type: 'ITP',
            size: '2.8 MB',
            date: '2025-11-20',
            rev: 'Rev.3',
            status: 'A — Approved',
            uploader: 'Rania Aziz',
            desc: 'Approved Inspection and Test Plan covering all production, delivery and installation stages.',
          },
          {
            id: 'd402',
            name: 'MSRA — Method Statement Risk Assessment Rev2.pdf',
            type: 'MSRA',
            size: '3.4 MB',
            date: '2025-11-25',
            rev: 'Rev.2',
            status: 'A — Approved',
            uploader: 'Rania Aziz',
            desc: 'Method statement and risk assessment for GRC installation operations at height.',
          },
          {
            id: 'd403',
            name: 'Pre-pour Inspection Checklists L1-L4.xlsx',
            type: 'Inspection Record',
            size: '1.1 MB',
            date: '2026-02-28',
            rev: 'Rev.0',
            status: 'Completed',
            uploader: 'Rania Aziz',
            desc: 'Pre-pour QC checklists for panels on levels 1–4.',
          },
          {
            id: 'd404',
            name: 'WIR-031 Installation Level 5 Zones A-C.pdf',
            type: 'WIR',
            size: '860 KB',
            date: '2026-03-11',
            rev: 'Rev.0',
            status: 'Approved',
            uploader: 'Site Team',
            desc: 'Work Inspection Request for installed panels on Level 5 Zones A, B and C.',
          },
          {
            id: 'd405',
            name: 'WIR-032 Installation Level 5 Zones D-F.pdf',
            type: 'WIR',
            size: '720 KB',
            date: '2026-03-13',
            rev: 'Rev.0',
            status: 'Pending',
            uploader: 'Site Team',
            desc: 'WIR submitted for Level 5 Zones D–F. Awaiting Main Contractor review.',
          },
          {
            id: 'd406',
            name: 'NCR-007 Panel Hairline Crack Report.pdf',
            type: 'NCR',
            size: '1.4 MB',
            date: '2026-03-12',
            rev: 'Rev.0',
            status: 'Open',
            uploader: 'Rania Aziz',
            desc: 'Non-Conformance Report for hairline crack on panel P04-09.',
          },
          {
            id: 'd407',
            name: 'Daily QC Reports March 2026.xlsx',
            type: 'Daily Report',
            size: '2.2 MB',
            date: '2026-03-14',
            rev: 'Rev.0',
            status: 'Current',
            uploader: 'Rania Aziz',
            desc: 'Consolidated daily QC reports for March 2026.',
          },
        ],
      },
      {
        id: 'f5',
        name: '05 — Programme & Planning',
        docs: [
          {
            id: 'd501',
            name: 'Baseline Programme Rev3 — Bluewaters B.pdf',
            type: 'Programme',
            size: '3.6 MB',
            date: '2025-11-30',
            rev: 'Rev.3',
            status: 'Approved',
            uploader: 'Planning Dept',
            desc: 'Approved baseline programme for all engineering, production, delivery and installation activities.',
          },
          {
            id: 'd502',
            name: 'Baseline Programme Rev3 — Bluewaters B.mpp',
            type: 'Programme',
            size: '1.1 MB',
            date: '2025-11-30',
            rev: 'Rev.3',
            status: 'Approved',
            uploader: 'Planning Dept',
            desc: 'MS Project file for baseline programme.',
          },
          {
            id: 'd503',
            name: 'Weekly Progress Report Wk 10 2026.pdf',
            type: 'Progress Report',
            size: '4.8 MB',
            date: '2026-03-14',
            rev: 'Rev.0',
            status: 'Submitted',
            uploader: 'Khalid Hassan',
            desc: 'Weekly progress report for Week 10 of 2026.',
          },
          {
            id: 'd504',
            name: 'Delivery Schedule March-April 2026.xlsx',
            type: 'Delivery Schedule',
            size: '640 KB',
            date: '2026-03-01',
            rev: 'Rev.2',
            status: 'Active',
            uploader: 'Planning Dept',
            desc: 'Delivery schedule and dispatch sequence for panels in March and April 2026.',
          },
        ],
      },
      {
        id: 'f6',
        name: '06 — Correspondence & RFIs',
        docs: [
          {
            id: 'd601',
            name: 'RFI-014 Sealant Joint Width Clarification.pdf',
            type: 'RFI',
            size: '380 KB',
            date: '2026-02-20',
            rev: 'Rev.0',
            status: 'Answered',
            uploader: 'Ali Al-Farsi',
            desc: 'RFI regarding sealant joint width at horizontal panel interfaces. Response received.',
          },
          {
            id: 'd602',
            name: 'RFI-015 Panel Colour Variation Approval.pdf',
            type: 'RFI',
            size: '520 KB',
            date: '2026-03-05',
            rev: 'Rev.0',
            status: 'Pending',
            uploader: 'Ali Al-Farsi',
            desc: 'RFI for consultant approval of minor colour variation in batch 3 panels.',
          },
          {
            id: 'd603',
            name: 'Letter — Extension of Time Claim EOT-001.pdf',
            type: 'Correspondence',
            size: '1.6 MB',
            date: '2026-02-28',
            rev: 'Rev.0',
            status: 'Submitted',
            uploader: 'Khalid Hassan',
            desc: 'Formal EOT claim for 14 calendar day extension due to delayed IFC drawings.',
          },
          {
            id: 'd604',
            name: 'Meeting Minutes — Progress Meeting 15 Mar 2026.pdf',
            type: 'Minutes',
            size: '420 KB',
            date: '2026-03-15',
            rev: 'Rev.0',
            status: 'Approved',
            uploader: 'Khalid Hassan',
            desc: 'Minutes from site progress meeting including action items and delivery schedule.',
          },
        ],
      },
    ],
  },
}

;['PRJ-2402', 'PRJ-2403', 'PRJ-2404'].forEach((pid) => {
  PROJECT_DOCS[pid] = {
    folders: [
      {
        id: 'f1',
        name: '01 — Contracts & Commercial',
        docs: [
          {
            id: 'd101',
            name: `Contract Agreement — ${pid}.pdf`,
            type: 'Contract',
            size: '2.1 MB',
            date: '2025-01-15',
            rev: 'Rev.0',
            status: 'Approved',
            uploader: 'Rabie Mudallaly',
            desc: 'Signed contract document.',
          },
          {
            id: 'd102',
            name: `LOI — ${pid}.pdf`,
            type: 'Contract',
            size: '460 KB',
            date: '2025-01-10',
            rev: 'Rev.0',
            status: 'Approved',
            uploader: 'Hussein Redjili',
            desc: 'Letter of Intent confirming project award.',
          },
        ],
      },
      {
        id: 'f2',
        name: '02 — Engineering & Shop Drawings',
        docs: [
          {
            id: 'd201',
            name: `${pid}-GRC-SD-001 Typical Panel Detail Rev1.dwg`,
            type: 'Shop Drawing',
            size: '7.2 MB',
            date: '2025-03-12',
            rev: 'Rev.1',
            status: 'Pending review',
            uploader: 'Doc Controller',
            desc: 'Shop drawing submitted for consultant approval.',
          },
          {
            id: 'd202',
            name: `${pid}-STRUCT-001 Structural Calcs Rev1.pdf`,
            type: 'Structural Calc',
            size: '3.8 MB',
            date: '2025-03-08',
            rev: 'Rev.1',
            status: 'Pending review',
            uploader: 'Lead Engineer',
            desc: 'Structural calculations submitted for review.',
          },
        ],
      },
      {
        id: 'f3',
        name: '03 — Material Submittals',
        docs: [
          {
            id: 'd301',
            name: `${pid}-MAT-MS-001 GRC Mix Design Rev1.pdf`,
            type: 'Material Submittal',
            size: '1.6 MB',
            date: '2025-02-20',
            rev: 'Rev.1',
            status: 'A — Approved',
            uploader: 'QA Engineer',
            desc: 'GRC mix design specification and test results.',
          },
        ],
      },
      {
        id: 'f4',
        name: '04 — QA/QC Records',
        docs: [
          {
            id: 'd401',
            name: 'ITP — Inspection Test Plan Rev1.pdf',
            type: 'ITP',
            size: '2.4 MB',
            date: '2025-02-01',
            rev: 'Rev.1',
            status: 'A — Approved',
            uploader: 'QA Engineer',
            desc: 'Approved Inspection and Test Plan.',
          },
          {
            id: 'd402',
            name: 'MSRA — Method Statement Rev1.pdf',
            type: 'MSRA',
            size: '3.0 MB',
            date: '2025-02-05',
            rev: 'Rev.1',
            status: 'A — Approved',
            uploader: 'QA Engineer',
            desc: 'Approved method statement and risk assessment.',
          },
        ],
      },
      {
        id: 'f5',
        name: '05 — Programme & Planning',
        docs: [
          {
            id: 'd501',
            name: `Baseline Programme Rev1 — ${pid}.pdf`,
            type: 'Programme',
            size: '3.1 MB',
            date: '2025-01-25',
            rev: 'Rev.1',
            status: 'Approved',
            uploader: 'Planning Dept',
            desc: 'Approved baseline programme.',
          },
        ],
      },
      {
        id: 'f6',
        name: '06 — Correspondence & RFIs',
        docs: [
          {
            id: 'd601',
            name: 'RFI-001 General Technical Clarification.pdf',
            type: 'RFI',
            size: '340 KB',
            date: '2025-02-28',
            rev: 'Rev.0',
            status: 'Answered',
            uploader: 'Doc Controller',
            desc: 'General technical RFI with consultant response.',
          },
        ],
      },
    ],
  }
})

// ─── Project data ─────────────────────────────────────────────────────────────
const INIT_PROJECTS = [
  {
    id: 'PRJ-2401',
    name: 'Bluewaters Tower B',
    client: 'Meraas Development',
    value: 'AED 4.2M',
    status: 'production',
    progress: 68,
    pm: 'Khalid Hassan',
    panels: 420,
    contract: 'CT-2024-0041',
    start: '2024-11-01',
    end: '2025-08-30',
    bcJob: 'J-2401',
    address: 'Bluewaters Island, Dubai',
    scope:
      'GRC facade cladding — North, South and East elevations. 420 panels across 14 floors.',
    retention: '5%',
    paymentTerms: '60 days net',
    advancePaid: 'AED 840,000',
    milestones: [
      { label: 'Contract signed', date: '2024-11-01', done: true },
      { label: 'Engineering approval', date: '2024-12-15', done: true },
      { label: 'Mould preparation', date: '2025-01-20', done: true },
      { label: 'Production start', date: '2025-02-01', done: true },
      { label: '50% panels produced', date: '2025-04-30', done: true },
      { label: 'First delivery to site', date: '2025-05-10', done: true },
      { label: 'Installation start', date: '2025-05-20', done: true },
      { label: '100% panels delivered', date: '2025-07-15', done: false },
      { label: 'Installation complete', date: '2025-08-01', done: false },
      { label: 'Handover', date: '2025-08-30', done: false },
    ],
    billing: [
      {
        invoice: 'INV-2401-01',
        amount: 'AED 840,000',
        submitted: '2025-02-01',
        status: 'paid',
        overdue: false,
      },
      {
        invoice: 'INV-2401-02',
        amount: 'AED 1,050,000',
        submitted: '2025-04-01',
        status: 'paid',
        overdue: false,
      },
      {
        invoice: 'INV-2401-03',
        amount: 'AED 840,000',
        submitted: '2025-06-01',
        status: 'pending',
        overdue: true,
        days: 14,
      },
      {
        invoice: 'INV-2401-04',
        amount: 'AED 630,000',
        submitted: '—',
        status: 'not-submitted',
        overdue: false,
      },
    ],
    team: [
      { name: 'Khalid Hassan', role: 'Project Manager', dept: 'Projects' },
      { name: 'Rania Aziz', role: 'QA/QC Engineer', dept: 'QA/QC' },
      { name: 'Marco Rossi', role: 'Site Supervisor', dept: 'Installation' },
      {
        name: 'Ali Al-Farsi',
        role: 'Document Controller',
        dept: 'Engineering',
      },
      { name: 'Sara Nour', role: 'Production Engineer', dept: 'Manufacturing' },
    ],
    panelStats: {
      produced: 285,
      delivered: 210,
      installed: 186,
      qcPassed: 162,
      inProgress: 135,
      notStarted: 0,
    },
  },
  {
    id: 'PRJ-2402',
    name: 'Dubai Creek Harbour',
    client: 'Emaar Properties',
    value: 'AED 7.8M',
    status: 'engineering',
    progress: 35,
    pm: 'Sara Al-Mansoori',
    panels: 870,
    contract: 'CT-2024-0052',
    start: '2025-01-15',
    end: '2026-03-31',
    bcJob: 'J-2402',
    address: 'Dubai Creek Harbour, Ras Al Khor',
    scope:
      'GRC and GRP facade panels — Podium and Tower levels. 870 elements across 24 floors.',
    retention: '10%',
    paymentTerms: '45 days net',
    advancePaid: 'AED 1,560,000',
    milestones: [
      { label: 'Contract signed', date: '2025-01-15', done: true },
      { label: 'Engineering kick-off', date: '2025-02-01', done: true },
      { label: 'Shop drawings Rev1', date: '2025-03-15', done: true },
      { label: 'Material approvals', date: '2025-04-30', done: false },
      { label: 'Mould preparation', date: '2025-05-15', done: false },
      { label: 'Production start', date: '2025-06-01', done: false },
      { label: 'Handover', date: '2026-03-31', done: false },
    ],
    billing: [
      {
        invoice: 'INV-2402-01',
        amount: 'AED 1,560,000',
        submitted: '2025-02-01',
        status: 'paid',
        overdue: false,
      },
      {
        invoice: 'INV-2402-02',
        amount: 'AED 1,170,000',
        submitted: '2025-04-15',
        status: 'pending',
        overdue: false,
        days: 5,
      },
      {
        invoice: 'INV-2402-03',
        amount: 'AED 1,560,000',
        submitted: '—',
        status: 'not-submitted',
        overdue: false,
      },
    ],
    team: [
      { name: 'Sara Al-Mansoori', role: 'Project Manager', dept: 'Projects' },
      { name: 'Ahmed Khalil', role: 'Lead Engineer', dept: 'Engineering' },
      { name: 'Fatima Hassan', role: 'QA/QC Engineer', dept: 'QA/QC' },
      {
        name: "James O'Brien",
        role: 'Document Controller',
        dept: 'Engineering',
      },
    ],
    panelStats: {
      produced: 0,
      delivered: 0,
      installed: 0,
      qcPassed: 0,
      inProgress: 0,
      notStarted: 870,
    },
  },
  {
    id: 'PRJ-2403',
    name: "One Za'abeel Podium",
    client: 'ICD Brookfield',
    value: 'AED 2.1M',
    status: 'delivery',
    progress: 91,
    pm: 'Rami Farhat',
    panels: 198,
    contract: 'CT-2023-0088',
    start: '2024-03-01',
    end: '2025-04-30',
    bcJob: 'J-2403',
    address: "Za'abeel, Dubai",
    scope:
      'GRC cladding for podium levels 1–4. 198 panels, predominantly textured finish.',
    retention: '5%',
    paymentTerms: '30 days net',
    advancePaid: 'AED 420,000',
    milestones: [
      { label: 'Contract signed', date: '2024-03-01', done: true },
      { label: 'Engineering complete', date: '2024-05-01', done: true },
      { label: 'Production complete', date: '2024-10-15', done: true },
      { label: 'Delivery complete', date: '2025-01-30', done: true },
      { label: 'Installation 90%', date: '2025-03-01', done: true },
      { label: 'Snagging', date: '2025-03-20', done: false },
      { label: 'Handover', date: '2025-04-30', done: false },
    ],
    billing: [
      {
        invoice: 'INV-2403-01',
        amount: 'AED 420,000',
        submitted: '2024-04-01',
        status: 'paid',
        overdue: false,
      },
      {
        invoice: 'INV-2403-02',
        amount: 'AED 630,000',
        submitted: '2024-07-01',
        status: 'paid',
        overdue: false,
      },
      {
        invoice: 'INV-2403-03',
        amount: 'AED 630,000',
        submitted: '2024-11-01',
        status: 'paid',
        overdue: false,
      },
      {
        invoice: 'INV-2403-04',
        amount: 'AED 315,000',
        submitted: '2025-02-01',
        status: 'pending',
        overdue: true,
        days: 28,
      },
      {
        invoice: 'INV-2403-05',
        amount: 'AED 105,000',
        submitted: '—',
        status: 'not-submitted',
        overdue: false,
      },
    ],
    team: [
      { name: 'Rami Farhat', role: 'Project Manager', dept: 'Projects' },
      { name: 'Tariq Musa', role: 'Site Supervisor', dept: 'Installation' },
      { name: 'Lina Khalil', role: 'QA/QC Inspector', dept: 'QA/QC' },
    ],
    panelStats: {
      produced: 198,
      delivered: 198,
      installed: 180,
      qcPassed: 164,
      inProgress: 18,
      notStarted: 0,
    },
  },
  {
    id: 'PRJ-2404',
    name: 'DIFC Gate Avenue Ph2',
    client: 'DIFC Authority',
    value: 'AED 5.5M',
    status: 'awarded',
    progress: 12,
    pm: 'Aisha Noor',
    panels: 560,
    contract: 'CT-2025-0011',
    start: '2025-04-01',
    end: '2026-06-30',
    bcJob: 'J-2404',
    address: 'DIFC, Sheikh Zayed Road, Dubai',
    scope:
      'GRC feature panels and bespoke cladding for Phase 2 of Gate Avenue expansion.',
    retention: '10%',
    paymentTerms: '60 days net',
    advancePaid: 'AED 1,100,000',
    milestones: [
      { label: 'Contract signed', date: '2025-03-01', done: true },
      { label: 'Advance payment', date: '2025-03-15', done: true },
      { label: 'Engineering kick-off', date: '2025-04-01', done: false },
      { label: 'Drawings submission', date: '2025-05-30', done: false },
      { label: 'Handover', date: '2026-06-30', done: false },
    ],
    billing: [
      {
        invoice: 'INV-2404-01',
        amount: 'AED 1,100,000',
        submitted: '2025-03-15',
        status: 'paid',
        overdue: false,
      },
      {
        invoice: 'INV-2404-02',
        amount: 'AED 1,375,000',
        submitted: '—',
        status: 'not-submitted',
        overdue: false,
      },
    ],
    team: [
      { name: 'Aisha Noor', role: 'Project Manager', dept: 'Projects' },
      { name: 'Hassan Al-Rashid', role: 'Lead Engineer', dept: 'Engineering' },
      {
        name: 'Priya Sharma',
        role: 'Document Controller',
        dept: 'Engineering',
      },
    ],
    panelStats: {
      produced: 0,
      delivered: 0,
      installed: 0,
      qcPassed: 0,
      inProgress: 0,
      notStarted: 560,
    },
  },
]

const INIT_APPROVALS = [
  {
    id: 'SUB-441',
    type: 'Shop Drawing',
    project: 'Bluewaters Tower B',
    doc: 'BD-GRC-SD-044 Rev.2',
    by: 'Ali Hassan',
    date: '2026-03-14',
    status: 'pending',
    days: 1,
  },
  {
    id: 'SUB-442',
    type: 'Material Submittal',
    project: 'Dubai Creek Harbour',
    doc: 'DCH-MAT-MS-012',
    by: 'Sara Al-Mansoori',
    date: '2026-03-13',
    status: 'pending',
    days: 2,
  },
  {
    id: 'SUB-443',
    type: 'NCR',
    project: "One Za'abeel Podium",
    doc: 'OZP-QC-NCR-007',
    by: 'QC Team',
    date: '2026-03-12',
    status: 'action',
    days: 3,
  },
  {
    id: 'SUB-444',
    type: 'WIR',
    project: "One Za'abeel Podium",
    doc: 'OZP-INST-WIR-031',
    by: 'Site Team',
    date: '2026-03-11',
    status: 'approved',
    days: 4,
  },
]

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
function Badge({ label, color }) {
  return (
    <span
      style={{
        background: `${color}20`,
        color,
        border: `1px solid ${color}40`,
        borderRadius: 5,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function ProgressBar({ pct, color }) {
  return (
    <div
      style={{
        background: 'var(--border)',
        borderRadius: 4,
        height: 6,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${Math.min(100, pct)}%`,
          height: '100%',
          background: color,
          borderRadius: 4,
        }}
      />
    </div>
  )
}

function InfoCard({ label, value, accent, large, onClick, children }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '10px 13px',
        borderLeft: accent ? `3px solid ${accent}` : 'none',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      {value && (
        <div
          style={{
            fontSize: large ? 20 : 13,
            fontWeight: 700,
            color: accent || 'var(--text)',
          }}
        >
          {value}
        </div>
      )}
      {children}
    </div>
  )
}

function Th({ children }) {
  return (
    <th
      style={{
        padding: '9px 14px',
        fontSize: 10,
        fontWeight: 600,
        color: 'var(--muted)',
        textAlign: 'left',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        borderBottom: '2px solid var(--border)',
        background: 'var(--depth)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </th>
  )
}

function Td({ children, style }) {
  return (
    <td
      style={{
        padding: '9px 14px',
        fontSize: 12,
        borderBottom: '1px solid var(--border-sm)',
        verticalAlign: 'middle',
        ...style,
      }}
    >
      {children}
    </td>
  )
}

// ─── Document Preview Modal ───────────────────────────────────────────────────
function DocPreviewModal({ doc, project, onClose }) {
  const dt = getDocType(doc.name)
  const sc = docStatusColor(doc.status)
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--overlay-heavy)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-md)',
          borderRadius: 12,
          width: 640,
          maxWidth: '94vw',
          maxHeight: '88vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 0,
            }}
          >
            <span
              style={{
                background: dt.bg,
                color: dt.color,
                borderRadius: 4,
                padding: '3px 7px',
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {dt.icon}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {doc.name}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid var(--border-md)',
              background: 'var(--card)',
              color: 'var(--muted)',
              fontSize: 15,
              cursor: 'pointer',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
          >
            {[
              ['Type', doc.type],
              ['Revision', doc.rev],
              ['Size', doc.size],
              ['Date', doc.date],
              ['Uploaded by', doc.uploader],
              ['Project', project.name],
            ].map(([l, v]) => (
              <InfoCard key={l} label={l} value={v} />
            ))}
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              Approval Status
            </div>
            <Badge label={doc.status} color={sc} />
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
            >
              Description
            </div>
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '12px 14px',
                fontSize: 13,
                color: 'var(--text)',
                lineHeight: 1.7,
              }}
            >
              {doc.desc}
            </div>
          </div>
          <div
            style={{
              background: 'var(--card-dim)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'var(--card)',
                padding: '8px 14px',
                borderBottom: '1px solid var(--border)',
                fontSize: 11,
                color: 'var(--muted)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>Document Preview</span>
              <span>SharePoint Online · Secure Viewer</span>
            </div>
            <div
              style={{
                height: 150,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 40, opacity: 0.3 }}>
                {dt.icon === 'DWG'
                  ? '📐'
                  : dt.icon === 'PDF'
                    ? '📄'
                    : dt.icon === 'XLS'
                      ? '📊'
                      : '📎'}
              </span>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--muted)',
                  textAlign: 'center',
                  maxWidth: 320,
                }}
              >
                Connect Microsoft Graph API to enable inline preview.
                <br />
                <code style={{ color: C.teal, fontSize: 10 }}>
                  GET /sites/{'{siteId}'}/drive/items/{'{itemId}'}/preview
                </code>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              style={{
                background: C.teal,
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Open in SharePoint
            </button>
            <button
              style={{
                background: 'none',
                border: `1px solid ${C.teal}`,
                color: C.teal,
                borderRadius: 6,
                padding: '8px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ⬇ Download
            </button>
            <button
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: '1px solid var(--border-md)',
                color: 'var(--muted)',
                borderRadius: 6,
                padding: '8px 14px',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Documents Tab ────────────────────────────────────────────────────────────
function DocumentsTab({ project, onPreview }) {
  const lib = PROJECT_DOCS[project.id] || { folders: [] }
  const [openFolders, setOpenFolders] = useState({})
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const allDocs = lib.folders.flatMap((f) => f.docs)
  const allTypes = [...new Set(allDocs.map((d) => d.type))]
  const isFiltering = typeFilter !== 'all' || search.trim() !== ''
  const filtered = allDocs.filter((d) => {
    const mt = typeFilter === 'all' || d.type === typeFilter
    const ms =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase())
    return mt && ms
  })

  function DocRow({ doc }) {
    const dt = getDocType(doc.name)
    const sc = docStatusColor(doc.status)
    const [hov, setHov] = useState(false)
    return (
      <div
        onDoubleClick={() => onPreview(doc)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '9px 14px',
          borderBottom: '1px solid var(--border-sm)',
          gap: 10,
          cursor: 'pointer',
          background: hov ? 'var(--card-dim)' : '',
        }}
      >
        <div
          style={{
            width: 32,
            height: 36,
            borderRadius: 5,
            background: dt.bg,
            color: dt.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {dt.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: 2,
            }}
            title={doc.name}
          >
            {doc.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {doc.type} · {doc.rev} · {doc.size} · {doc.date} · {doc.uploader}
          </div>
        </div>
        <Badge label={doc.status} color={sc} />
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexShrink: 0,
            opacity: hov ? 1 : 0,
            transition: 'opacity .15s',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPreview(doc)
            }}
            style={{
              padding: '3px 9px',
              borderRadius: 5,
              border: '1px solid var(--border-md)',
              background: 'none',
              color: 'var(--muted)',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            👁 Preview
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '3px 9px',
              borderRadius: 5,
              border: '1px solid var(--border-md)',
              background: 'none',
              color: 'var(--muted)',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            ⬇
          </button>
        </div>
      </div>
    )
  }

  function FolderRow({ folder }) {
    const isOpen = openFolders[folder.id]
    const pending = folder.docs.filter(
      (d) => docStatusColor(d.status) === C.amber,
    ).length
    const [hov, setHov] = useState(false)
    return (
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden',
          marginBottom: 8,
        }}
      >
        <div
          onClick={() =>
            setOpenFolders((p) => ({ ...p, [folder.id]: !p[folder.id] }))
          }
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 14px',
            cursor: 'pointer',
            gap: 8,
            background: hov ? 'var(--card-dim)' : '',
            userSelect: 'none',
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: 'var(--muted)',
              transform: isOpen ? 'rotate(90deg)' : '',
              display: 'inline-block',
              transition: 'transform .15s',
              width: 12,
            }}
          >
            ▶
          </span>
          <span style={{ fontSize: 15 }}>📁</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              flex: 1,
              color: 'var(--text)',
            }}
          >
            {folder.name}
          </span>
          <span style={{ fontSize: 11, color: 'var(--muted)', marginRight: 8 }}>
            {folder.docs.length} file{folder.docs.length !== 1 ? 's' : ''}
          </span>
          {pending > 0 && (
            <Badge label={`${pending} pending`} color={C.amber} />
          )}
        </div>
        {isOpen && (
          <div
            style={{
              borderTop: '1px solid var(--border-sm)',
              background: 'var(--depth)',
            }}
          >
            {folder.docs.map((d) => (
              <DocRow key={d.id} doc={d} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 13,
              color: 'var(--muted)',
              pointerEvents: 'none',
            }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search documents…'
            style={{
              background: 'var(--border-sm)',
              border: '1px solid var(--border-md)',
              color: 'var(--text)',
              borderRadius: 8,
              padding: '7px 12px 7px 32px',
              fontSize: 13,
              width: 220,
              outline: 'none',
            }}
          />
        </div>
        {['all', ...allTypes.slice(0, 6)].map((t) => {
          const cnt =
            t === 'all'
              ? allDocs.length
              : allDocs.filter((d) => d.type === t).length
          const active = typeFilter === t
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                border: `1px solid ${active ? `${C.teal}80` : 'var(--border-md)'}`,
                background: active ? `${C.teal}20` : 'var(--card)',
                color: active ? C.teal : 'var(--muted)',
                fontSize: 11.5,
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {t === 'all' ? 'All' : t} ({cnt})
            </button>
          )
        })}
        <button
          style={{
            marginLeft: 'auto',
            background: C.teal,
            color: '#fff',
            border: 'none',
            borderRadius: 7,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ⬆ Upload
        </button>
      </div>

      {isFiltering ? (
        <div>
          <div
            style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}
          >
            {filtered.length} document{filtered.length !== 1 ? 's' : ''} found
            <button
              onClick={() => {
                setTypeFilter('all')
                setSearch('')
              }}
              style={{
                background: 'none',
                border: 'none',
                color: C.teal,
                fontSize: 12,
                cursor: 'pointer',
                marginLeft: 8,
                textDecoration: 'underline',
              }}
            >
              Clear
            </button>
          </div>
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {filtered.length > 0 ? (
              filtered.map((d) => <DocRow key={d.id} doc={d} />)
            ) : (
              <div
                style={{
                  padding: 30,
                  textAlign: 'center',
                  color: 'var(--muted)',
                  fontSize: 13,
                }}
              >
                No documents match your search
              </div>
            )}
          </div>
        </div>
      ) : (
        lib.folders.map((f) => <FolderRow key={f.id} folder={f} />)
      )}
    </div>
  )
}

// ─── Drawer sub-tabs ──────────────────────────────────────────────────────────
function OverviewTab({ project: p, allDocs, pendingDocs, onDocuments }) {
  const ps = p.panelStats
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 10,
        }}
      >
        <InfoCard label='Contract Value' accent={C.teal}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: C.teal,
              marginTop: 2,
            }}
          >
            {p.value}
          </div>
        </InfoCard>
        <InfoCard label='Progress' accent={C.ltBlue}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: C.ltBlue,
              marginTop: 2,
              marginBottom: 6,
            }}
          >
            {p.progress}%
          </div>
          <ProgressBar
            pct={p.progress}
            color={
              p.progress > 80 ? C.green : p.progress > 50 ? C.teal : C.ltBlue
            }
          />
        </InfoCard>
        <InfoCard label='Total Panels' accent={C.purple}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: C.purple,
              marginTop: 2,
            }}
          >
            {p.panels}
          </div>
        </InfoCard>
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12,
          }}
        >
          Project Information
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
        >
          {[
            ['Project Manager', p.pm],
            ['Client', p.client],
            ['Contract No.', p.contract],
            ['BC Job No.', p.bcJob],
            ['Start Date', p.start],
            ['End Date', p.end],
            ['Payment Terms', p.paymentTerms],
            ['Retention', p.retention],
          ].map(([l, v]) => (
            <InfoCard key={l} label={l} value={v} />
          ))}
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
          }}
        >
          Scope of Works
        </div>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '12px 14px',
            fontSize: 13,
            color: 'var(--muted)',
            lineHeight: 1.6,
          }}
        >
          {p.scope}
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12,
          }}
        >
          Document Library Summary
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 10,
          }}
        >
          <InfoCard
            label='Total Documents'
            accent={C.ltBlue}
            onClick={onDocuments}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: C.ltBlue,
                marginTop: 2,
              }}
            >
              {allDocs.length}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
              Click to open library
            </div>
          </InfoCard>
          <InfoCard
            label='Pending Review'
            accent={C.amber}
            onClick={onDocuments}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: C.amber,
                marginTop: 2,
              }}
            >
              {pendingDocs}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
              Awaiting approval
            </div>
          </InfoCard>
          <InfoCard
            label='Approved / Active'
            accent={C.green}
            onClick={onDocuments}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: C.green,
                marginTop: 2,
              }}
            >
              {allDocs.length - pendingDocs}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
              Click to browse
            </div>
          </InfoCard>
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 12,
          }}
        >
          Panel Status Breakdown
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 8,
          }}
        >
          {[
            ['Produced', ps.produced, C.purple],
            ['Delivered', ps.delivered, C.amber],
            ['Installed', ps.installed, C.green],
            ['QC Passed', ps.qcPassed, C.gold],
            ['In Progress', ps.inProgress, C.ltBlue],
            ['Not Started', ps.notStarted, C.grey],
          ].map(([l, v, c]) => (
            <InfoCard key={l} label={l} accent={c}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: c,
                  marginTop: 2,
                  marginBottom: 5,
                }}
              >
                {v}
              </div>
              <ProgressBar pct={Math.round((v / p.panels) * 100)} color={c} />
              <div
                style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}
              >
                {Math.round((v / p.panels) * 100)}%
              </div>
            </InfoCard>
          ))}
        </div>
      </div>
    </div>
  )
}

function MilestonesTab({ project: p }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 12,
        }}
      >
        Project Programme
      </div>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {p.milestones.map((m, i) => {
          const done = m.done,
            next = !done && (i === 0 || p.milestones[i - 1].done),
            col = done ? C.green : next ? C.amber : C.grey
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 16px',
                borderBottom:
                  i < p.milestones.length - 1
                    ? '1px solid var(--border-sm)'
                    : 'none',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: `${col}20`,
                  color: col,
                  border: `2px solid ${col}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {done ? '✓' : next ? '◉' : '○'}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: done || next ? 600 : 400,
                    color: done || next ? 'var(--text)' : 'var(--muted)',
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}
                >
                  {m.date}
                </div>
              </div>
              <Badge
                label={done ? 'Complete' : next ? 'In Progress' : 'Upcoming'}
                color={col}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BillingTab({ project: p }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 10,
        }}
      >
        <InfoCard label='Invoices Paid' accent={C.green}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: C.green,
              marginTop: 2,
            }}
          >
            {p.billing.filter((b) => b.status === 'paid').length} /{' '}
            {p.billing.filter((b) => b.status !== 'not-submitted').length}
          </div>
        </InfoCard>
        <InfoCard label='Overdue' accent={C.amber}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: C.amber,
              marginTop: 2,
            }}
          >
            {p.billing.filter((b) => b.overdue).length}
          </div>
        </InfoCard>
        <InfoCard label='Advance Paid' accent={C.ltBlue}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: C.ltBlue,
              marginTop: 2,
            }}
          >
            {p.advancePaid}
          </div>
        </InfoCard>
      </div>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <Th>Invoice</Th>
              <Th>Amount</Th>
              <Th>Submitted</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {p.billing.map((b) => (
              <tr key={b.invoice}>
                <Td style={{ color: C.ltBlue, fontWeight: 600 }}>
                  {b.invoice}
                </Td>
                <Td style={{ fontWeight: 600 }}>{b.amount}</Td>
                <Td style={{ color: 'var(--muted)' }}>{b.submitted}</Td>
                <Td>
                  <Badge
                    label={
                      b.status === 'paid'
                        ? 'Paid'
                        : b.status === 'pending'
                          ? 'Submitted — pending'
                          : 'Not yet submitted'
                    }
                    color={
                      b.status === 'paid'
                        ? C.green
                        : b.status === 'pending'
                          ? C.amber
                          : C.grey
                    }
                  />
                  {b.overdue && (
                    <span style={{ fontSize: 10, color: C.red, marginLeft: 8 }}>
                      ⚠ {b.days} days overdue
                    </span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TeamTab({ project: p }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 12,
        }}
      >
        Project Team — {p.team.length} members
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {p.team.map((t) => (
          <div
            key={t.name}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: `${C.blue}30`,
                border: `2px solid ${C.blue}50`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: C.ltBlue,
                flexShrink: 0,
              }}
            >
              {t.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                {t.role}
              </div>
            </div>
            <Badge label={t.dept} color={C.teal} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PanelsTab({ project: p, onOpenTracker }) {
  const counts = Array(7).fill(0)
  PANELS.flat().forEach((pn) => counts[pn.status]++)
  return (
    <div>
      <div
        style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}
      >
        {STATUS_LABELS.slice(1).map((_, i) => {
          const si = i + 1
          return (
            <div
              key={si}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 9px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 5,
                fontSize: 11,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: STATUS_COLORS[si],
                }}
              />
              {STATUS_LABELS[si]}:{' '}
              <strong style={{ color: STATUS_COLORS[si] }}>{counts[si]}</strong>
            </div>
          )
        })}
      </div>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 14,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: 'var(--muted)',
            marginBottom: 10,
            fontWeight: 600,
          }}
        >
          North Elevation — {p.panels} panels total
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '28px repeat(14,1fr)',
            gap: 3,
            marginBottom: 3,
          }}
        >
          <div />
          {Array.from({ length: 14 }, (_, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                fontSize: 9,
                color: 'var(--muted)',
              }}
            >
              G{i + 1}
            </div>
          ))}
        </div>
        {PANELS.map((row, ri) => (
          <div
            key={ri}
            style={{
              display: 'grid',
              gridTemplateColumns: '28px repeat(14,1fr)',
              gap: 3,
              marginBottom: 3,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                color: 'var(--muted)',
                fontWeight: 600,
              }}
            >
              L{ri + 1}
            </div>
            {row.map((panel) => (
              <div
                key={panel.id}
                title={`${panel.id} — ${STATUS_LABELS[panel.status]}`}
                style={{
                  height: 22,
                  borderRadius: 3,
                  background: STATUS_COLORS[panel.status],
                  cursor: 'pointer',
                  transition: 'transform .1s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.15)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <button
          onClick={onOpenTracker}
          style={{
            background: C.teal,
            color: '#fff',
            border: 'none',
            borderRadius: 7,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Open Full Elevational Tracker →
        </button>
      </div>
    </div>
  )
}

// ─── Project Detail Drawer ────────────────────────────────────────────────────
const DRAWER_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'documents', label: 'Documents' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'billing', label: 'Billing' },
  { id: 'team', label: 'Team' },
  { id: 'panels', label: 'Panels' },
]

function ProjectDrawer({ project, onClose, onNavigate }) {
  const [tab, setTab] = useState('overview')
  const [previewDoc, setPreviewDoc] = useState(null)
  const lib = PROJECT_DOCS[project.id] || { folders: [] }
  const allDocs = lib.folders.flatMap((f) => f.docs)
  const pendingDocs = allDocs.filter(
    (d) => docStatusColor(d.status) === C.amber,
  ).length
  const pCol = (s) =>
    ({
      production: C.green,
      delivery: C.gold,
      engineering: C.ltBlue,
      awarded: C.purple,
    })[s] || C.grey

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape' && !previewDoc) onClose()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose, previewDoc])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--overlay)',
          zIndex: 200,
        }}
      />
      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 820,
          maxWidth: '96vw',
          background: 'var(--bg)',
          borderLeft: '1px solid var(--border)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--drawer-shadow, -8px 0 24px rgba(0,0,0,.15))',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 5,
              }}
            >
              <Badge label={project.status} color={pCol(project.status)} />
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                {project.id} · {project.bcJob} (BC)
              </span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>
              {project.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              {project.client} · {project.address}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              border: '1px solid var(--border-md)',
              background: 'var(--card)',
              color: 'var(--muted)',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
        {/* Tab bar */}
        <div
          style={{
            display: 'flex',
            gap: 2,
            borderBottom: '1px solid var(--border)',
            padding: '0 22px',
            background: 'var(--surface)',
            flexShrink: 0,
            overflowX: 'auto',
          }}
        >
          {DRAWER_TABS.map((t) => {
            const isActive = tab === t.id
            const lbl =
              t.id === 'documents' ? `Documents (${allDocs.length})` : t.label
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '9px 14px',
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  border: 'none',
                  background: 'none',
                  color: isActive ? C.teal : 'var(--muted)',
                  borderBottom: `2px solid ${isActive ? C.teal : 'transparent'}`,
                  marginBottom: -1,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {lbl}
                {t.id === 'documents' && pendingDocs > 0 && (
                  <span
                    style={{
                      marginLeft: 6,
                      background: `${C.amber}30`,
                      color: C.amber,
                      border: `1px solid ${C.amber}50`,
                      borderRadius: 10,
                      padding: '0 5px',
                      fontSize: 10,
                    }}
                  >
                    {pendingDocs}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {/* Tab content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>
          {tab === 'overview' && (
            <OverviewTab
              project={project}
              allDocs={allDocs}
              pendingDocs={pendingDocs}
              onDocuments={() => setTab('documents')}
            />
          )}
          {tab === 'documents' && (
            <DocumentsTab project={project} onPreview={setPreviewDoc} />
          )}
          {tab === 'milestones' && <MilestonesTab project={project} />}
          {tab === 'billing' && <BillingTab project={project} />}
          {tab === 'team' && <TeamTab project={project} />}
          {tab === 'panels' && (
            <PanelsTab
              project={project}
              onOpenTracker={() => {
                onClose()
                onNavigate('tracker')
              }}
            />
          )}
        </div>
      </div>
      {previewDoc && (
        <DocPreviewModal
          doc={previewDoc}
          project={project}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </>
  )
}

// ─── Dashboard Module ─────────────────────────────────────────────────────────
function DashboardModule({ projects, approvals, onOpenProject }) {
  return (
    <div>
      {/* KPI row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          ['Active Projects', '4', '2 in production', C.ltBlue, '🏗'],
          ['Open Enquiries', '4', '1 due this week', C.amber, '📋'],
          ['Pending Approvals', '3', '1 overdue', C.red, '⏳'],
          ['Panels Tracked', '2,048', 'all projects', C.teal, '🧱'],
        ].map(([l, v, sub, a, ic]) => (
          <div
            key={l}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '14px 16px',
              borderLeft: `3px solid ${a}`,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 3,
              }}
            >
              {l}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: a }}>
              {v} <span style={{ fontSize: 16 }}>{ic}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}
      >
        {/* Project cards */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 18px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              Active Projects
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              Double-click or View Details to drill in
            </span>
          </div>
          <div
            style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={onOpenProject} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Pending approvals */}
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid var(--border)',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Pending Approvals
            </div>
            <div
              style={{
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {approvals
                .filter((a) => a.status !== 'approved')
                .map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: 10,
                      background: 'var(--depth)',
                      border: `1px solid ${a.status === 'action' ? `${C.red}60` : 'var(--border)'}`,
                      borderRadius: 7,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        {a.doc}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {a.type}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge
                        label={
                          a.status === 'action' ? 'Action req.' : 'Pending'
                        }
                        color={a.status === 'action' ? C.red : C.amber}
                      />
                      <div
                        style={{
                          fontSize: 10,
                          color: 'var(--muted)',
                          marginTop: 3,
                        }}
                      >
                        Day {a.days}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Enquiry pipeline */}
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid var(--border)',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Enquiry Pipeline
            </div>
            <div style={{ padding: 16 }}>
              {[
                ['New', C.grey, 1],
                ['Info Missing', C.amber, 1],
                ['GM Approved', C.green, 2],
                ['In Estimation', C.ltBlue, 1],
                ['Awarded', C.green, 0],
              ].map(([l, c, n]) => (
                <div
                  key={l}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 9,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: c,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ fontSize: 12, flex: 1 }}>{l}</div>
                  <div
                    style={{
                      width: 80,
                      background: 'var(--card-mid)',
                      borderRadius: 4,
                      height: 6,
                    }}
                  >
                    <div
                      style={{
                        width: `${n * 50}%`,
                        height: '100%',
                        background: c,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: c,
                      minWidth: 14,
                      textAlign: 'right',
                    }}
                  >
                    {n}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project: p, onOpen }) {
  const [hov, setHov] = useState(false)
  const pCol = (s) =>
    ({
      production: C.green,
      delivery: C.gold,
      engineering: C.ltBlue,
      awarded: C.purple,
    })[s] || C.grey
  return (
    <div
      onDoubleClick={() => onOpen(p.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(p.id)}
      style={{
        padding: 14,
        background: 'var(--depth)',
        border: `1px solid ${hov ? `${C.teal}60` : 'var(--border)'}`,
        borderRadius: 9,
        cursor: 'pointer',
        position: 'relative',
        transform: hov ? 'translateY(-1px)' : '',
        transition: 'border-color .15s, transform .12s',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            {p.client} · {p.id} · PM: {p.pm}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 5,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>
            {p.value}
          </span>
          <Badge label={p.status} color={pCol(p.status)} />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpen(p.id)
            }}
            style={{
              background: `${C.teal}15`,
              border: `1px solid ${C.teal}50`,
              color: C.teal,
              borderRadius: 5,
              padding: '3px 10px',
              fontSize: 10,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            View Details →
          </button>
        </div>
      </div>
      <ProgressBar
        pct={p.progress}
        color={p.progress > 80 ? C.green : p.progress > 50 ? C.teal : C.ltBlue}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
        }}
      >
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>
          {p.panels} panels
        </span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>
          {p.progress}% complete
        </span>
      </div>
      <span
        style={{
          position: 'absolute',
          bottom: 10,
          right: 12,
          fontSize: 10,
          color: C.teal,
          opacity: hov ? 1 : 0,
          transition: 'opacity .15s',
          fontWeight: 600,
        }}
      >
        ⤢ double-click to open
      </span>
    </div>
  )
}

// ─── Elevational Tracker Module ───────────────────────────────────────────────
function TrackerModule({ projects }) {
  const [filterStatus, setFilterStatus] = useState(null)
  const [selectedPanel, setSelectedPanel] = useState(null)
  const counts = Array(7).fill(0)
  PANELS.flat().forEach((p) => counts[p.status]++)
  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginBottom: 18,
          flexWrap: 'wrap',
        }}
      >
        <select
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border-md)',
            color: 'var(--text)',
            borderRadius: 7,
            padding: '7px 12px',
            fontSize: 13,
          }}
        >
          {projects.map((p) => (
            <option key={p.id}>
              {p.name} ({p.id})
            </option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          420 panels · 68% complete · PM: Khalid Hassan
        </span>
        <button
          onClick={() => setFilterStatus(null)}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: `1px solid ${C.teal}`,
            color: C.teal,
            borderRadius: 6,
            padding: '5px 12px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Clear filter
        </button>
      </div>
      <div
        style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}
      >
        {STATUS_LABELS.slice(1).map((_, i) => {
          const si = i + 1,
            active = filterStatus === si
          return (
            <button
              key={si}
              onClick={() => setFilterStatus(active ? null : si)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 9px',
                background: active ? `${STATUS_COLORS[si]}30` : 'var(--card)',
                border: `1px solid ${active ? STATUS_COLORS[si] : 'var(--border-md)'}`,
                borderRadius: 6,
                color: 'var(--text)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: STATUS_COLORS[si],
                }}
              />
              {STATUS_LABELS[si]}{' '}
              <strong style={{ color: STATUS_COLORS[si] }}>{counts[si]}</strong>
            </button>
          )
        })}
      </div>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }}
      >
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: 'var(--muted)',
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            North Elevation — Bluewaters Tower B
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '32px repeat(14,1fr)',
              gap: 3,
              marginBottom: 4,
            }}
          >
            <div />
            {Array.from({ length: 14 }, (_, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  fontSize: 9,
                  color: 'var(--muted)',
                }}
              >
                G{i + 1}
              </div>
            ))}
          </div>
          {PANELS.map((row, ri) => (
            <div
              key={ri}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px repeat(14,1fr)',
                gap: 3,
                marginBottom: 3,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  color: 'var(--muted)',
                  fontWeight: 600,
                }}
              >
                L{ri + 1}
              </div>
              {row.map((panel) => {
                const dimmed =
                    filterStatus !== null && panel.status !== filterStatus,
                  sel = selectedPanel?.id === panel.id
                return (
                  <div
                    key={panel.id}
                    onClick={() => setSelectedPanel(sel ? null : panel)}
                    title={`${panel.id} — ${STATUS_LABELS[panel.status]}`}
                    style={{
                      height: 26,
                      borderRadius: 3,
                      background: dimmed
                        ? 'var(--card-mid)'
                        : STATUS_COLORS[panel.status],
                      border: `2px solid ${sel ? '#fff' : 'transparent'}`,
                      opacity: dimmed ? 0.2 : 1,
                      cursor: 'pointer',
                      transition: 'transform .1s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = 'scale(1.15)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            Panel Detail
          </div>
          {selectedPanel ? (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                Panel {selectedPanel.id}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  marginBottom: 12,
                }}
              >
                Floor: {selectedPanel.floor}
              </div>
              <div style={{ marginBottom: 14 }}>
                <Badge
                  label={STATUS_LABELS[selectedPanel.status]}
                  color={STATUS_COLORS[selectedPanel.status]}
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--muted)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Activity Log
              </div>
              {[
                ['Area cleared', selectedPanel.status >= 1],
                ['Vapour barrier', selectedPanel.status >= 2],
                ['Rockwool', selectedPanel.status >= 3],
                ['Cavity barrier', selectedPanel.status >= 3],
                ['Steel / bracket', selectedPanel.status >= 4],
                ['Panel install', selectedPanel.status >= 5],
                ['QC inspection', selectedPanel.status >= 6],
              ].map(([act, done]) => (
                <div
                  key={act}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 0',
                    borderBottom: '1px solid var(--border-sm)',
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      background: done ? '#1D834820' : 'var(--card-mid)',
                      color: done ? C.green : 'var(--muted)',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {done ? '✓' : '–'}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: done ? 'var(--text)' : 'var(--muted)',
                    }}
                  >
                    {act}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: 'var(--muted)',
                  lineHeight: 1.7,
                }}
              >
                Tag: PRJ-2401-{selectedPanel.id}
                <br />
                Area: {(1.2 + Math.random() * 2).toFixed(2)} m²
              </div>
            </div>
          ) : (
            <div
              style={{
                color: 'var(--muted)',
                fontSize: 13,
                textAlign: 'center',
                paddingTop: 40,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>🧱</div>Click any
              panel cell
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Tender Portal Module ─────────────────────────────────────────────────────
function TenderPortalModule() {
  const [showForm, setShowForm] = useState(false)
  const [enquiries, setEnquiries] = useState([
    {
      id: 'ENQ-0189',
      client: 'Aldar Properties',
      project: 'Yas Island Tower',
      received: '2026-03-10',
      due: '2026-03-25',
      status: 'estimation',
      gm: 'Approved',
    },
    {
      id: 'ENQ-0190',
      client: 'Nakheel',
      project: 'Palm Jumeirah Villa',
      received: '2026-03-11',
      due: '2026-03-28',
      status: 'go',
      gm: 'Approved',
    },
    {
      id: 'ENQ-0191',
      client: 'Dubai Holding',
      project: 'Jumeirah Central Block',
      received: '2026-03-12',
      due: '2026-04-02',
      status: 'info-missing',
      gm: '—',
    },
    {
      id: 'ENQ-0192',
      client: 'Meydan Group',
      project: 'Racecourse Facade',
      received: '2026-03-13',
      due: '2026-04-05',
      status: 'new',
      gm: 'Pending',
    },
  ])
  const [form, setForm] = useState({
    client: '',
    project: '',
    due: '',
    scope: 'grc',
  })
  const [submitting, setSubmitting] = useState(false)
  const sCol = (s) =>
    ({
      new: C.grey,
      'info-missing': C.amber,
      go: C.green,
      estimation: C.ltBlue,
      regret: C.red,
    })[s] || C.grey
  const sLbl = (s) =>
    ({
      new: 'New',
      'info-missing': 'Info Missing',
      go: 'GM Approved',
      estimation: 'Estimation',
      regret: 'Regret',
    })[s] || s
  function submit() {
    if (!form.client || !form.project) return
    setSubmitting(true)
    setTimeout(() => {
      setEnquiries((prev) => [
        {
          id: `ENQ-0${193 + prev.length}`,
          client: form.client,
          project: form.project,
          received: new Date().toISOString().split('T')[0],
          due: form.due || 'TBC',
          status: 'new',
          gm: 'Pending',
        },
        ...prev,
      ])
      setForm({ client: '', project: '', due: '', scope: 'grc' })
      setShowForm(false)
      setSubmitting(false)
    }, 600)
  }
  function escalate(id) {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'go', gm: 'Approved' } : e,
      ),
    )
  }
  const cellS = {
    padding: '10px 14px',
    fontSize: 12,
    borderBottom: '1px solid var(--border-sm)',
    verticalAlign: 'middle',
  }
  const thS = {
    padding: '9px 14px',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--muted)',
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderBottom: '2px solid var(--border)',
    background: 'var(--depth)',
    whiteSpace: 'nowrap',
  }
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'New', 'Estimation', 'Approved'].map((l) => (
            <button
              key={l}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border-md)',
                color: 'var(--muted)',
                borderRadius: 6,
                padding: '5px 12px',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          style={{
            background: C.teal,
            color: '#fff',
            border: 'none',
            borderRadius: 7,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + New enquiry
        </button>
      </div>
      {showForm && (
        <div
          style={{
            background: 'var(--card)',
            border: `1px solid ${C.teal}`,
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
            Register new enquiry
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: 12,
              marginBottom: 14,
            }}
          >
            {[
              ['Client / Company', 'client', 'text', 'e.g. Emaar Properties'],
              ['Project Name', 'project', 'text', 'e.g. Marina Gate Tower'],
              ['Submission Due', 'due', 'date', ''],
              ['Scope Type', 'scope', 'select', ''],
            ].map(([label, key, type, ph]) => (
              <div key={key}>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--muted)',
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                {type === 'select' ? (
                  <select
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      background: 'var(--depth)',
                      border: '1px solid var(--border-md)',
                      color: 'var(--text)',
                      borderRadius: 6,
                      padding: '7px 10px',
                      fontSize: 13,
                    }}
                  >
                    <option value='grc'>GRC Panels</option>
                    <option value='grp'>GRP Panels</option>
                    <option value='grc+grp'>GRC + GRP</option>
                  </select>
                ) : (
                  <input
                    type={type}
                    placeholder={ph}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      background: 'var(--depth)',
                      border: '1px solid var(--border-md)',
                      color: 'var(--text)',
                      borderRadius: 6,
                      padding: '7px 10px',
                      fontSize: 13,
                      boxSizing: 'border-box',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={submit}
              disabled={submitting}
              style={{
                background: C.teal,
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {submitting ? 'Registering…' : 'Register enquiry'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: 'none',
                border: '1px solid var(--border-md)',
                color: 'var(--muted)',
                borderRadius: 6,
                padding: '8px 14px',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {[
                'ID',
                'Client',
                'Project',
                'Received',
                'Due',
                'Status',
                'GM Decision',
                'Actions',
              ].map((h) => (
                <th key={h} style={thS}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e, i) => (
              <tr
                key={e.id}
                style={{
                  background: i % 2 === 0 ? 'transparent' : 'var(--row-alt)',
                }}
              >
                <td style={{ ...cellS, color: C.ltBlue, fontWeight: 600 }}>
                  {e.id}
                </td>
                <td style={cellS}>{e.client}</td>
                <td style={cellS}>{e.project}</td>
                <td style={{ ...cellS, color: 'var(--muted)' }}>
                  {e.received}
                </td>
                <td style={{ ...cellS, color: 'var(--muted)' }}>{e.due}</td>
                <td style={cellS}>
                  <Badge label={sLbl(e.status)} color={sCol(e.status)} />
                </td>
                <td
                  style={{
                    ...cellS,
                    color: e.gm === 'Approved' ? C.green : 'var(--muted)',
                    fontWeight: e.gm === 'Approved' ? 600 : 400,
                  }}
                >
                  {e.gm}
                </td>
                <td style={cellS}>
                  {e.status === 'new' && e.gm === 'Pending' && (
                    <button
                      onClick={() => escalate(e.id)}
                      style={{
                        background: 'none',
                        border: `1px solid ${C.ltBlue}`,
                        color: C.ltBlue,
                        borderRadius: 5,
                        padding: '3px 9px',
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      Send to GM
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Engineering Portal Module ────────────────────────────────────────────────
function EngineeringPortalModule() {
  const drawings = [
    {
      id: 'BD-GRC-SD-041',
      title: 'North Elevation Typ. Panel Detail',
      type: 'Shop Drawing',
      rev: 'Rev.3',
      status: 'A',
      project: 'Bluewaters Tower B',
      submitted: '2026-03-01',
      approved: '2026-03-08',
      fab: true,
    },
    {
      id: 'BD-GRC-SD-042',
      title: 'Corner Panel Connection Detail',
      type: 'Shop Drawing',
      rev: 'Rev.2',
      status: 'A',
      project: 'Bluewaters Tower B',
      submitted: '2026-03-03',
      approved: '2026-03-10',
      fab: true,
    },
    {
      id: 'BD-GRC-SD-043',
      title: 'Parapet Coping Detail',
      type: 'Shop Drawing',
      rev: 'Rev.1',
      status: 'B',
      project: 'Bluewaters Tower B',
      submitted: '2026-03-07',
      approved: '2026-03-12',
      fab: false,
    },
    {
      id: 'BD-GRC-SD-044',
      title: 'Soffit Panel Layout',
      type: 'Shop Drawing',
      rev: 'Rev.2',
      status: 'pending',
      project: 'Bluewaters Tower B',
      submitted: '2026-03-14',
      approved: '—',
      fab: false,
    },
    {
      id: 'DCH-GRC-SD-001',
      title: 'Podium Level Facade Grid',
      type: 'Shop Drawing',
      rev: 'Rev.1',
      status: 'pending',
      project: 'Dubai Creek Harbour',
      submitted: '2026-03-12',
      approved: '—',
      fab: false,
    },
    {
      id: 'DCH-GRC-MS-001',
      title: 'GRC Mix Design — Class 1',
      type: 'Material Submittal',
      rev: 'Rev.1',
      status: 'A',
      project: 'Dubai Creek Harbour',
      submitted: '2026-03-05',
      approved: '2026-03-11',
      fab: false,
    },
    {
      id: 'DCH-GRC-MS-002',
      title: 'E-glass Fibre Spec Sheet',
      type: 'Material Submittal',
      rev: 'Rev.1',
      status: 'C',
      project: 'Dubai Creek Harbour',
      submitted: '2026-03-09',
      approved: '—',
      fab: false,
    },
  ]
  const sc = (s) =>
    ({ A: C.green, B: C.teal, C: C.red, D: C.red, pending: C.amber })[s] ||
    C.grey
  const thS = {
    padding: '9px 12px',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--muted)',
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap',
    borderBottom: '2px solid var(--border)',
    background: 'var(--depth)',
  }
  const tdS = {
    padding: '9px 12px',
    fontSize: 12,
    borderBottom: '1px solid var(--border-sm)',
    verticalAlign: 'middle',
  }
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          ['Total submittals', 7, '📄', C.ltBlue],
          ['Approved (A/B)', 4, '✅', C.green],
          ['Pending review', 2, '⏳', C.amber],
          ['Fab drawings issued', 2, '🔧', C.teal],
        ].map(([l, v, ic, ac]) => (
          <InfoCard key={l} label={l} accent={ac}>
            <div style={{ fontSize: 24, fontWeight: 700, color: ac }}>
              {v} <span style={{ fontSize: 16 }}>{ic}</span>
            </div>
          </InfoCard>
        ))}
      </div>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '13px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            Submittal Register
          </span>
          <button
            style={{
              background: C.teal,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + New submittal
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {[
                  'Doc No.',
                  'Title',
                  'Type',
                  'Rev',
                  'Project',
                  'Submitted',
                  'Approved',
                  'Status',
                  'Fab',
                ].map((h) => (
                  <th key={h} style={thS}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drawings.map((d, i) => (
                <tr
                  key={d.id}
                  style={{
                    background: i % 2 === 0 ? 'transparent' : 'var(--row-alt)',
                  }}
                >
                  <td
                    style={{
                      ...tdS,
                      color: C.ltBlue,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {d.id}
                  </td>
                  <td style={{ ...tdS, maxWidth: 200 }}>{d.title}</td>
                  <td style={tdS}>
                    <Badge
                      label={d.type}
                      color={d.type === 'Shop Drawing' ? C.ltBlue : C.purple}
                    />
                  </td>
                  <td style={{ ...tdS, color: 'var(--muted)' }}>{d.rev}</td>
                  <td
                    style={{
                      ...tdS,
                      color: 'var(--muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {d.project}
                  </td>
                  <td
                    style={{
                      ...tdS,
                      color: 'var(--muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {d.submitted}
                  </td>
                  <td
                    style={{
                      ...tdS,
                      color: 'var(--muted)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {d.approved}
                  </td>
                  <td style={tdS}>
                    <Badge label={d.status} color={sc(d.status)} />
                  </td>
                  <td style={{ ...tdS, textAlign: 'center' }}>
                    {d.fab ? (
                      <span style={{ color: C.green }}>✓</span>
                    ) : (
                      <span style={{ color: 'var(--faint)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Approvals Module ─────────────────────────────────────────────────────────
function ApprovalsModule({ approvals, setApprovals }) {
  const [comments, setComments] = useState({})
  function decide(id, decision) {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: decision } : a)),
    )
  }
  const counts = {
    pending: approvals.filter((a) => a.status === 'pending').length,
    action: approvals.filter((a) => a.status === 'action').length,
    approved: approvals.filter((a) => a.status === 'approved').length,
    rejected: approvals.filter((a) => a.status === 'rejected').length,
  }
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          ['Pending', counts.pending, C.amber],
          ['Action required', counts.action, C.red],
          ['Approved', counts.approved, C.green],
          ['Rejected', counts.rejected, C.red],
        ].map(([l, v, ac]) => (
          <InfoCard key={l} label={l} accent={ac}>
            <div
              style={{ fontSize: 24, fontWeight: 700, color: ac, marginTop: 2 }}
            >
              {v}
            </div>
          </InfoCard>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {approvals.map((a) => {
          const active = a.status === 'pending' || a.status === 'action'
          return (
            <div
              key={a.id}
              style={{
                background: 'var(--card)',
                border: `1px solid ${a.status === 'action' ? C.red + '60' : 'var(--border)'}`,
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <Badge label={a.type} color={C.ltBlue} />
                    <Badge
                      label={
                        a.status === 'pending'
                          ? 'Pending'
                          : a.status === 'action'
                            ? 'Action req.'
                            : a.status === 'approved'
                              ? 'Approved'
                              : 'Rejected'
                      }
                      color={
                        a.status === 'approved'
                          ? C.green
                          : a.status === 'rejected'
                            ? C.red
                            : a.status === 'action'
                              ? C.red
                              : C.amber
                      }
                    />
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      Day {a.days} of review
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{a.doc}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--muted)',
                      marginTop: 2,
                    }}
                  >
                    {a.project} · {a.by} · {a.date}
                  </div>
                </div>
                {active ? (
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => decide(a.id, 'approved')}
                      style={{
                        background: `${C.green}20`,
                        border: `1px solid ${C.green}`,
                        color: C.green,
                        borderRadius: 6,
                        padding: '7px 14px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => decide(a.id, 'rejected')}
                      style={{
                        background: `${C.red}20`,
                        border: `1px solid ${C.red}`,
                        color: C.red,
                        borderRadius: 6,
                        padding: '7px 14px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Reject
                    </button>
                  </div>
                ) : a.status === 'approved' ? (
                  <span style={{ color: C.green, fontSize: 22 }}>✓</span>
                ) : (
                  <span style={{ color: C.red, fontSize: 22 }}>✕</span>
                )}
              </div>
              {active && (
                <div
                  style={{
                    padding: '0 18px 14px',
                    borderTop: '1px solid var(--border-sm)',
                    paddingTop: 10,
                  }}
                >
                  <input
                    placeholder='Add review comment (optional)…'
                    value={comments[a.id] || ''}
                    onChange={(e) =>
                      setComments((c) => ({ ...c, [a.id]: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      background: 'var(--depth)',
                      border: '1px solid var(--border-md)',
                      color: 'var(--text)',
                      borderRadius: 6,
                      padding: '7px 10px',
                      fontSize: 12,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Power BI Module ──────────────────────────────────────────────────────────
function PowerBIModule({ projects }) {
  const maxVal = 7.8
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          [
            'Total contract value',
            'AED 19.6M',
            '4 active projects',
            C.teal,
            '💰',
          ],
          ['Invoiced to date', 'AED 11.2M', '57% of portfolio', C.ltBlue, '📊'],
          ['Retention held', 'AED 1.96M', '10% avg retention', C.amber, '🔒'],
        ].map(([l, v, sub, a, ic]) => (
          <InfoCard key={l} label={l} accent={a}>
            <div
              style={{ fontSize: 22, fontWeight: 700, color: a, marginTop: 2 }}
            >
              {v} <span style={{ fontSize: 16 }}>{ic}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
              {sub}
            </div>
          </InfoCard>
        ))}
      </div>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}
      >
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            Contract value by project (AED)
          </div>
          {projects.map((p) => {
            const pct = (
              (parseFloat(p.value.replace(/[^0-9.]/g, '')) / maxVal) *
              100
            ).toFixed(0)
            return (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {p.name}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: C.teal }}
                  >
                    {p.value}
                  </span>
                </div>
                <ProgressBar pct={pct} color={C.teal} />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 3,
                  }}
                >
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                    {p.progress}% complete
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                    {p.panels} panels
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
              Production status
            </div>
            {[
              ['Produced & dispatched', 68, C.green],
              ['In production', 20, C.teal],
              ['Not started', 12, C.grey],
            ].map(([l, v, c]) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 3,
                  }}
                >
                  <span style={{ fontSize: 12 }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: c }}>
                    {v}%
                  </span>
                </div>
                <ProgressBar pct={v} color={c} />
              </div>
            ))}
          </div>
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
              Payment breakdown
            </div>
            {[
              ['Cash received', C.green, 'AED 9.3M'],
              ['Invoiced — outstanding', C.amber, 'AED 1.9M'],
              ['Retention held', C.grey, 'AED 1.96M'],
              ['Not yet invoiced', C.ltBlue, 'AED 6.44M'],
            ].map(([l, c, v]) => (
              <div
                key={l}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '7px 0',
                  borderBottom: '1px solid var(--border-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: c,
                    }}
                  />
                  <span style={{ fontSize: 12 }}>{l}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: c }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'tracker', label: 'Elevational Tracker', icon: '🏗', badge: 'live' },
  { id: 'tender', label: 'GRC Tender Portal', icon: '📋' },
  { id: 'engineering', label: 'Engineering Portal', icon: '📐' },
  { id: 'approvals', label: 'Approvals', icon: '✅', badge: 'num' },
  { id: 'powerbi', label: 'Power BI Reports', icon: '📊' },
]

const MOD_TITLES = {
  dashboard: 'Operations Dashboard',
  tracker: 'Elevational Tracker',
  engineering: 'Engineering Portal',
  tender: 'GRC Tender Portal',
  approvals: 'Approval Workflows',
  powerbi: 'Power BI Reports',
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function ASGRCPortal() {
  const [active, setActive] = useState('dashboard')
  const [projects] = useState(INIT_PROJECTS)
  const [approvals, setApprovals] = useState(INIT_APPROVALS)
  const [openProjectId, setOpenProjectId] = useState(null)
  const [dark, setDark] = useState(false)

  const openProject = useCallback((id) => setOpenProjectId(id), [])
  const closeProject = useCallback(() => setOpenProjectId(null), [])
  const openProj = projects.find((p) => p.id === openProjectId)
  const pendingCount = approvals.filter((a) => a.status !== 'approved').length

  const isDark = dark
  const cssVars = isDark
    ? {
        '--bg': '#0D1117',
        '--surface': '#161B22',
        '--border': 'rgba(255,255,255,0.09)',
        '--border-sm': 'rgba(255,255,255,0.06)',
        '--border-md': 'rgba(255,255,255,0.13)',
        '--text': '#E6EDF3',
        '--muted': '#7D8590',
        '--card': 'rgba(255,255,255,0.04)',
        '--card-dim': 'rgba(255,255,255,0.025)',
        '--card-mid': 'rgba(255,255,255,0.06)',
        '--depth': 'rgba(0,0,0,0.2)',
        '--depth-2': 'rgba(0,0,0,0.3)',
        '--hover': 'rgba(255,255,255,0.035)',
        '--row-alt': 'rgba(255,255,255,0.025)',
        '--faint': 'rgba(255,255,255,0.15)',
        '--overlay': 'rgba(0,0,0,0.65)',
        '--overlay-heavy': 'rgba(0,0,0,0.8)',
      }
    : {
        '--bg': '#F4F6F9',
        '--surface': '#FFFFFF',
        '--border': 'rgba(0,0,0,0.09)',
        '--border-sm': 'rgba(0,0,0,0.06)',
        '--border-md': 'rgba(0,0,0,0.13)',
        '--text': '#1C2128',
        '--muted': '#57606A',
        '--card': 'rgba(0,0,0,0.03)',
        '--card-dim': 'rgba(0,0,0,0.015)',
        '--card-mid': 'rgba(0,0,0,0.05)',
        '--depth': 'rgba(0,0,0,0.04)',
        '--depth-2': 'rgba(0,0,0,0.06)',
        '--hover': 'rgba(0,0,0,0.03)',
        '--row-alt': 'rgba(0,0,0,0.025)',
        '--faint': 'rgba(0,0,0,0.12)',
        '--overlay': 'rgba(0,0,0,0.5)',
        '--overlay-heavy': 'rgba(0,0,0,0.7)',
      }

  return (
    <div
      style={{
        ...cssVars,
        fontFamily: 'system-ui,-apple-system,sans-serif',
        background: 'var(--bg)',
        color: 'var(--text)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          height: 50,
          gap: 14,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            background: C.teal,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}
        >
          A
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
            ASGRC Portal
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1 }}>
            Phase 2 · Prototype v3
          </div>
        </div>
        <div style={{ height: 20, width: 1, background: 'var(--border)' }} />
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          {MOD_TITLES[active]}
        </div>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 9px',
              background: `${C.teal}20`,
              border: `1px solid ${C.teal}40`,
              borderRadius: 20,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: C.teal,
              }}
            />
            <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>
              BC Connected
            </span>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {dark ? '☾ Dark' : '☀ Light'}
          </button>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: C.blue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            R
          </div>
        </div>
      </header>

      <div
        style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}
      >
        {/* ── Sidebar ── */}
        <nav
          style={{
            width: 192,
            flexShrink: 0,
            background: 'var(--surface)',
            borderRight: '1px solid var(--border)',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
          }}
        >
          {NAV.map((item) => {
            const sel = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 9px',
                  borderRadius: 7,
                  border: 'none',
                  background: sel ? `${C.teal}20` : 'transparent',
                  color: sel ? C.teal : 'var(--muted)',
                  fontWeight: sel ? 600 : 400,
                  fontSize: 12.5,
                  textAlign: 'left',
                  width: '100%',
                  borderLeft: `3px solid ${sel ? C.teal : 'transparent'}`,
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge === 'live' && (
                  <span
                    style={{
                      background: `${C.teal}30`,
                      color: C.teal,
                      border: `1px solid ${C.teal}50`,
                      borderRadius: 10,
                      padding: '1px 6px',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    Live
                  </span>
                )}
                {item.badge === 'num' && (
                  <span
                    style={{
                      background: `${C.amber}30`,
                      color: C.amber,
                      border: `1px solid ${C.amber}50`,
                      borderRadius: 10,
                      padding: '1px 6px',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            )
          })}
          <div
            style={{
              marginTop: 'auto',
              padding: 10,
              background: 'var(--depth-2)',
              borderRadius: 7,
              fontSize: 11,
            }}
          >
            <div
              style={{
                color: 'var(--muted)',
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              API Status
            </div>
            {[
              ['BC OData', true],
              ['SharePoint', true],
              ['Power Automate', true],
              ['Entra ID', true],
            ].map(([s, ok]) => (
              <div
                key={s}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 3,
                  color: 'var(--muted)',
                }}
              >
                <span>{s}</span>
                <span style={{ color: C.green, fontWeight: 600 }}>
                  {ok ? '●' : '○'}
                </span>
              </div>
            ))}
          </div>
        </nav>

        {/* ── Main ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {active === 'dashboard' && (
            <DashboardModule
              projects={projects}
              approvals={approvals}
              onOpenProject={openProject}
            />
          )}
          {active === 'tracker' && <TrackerModule projects={projects} />}
          {active === 'tender' && <TenderPortalModule />}
          {active === 'engineering' && <EngineeringPortalModule />}
          {active === 'approvals' && (
            <ApprovalsModule
              approvals={approvals}
              setApprovals={setApprovals}
            />
          )}
          {active === 'powerbi' && <PowerBIModule projects={projects} />}
        </main>
      </div>

      {/* ── Project drawer ── */}
      {openProj && (
        <ProjectDrawer
          project={openProj}
          onClose={closeProject}
          onNavigate={(id) => {
            closeProject()
            setActive(id)
          }}
        />
      )}
    </div>
  )
}
