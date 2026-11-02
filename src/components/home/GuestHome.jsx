export default function GuestHome() {
  return (
    <section className="page active guest-home" id="page-home-guest">
      <div className="guest-hero">
        <p className="eyebrow">A calmer way to move</p>
        <h1>Build a rhythm that fits <em>real life.</em></h1>
        <p className="lede">
          Meet coaches, discover guided classes, and create a wellness plan
          that supports your day instead of overwhelming it.
        </p>
        <div className="guest-actions">
          <a className="action-button" href="/signup">Create your space →</a>
          <a className="outline-button" href="/login">Log in</a>
        </div>
      </div>
      <div className="guest-feature-grid">
        <article className="cream-card guest-feature">
          <span className="feature-icon">♧</span>
          <h2>Coach matching</h2>
          <p>Find support that feels aligned with your goals and pace.</p>
        </article>
        <article className="cream-card guest-feature">
          <span className="feature-icon">▤</span>
          <h2>Guided courses</h2>
          <p>Try short lessons designed for busy routines and real progress.</p>
        </article>
        <article className="cream-card guest-feature">
          <span className="feature-icon">⌗</span>
          <h2>Helpful tools</h2>
          <p>Track your goals, mood, and everyday movement without the pressure.</p>
        </article>
      </div>

      <section className="guest-content-block">
        <div className="section-heading guest-block-head">
          <div>
            <p className="eyebrow">Meet your support</p>
            <h2>Coaches who keep real life in view</h2>
          </div>
        </div>
        <div className="trainer-preview-grid">
          <article className="cream-card trainer-preview">
            <span className="trainer-badge">Maya Chen</span>
            <h3>Strength & mobility coach</h3>
            <p>
              Brings structure, confidence, and smart progression for people who
              want to feel stronger without burnout.
            </p>
          </article>
          <article className="cream-card trainer-preview">
            <span className="trainer-badge">Arjun Patel</span>
            <h3>Mindful movement guide</h3>
            <p>
              Helps you build calm movement and recovery habits that support
              long-term energy and consistency.
            </p>
          </article>
          <article className="cream-card trainer-preview">
            <span className="trainer-badge">Lena Ortiz</span>
            <h3>Nutrition & habit coach</h3>
            <p>
              Makes everyday nutrition simple and helps you design habits that
              stick.
            </p>
          </article>
        </div>
      </section>

      <section className="guest-content-block faq-block">
        <div className="section-heading guest-block-head">
          <div>
            <p className="eyebrow">FAQs</p>
            <h2>Everything you need to know before starting</h2>
          </div>
        </div>
        <div className="faq-list">
          <details open>
            <summary>Is flexform for beginners?</summary>
            <p>
              Yes. Every plan is designed to be approachable, with guided
              sessions and flexible routines that work for different experience
              levels.
            </p>
          </details>
          <details>
            <summary>Do I need a strict routine?</summary>
            <p>
              No. The platform is built around realistic progress. Small,
              sustainable habits matter more than perfection.
            </p>
          </details>
          <details>
            <summary>Can I try coaching before committing?</summary>
            <p>
              Absolutely. You can explore the programs, preview coach styles,
              and create your account before choosing a plan.
            </p>
          </details>
          <details>
            <summary>What makes flexform different?</summary>
            <p>
              We combine supportive coaching, thoughtful tools, and a healthier
              relationship with movement—so your routine fits your life, not the
              other way around.
            </p>
          </details>
        </div>
      </section>
    </section>
  );
}