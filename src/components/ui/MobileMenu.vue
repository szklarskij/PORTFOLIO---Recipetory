<template>
  <div>
    <div class="slot">
      <div class="close-btn" @click="close">
        <ion-icon name="close-outline"></ion-icon>
      </div>
      <slot></slot>
    </div>
    <div class="backdrop"></div>
  </div>
</template>

<script>
// import { ref } from "vue";
export default {
  setup(_, context) {
    const close = function () {
      context.emit("close-mobile-menu");
    };

    return { close };
  },
};
</script>

<style scoped>
.slot {
  position: fixed;
  display: grid;
  grid-template-rows: 1fr 8fr;
  grid-auto-columns: 1fr;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  z-index: 12;
  justify-content: center;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.close-btn {
  justify-self: flex-end;
}
.close-btn ion-icon {
  font-size: 8rem;
  color: var(--text-light);
}
</style>
