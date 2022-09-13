<template>
  <the-header></the-header>
  <router-view v-slot="{ Component }">
    <keep-alive include="recipe-results">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <!-- <router-view></router-view> -->
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import TheHeader from "./components/layout/TheHeader.vue";
export default {
  components: { TheHeader },
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
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");
* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}
</style>
