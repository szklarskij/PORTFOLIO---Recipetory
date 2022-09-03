<template>
  <div>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <p>SEARCH</p>
  </div>
</template>

<script>
// import { useStore } from "vuex";
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();

    //loading spinner

    const isLoading = computed(function () {
      return store.getters["search/isSearchingListLoading"];
    });
    return { isLoading };
  },
};
</script>
