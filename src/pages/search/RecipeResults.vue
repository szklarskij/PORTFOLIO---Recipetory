<template>
  <section>
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
    <base-container v-else>
      <div v-if="!recipesLoaded">
        <h2>Recipes not found!</h2>
        <p>Please input another keywords</p>
      </div>
      <div v-else>
        <h2>Recipes has been found!</h2>
        <p>Showing resoults of "{{ searchString }}"</p>
        <ul>
          <recipe-item
            v-for="recipe in recipes"
            :key="recipe.id"
            :label="recipe.label"
            :image="recipe.image"
            :source="recipe.source"
          ></recipe-item>
        </ul>
      </div>
    </base-container>
  </section>
</template>
<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import RecipeItem from "../../components/search/RecipeItem.vue";

export default {
  components: { RecipeItem },
  setup() {
    const route = useRoute();
    const store = useStore();

    const searchString = computed(function () {
      return store.getters["search/searchString"];
    });
    const recipesLoaded = computed(function () {
      return store.getters["search/recipesLoaded"];
    });
    /////
    const isLoading = computed(function () {
      return store.getters["search/isSearchingListLoading"];
    });

    //////////////////// show list
    const recipes = computed(function () {
      return store.getters["search/getSearchList"];
    });
    //////////////////// fetch

    const fetch = async function () {
      //validacja
      if (!validateInput(route.params.query)) {
        return;
      }
      //fetch
      try {
        const searchString = route.params.query;
        await store.dispatch("search/setSearchString", searchString);
      } catch (error) {
        store.dispatch("search/setError", error);
      }
      store.dispatch("search/spinnerOff");
    };

    const validateInput = function (string) {
      if (string.length < 3) {
        store.dispatch("search/setError", "Please input at least 3 characters");
        return false;
      } else {
        return true;
      }
    };
    watch(
      () => route.params.query,
      () => {
        console.log("route change");
        fetch();
      }
    );
    fetch();

    /// errors
    const isError = computed(function () {
      return store.getters["search/isError"];
    });
    const handleError = function () {
      store.dispatch("search/setError", null);
    };

    return {
      recipesLoaded,
      searchString,
      fetch,
      isLoading,
      isError,
      handleError,
      recipes,
    };
  },
};
</script>
