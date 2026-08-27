<template>
  <div class="landing">
    <section class="hero-shell">
      <div class="hero-glow hero-glow-primary" />
      <div class="hero-glow hero-glow-secondary" />

      <div class="hero-grid">
        <div class="hero-copy">
          <div class="eyebrow">
            <span class="eyebrow-dot" />
            Live maintenance for Nuxt
          </div>

          <h1>
            Maintenance mode
            <span>without restarts.</span>
          </h1>

          <p class="hero-description">
            Put an entire Nuxt application—or only one named section—into maintenance while it is running.
            Keep control of your URLs, error page, and deployment workflow.
          </p>

          <ul class="capability-list">
            <li>
              <UIcon
                name="i-lucide-check"
                aria-hidden="true"
              />
              <span>Nuxt 3.21 and Nuxt 4 support</span>
            </li>
            <li>
              <UIcon
                name="i-lucide-check"
                aria-hidden="true"
              />
              <span>Filesystem and shared Redis state</span>
            </li>
            <li>
              <UIcon
                name="i-lucide-check"
                aria-hidden="true"
              />
              <span>Secret URL and cookie bypass</span>
            </li>
            <li>
              <UIcon
                name="i-lucide-check"
                aria-hidden="true"
              />
              <span>Named maintenance sections</span>
            </li>
          </ul>

          <div class="hero-actions">
            <UButton
              to="/getting-started"
              size="xl"
              trailing-icon="i-lucide-arrow-right"
              label="Get started"
            />
            <UButton
              to="https://github.com/roncallyt/nuxt-maintainer"
              target="_blank"
              size="xl"
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-external-link"
              label="View on GitHub"
            />
          </div>
        </div>

        <div class="terminal-wrap">
          <div
            class="terminal"
            aria-label="nuxt-maintainer command example"
          >
            <div class="terminal-header">
              <div
                class="terminal-dots"
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </div>
              <span>Terminal</span>
              <span class="terminal-spacer" />
            </div>

            <div class="terminal-body">
              <div class="command">
                <span class="prompt">$</span>
                <code>npx nuxi module add nuxt-maintainer</code>
              </div>
              <div class="command">
                <span class="prompt">$</span>
                <code>npx nuxt-maintainer down --message "Back shortly"</code>
              </div>
              <p class="command-result command-result-down">
                <span /> Application is in maintenance mode
              </p>
              <div class="command">
                <span class="prompt">$</span>
                <code>npx nuxt-maintainer up</code>
              </div>
              <p class="command-result command-result-up">
                <span /> Application is live
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="feature-section"
      aria-labelledby="features-title"
    >
      <div class="section-heading">
        <p>Built for operations</p>
        <h2 id="features-title">
          Predictable maintenance, from one route to every node.
        </h2>
      </div>

      <div class="feature-grid">
        <article class="feature-card">
          <div class="feature-icon">
            <UIcon
              name="i-lucide-refresh-cw"
              aria-hidden="true"
            />
          </div>
          <h3>Change state live</h3>
          <p>Put a running application up or down from the CLI without rebuilding or restarting Nuxt.</p>
        </article>
        <article class="feature-card">
          <div class="feature-icon">
            <UIcon
              name="i-lucide-route"
              aria-hidden="true"
            />
          </div>
          <h3>Stay in Nuxt’s pipeline</h3>
          <p>Preserve the requested URL, reuse your existing error page, and return structured 503s to APIs.</p>
        </article>
        <article class="feature-card">
          <div class="feature-icon">
            <UIcon
              name="i-lucide-panels-top-left"
              aria-hidden="true"
            />
          </div>
          <h3>Pause only what you need</h3>
          <p>Take named sections such as checkout or search offline while the rest of the application stays up.</p>
        </article>
      </div>
    </section>

    <section class="section-callout">
      <div>
        <p class="callout-label">
          Scoped maintenance
        </p>
        <h2>Keep the application open while checkout takes a break.</h2>
        <p>
          Wrap an interface in <code>&lt;NuxtMaintenance&gt;</code>, then toggle that section independently from the CLI.
        </p>
      </div>

      <UButton
        to="/sections"
        size="lg"
        color="neutral"
        variant="outline"
        trailing-icon="i-lucide-arrow-right"
        label="Explore sections"
      />
    </section>
  </div>
