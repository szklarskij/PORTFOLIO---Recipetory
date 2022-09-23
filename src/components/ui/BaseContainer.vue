<template>
  <div class="basic-container">
    <slot></slot>
  </div>
</template>
<style scoped>
.basic-container {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);

  margin: 3.6rem 2rem;
  /* max-width: 100vw; */
  /* max-width: 95vw; */
  width: 105.8rem;
  /* padding: 0 2rem; */
  background-color: white;
}

@media (max-width: 69.68em) {
  .basic-container {
    width: unset;
    border-radius: 0;
    min-width: 100vw;
    /* min-height: 100%; */
    margin: 0;
  }
}
/* 830 */
@media (max-width: 51.87em) {
  .basic-container {
    /* width: 70rem; */
  }
}
/* 720*/
@media (max-width: 45em) {
  .basic-container {
    /* width: 60rem;/ */
  }
}
/* 612 */

@media (max-width: 38.25em) {
  .basic-container {
    /* width: 50rem; */
  }
}
/* 520 */

@media (max-width: 32.5em) {
  .basic-container {
    /* width: 40rem; */
    /* padding: ; */
    /* margin: 1.6rem auto; */
  }
}
/* 405 */
@media (max-width: 25.31em) {
  .basic-container {
    /* width: 35rem; */
  }
}
/* 320 */
@media (max-width: 20em) {
  .basic-container {
    /* width: 27rem; */
  }
}
</style>
