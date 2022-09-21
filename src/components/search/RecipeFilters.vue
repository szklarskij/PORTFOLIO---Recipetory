<template>
  <div class="filters" v-if="!mediumView">
    <p>Filters:</p>
    <input
      type="checkbox"
      id="vegetarian"
      v-model="optionVegetarian"
      @click="optionClicked"
    />
    <label><base-badge type="vegetarian"></base-badge></label>
    <input
      type="checkbox"
      id="pescatarian"
      v-model="optionPescatarian"
      @click="optionClicked"
    />
    <label><base-badge type="pescatarian"></base-badge></label>
    <input
      type="checkbox"
      id="egg-free"
      v-model="optionEggFree"
      @click="optionClicked"
    />
    <label><base-badge type="egg-free"></base-badge></label>
    <input
      type="checkbox"
      id="alcohol-free"
      v-model="optionAlcoholFree"
      @click="optionClicked"
    />
    <label><base-badge type="alcohol-free"></base-badge></label>
  </div>
  <div v-else class="button">
    <base-button styleMode="outline" @click="setMobileMenu"
      >Filters</base-button
    >
  </div>
  <mobile-menu v-if="mobileMenuOpened" @close-mobile-menu="setMobileMenu">
    <div class="mobile-filter">
      <p>Filters:</p>
      <div>
        <input
          type="checkbox"
          id="vegetarian"
          v-model="optionVegetarian"
          @click="optionClicked"
        />
        <label><base-badge type="vegetarian"></base-badge></label>
      </div>
      <div>
        <input
          type="checkbox"
          id="pescatarian"
          v-model="optionPescatarian"
          @click="optionClicked"
        />
        <label><base-badge type="pescatarian"></base-badge></label>
      </div>
      <div>
        <input
          type="checkbox"
          id="egg-free"
          v-model="optionEggFree"
          @click="optionClicked"
        />
        <label><base-badge type="egg-free"></base-badge></label>
      </div>
      <div>
        <input
          type="checkbox"
          id="alcohol-free"
          v-model="optionAlcoholFree"
          @click="optionClicked"
        />
        <label><base-badge type="alcohol-free"></base-badge></label>
      </div>
    </div>
  </mobile-menu>
</template>
<script>
import {
  ref,
  reactive,
  toRefs,
  watch,
  computed,
  onActivated,
  inject,
} from "vue";
import { useStore } from "vuex";
import { useRoute, onBeforeRouteLeave } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    const store = useStore();

    const mediumView = inject("medium-view");

    const optionVegetarian = reactive({ id: "vegetarian", checked: false });
    const vegeRefs = toRefs(optionVegetarian);
    const optionPescatarian = reactive({ id: "pescatarian", checked: false });
    const pescaRefs = toRefs(optionPescatarian);
    const optionEggFree = reactive({ id: "egg-free", checked: false });
    const eggRefs = toRefs(optionEggFree);
    const optionAlcoholFree = reactive({ id: "alcohol-free", checked: false });
    const alcoRefs = toRefs(optionAlcoholFree);
    const optionsArray = [
      optionVegetarian,
      optionPescatarian,
      optionEggFree,
      optionAlcoholFree,
    ];
    ///////////////////////////////////////////////////////////////////////change filters
    let loadingStage = false;
    watch(
      [optionVegetarian, optionPescatarian, optionEggFree, optionAlcoholFree],
      function () {
        if (!loadingStage) {
          let filtersArray = [];
          store.dispatch("search/setSearchingPage", 1);
          optionsArray.forEach((opt) => {
            if (opt.checked) {
              filtersArray.push(opt.id);
            }
          });
          store.dispatch("search/changeFilters", filtersArray);
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
    ///////////////////////////////////////////////////////////////////////set on route change
    const routeParam = computed(function () {
      return route.params.query;
    });
    let active = true;

    watch(routeParam, function () {
      if ((active, routeParam.value)) {
        const query = route.params.query;
        const filterQuery = query.split("!")[1];

        let filterArr = [];

        if (filterQuery.includes("v")) filterArr.push("vegetarian");
        if (filterQuery.includes("p")) filterArr.push("pescatarian");
        if (filterQuery.includes("e")) filterArr.push("egg-free");
        if (filterQuery.includes("a")) filterArr.push("alcohol-free");
        store.dispatch("search/changeFilters", filterArr);

        loadSettings();
        loadingStage = false;
      }
    });

    ///////////////////////////////////////////////////////////////////////load settings
    const loadSettings = function () {
      const filters = store.getters["search/getFilters"].join(",");

      if (filters.includes("vegetarian")) {
        optionVegetarian.checked = true;
      } else {
        optionVegetarian.checked = false;
      }
      if (filters.includes("pescatarian")) {
        optionPescatarian.checked = true;
      } else {
        optionPescatarian.checked = false;
      }
      if (filters.includes("egg-free")) {
        optionEggFree.checked = true;
      } else {
        optionEggFree.checked = false;
      }
      if (filters.includes("alcohol-free")) {
        optionAlcoholFree.checked = true;
      } else {
        optionAlcoholFree.checked = false;
      }
    };
    /////////////////////////////////////////////////////////////////////// open mobile menu
    const mobileMenuOpened = ref(false);
    const setMobileMenu = function () {
      mobileMenuOpened.value = !mobileMenuOpened.value;
    };
    /////////////////////////////////////////////////////////////////////// init
    loadSettings();

    return {
      optionVegetarian: vegeRefs.checked,
      optionPescatarian: pescaRefs.checked,
      optionEggFree: eggRefs.checked,
      optionAlcoholFree: alcoRefs.checked,
      mediumView,
      setMobileMenu,
      mobileMenuOpened,
    };
  },
};
</script>
<style scoped>
.filters {
  display: flex;
  align-items: center;
  /* margin-top: 2rem; */
  margin: 0.6rem 0 4rem;
}

p {
  font-size: 2rem;
  margin-right: 2rem;
}
input {
  margin: 0 0.3rem 0 1rem;
  accent-color: var(--color-grad-2);
}
label {
  font-size: 2rem;
}
.button {
  margin-top: 1rem;
}

.mobile-filter {
  color: var(--text-light);
  width: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}

.mobile-filter p {
  font-size: 3rem;
  margin-bottom: 2rem;
}
.mobile-filter label {
  font-size: 3rem;
  margin-left: 2rem;
}
.mobile-filter div {
  margin-bottom: 2rem;
}
.mobile-filter input {
  -ms-transform: scale(2);
  -webkit-transform: scale(2);
  transform: scale(2);
  accent-color: unset;
}
.mobile-filter input:focus {
  /* accent-color: var(--color-grad-2); */
}
</style>