</template>

<style scoped>
.landing {
  --landing-border: color-mix(in srgb, var(--ui-border) 78%, transparent);
  overflow: hidden;
}

.hero-shell {
  position: relative;
  isolation: isolate;
  border-bottom: 1px solid var(--landing-border);
}

.hero-shell::before {
  position: absolute;
  z-index: -2;
  inset: 0;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--ui-border) 35%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--ui-border) 35%, transparent) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(to bottom, black, transparent 88%);
  content: '';
  opacity: 0.32;
}

.hero-glow {
  position: absolute;
  z-index: -1;
  width: 30rem;
  height: 30rem;
  border-radius: 9999px;
  filter: blur(100px);
  pointer-events: none;
}

.hero-glow-primary {
  top: -16rem;
  right: 5%;
  background: color-mix(in srgb, var(--ui-primary) 18%, transparent);
}

.hero-glow-secondary {
  bottom: -22rem;
  left: 5%;
  background: color-mix(in srgb, var(--ui-primary) 10%, transparent);
}

.hero-grid,
.feature-section,
.section-callout {
  width: min(100% - 3rem, 80rem);
  margin-inline: auto;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(25rem, 0.95fr);
  gap: clamp(3rem, 7vw, 7rem);
  align-items: center;
  min-height: 43rem;
  padding-block: clamp(5rem, 10vw, 8rem);
}

.eyebrow {
  display: inline-flex;
  gap: 0.6rem;
  align-items: center;
  margin-bottom: 1.5rem;
  color: var(--ui-primary);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.eyebrow-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: currentColor;
  box-shadow: 0 0 0 0.3rem color-mix(in srgb, var(--ui-primary) 14%, transparent);
}

h1 {
  max-width: 12ch;
  margin: 0;
  color: var(--ui-text-highlighted);
  font-size: clamp(3.25rem, 6.3vw, 5.8rem);
  font-weight: 750;
  letter-spacing: -0.065em;
  line-height: 0.96;
}

h1 span {
  display: block;
  color: color-mix(in srgb, var(--ui-text-highlighted) 52%, transparent);
}

.hero-description {
  max-width: 42rem;
  margin: 1.75rem 0 0;
  color: var(--ui-text-muted);
  font-size: clamp(1.05rem, 1.5vw, 1.25rem);
  line-height: 1.7;
}

.capability-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1.25rem;
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}

.capability-list li {
  display: flex;
  gap: 0.65rem;
  align-items: center;
  color: var(--ui-text);
  font-size: 0.925rem;
}

.capability-list .iconify {
  flex: 0 0 auto;
  width: 1rem;
  height: 1rem;
  color: var(--ui-primary);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2.4rem;
}

.terminal-wrap {
  position: relative;
}

.terminal-wrap::before {
  position: absolute;
  z-index: -1;
  inset: 12% -7% -10% 18%;
  border-radius: 2rem;
  background: color-mix(in srgb, var(--ui-primary) 12%, transparent);
  filter: blur(45px);
  content: '';
}

.terminal {
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--ui-border) 88%, var(--ui-primary) 12%);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--ui-bg-elevated) 92%, transparent);
  box-shadow: 0 2rem 6rem rgb(0 0 0 / 0.18);
  backdrop-filter: blur(20px);
}

.terminal-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 3.25rem;
  padding-inline: 1rem;
  border-bottom: 1px solid var(--landing-border);
  color: var(--ui-text);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
}

.terminal-dots {
  display: flex;
  gap: 0.4rem;
}

