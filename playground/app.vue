<template>
  <div class="shell">
    <header class="header">
      <NuxtLink
        class="brand"
        to="/"
      >
        Nuxt Maintainer
      </NuxtLink>
      <nav aria-label="Playground navigation">
        <NuxtLink to="/">
          Features
        </NuxtLink>
        <NuxtLink to="/account/settings">
          URL test
        </NuxtLink>
        <a href="/health">Health check</a>
      </nav>
    </header>
    <NuxtPage />
  </div>
</template>

<style>
:root {
  color-scheme: dark;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  background: #07110e;
  color: #e6fff5;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at 12% 0%, rgb(0 220 130 / 16%), transparent 32rem),
    #07110e;
}

a {
  color: #65e6ad;
}

button {
  border: 1px solid #287d5d;
  border-radius: 0.65rem;
  padding: 0.65rem 0.9rem;
  background: #103a2b;
  color: #effff9;
  cursor: pointer;
}

button:hover {
  background: #16543e;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.shell {
  width: min(70rem, calc(100% - 2rem));
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid #1b4738;
}

.header nav {
  display: flex;
  gap: 1rem;
}

.brand {
  color: #e6fff5;
  font-weight: 750;
  text-decoration: none;
}

.page {
  padding: 4rem 0;
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: #65e6ad;
  font: 700 0.75rem/1 ui-monospace, monospace;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1 {
  max-width: 16ch;
  margin: 0;
  font-size: clamp(2.4rem, 7vw, 5rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
}

h2 {
  margin-top: 0;
}

.lede {
  max-width: 44rem;
  margin: 1.5rem 0 3rem;
  color: #a9c9bc;
  font-size: 1.1rem;
  line-height: 1.7;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
  gap: 1rem;
}

.card {
  padding: 1.25rem;
  border: 1px solid #1b4738;
  border-radius: 1rem;
  background: rgb(9 30 23 / 78%);
}

.card p {
  color: #a9c9bc;
  line-height: 1.6;
}

.command {
  display: block;
  overflow-x: auto;
  padding: 0.85rem;
  border-radius: 0.65rem;
  background: #030a08;
  color: #8df4c7;
  white-space: nowrap;
}

.result {
  min-height: 3rem;
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: 0.65rem;
  background: #030a08;
  color: #c1dfd3;
  white-space: pre-wrap;
}

.fallback {
  border-color: #9a6432;
  background: #3b2916;
}

@media (max-width: 42rem) {
  .header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header nav {
    flex-wrap: wrap;
  }
}
</style>
