<template>
  <div>
    <base-dialog
      :show="!!isError"
      title="An error occured!"
      @close="handleError"
    >
      <p>{{ isError }}</p>
    </base-dialog>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>

    <search-list v-if="!isLoading"></search-list>
  </div>
</template>

<script>
// import { useStore } from "vuex";
import { computed } from "vue";
import { useStore } from "vuex";

import SearchList from "./SearchList.vue";

export default {
  components: { SearchList },
  setup() {
    const store = useStore();

    //loading spinner

    const isLoading = computed(function () {
      return store.getters["search/isSearchingListLoading"];
    });

    //errors
    const isError = computed(function () {
      return store.getters["search/isError"];
    });
    const handleError = function () {
      store.dispatch("search/setError", null);
    };

    //check list

    const recipesLoaded = computed(function () {
      return store.getters["search/recipesLoaded"];
    });
    return { isLoading, isError, handleError, recipesLoaded };
  },
};
</script>