.terminal-dots span {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 9999px;
  background: #fb7185;
}

.terminal-dots span:nth-child(2) {
  background: #facc15;
}

.terminal-dots span:nth-child(3) {
  background: #4ade80;
}

.terminal-body {
  display: grid;
  gap: 1.1rem;
  min-height: 22rem;
  padding: clamp(1.35rem, 3vw, 2rem);
  font-family: var(--font-mono);
  font-size: clamp(0.76rem, 1.1vw, 0.9rem);
  line-height: 1.65;
}

.command {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  color: var(--ui-text-highlighted);
}

.command code {
  overflow-wrap: anywhere;
}

.prompt {
  color: var(--ui-primary);
  font-weight: 700;
}

.command-result {
  display: flex;
  gap: 0.55rem;
  align-items: center;
  margin: -0.55rem 0 0 1.5rem;
  color: var(--ui-text-muted);
  font-size: 0.78rem;
}

.command-result span {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
}

.command-result-down span {
  background: #fb7185;
}

.command-result-up span {
  background: #4ade80;
}

.feature-section {
  padding-block: clamp(5rem, 9vw, 8rem);
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(10rem, 0.45fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
  margin-bottom: 3rem;
}

.section-heading > p,
.callout-label {
  margin: 0;
  color: var(--ui-primary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.section-heading h2,
.section-callout h2 {
  margin: 0;
  color: var(--ui-text-highlighted);
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1.08;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.feature-card {
  min-height: 16rem;
  padding: 1.6rem;
  border: 1px solid var(--landing-border);
  border-radius: 1rem;
  background: color-mix(in srgb, var(--ui-bg-elevated) 60%, transparent);
}

.feature-icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  margin-bottom: 3.25rem;
  border: 1px solid color-mix(in srgb, var(--ui-primary) 28%, transparent);
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--ui-primary) 9%, transparent);
  color: var(--ui-primary);
  place-items: center;
}

.feature-icon .iconify {
  width: 1.25rem;
  height: 1.25rem;
}

.feature-card h3 {
  margin: 0;
  color: var(--ui-text-highlighted);
  font-size: 1.1rem;
  font-weight: 650;
}

.feature-card p {
  margin: 0.8rem 0 0;
  color: var(--ui-text-muted);
  line-height: 1.65;
}

.section-callout {
  display: flex;
  gap: 3rem;
  align-items: end;
  justify-content: space-between;
  margin-bottom: clamp(5rem, 9vw, 8rem);
  padding: clamp(1.75rem, 4vw, 3.5rem);
  border: 1px solid var(--landing-border);
  border-radius: 1.25rem;
  background:
    radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--ui-primary) 13%, transparent), transparent 35%),
    var(--ui-bg-elevated);
}

.section-callout > div {
  max-width: 47rem;
}

.section-callout h2 {
  margin-top: 0.9rem;
  font-size: clamp(1.8rem, 3.3vw, 2.7rem);
}

.section-callout p:last-child {
  margin: 1rem 0 0;
  color: var(--ui-text-muted);
  line-height: 1.7;
}

.section-callout code {
  color: var(--ui-text-highlighted);
  font-family: var(--font-mono);
}

@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 4rem;
    padding-block: 5rem;
  }

  .terminal-wrap {
    width: min(100%, 40rem);
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    min-height: auto;
  }

  .feature-icon {
    margin-bottom: 2rem;
  }
}

@media (max-width: 640px) {
  .hero-grid,
  .feature-section,
  .section-callout {
    width: min(100% - 2rem, 80rem);
  }

  .capability-list,
  .section-heading {
    grid-template-columns: 1fr;
  }

  .section-heading {
    gap: 1rem;
  }

  .terminal-body {
    min-height: 20rem;
  }

  .section-callout {
    align-items: flex-start;
    flex-direction: column;
    gap: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-glow,
  .terminal-wrap::before {
    filter: none;
  }
}
</style>
