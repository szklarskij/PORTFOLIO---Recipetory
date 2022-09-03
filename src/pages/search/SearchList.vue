<template>
  <section>
    <base-container>
      <div v-if="!recipesLoaded">
        <h2>Recipes not found!</h2>
        <p>Please input another keywords</p>
      </div>
      <div v-else>
        <h2>Recipes has been found!</h2>
        <p>Showing resoults of "{{ searchString }}"</p>
      </div>
    </base-container>
  </section>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const searchString = computed(function () {
      return store.getters["search/searchString"];
    });
    const recipesLoaded = computed(function () {
      return store.getters["search/recipesLoaded"];
    });
    return { recipesLoaded, searchString };
  },
};
</script>
