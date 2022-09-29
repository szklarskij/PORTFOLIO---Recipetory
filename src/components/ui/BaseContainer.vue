<template>
  <div class="basic-container">
    <slot></slot>
  </div>
</template>
<style scoped>
.basic-container {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);

  width: 105.8rem;

  background-color: white;
}
@media (min-width: 69.68em) {
  .basic-container {
    margin: 4rem 0;
  }
}
@media (max-width: 69.68em) {
  .basic-container {
    width: unset;
    border-radius: 0;
    min-width: 100vw;
  }
}
</style>
