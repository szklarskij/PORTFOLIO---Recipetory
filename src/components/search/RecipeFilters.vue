<template>
  <div class="filters">
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
</template>
<script>
import { reactive, toRefs, watch, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();

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
    watch(
      [optionVegetarian, optionPescatarian, optionEggFree, optionAlcoholFree],
      function () {
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
    );

    ///////////////////////////////////////////////////////////////////////set on route change
    const routeParam = computed(function () {
      return router.currentRoute.value.fullPath;
    });
    watch(routeParam, function () {
      loadFilters();
    });

    ///////////////////////////////////////////////////////////////////////load settings
    const loadFilters = function () {
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
        optionEggFree.checked = false;
      }
    };

    /////////////////////////////////////////////////////////////////////// init
    loadFilters();

    return {
      optionVegetarian: vegeRefs.checked,
      optionPescatarian: pescaRefs.checked,
      optionEggFree: eggRefs.checked,
      optionAlcoholFree: alcoRefs.checked,
    };
  },
};
</script>
<style scoped>
.filters {
  display: flex;
  align-items: center;
}
</style>
