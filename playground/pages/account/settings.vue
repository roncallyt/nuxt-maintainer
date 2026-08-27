<template>
  <main class="page">
    <p class="eyebrow">
      URL preservation test
    </p>
    <h1>The current URL is part of the test.</h1>
    <p class="lede">
      Put the site down, then reload this page. The application should render its maintenance error with status 503 while the browser remains on <code>/account/settings</code>.
    </p>
    <NuxtLink to="/">
      Back to feature harness
    </NuxtLink>
  </main>
</template>
