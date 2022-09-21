<template>
  <div class="sort-options" v-if="!mediumView">
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
    <div class="sort-type" v-if="showType">
      <input type="radio" id="sortAscending" value="a" v-model="sortType" />
      <label for="sortAscending">ascending</label>
      <input type="radio" id="sortDescending" value="d" v-model="sortType" />
      <label for="sortDescending">descending order</label>
    </div>
  </div>
  <div class="button" v-else>
    <base-button styleMode="outline" @click="setMobileMenu"
      >Sort options</base-button
    >
  </div>
  <mobile-menu v-if="mobileMenuOpened" @close-mobile-menu="setMobileMenu">
    <div class="mobile-sort">
      <p>Sort by:</p>
      <div>
        <input
          type="radio"
          id="sortNone"
          value="n"
          @click="turnOffSort"
          v-model="sortOption"
        />
        <label for="sortNone">none</label>
      </div>
      <div>
        <input type="radio" id="sortLabel" value="l" v-model="sortOption" />
        <label for="sortLabel">label</label>
      </div>
      <div class="mobile-margin">
        <input type="radio" id="sortSource" value="s" v-model="sortOption" />
        <label for="sortSource">source</label>
      </div>
      <p v-if="showType">In order:</p>
      <div class="sort-type" v-if="showType">
        <input type="radio" id="sortAscending" value="a" v-model="sortType" />
        <label for="sortAscending">ascending</label>
      </div>
      <div class="sort-type" v-if="showType">
        <input type="radio" id="sortDescending" value="d" v-model="sortType" />
        <label for="sortDescending">descending</label>
      </div>
    </div>
  </mobile-menu>
</template>
<script>
import { ref, computed, watch, onActivated, inject } from "vue";
import { useStore } from "vuex";
import { useRoute, onBeforeRouteLeave } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    const store = useStore();

    const mediumView = inject("medium-view");

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

    /////////////////////////////////////////////////////////////////////// open mobile menu
    const mobileMenuOpened = ref(false);
    const setMobileMenu = function () {
      mobileMenuOpened.value = !mobileMenuOpened.value;
    };

    /////////////////////////////////////////////////////////////////////// init - load setting on first mount

    loadSettings();

    return {
      sortOption,
      sortType,
      showType,
      turnOffSort,
      mediumView,
      setMobileMenu,
      mobileMenuOpened,
    };
  },
};
</script>

<style scoped>
.sort-options {
  display: flex;
  align-items: center;
  margin-top: 2rem;
  align-self: center;
}
.sort-options .space {
  margin-left: 2rem;
  padding: 0 2rem;
}
.sort-options p {
  font-size: 2rem;
}
.sort-options input {
  margin: 0 0.3rem 0 2.4rem;
  accent-color: var(--color-grad-2);
}
.sort-options label {
  font-size: 2rem;
}
.sort-options .sort-type {
  margin-left: 4rem;
}
.button {
  margin-top: 1rem;
}

.mobile-sort {
  color: var(--text-light);
  width: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}
.mobile-sort p {
  font-size: 3rem;
  margin-bottom: 2rem;
}
.mobile-sort label {
  font-size: 3rem;
  margin-left: 2rem;
}
.mobile-sort input {
  -ms-transform: scale(1.5);
  -webkit-transform: scale(1.5);
  transform: scale(1.5);
  accent-color: unset;
}
.mobile-sort input:focus {
  accent-color: unset;
}
.mobile-margin {
  margin-bottom: 5rem !important;
}
.mobile-sort div {
  margin-bottom: 2rem;
}
</style>
