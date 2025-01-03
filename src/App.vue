<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/produkt">Produkt</RouterLink>
        <RouterLink to="/warenbewegung">Warenbewegung</RouterLink>
        <RouterLink to="/inventur">Inventur</RouterLink>
        <RouterLink to="/lieferant">Lieferant</RouterLink>
        <RouterLink to="/kunde">Kunde</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />

</template>

<style scoped>
header {
  position: absolute;
  top: 20px;
  left: 100px;
  right: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  z-index: 10;
}
.wrapper {
  margin: 0;
  padding: 0;
}
nav {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 12px;
  margin: 0;
  gap: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
