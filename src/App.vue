<template>
  <div id="container">
    <the-header></the-header>
    <div id="wrapper">
      <router-view v-slot="{ Component }">
        <keep-alive include="recipe-results">
          <transition name="route" mode="out-in">
            <component :is="Component" />
          </transition>
        </keep-alive>
      </router-view>
    </div>
    <!-- <router-view></router-view> -->
    <the-footer></the-footer>
  </div>
</template>

<script>
import { computed, watch } from "vue";
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

    watch(autoLogout, () => {
      router.replace("/search");
    });
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Aladin&family=Roboto+Slab:wght@400;700&display=swap");

:root {
  --color-primary: #f38e82;
  --color-grad-1: #94d82d;
  --color-grad-2: #5c940d;
  --color-button: #d8f5a2;
  --color-button-hover: #ffec99;

  --text-dark: rgb(23, 37, 4);
  --text-light: #f5faeb;

  --backgroud-color: #f7ffea;

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
}
* {
  box-sizing: border-box;
  margin: 0;
}

html {
  font-family: "Roboto Slab", serif;
  color: var(--text-dark);
  font-size: 62.5%;
}

body {
  background-color: var(--backgroud-color);
  font-size: 1.6rem;
}

#container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
#wrapper {
  flex: 1;
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
</style>
