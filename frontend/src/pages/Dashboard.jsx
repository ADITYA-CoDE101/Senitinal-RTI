import React, { useState, useEffect } from 'react'
import Icon from '../components/Icon'
import { getDashboardStats } from '../services/api'

/* ── TOKENS ──────────────────────────────────────────────────── */
const BG   = '#07090f'
const SURF = '#0d1117'
const BDIM = 'rgba(255,255,255,0.06)'

/* ── DASHBOARD PAGE ──────────────────────────────────────────── */
export default function Dashboard({ navigate }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getDashboardStats()
      setStats(res.data)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    }
    setLoading(false)
  }

  // Fallback data if DB is empty or fails
  const displayOverview = stats?.overview || {
    totalComplaints: '0',
    resolutionRate: '0%',
    avgResponseTime: '--',
    activeEscalations: '0'
  }

  const statCards = [
    { label: 'Total Complaints',    value: displayOverview.totalComplaints,  change: 'Across all departments', icon: 'file',     color: '#3b74ff' },
    { label: 'Resolution Rate',     value: displayOverview.resolutionRate,   change: 'Completed resolutions', icon: 'check',    color: '#0ec98c' },
    { label: 'Avg Response Time',   value: displayOverview.avgResponseTime,  change: 'Current system average', icon: 'clock',    color: '#00c2e0' },
    { label: 'Active Escalations',  value: displayOverview.activeEscalations, change: 'Pending CIC review', icon: 'bell',     color: '#ef4444' },
  ]

  const trendData = stats?.monthlyTrend || []
  const maxFiled = trendData.length > 0 ? Math.max(...trendData.map(b => b.filed), 10) : 10

  return (
    <div className="page-enter" style={{ background: BG, minHeight: '100vh', color: '#fff' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '64px 48px 48px' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(26,86,232,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,232,0.04) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div style={{ position: 'absolute', bottom: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,232,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
              color: '#0ec98c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0ec98c', animation: 'pulse 1.6s infinite' }} />
              Live System Metrics
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.08,
              letterSpacing: '-2px', color: '#fff', marginBottom: 10,
            }}>
              Real-time <span style={{ background: 'linear-gradient(90deg,#0ec98c,#00c2e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Analytics</span>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 480 }}>
              Live data from India's first AI-powered automated RTI filing system.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={fetchStats} disabled={loading} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BDIM}`, borderRadius: 9, padding: '11px', cursor: 'pointer' }}>
               <Icon name="refresh" size={16} color="rgba(255,255,255,0.5)" />
            </button>
            <button onClick={() => navigate('fileComplaint')} style={{ padding: '11px 22px', borderRadius: 9, background: '#1a56e8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, boxShadow: '0 4px 14px rgba(26,86,232,0.4)' }}>
              <Icon name="file" size={13} color="white" /> File Complaint
            </button>
          </div>
        </div>
      </section>

      {/* ── OVERVIEW STATS ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {statCards.map((s, i) => <StatCard key={i} stat={s} loading={loading} />)}
        </div>
      </section>

      {/* ── CHARTS ROW ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>

          {/* Bar Chart */}
          <div style={{ background: SURF, borderRadius: 16, border: `1px solid ${BDIM}`, padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff' }}>Complaint Trends</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Volume trends over last few months</div>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: '#3b74ff' }} /> Filed
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: '#0ec98c' }} /> Resolved
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180 }}>
              {trendData.length > 0 ? trendData.map((b, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
                    <BarUnit value={b.filed} max={maxFiled} color="#3b74ff" />
                    <BarUnit value={b.resolved} max={maxFiled} color="#0ec98c" />
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>{b.month}</span>
                </div>
              )) : (
                <div style={{ flex: 1, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontFamily: "'Space Mono', monospace", fontSize: 12 }}>No trend data yet. Start filing complaints to see them here!</div>
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={{ background: SURF, borderRadius: 16, border: `1px solid ${BDIM}`, padding: '28px' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>By Category</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>System-wide issue distribution</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {stats?.byCategory && stats.byCategory.length > 0 ? stats.byCategory.map((cat, i) => (
                <CategoryRow key={i} cat={cat} />
              )) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '20px' }}>Loading category data...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM ROW ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Top Authorities */}
          <div style={{ background: SURF, borderRadius: 16, border: `1px solid ${BDIM}`, padding: '28px' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>Performance Ranking</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>Top responding government authorities</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {stats?.topAuthorities && stats.topAuthorities.length > 0 ? stats.topAuthorities.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 0', borderBottom: i < stats.topAuthorities.length - 1 ? `1px solid ${BDIM}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.06)', fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)',
                    }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{a.name}</span>
                  </div>
                  <span style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: '#0ec98c',
                  }}>{a.rate}</span>
                </div>
              )) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '20px' }}>Ranking authorities based on response time...</div>
              )}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div style={{ background: SURF, borderRadius: 16, border: `1px solid ${BDIM}`, padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff' }}>Live Activity</div>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0ec98c', animation: 'pulse 1.6s infinite' }} />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>Real-time platform events</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {stats?.recentComplaints && stats.recentComplaints.length > 0 ? stats.recentComplaints.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0',
                  borderBottom: i < stats.recentComplaints.length - 1 ? `1px solid ${BDIM}` : 'none',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: a.status === 'resolved' ? '#0ec98c' : '#3b74ff',
                    flexShrink: 0, marginTop: 5,
                  }} />
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                       Complaint <span style={{ color: '#fff', fontWeight: 600 }}>#{a.trackingId}</span> filed in {a.category} 
                       {a.status === 'submitted' ? ' is being processed.' : ` is ${a.status.toUpperCase()}.`}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Mono', monospace", marginTop: 2 }}>{new Date(a.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '20px' }}>Monitoring live activity...</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${BDIM}`, padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: '#fff' }}>Sentinel<span style={{ color: '#00c2e0' }}>-RTI</span></span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 Sentinel-RTI. Open Source MIT.</span>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}

