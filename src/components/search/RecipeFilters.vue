<template>
  <div class="filters">
    <p>Filters:</p>
    <div
      v-for="option in options"
      :id="option.label"
      :label="option.label"
      :key="option.id"
    >
      <input type="checkbox" v-model="option.checked" :value="option.label" />
      <label
        ><base-badge :type="option.label">{{ option.label }}</base-badge></label
      >
    </div>
  </div>
</template>
<script>
import { watch, computed, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const options = reactive([
      reactive({ label: "vegetarian", id: "vegetarian", checked: false }),
      reactive({ label: "pescatarian", id: "pescatarian", checked: false }),
      reactive({ label: "egg-free", id: "egg-free", checked: false }),
      reactive({ label: "alcohol-free", id: "alcohol-free", checked: false }),
    ]);

    watch(options, function () {
      let filtersArray = [];
      store.dispatch("search/setSearchingPage", 1);
      options.forEach((opt) => {
        if (opt.checked) {
          filtersArray.push(opt.label);
        }
      });
      store.dispatch("search/changeFilters", filtersArray);
      store.dispatch("search/generateSearchUrl");
    });
    ///load
    const loadFilters = function () {
      const filters = store.getters["search/getFilters"].join(",");
      if (filters.includes("vegetarian")) options[0].checked = true;
      if (filters.includes("pescatarian")) options[1].checked = true;
      if (filters.includes("egg-free")) options[2].checked = true;
      if (filters.includes("alcohol-free")) options[3].checked = true;
    };
    const routeParam = computed(function () {
      return router.currentRoute.value.fullPath;
    });
    watch(routeParam, function () {
      loadSettings();
    });

    const loadSettings = function () {
      loadFilters();
    };
    loadFilters();

    return { options };
  },
};
</script>
<style scoped>
.filters {
  display: flex;
  align-items: center;
}
</style>
