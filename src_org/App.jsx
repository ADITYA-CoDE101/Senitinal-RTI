import './App.css'

function App() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="#top">
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-text">Sentinel-RTI</span>
          </a>
          <nav className="nav" aria-label="Primary">
            <a href="#problem">Problem</a>
            <a href="#solution">Solution</a>
            <a href="#workflow">Workflow</a>
            <a href="#stack">Stack</a>
          </nav>
          <a className="btn btn-primary btn-sm" href="#cta">
            Get started
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-inner">
            <p className="eyebrow">AI-powered civic advocacy · India</p>
            <h1>
              Turn everyday complaints into{' '}
              <span className="hero-highlight">legally grounded</span> action
            </h1>
            <p className="hero-lede">
              Sentinel-RTI helps citizens file evidence-backed RTI complaints
              and formal grievances in plain Hindi or English—routed to the right
              authority and tracked until resolution.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#cta">
                Start a complaint
              </a>
              <a className="btn btn-ghost" href="#workflow">
                See the workflow
              </a>
            </div>
            <ul className="hero-trust" aria-label="Input channels">
              <li>Text & voice</li>
              <li>Image evidence</li>
              <li>Geo-location</li>
              <li>RAG-backed legal text</li>
            </ul>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-orbit" />
          </div>
        </section>

        <section id="problem" className="section section-alt">
          <div className="container">
            <h2 className="section-title">Why complaints stall</h2>
            <p className="section-sub">
              Millions face potholes, waste, and broken infrastructure—but formal
              action stays rare.
            </p>
            <div className="card-grid three">
              <article className="card">
                <h3>Wrong department</h3>
                <p>
                  Citizens do not know which office or portal actually owns the
                  issue.
                </p>
              </article>
              <article className="card">
                <h3>Weak evidence</h3>
                <p>
                  Informal messages lack timestamps, location, and structured
                  proof authorities expect.
                </p>
              </article>
              <article className="card">
                <h3>No follow-through</h3>
                <p>
                  Even when filed, complaints fade without deadlines, reminders,
                  or appeals.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="solution" className="section">
          <div className="container split">
            <div>
              <h2 className="section-title">What Sentinel-RTI does</h2>
              <p className="section-sub left">
                Describe your issue in your own words or upload a photo. Our
                system drafts a formal complaint with legal context, enriches it
                with evidence metadata, and keeps the case alive with intelligent
                follow-ups.
              </p>
              <ul className="checklist">
                <li>
                  <strong>Issue detection</strong> from images (e.g. potholes,
                  garbage) plus severity-aware wording
                </li>
                <li>
                  <strong>AI Evidence Enhancer</strong>—timestamp, geo-tag, and
                  structured summary
                </li>
                <li>
                  <strong>RAG over the RTI Act</strong> and guidelines so drafts
                  cite real provisions
                </li>
                <li>
                  <strong>Smart routing</strong> to the correct authority and
                  submission channel
                </li>
                <li>
                  <strong>Human-in-the-loop</strong> for OTP and CAPTCHA where
                  portals require it
                </li>
              </ul>
            </div>
            <aside className="aside-panel" aria-label="Lifecycle states">
              <h3 className="aside-title">Lifecycle tracking</h3>
              <ul className="lifecycle">
                <li>
                  <span className="dot submitted" /> Submitted
                </li>
                <li>
                  <span className="dot pending" /> Pending
                </li>
                <li>
                  <span className="dot escalated" /> Escalated
                </li>
                <li>
                  <span className="dot resolved" /> Resolved
                </li>
              </ul>
              <p className="aside-note">
                Automated reminders, appeals, and escalations when authorities do
                not respond—aligned to the legal hierarchy.
              </p>
            </aside>
          </div>
        </section>

        <section id="workflow" className="section section-alt">
          <div className="container">
            <h2 className="section-title">End-to-end workflow</h2>
            <p className="section-sub">
              From first input to analytics—one coherent pipeline.
            </p>
            <ol className="workflow">
              <li>
                <span className="wf-step">1</span>
                <div>
                  <h3>User input</h3>
                  <p>
                    Text, image, voice, and automatic geo-location capture the
                    issue in context.
                  </p>
                </div>
              </li>
              <li>
                <span className="wf-step">2</span>
                <div>
                  <h3>AI processing</h3>
                  <p>
                    Classification, evidence enhancement, and severity analysis
                    build a defensible record.
                  </p>
                </div>
              </li>
              <li>
                <span className="wf-step">3</span>
                <div>
                  <h3>Draft complaint</h3>
                  <p>
                    Legal sections from RAG plus an evidence summary produce a
                    submission-ready draft.
                  </p>
                </div>
              </li>
              <li>
                <span className="wf-step">4</span>
                <div>
                  <h3>Smart routing</h3>
                  <p>
                    Identify the responsible authority and the right government
                    portal.
                  </p>
                </div>
              </li>
              <li>
                <span className="wf-step">5</span>
                <div>
                  <h3>Submit & verify</h3>
                  <p>
                    Auto-filled forms with user confirmation; OTP and CAPTCHA
                    handled safely in the loop.
                  </p>
                </div>
              </li>
              <li>
                <span className="wf-step">6</span>
                <div>
                  <h3>Track & escalate</h3>
                  <p>
                    Follow-ups, appeals, and dashboard analytics on resolution
                    trends and geography.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section id="stack" className="section">
          <div className="container">
            <h2 className="section-title">Built for real operations</h2>
            <p className="section-sub">
              MERN at the core—designed to plug in vision models, embeddings, and
              government-facing automation.
            </p>
            <div className="stack-row">
              <div className="stack-item">
                <span className="stack-name">React</span>
                <span className="stack-desc">Accessible UI & dashboards</span>
              </div>
              <div className="stack-item">
                <span className="stack-name">Node + Express</span>
                <span className="stack-desc">Routing, workflows, follow-ups</span>
              </div>
              <div className="stack-item">
                <span className="stack-name">MongoDB</span>
                <span className="stack-desc">Complaint lifecycle & drafts</span>
              </div>
              <div className="stack-item">
                <span className="stack-name">RAG & AI</span>
                <span className="stack-desc">Legal grounding & evidence</span>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="section cta">
          <div className="container cta-inner">
            <blockquote className="vision">
              Real change happens when complaints are{' '}
              <strong>proven, tracked, and enforced</strong>—not just voiced once
              and forgotten.
            </blockquote>
            <p className="cta-lede">
              Sentinel-RTI is an accountability layer for civic India: structured
              complaints, persistent follow-up, and transparent status.
            </p>
            <a className="btn btn-primary btn-lg" href="#top">
              Explore Sentinel-RTI
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">Sentinel-RTI</span>
          <span className="footer-meta">
            Automated citizen advocacy · Evidence-backed · Legally grounded
          </span>
        </div>
      </footer>
    </div>
  )
}

export default App
