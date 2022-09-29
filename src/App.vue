<template>
  <div class="background"></div>
  <div id="container">
    <the-header></the-header>
    <div id="wrapper">
      <router-view v-slot="{ Component }">
        <keep-alive include="recipe-results">
          <transition name="route" mode="out-in">
            <component
              :is="Component"
              @select-mobile-input="selectMobileInput"
            />
          </transition>
        </keep-alive>
      </router-view>
    </div>
    <!-- <router-view></router-view> -->
    <the-footer></the-footer>
  </div>
</template>

<script>
import { ref, computed, watch, provide } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";
export default {
  components: { TheHeader, TheFooter },
  name: "App",

  setup() {
    const store = useStore();
    store.dispatch("auth/tryLogin");
    const router = useRouter();
    const autoLogout = computed(function () {
      return store.getters["auth/didAutoLogout"];
    });
    const mobileInput = ref(0);
    const selectMobileInput = function () {
      mobileInput.value++;
    };

    provide("select-mobile-input", mobileInput);

    ///
    const screenWidth = ref(window.innerWidth);
    const handleResize = function () {
      screenWidth.value = window.innerWidth;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const mediumView = computed(function () {
      return screenWidth.value <= 1115;
    });
    const smallView = computed(function () {
      return screenWidth.value <= 612;
    });
    provide("medium-view", mediumView);
    provide("small-view", smallView);

    ///

    watch(autoLogout, () => {
      router.replace("/search");
    });
    ////
    let vh = window.innerHeight;
    let vw = window.innerWidth;
    const fixBackground = function () {
      document.documentElement.style.setProperty("--vh", `${vh + vh / 10}px`);
    };
    fixBackground();

    window.addEventListener("resize", () => {
      if (vw !== window.innerWidth) {
        vh = window.innerHeight;
        vw = window.innerWidth;
        fixBackground();
      }
    });

    return { selectMobileInput };
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Aladin&family=Roboto+Slab:wght@400;700&display=swap");

:root {
  --color-primary: #f38e82;
  --color-grad-1: #86a853;
  --color-grad-2: #325008;
  --color-button: #d8f5a2;
  --color-button-hover: #ffec99;
  --color-search-button-1: rgb(180, 206, 35);
  --color-search-button-2: rgb(136, 158, 12);

  --color-error: rgb(226, 85, 85);

  --text-dark: rgb(23, 37, 4);
  --text-light: #f5faeb;

  --background-color: #f7ffea;

  --gradient: linear-gradient(
    to right bottom,
    var(--color-grad-1),
    var(--color-grad-2)
  );
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
*:focus {
  outline: none !important;
}

html {
  font-family: "Roboto Slab", serif;
  color: var(--text-dark);
  font-size: 62.5%;
}

/* *::-webkit-scrollbar {
  display: block;
  width: 16px;
}

*::-webkit-scrollbar-button {
  display: none;
}

*::-webkit-scrollbar-track {
  background-color: #00000000;
}

*::-webkit-scrollbar-track-piece {
  background-color: #00000000;
}

*::-webkit-scrollbar-thumb {
  background-color: #00000040;
  border: 1px solid #ffffff40;
  border-radius: 24px;
} */

body {
  background-color: var(--text-light);
  font-size: 1.6rem;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

#container {
  min-width: auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0;

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  overflow-y: overlay;
}
#wrapper {
  margin: 0;
  flex: 1;
  display: flex;

  flex-direction: column;
  align-items: center;

  justify-content: center;
}

#wrapper::before {
  content: "";
  flex: 1;
}
#wrapper::after {
  content: "";
  flex: 3;
}

.no-wrap {
  white-space: nowrap;
}

/* transion */
.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}
.route-leave-active {
  transition: all 0.3s ease-in;
}
.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.padding {
  padding: 6.2rem;
}
/* 1115 */
@media (min-width: 69.68em) {
  body {
    background-image: linear-gradient(#f7ffea69, #f7ffeac9),
      url("./assets/background.webp");
    background-size: cover;
  }
}

/* 620 */
@media (max-width: 38.25em) {
  .padding {
    padding: 2.5rem 1rem;
  }
}
</style>
