<template>
  <div>
    <p>Sort by:</p>

    <input
      type="radio"
      id="sortNone"
      value="n"
      @click="turnOffSort"
      v-model="sortOption"
    />
    <label for="sortNone">none</label>

    <input type="radio" id="sortLabel" value="l" v-model="sortOption" />
    <label for="sortLabel">label</label>

    <input type="radio" id="sortSource" value="s" v-model="sortOption" />
    <label for="sortSource">source</label>
    <div v-if="showType">
      <p class="space"></p>
      <input type="radio" id="sortAscending" value="a" v-model="sortType" />
      <label for="sortAscending">ascending</label>
      <input type="radio" id="sortDescending" value="d" v-model="sortType" />
      <label for="sortDescending">descending order</label>
    </div>
  </div>
</template>
<script>
import { ref, computed, watch, onActivated } from "vue";
import { useStore } from "vuex";
import { useRoute, onBeforeRouteLeave } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    const store = useStore();

    const sortOption = ref("n");
    const sortType = ref("a");
    const showType = computed(function () {
      if (!sortOption.value || sortOption.value === "n") {
        return false;
      } else {
        return true;
      }
    });

    /////////////////////////////////////////////////////////////////////// when no sort

    const turnOffSort = function () {
      sortType.value = "n";
    };

    /////////////////////////////////////////////////////////////////////// change sort options

    let loadingStage = false;
    watch(
      [sortOption, sortType],
      () => {
        if (!loadingStage) {
          store.dispatch("search/setSortParams", [
            sortOption.value,
            sortType.value,
          ]);
          console.log("1 watch changes", sortOption.value, sortType.value);
          store.dispatch("search/generateSearchUrl");
        }
        loadingStage = false;
      },
      { flush: "post" }
    );

    /////////////////////////////////////////////////////////////////////// check if component is active

    onActivated(function () {
      active = true;
    });

    /////////////////////////////////////////////////////////////////////// deactivate when page changed

    onBeforeRouteLeave(function (_, from) {
      if (from.name === "search") {
        active = false;
      }
    });
    /////////////////////////////////////////////////////////////////////// check route changes

    const routeParam = computed(function () {
      return route.params.query;
    });
    let active = true;

    watch(routeParam, function () {
      if (active && routeParam.value) {
        const sortQuery = routeParam.value.slice(
          routeParam.value.indexOf("$") + 1
        );
        const sort = Array.from(
          sortQuery.slice(
            sortQuery.indexOf("=") + 1,
            sortQuery.indexOf("=") + 3
          )
        );

        //store url params as sort settings

        store.dispatch("search/setSortParams", sort);
        loadSettings();
        loadingStage = false;
      }
    });

    /////////////////////////////////////////////////////////////////////// load settings and change inputs

    const loadSettings = function () {
      const loadSortOption = store.getters["search/getSortOption"];
      if (loadSortOption !== sortOption.value) {
        if (loadSortOption && loadSortOption === "l") {
          sortOption.value = "l";
        } else if (loadSortOption && loadSortOption === "s") {
          sortOption.value = "s";
        } else {
          sortOption.value = "n";
        }
      }

      const loadSortType = store.getters["search/getSortType"];

      if (loadSortType !== sortType.value) {
        if (loadSortType && loadSortType === "a") {
          sortType.value = "a";
        } else if (loadSortType && loadSortType === "d") {
          sortType.value = "d";
        } else sortType.value = "n";
      }

      loadingStage = true;

      // sort

      store.dispatch("search/sort", [sortOption.value, sortType.value]);
    };

    /////////////////////////////////////////////////////////////////////// init - load setting on first mount

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
