<template>
  <div class="filters">
    <div
      v-for="option in options"
      :id="option.label"
      :label="option.label"
      :key="option.id"
    >
      <input type="checkbox" v-model="option.checked" :value="option" />
      <label
        ><base-badge :type="option.label">{{ option.label }}</base-badge></label
      >
    </div>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const options = ref([
      { label: "vegetarian", id: "vegetarian", checked: false },
      { label: "pescatarian", id: "pescatarian", checked: false },
      { label: "egg-free", id: "egg-free", checked: false },
      { label: "alcohol-free", id: "alcohol-free", checked: false },
    ]);

    watch(options.value, function () {
      let filtersArray = [];
      store.dispatch("search/setSearchingPage", 1);
      options.value.forEach((opt) => {
        if (opt.checked) {
          filtersArray.push(opt.label);
        }
      });
      store.dispatch("search/changeFilters", filtersArray);
      store.dispatch("search/generateSearchUrl");
    });
    return { options };
  },
};
</script>
<style scoped>
.filters {
  display: flex;
}
</style>
