import React, { useState } from 'react'

// ─── Palette & theme ───────────────────────────────────────────────────────
const C = {
  navy: '#0B1F3A',
  blue: '#1A5276',
  teal: '#0E8A6A',
  ltBlue: '#2E86C1',
  purple: '#7B2D8B',
  amber: '#D35400',
  green: '#1D8348',
  red: '#922B21',
  gold: '#D4AC0D',
  grey: '#4A5568',
  ltGrey: '#718096',
}

// ─── Mock data ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'PRJ-2401',
    name: 'Bluewaters Tower B',
    client: 'Meraas Development',
    value: 'AED 4.2M',
    status: 'production',
    progress: 68,
    pm: 'Khalid Hassan',
    panels: 420,
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
  },
]

const ENQUIRIES = [
  {
    id: 'ENQ-0189',
    client: 'Aldar Properties',
    project: 'Yas Island Tower',
    received: '2026-03-10',
    due: '2026-03-25',
    status: 'estimation',
    gm: 'Pending',
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
    gm: '-',
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
]

const APPROVALS = [
  {
    id: 'SUB-441',
    type: 'Shop Drawing',
    project: 'Bluewaters Tower B',
    doc: 'BD-GRC-SD-044 Rev.2',
    submittedBy: 'Ali Hassan',
    date: '2026-03-14',
    status: 'pending',
    days: 1,
  },
  {
    id: 'SUB-442',
    type: 'Material Submittal',
    project: 'Dubai Creek Harbour',
    doc: 'DCH-MAT-MS-012',
    submittedBy: 'Sara Al-Mansoori',
    date: '2026-03-13',
    status: 'pending',
    days: 2,
  },
  {
    id: 'SUB-443',
    type: 'NCR',
    project: "One Za'abeel Podium",
    doc: 'OZP-QC-NCR-007',
    submittedBy: 'QC Team',
    date: '2026-03-12',
    status: 'action',
    days: 3,
  },
  {
    id: 'SUB-444',
    type: 'WIR',
    project: "One Za'abeel Podium",
    doc: 'OZP-INST-WIR-031',
    submittedBy: 'Site Team',
    date: '2026-03-11',
    status: 'approved',
    days: 4,
  },
]

// Elevational tracker — 8 rows × 12 cols of panels
const PANEL_STATUSES = [
  'none',
  'drawing-issued',
  'drawing-approved',
  'produced',
  'delivered',
  'installed',
  'qc-passed',
]
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

function makePanels(rows, cols) {
  const grid = []
  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < cols; c++) {
      const progress = Math.min(
        6,
        Math.max(
          0,
          Math.round(
            (cols - c - 1) * 0.45 + (rows - r - 1) * 0.3 + Math.random() * 1.5,
          ),
        ),
      )
      row.push({
        id: `P${String(r + 1).padStart(2, '0')}-${String(c + 1).padStart(2, '0')}`,
        status: progress,
        floor: `L${r + 1}`,
      })
    }
    grid.push(row)
  }
  return grid
}
const PANELS = makePanels(8, 14)

// ─── Reusable small components ─────────────────────────────────────────────
function Badge({ label, color = '#2E86C1', bg }) {
  const bgColor = bg || color + '20'
  return (
    <span
      style={{
        background: bgColor,
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

function StatCard({ label, value, sub, accent = C.teal, icon }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '16px 20px',
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 4,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--text)',
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
          {sub && (
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              {sub}
            </div>
          )}
        </div>
        {icon && <div style={{ fontSize: 22, opacity: 0.6 }}>{icon}</div>}
      </div>
    </div>
  )
}

function ProgressBar({ pct, color = C.teal }) {
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
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 4,
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  )
}

function SectionHeader({ title, action, actionLabel }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text)',
        }}
      >
        {title}
      </h3>
      {action && (
        <button
          onClick={action}
          style={{
            background: 'none',
            border: `1px solid ${C.teal}`,
            color: C.teal,
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {actionLabel || 'View all'}
        </button>
      )}
    </div>
  )
}

