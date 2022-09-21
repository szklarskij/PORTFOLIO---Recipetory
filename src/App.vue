<template>
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

  --color-grey-light-1: #f9f5f3;
  --color-grey-light-2: #f2efee;
  --color-grey-light-3: #d3c7c3;
  --color-grey-dark-1: #615551;
  --color-grey-dark-2: #918581;

  --large: 78.15em;
  --medium: 61.25em;
  --small: 37.5em;
  --smallest: 31.25em;
  /*
 // 1250px
 // 980px
 // 600px
 // 500px
 */
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  font-family: "Roboto Slab", serif;
  color: var(--text-dark);
  font-size: 62.5%;
  overflow-y: scroll;
  overflow-x: hidden;
}

body {
  font-size: 1.6rem;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}
body::before {
  content: "";
  position: fixed;
  background-image: linear-gradient(#f7ffea69, #f7ffeac9),
    url("./assets/background.webp");
  background-size: cover;
  background-position: left;
  height: 100%;
  width: 100%;
  min-height: var(--original-viewport-height);
  left: 0;
  top: 0;
  will-change: transform;
  z-index: -1;
}

#container {
  min-width: auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0;
}
#wrapper {
  margin: 0;
  flex: 1;
  display: flex;
  /* align-items: center; */
  justify-content: center;
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
  padding: 7.4rem 6.2rem;
}

/* 612 */

@media (max-width: 38.25em) {
  #wrapper {
    align-items: center;
  }
}

/* 830 */
@media (max-width: 51.87em) {
  .padding {
    padding: 4.4rem 3.2rem;
  }
}

/* 405 */
@media (max-width: 25.31em) {
  .padding {
    padding: 3.6rem 3.2rem;
  }
}
/* 360 */
@media (max-width: 20em) {
  .padding {
    padding: 2.5rem 1rem;
  }
}
</style>
