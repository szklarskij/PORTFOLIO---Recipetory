<template>
  <div class="basic-container">
    <slot></slot>
  </div>
</template>
<style scoped>
.basic-container {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  /* padding: 1.6rem; */
  margin: 2rem auto;

  min-width: 100rem;

  background-color: white;
  margin: 3.6rem;
}

/* .container-enter-from,
.container-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.container-enter-active {
  transition: all 0.3s ease-out;
}

.container-leave-active {
  transition: all 0.3s ease-in;
}

.container-enter-to,
.container-leave-from {
  opacity: 1;
  transform: scale(1);
} */
</style>