// ─── MODULE: Dashboard ─────────────────────────────────────────────────────
function DashboardModule() {
  const stats = [
    {
      label: 'Active projects',
      value: 4,
      sub: '2 in production',
      accent: C.blue,
      icon: '🏗',
    },
    {
      label: 'Open enquiries',
      value: 4,
      sub: '1 due this week',
      accent: C.amber,
      icon: '📋',
    },
    {
      label: 'Pending approvals',
      value: 3,
      sub: '1 overdue 3 days',
      accent: C.red,
      icon: '⏳',
    },
    {
      label: 'Panels tracked',
      value: '2,048',
      sub: 'across all projects',
      accent: C.teal,
      icon: '🧱',
    },
  ]
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}
      >
        {/* Active projects */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <SectionHeader title='Active projects' />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PROJECTS.map((p) => (
              <div
                key={p.id}
                style={{
                  padding: '12px 14px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
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
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--text)',
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--muted)',
                        marginTop: 2,
                      }}
                    >
                      {p.client} · {p.id} · PM: {p.pm}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{ fontSize: 12, fontWeight: 600, color: C.teal }}
                    >
                      {p.value}
                    </div>
                    <Badge
                      label={p.status}
                      color={
                        p.status === 'production'
                          ? '#1D8348'
                          : p.status === 'delivery'
                            ? '#D4AC0D'
                            : p.status === 'engineering'
                              ? '#2E86C1'
                              : '#884EA0'
                      }
                    />
                  </div>
                </div>
                <ProgressBar
                  pct={p.progress}
                  color={
                    p.progress > 80
                      ? C.green
                      : p.progress > 50
                        ? C.teal
                        : C.blue
                  }
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
                    {p.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending approvals + pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 20,
              flex: 1,
            }}
          >
            <SectionHeader title='Pending approvals' />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {APPROVALS.filter((a) => a.status !== 'approved').map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--bg)',
                    border: `1px solid ${a.status === 'action' ? C.red + '60' : 'var(--border)'}`,
                    borderRadius: 7,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text)',
                      }}
                    >
                      {a.doc}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {a.type} · {a.project}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Badge
                      label={a.status === 'action' ? 'Action req.' : 'Pending'}
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

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <SectionHeader title='Enquiry pipeline' />
            {[
              ['New', '#718096', 1],
              ['Info missing', '#D35400', 1],
              ['Go / Estimation', '#2E86C1', 2],
              ['Quotation sent', '#884EA0', 0],
              ['Awarded', '#1D8348', 0],
            ].map(([label, color, count]) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ fontSize: 12, color: 'var(--text)', flex: 1 }}>
                  {label}
                </div>
                <div
                  style={{
                    width: 80,
                    background: 'var(--border)',
                    borderRadius: 4,
                    height: 6,
                  }}
                >
                  <div
                    style={{
                      width: `${count * 50}%`,
                      height: '100%',
                      background: color,
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color,
                    minWidth: 16,
                    textAlign: 'right',
                  }}
                >
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MODULE: Elevational Tracker ───────────────────────────────────────────
function ElevationalTrackerModule() {
  const [selectedPanel, setSelectedPanel] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [selectedProject, setSelectedProject] = useState('PRJ-2401')

  const proj = PROJECTS.find((p) => p.id === selectedProject)

  const panelCounts = PANEL_STATUSES.map(
    (_, si) => PANELS.flat().filter((p) => p.status === si).length,
  )

  return (
    <div>
      {/* Controls */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: 7,
            padding: '7px 12px',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.id})
            </option>
          ))}
        </select>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          {proj?.panels} panels · {proj?.progress}% complete · PM: {proj?.pm}
        </div>
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

      {/* Legend + counts */}
      <div
        style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}
      >
        {PANEL_STATUSES.slice(1).map((_, i) => {
          const si = i + 1
          const active = filterStatus === si
          return (
            <button
              key={si}
              onClick={() => setFilterStatus(active ? null : si)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 10px',
                background: active
                  ? STATUS_COLORS[si] + '30'
                  : 'var(--surface)',
                border: `1px solid ${active ? STATUS_COLORS[si] : 'var(--border)'}`,
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
                color: 'var(--text)',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: STATUS_COLORS[si],
                }}
              />
              {STATUS_LABELS[si]}
              <span style={{ color: STATUS_COLORS[si], fontWeight: 700 }}>
                {panelCounts[si]}
              </span>
            </button>
          )
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {/* Elevation grid */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 16,
            overflowX: 'auto',
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
            North Elevation — {proj?.name}
          </div>
          {/* Column headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `40px repeat(14, 1fr)`,
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
                  fontSize: 10,
                  color: 'var(--muted)',
                }}
              >
                G{i + 1}
              </div>
            ))}
          </div>
          {/* Rows */}
          {PANELS.map((row, ri) => (
            <div
              key={ri}
              style={{
                display: 'grid',
                gridTemplateColumns: `40px repeat(14, 1fr)`,
                gap: 3,
                marginBottom: 3,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: 'var(--muted)',
                  fontWeight: 600,
                }}
              >
                L{ri + 1}
              </div>
              {row.map((panel) => {
                const dimmed =
                  filterStatus !== null && panel.status !== filterStatus
                const sel = selectedPanel?.id === panel.id
                return (
                  <div
                    key={panel.id}
                    onClick={() => setSelectedPanel(sel ? null : panel)}
                    title={`${panel.id} — ${STATUS_LABELS[panel.status]}`}
                    style={{
                      height: 28,
                      borderRadius: 4,
                      cursor: 'pointer',
                      background: dimmed
                        ? 'var(--border)'
                        : STATUS_COLORS[panel.status],
                      border: `2px solid ${sel ? '#fff' : 'transparent'}`,
                      opacity: dimmed ? 0.25 : 1,
                      transition: 'all 0.15s',
                    }}
                  />
                )
              })}
            </div>
          ))}
          {/* Progress summary bar */}
          <div
            style={{
              marginTop: 14,
              padding: '10px 12px',
              background: 'var(--bg)',
              borderRadius: 7,
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            {PANEL_STATUSES.slice(1).map((_, i) => {
              const si = i + 1
              const pct = ((panelCounts[si] / (14 * 8)) * 100).toFixed(0)
              return (
                <div
                  key={si}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: STATUS_COLORS[si],
                    }}
                  />
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                    {pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel detail */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 16,
          }}
        >
          {selectedPanel ? (
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: 4,
                }}
              >
                Panel {selectedPanel.id}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  marginBottom: 14,
                }}
              >
                Floor: {selectedPanel.floor} · Project: {selectedProject}
              </div>
              <div style={{ marginBottom: 16 }}>
                <Badge
                  label={STATUS_LABELS[selectedPanel.status]}
                  color={STATUS_COLORS[selectedPanel.status]}
                />
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--muted)',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Activity log
              </div>
              {[
                ['Area cleared', selectedPanel.status >= 1],
                ['Vapour barrier', selectedPanel.status >= 2],
                ['Rockwool', selectedPanel.status >= 3],
                ['Cavity barrier', selectedPanel.status >= 3],
                ['Steel / bracket fix', selectedPanel.status >= 4],
                ['Panel installation', selectedPanel.status >= 5],
                ['QC final inspection', selectedPanel.status >= 6],
              ].map(([act, done]) => (
                <div
                  key={act}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 0',
                    borderBottom: '1px solid var(--border)',
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
                      fontSize: 10,
                      background: done ? C.green + '30' : C.grey + '30',
                      color: done ? C.green : C.grey,
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
                style={{ marginTop: 14, fontSize: 11, color: 'var(--muted)' }}
              >
                BOQ item: GRC-FAC-N-
                {String(
                  (parseInt(selectedPanel.id.replace(/\D/g, ''), 10) % 48) + 1,
                ).padStart(3, '0')}
                <br />
                Tag No: {selectedProject}-{selectedPanel.id}
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
                padding: '40px 0',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>🧱</div>
              Click any panel cell to view its status and activity log
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MODULE: GRC Tender Portal ─────────────────────────────────────────────
function TenderPortalModule() {
  const [showForm, setShowForm] = useState(false)
  const [enquiries, setEnquiries] = useState(ENQUIRIES)
  const [form, setForm] = useState({
    client: '',
    project: '',
    due: '',
    scope: 'grc',
  })
  const [submitting, setSubmitting] = useState(false)

  const statusColor = (s) =>
    ({
      new: C.grey,
      'info-missing': C.amber,
      go: C.green,
      estimation: C.blue,
      regret: C.red,
    })[s] || C.grey
  const statusLabel = (s) =>
    ({
      new: 'New',
      'info-missing': 'Info Missing',
      go: 'GM Approved',
      estimation: 'Estimation',
      regret: 'Regret',
    })[s] || s

  function submitEnquiry() {
    if (!form.client || !form.project) return
    setSubmitting(true)
    setTimeout(() => {
      const newEnq = {
        id: `ENQ-0${193 + enquiries.length}`,
        client: form.client,
        project: form.project,
        received: new Date().toISOString().split('T')[0],
        due: form.due || 'TBC',
        status: 'new',
        gm: 'Pending',
      }
      setEnquiries((prev) => [newEnq, ...prev])
      setForm({ client: '', project: '', due: '', scope: 'grc' })
      setShowForm(false)
      setSubmitting(false)
    }, 800)
  }

  function escalateGM(id) {
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'go', gm: 'Approved' } : e,
      ),
    )
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
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            ['All', null],
            ['New', 'new'],
            ['Estimation', 'estimation'],
            ['Approved', 'go'],
          ].map(([l, v]) => (
            <button
              key={l}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
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

      {/* New enquiry form */}
      {showForm && (
        <div
          style={{
            background: 'var(--surface)',
            border: `1px solid ${C.teal}`,
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: 14,
            }}
          >
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
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
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
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
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
              onClick={submitEnquiry}
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
                border: '1px solid var(--border)',
                color: 'var(--text)',
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

      {/* Enquiry table */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                borderBottom: '2px solid var(--border)',
                background: 'var(--bg)',
              }}
            >
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
                <th
                  key={h}
                  style={{
                    padding: '10px 14px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--muted)',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                  }}
                >
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
                  borderBottom: '1px solid var(--border)',
                  background:
                    i % 2 === 0 ? 'transparent' : 'var(--bg-alt, transparent)',
                }}
              >
                <td
                  style={{
                    padding: '10px 14px',
                    fontSize: 12,
                    color: C.blue,
                    fontWeight: 600,
                  }}
                >
                  {e.id}
                </td>
                <td
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    color: 'var(--text)',
                  }}
                >
                  {e.client}
                </td>
                <td
                  style={{
                    padding: '10px 14px',
                    fontSize: 13,
                    color: 'var(--text)',
                  }}
                >
                  {e.project}
                </td>
                <td
                  style={{
                    padding: '10px 14px',
                    fontSize: 12,
                    color: 'var(--muted)',
                  }}
                >
                  {e.received}
                </td>
                <td
                  style={{
                    padding: '10px 14px',
                    fontSize: 12,
                    color: 'var(--muted)',
                  }}
                >
                  {e.due}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <Badge
                    label={statusLabel(e.status)}
                    color={statusColor(e.status)}
                  />
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span
                    style={{
                      fontSize: 12,
                      color:
                        e.gm === 'Approved'
                          ? C.green
                          : e.gm === 'Regret'
                            ? C.red
                            : 'var(--muted)',
                      fontWeight: e.gm === 'Approved' ? 600 : 400,
                    }}
                  >
                    {e.gm}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {e.status === 'new' && e.gm === 'Pending' && (
                    <button
                      onClick={() => escalateGM(e.id)}
                      style={{
                        background: 'none',
                        border: `1px solid ${C.blue}`,
                        color: C.blue,
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

// ─── MODULE: Engineering Portal ────────────────────────────────────────────
function EngineeringPortalModule() {
  const drawings = [
    {
      id: 'BD-GRC-SD-041',
      title: 'North Elevation Typ. Panel Detail',
      type: 'Shop Drawing',
      rev: 'Rev.3',
      status: 'A',
      project: 'Bluewaters Tower B',
      submittedDate: '2026-03-01',
      approvedDate: '2026-03-08',
      issuedFab: true,
    },
    {
      id: 'BD-GRC-SD-042',
      title: 'Corner Panel Connection Detail',
      type: 'Shop Drawing',
      rev: 'Rev.2',
      status: 'A',
      project: 'Bluewaters Tower B',
      submittedDate: '2026-03-03',
      approvedDate: '2026-03-10',
      issuedFab: true,
    },
    {
      id: 'BD-GRC-SD-043',
      title: 'Parapet Coping Detail',
      type: 'Shop Drawing',
      rev: 'Rev.1',
      status: 'B',
      project: 'Bluewaters Tower B',
      submittedDate: '2026-03-07',
      approvedDate: '2026-03-12',
      issuedFab: false,
    },
    {
      id: 'BD-GRC-SD-044',
      title: 'Soffit Panel Layout',
      type: 'Shop Drawing',
      rev: 'Rev.2',
      status: 'pending',
      project: 'Bluewaters Tower B',
      submittedDate: '2026-03-14',
      approvedDate: '—',
      issuedFab: false,
    },
    {
      id: 'DCH-GRC-SD-001',
      title: 'Podium Level Facade Grid',
      type: 'Shop Drawing',
      rev: 'Rev.1',
      status: 'pending',
      project: 'Dubai Creek Harbour',
      submittedDate: '2026-03-12',
      approvedDate: '—',
      issuedFab: false,
    },
    {
      id: 'DCH-GRC-MS-001',
      title: 'GRC Mix Design — Class 1',
      type: 'Material Submittal',
      rev: 'Rev.1',
      status: 'A',
      project: 'Dubai Creek Harbour',
      submittedDate: '2026-03-05',
      approvedDate: '2026-03-11',
      issuedFab: false,
    },
    {
      id: 'DCH-GRC-MS-002',
      title: 'E-glass Fibre Spec Sheet',
      type: 'Material Submittal',
      rev: 'Rev.1',
      status: 'C',
      project: 'Dubai Creek Harbour',
      submittedDate: '2026-03-09',
      approvedDate: '—',
      issuedFab: false,
    },
  ]

  const statusColor = (s) =>
    ({ A: C.green, B: C.teal, C: C.red, D: C.red, pending: C.amber })[s] ||
    C.grey
  const statusFull = (s) =>
    ({
      A: 'Approved (A)',
      B: 'Approved w/ comments (B)',
      C: 'Revise & resubmit (C)',
      D: 'Rejected (D)',
      pending: 'Submitted — awaiting review',
    })[s] || s

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
          ['Total submittals', 7, '📄', C.blue],
          ['Approved (A/B)', 4, '✅', C.green],
          ['Pending review', 2, '⏳', C.amber],
          ['Fab drawings issued', 2, '🔧', C.teal],
        ].map(([l, v, ic, ac]) => (
          <StatCard key={l} label={l} value={v} accent={ac} icon={ic} />
        ))}
      </div>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                borderBottom: '2px solid var(--border)',
                background: 'var(--bg)',
              }}
            >
              {[
                'Doc No.',
                'Title',
                'Type',
                'Rev',
                'Project',
                'Submitted',
                'Approved',
                'Approval Status',
                'Fab Issued',
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '9px 12px',
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--muted)',
                    textAlign: 'left',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drawings.map((d, i) => (
              <tr
                key={d.id}
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <td
                  style={{
                    padding: '10px 12px',
                    fontSize: 12,
                    color: C.blue,
                    fontWeight: 600,
                  }}
                >
                  {d.id}
                </td>
                <td
                  style={{
                    padding: '10px 12px',
                    fontSize: 12,
                    color: 'var(--text)',
                    maxWidth: 200,
                  }}
                >
                  {d.title}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <Badge
                    label={d.type}
                    color={d.type === 'Shop Drawing' ? C.blue : C.purple}
                  />
                </td>
                <td
                  style={{
                    padding: '10px 12px',
                    fontSize: 12,
                    color: 'var(--muted)',
                  }}
                >
                  {d.rev}
                </td>
                <td
                  style={{
                    padding: '10px 12px',
                    fontSize: 11,
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {d.project}
                </td>
                <td
                  style={{
                    padding: '10px 12px',
                    fontSize: 11,
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {d.submittedDate}
                </td>
                <td
                  style={{
                    padding: '10px 12px',
                    fontSize: 11,
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {d.approvedDate}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <Badge label={d.status} color={statusColor(d.status)} />
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  {d.issuedFab ? (
                    <span style={{ color: C.green, fontSize: 13 }}>✓</span>
                  ) : (
                    <span style={{ color: 'var(--border)', fontSize: 13 }}>
                      —
                    </span>
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

// ─── MODULE: Approval Workflows ────────────────────────────────────────────
function ApprovalsModule() {
  const [items, setItems] = useState(APPROVALS)
  const [comment, setComment] = useState({})

  function decide(id, decision) {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: decision } : a)),
    )
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
          [
            'Pending',
            items.filter((a) => a.status === 'pending').length,
            C.amber,
          ],
          [
            'Action required',
            items.filter((a) => a.status === 'action').length,
            C.red,
          ],
          [
            'Approved',
            items.filter((a) => a.status === 'approved').length,
            C.green,
          ],
          [
            'Rejected',
            items.filter((a) => a.status === 'rejected').length,
            C.red,
          ],
        ].map(([l, v, ac]) => (
          <StatCard key={l} label={l} value={v} accent={ac} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((a) => (
          <div
            key={a.id}
            style={{
              background: 'var(--surface)',
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
                    marginBottom: 4,
                  }}
                >
                  <Badge label={a.type} color={C.blue} />
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
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text)',
                  }}
                >
                  {a.doc}
                </div>
                <div
                  style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}
                >
                  {a.project} · Submitted by {a.submittedBy} on {a.date}
                </div>
              </div>
              {(a.status === 'pending' || a.status === 'action') && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => decide(a.id, 'approved')}
                    style={{
                      background: C.green + '20',
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
                      background: C.red + '20',
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
              )}
              {a.status === 'approved' && (
                <span style={{ color: C.green, fontSize: 20 }}>✓</span>
              )}
              {a.status === 'rejected' && (
                <span style={{ color: C.red, fontSize: 20 }}>✕</span>
              )}
            </div>
            {/* Comment area */}
            {(a.status === 'pending' || a.status === 'action') && (
              <div
                style={{
                  padding: '0 18px 14px',
                  borderTop: '1px solid var(--border)',
                  paddingTop: 12,
                }}
              >
                <input
                  placeholder='Add review comment (optional)…'
                  value={comment[a.id] || ''}
                  onChange={(e) =>
                    setComment((c) => ({ ...c, [a.id]: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
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
        ))}
      </div>
    </div>
  )
}

// ─── MODULE: Power BI stub ─────────────────────────────────────────────────
function PowerBIModule() {
  const projects = PROJECTS
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
        <StatCard
          label='Total contract value'
          value='AED 19.6M'
          sub='4 active projects'
          accent={C.teal}
          icon='💰'
        />
        <StatCard
          label='Invoiced to date'
          value='AED 11.2M'
          sub='57% of portfolio'
          accent={C.blue}
          icon='📊'
        />
        <StatCard
          label='Retention held'
          value='AED 1.96M'
          sub='10% avg retention'
          accent={C.amber}
          icon='🔒'
        />
      </div>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}
      >
        {/* Project value chart */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <SectionHeader title='Contract value by project (AED)' />
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--text)',
                    fontWeight: 500,
                  }}
                >
                  {p.name}
                </span>
                <span style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>
                  {p.value}
                </span>
              </div>
              <div
                style={{
                  background: 'var(--border)',
                  borderRadius: 4,
                  height: 8,
                }}
              >
                <div
                  style={{
                    width: `${(parseFloat(p.value.replace(/[^0-9.]/g, '')) / maxVal) * 100}%`,
                    height: '100%',
                    background: C.teal,
                    borderRadius: 4,
                  }}
                />
              </div>
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
          ))}
        </div>
        {/* Status breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <SectionHeader title='Production status' />
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
                  <span style={{ fontSize: 12, color: 'var(--text)' }}>
                    {l}
                  </span>
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
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <SectionHeader title='Payment status' />
            {[
              ['Received', C.green, 'AED 9.3M'],
              ['Invoiced — outstanding', C.amber, 'AED 1.9M'],
              ['Retention', C.grey, 'AED 1.96M'],
              ['Not yet invoiced', C.blue, 'AED 6.44M'],
            ].map(([l, c, v]) => (
              <div
                key={l}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '7px 0',
                  borderBottom: '1px solid var(--border)',
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
                  <span style={{ fontSize: 12, color: 'var(--text)' }}>
                    {l}
                  </span>
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

// ─── MAIN APP ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞', group: 'overview' },
  {
    id: 'tracker',
    label: 'Elevational Tracker',
    icon: '🏗',
    group: 'project',
    badge: 'Live',
  },
  { id: 'tender', label: 'GRC Tender Portal', icon: '📋', group: 'sales' },
  {
    id: 'engineering',
    label: 'Engineering Portal',
    icon: '📐',
    group: 'project',
  },
  {
    id: 'approvals',
    label: 'Approvals',
    icon: '✅',
    group: 'control',
    badge: '3',
  },
  { id: 'powerbi', label: 'Power BI Reports', icon: '📊', group: 'reporting' },
]

const MODULE_TITLES = {
  dashboard: 'Operations Dashboard',
  tracker: 'Elevational Tracker',
  tender: 'GRC Tender Portal',
  engineering: 'Engineering Submittal Portal',
  approvals: 'Approval Workflows',
  powerbi: 'Power BI Dashboards',
}

export default function ASGRCPortal() {
  const [active, setActive] = useState('dashboard')
  const [dark, setDark] = useState(true)
  const [now] = useState(
    new Date().toLocaleString('en-AE', {
      timeZone: 'Asia/Dubai',
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  )

  const theme = dark
    ? {
        '--bg': '#0D1117',
        '--surface': '#161B22',
        '--border': 'rgba(255,255,255,0.08)',
        '--text': '#E6EDF3',
        '--muted': '#7D8590',
      }
    : {
        '--bg': '#F6F8FA',
        '--surface': '#FFFFFF',
        '--border': 'rgba(0,0,0,0.10)',
        '--text': '#1C2128',
        '--muted': '#57606A',
      }

  const modules = {
    dashboard: <DashboardModule />,
    tracker: <ElevationalTrackerModule />,
    tender: <TenderPortalModule />,
    engineering: <EngineeringPortalModule />,
    approvals: <ApprovalsModule />,
    powerbi: <PowerBIModule />,
  }

  return (
    <div
      style={{
        ...theme,
        fontFamily: 'system-ui,-apple-system,sans-serif',
        background: 'var(--bg)',
        color: 'var(--text)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          height: 52,
          flexShrink: 0,
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--text)',
                lineHeight: 1.2,
              }}
            >
              ASGRC Portal
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1 }}>
              Phase 2 · Prototype
            </div>
          </div>
        </div>
        <div style={{ height: 20, width: 1, background: 'var(--border)' }} />
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          {MODULE_TITLES[active]}
        </div>
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {now} · Dubai
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              background: C.teal + '20',
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
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {dark ? '☀ Light' : '☾ Dark'}
          </button>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: C.blue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            R
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <nav
          style={{
            width: 200,
            flexShrink: 0,
            background: 'var(--surface)',
            borderRight: '1px solid var(--border)',
            padding: '14px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const sel = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '8px 10px',
                  borderRadius: 7,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  background: sel ? C.teal + '20' : 'transparent',
                  color: sel ? C.teal : 'var(--muted)',
                  fontWeight: sel ? 600 : 400,
                  fontSize: 13,
                  borderLeft: sel
                    ? `3px solid ${C.teal}`
                    : '3px solid transparent',
                }}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      background:
                        item.badge === 'Live' ? C.teal + '30' : C.red + '30',
                      color: item.badge === 'Live' ? C.teal : C.red,
                      border: `1px solid ${item.badge === 'Live' ? C.teal : C.red}50`,
                      borderRadius: 10,
                      padding: '1px 6px',
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
          {/* API status */}
          <div
            style={{
              marginTop: 'auto',
              padding: '10px',
              background: 'var(--bg)',
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
              ['Power Automate', true],
              ['SharePoint', true],
              ['Entra ID', true],
            ].map(([s, ok]) => (
              <div
                key={s}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 3,
                }}
              >
                <span style={{ color: 'var(--muted)' }}>{s}</span>
                <span style={{ color: ok ? C.green : C.red, fontWeight: 600 }}>
                  {ok ? '●' : '○'}
                </span>
              </div>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
          {modules[active]}
        </main>
      </div>
    </div>
  )
}
