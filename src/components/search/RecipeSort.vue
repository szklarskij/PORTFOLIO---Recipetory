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
import { ref, computed, watch, onUpdated } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
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

    /////////////////////////////////////////////////////////////////////// force sort
    let loadingStage = false;
    watch(
      [sortOption, sortType],
      (newValue, oldValue) => {
        console.log("WATCHERRRRR");
        if (!loadingStage) {
          console.log(newValue, oldValue);
          // const oldSortType = store.getters["search/getSortType"];
          // const oldSortOption = store.getters["search/getSortOption"];
          // if (
          //   oldSortType === sortType.value &&
          //   oldSortOption === sortOption.value
          // ) {
          //   return console.log("stop");
          // }

          // console.log("1 - click");
          store.dispatch("search/setSortParams", [
            sortOption.value,
            sortType.value,
          ]);
          console.log("1 watch changes", sortOption.value, sortType.value);
          store.dispatch("search/generateSearchUrl");
        }
        loadingStage = false;
        // console.log();
        // if (newValue === oldValue) return;

        //
      },
      { flush: "post" }
    );

    /////////////////////////////////////////////////////////////////////// empty radio fix
    // watch(sortOption, function () {
    //   if (!sortType.value) sortType.value = "a";
    //   if (sortOption.value === "n") sortType.value = "n";
    // });

    /////////////////////////////////////////////////////////////////////// set on route change
    const routeParam = computed(function () {
      // console.log(route.params.query);
      return route.params.query;
    });

    onUpdated(() => {
      //   disableWatchParam = true;
      //   console.log("onupdated");
      //   // loadingStage = true;
      //   store.dispatch("search/sort", [sortOption.value, sortType.value]);
    });
    watch(routeParam, function () {
      console.log("param change");

      // console.log("tutaj load powinien byc");
      // loadingStage = true;
      const sortQuery = route.params.query.slice(
        route.params.query.indexOf("$") + 1
      );
      const sort = Array.from(
        sortQuery.slice(sortQuery.indexOf("=") + 1, sortQuery.indexOf("=") + 3)
      );
      // console.log();
      store.dispatch("search/setSortParams", sort);
      // console.log(sortOption.value, sortType.value);
      loadSettings();
      loadingStage = false;

      // if (loadSettings)
      // if (routeParam.value)
      //   console.log("tutaj load powinien byc", loadingStage);
      // loadSettings();
    });
    const listChange = computed(function () {
      return store.getters["search/getListChange"];
    });

    watch(listChange, function () {
      // console.log("sort update!!!!!!!!!!!!!!!!!!!");
      // loadSettings();
    });

    /////////////////////////////////////////////////////////////////////// load settings
    const loadSettings = function () {
      console.log(
        "////////////////////load sort settings",
        store.getters["search/getSortOption"]
      );
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

      ///// tutaj nowy sort
      store.dispatch("search/sort", [sortOption.value, sortType.value]);
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
