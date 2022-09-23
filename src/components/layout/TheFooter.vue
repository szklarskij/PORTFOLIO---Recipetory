<template>
  <section>
    <footer>
      <div>
        <p class="main">Recipetory 2022</p>

        <p class="fix">|</p>
        <p>Made by Jakub Szklarski</p>
        <p class="fix">|</p>
        <p>
          Contact:
          <a href="mailto:jakubszklarski1@gmail.com"
            >jakubszklarski1@gmail.com</a
          >
        </p>
      </div>
    </footer>
  </section>
</template>
<style scoped>
footer {
  z-index: 2;
  overscroll-behavior: none;
  position: static;
  display: flex;
  justify-content: center;
  background: var(--gradient);
  padding: 1rem;
  color: var(--text-light);
  font-size: 1.2rem;
  /* padding: 1rem 40rem; */
}
div {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-auto-columns: min-content;
  grid-auto-rows: min-content;
  justify-content: center;
  /* width: auto; */
  flex: 0 0;
  justify-items: center;
  white-space: nowrap;
  gap: 1rem;
}
a {
  /* margin-left: 0.3rem; */
  color: inherit;
}

@media (max-width: 38.25em) {
  div {
    gap: 0.3rem;
    column-gap: 2rem;
    grid-template-columns: 1fr 1fr;
  }
  .fix {
    display: none;
  }
  .main {
    grid-column: 1/-1;
  }
}
@media (max-width: 23.12em) {
  div {
    gap: 0.1rem;
    grid-template-columns: 1fr;
  }
}
</style>