function StatCard({ stat, loading }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '28px 24px', borderRadius: 16,
        background: hovered ? 'rgba(255,255,255,0.04)' : SURF,
        border: `1px solid ${hovered ? `${stat.color}40` : BDIM}`,
        transition: 'all 0.25s', cursor: 'default',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? `0 8px 24px ${stat.color}12` : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: `${stat.color}15`, border: `1px solid ${stat.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {loading ? (
             <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: stat.color, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          ) : (
             <Icon name={stat.icon} size={20} color={stat.color} sw={1.8} />
          )}
        </div>
      </div>
      <div style={{
        fontFamily: "'Space Mono', monospace", fontWeight: 700,
        fontSize: 'clamp(28px, 3vw, 36px)', color: '#fff', lineHeight: 1, marginBottom: 6,
      }}>{loading ? '--' : stat.value}</div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{stat.label}</div>
      <div style={{ fontSize: 11, color: loading ? 'rgba(255,255,255,0.2)' : `${stat.color}99` }}>{stat.change}</div>
      <style>{` @keyframes spin { to { transform: rotate(360deg); } } `}</style>
    </div>
  )
}

function BarUnit({ value, max, color }) {
  const [hovered, setHovered] = useState(false)
  const height = Math.max(8, (value / max) * 160)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '45%', height: `${height}px`, borderRadius: '4px 4px 0 0',
        background: hovered ? color : `${color}80`,
        transition: 'all 0.2s', cursor: 'default', position: 'relative',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)',
          background: '#1c2333', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap',
          fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)', zIndex: 10
        }}>{value}</div>
      )}
    </div>
  )
}

function CategoryRow({ cat }) {
  const [hovered, setHovered] = useState(false)
  const colors = ['#3b74ff', '#00c2e0', '#f59e0b', '#0ec98c', '#e04dff', 'rgba(255,255,255,0.3)']
  const color = colors[Math.floor(Math.random() * colors.length)] // In production use stable colors based on category name

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'default' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: hovered ? '#fff' : 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }}>{cat.category}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#00c2e0' }}>{cat.count.toLocaleString()}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          width: `${cat.pct}%`, height: '100%', borderRadius: 3,
          background: `linear-gradient(90deg, #1a56e8, #00c2e0)`,
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  )
}
