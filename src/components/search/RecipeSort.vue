<template>
  <div>
    <p>Sort by:</p>
    <input
      type="radio"
      id="sortNone"
      value="none"
      v-model="sortOption"
      @click="turnOffSort"
    />
    <label for="sortNone">none</label>

    <input type="radio" id="sortLabel" value="label" v-model="sortOption" />
    <label for="sortLabel">label</label>

    <input type="radio" id="sortSource" value="source" v-model="sortOption" />
    <label for="sortSource">source</label>
    <div v-if="showType">
      <p class="space"></p>
      <input
        type="radio"
        id="sortAscending"
        value="ascending"
        v-model="sortType"
      />
      <label for="sortAscending">ascending</label>
      <input
        type="radio"
        id="sortDescending"
        value="descending"
        v-model="sortType"
      />
      <label for="sortDescending">descending order</label>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const sortOption = ref("none");
    const sortType = ref(null);
    const showType = computed(function () {
      if (!sortOption.value || sortOption.value === "none") {
        return false;
      } else {
        return true;
      }
    });

    /////////////////////////////////////////////////////////////////////// when no sort
    const turnOffSort = function () {
      sortType.value = null;
    };

    /////////////////////////////////////////////////////////////////////// force sort
    watch([sortOption, sortType], function () {
      store.dispatch("search/sort", [sortOption.value, sortType.value]);
    });

    /////////////////////////////////////////////////////////////////////// empty radio fix
    watch(sortOption, function () {
      if (!sortType.value) sortType.value = "ascending";
      if (sortOption.value === "none") sortType.value = null;
    });

    /////////////////////////////////////////////////////////////////////// set on route change
    const routeParam = computed(function () {
      return router.currentRoute.value.fullPath;
    });
    watch(routeParam, function () {
      loadSettings();
    });

    /////////////////////////////////////////////////////////////////////// load settings
    const loadSettings = function () {
      const loadSortOption = store.getters["search/getSortOption"];
      if (loadSortOption && loadSortOption === "l") {
        sortOption.value = "label";
      } else if (loadSortOption && loadSortOption === "s") {
        sortOption.value = "source";
      } else sortOption.value = "none";
      const loadSortType = store.getters["search/getSortType"];
      if (loadSortType && loadSortType === "a") {
        sortType.value = "ascending";
      } else if (loadSortType && loadSortType === "d") {
        sortType.value = "descending";
      } else sortType.value = null;
    };
    /////////////////////////////////////////////////////////////////////// init
    loadSettings();

    return { sortOption, sortType, showType, turnOffSort };
  },
};
</script>

<style scoped>
div {
  display: flex;
  align-items: center;
}
.space {
  margin-left: 2rem;
}
</style>
