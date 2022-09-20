<template>
  <div class="basic-container">
    <slot></slot>
  </div>
</template>
<style scoped>
.basic-container {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);

  margin: 2rem auto;
  width: 100rem;

  background-color: white;
  margin: 3.6rem;
}

@media (max-width: 69.68em) {
  .basic-container {
    width: 80rem;
  }
}
/* 830 */
@media (max-width: 51.87em) {
  .basic-container {
    width: 60rem;
  }
}
/* 612 */

@media (max-width: 38.25em) {
  .basic-container {
    width: 50rem;
  }
}
/* 520 */

@media (max-width: 32.5em) {
  .basic-container {
    width: 40rem;
  }
}
/* 405 */
@media (max-width: 25.31em) {
  .basic-container {
    width: 35rem;
  }
}
</style>
