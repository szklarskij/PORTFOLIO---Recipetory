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
        <p>Showing results of "{{ searchString }}"</p>
        <recipe-sort></recipe-sort>
        <recipe-filters></recipe-filters>
        <ul>
          <recipe-item
            v-for="recipe in recipes"
            :key="recipe.label"
            :label="recipe.label"
            :image="recipe.image"
            :source="recipe.source"
            :healthLabels="recipe.healthLabels"
          ></recipe-item>
        </ul>
        <div class="pagination">
          <div class="prev-btn">
            <base-button
              @click="prevPage"
              mode="outline"
              v-if="prevButtonVisible"
              >Previous</base-button
            >
          </div>
          <p v-if="prevButtonVisible || nextButtonVisible">
            {{ currPageShow }}/{{ numOfPagesShow }}
          </p>
          <div class="next-btn">
            <base-button
              @click="nextPage"
              mode="outline"
              v-if="nextButtonVisible"
              >Next</base-button
            >
          </div>
        </div>
      </div>
    </base-container>
  </section>
</template>
<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import RecipeItem from "../../components/search/RecipeItem.vue";
import RecipeSort from "../../components/search/RecipeSort.vue";
import RecipeFilters from "../../components/search/RecipeFilters.vue";

export default {
  components: { RecipeItem, RecipeSort, RecipeFilters },

  setup() {
    const route = useRoute();
    const router = useRouter();
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
    //////////////////// set params on load
    const setParamsOnLoad = function () {
      const query = route.params.query;
      //recipe
      const recipeQuery = route.params.query.slice(0, query.indexOf("&"));

      store.dispatch("search/setSearchString", recipeQuery);
      //page
      const pageQuery = route.params.query.slice(query.indexOf("&") + 1);
      const page = pageQuery.slice(
        pageQuery.indexOf("=") + 1,
        pageQuery.indexOf("=") + 2
      );
      if (+page) store.dispatch("search/setSearchingPage", +page);
      //sorting
      const sortQuery = route.params.query.slice(query.indexOf("$") + 1);
      const sort = Array.from(
        sortQuery.slice(sortQuery.indexOf("=") + 1, sortQuery.indexOf("=") + 3)
      );
      store.dispatch("search/setSortParams", sort);

      // store.dispatch("search/generateSearchUrl");
    };
    //////////////////// fetch

    const fetch = async function () {
      //validacja
      const query = route.params.query.split("&")[0];

      if (!validateInput(query)) {
        return;
      }
      //fetch
      try {
        const searchString = query;
        await store.dispatch("search/fetchString", searchString);
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

    setParamsOnLoad();
    fetch();
    ////////////////fetching gdy komponent załadowany
    const checkForceFetch = computed(function () {
      return store.getters["search/checkForceFetch"];
    });

    watch(checkForceFetch, function () {
      fetch();
    });

    const isError = computed(function () {
      return store.getters["search/isError"];
    });
    const handleError = function () {
      store.dispatch("search/setError", null);
    };

    ///////////////////// paginacja;

    const currPageShow = computed(function () {
      return store.getters["search/getSearchPage"];
    });
    const numOfPagesShow = computed(function () {
      return store.getters["search/getNumberOfPages"];
    });
    const setPagesAndFilter = function (page = 1) {
      //filter
      let results = [];
      const searchL = store.getters["search/getSearchList"];
      const filters = store.getters["search/getFilters"];
      if (filters.length > 0) {
        searchL.forEach((recipe) => {
          filters.forEach((filter) => {
            // console.log(recipe.healthLabels);
            console.log(
              recipe.healthLabels,
              filter,
              recipe.healthLabels.includes(filter)
            );
            if (
              recipe.healthLabels.includes(filter) &&
              !results.includes(recipe)
            ) {
              results.push(recipe);
            }
          });
        });
      } else results = store.getters["search/getSearchList"];
      console.log(results);
      const resultsPerPage = store.getters["search/getResultsPerPage"];

      store.dispatch("search/setSearchingPage", page);
      const start = (page - 1) * resultsPerPage; //// przeniesc do configa
      const end = page * resultsPerPage;
      ///buttons
      const numPages = Math.ceil(results.length / resultsPerPage);
      store.dispatch("search/setNumberOfPages", numPages);

      if (numPages < store.getters["search/getSearchPage"]) {
        router.push("/*");
      }

      store.dispatch("search/setSearchListResults", results.slice(start, end));
      //strona 1 i więcej stron
      if (page === 1 && numPages > 1) {
        store.dispatch("search/setPaginationStatus", "moreThan1Pages");
      }

      //ostatnia strona
      else if (page === numPages && numPages !== 1) {
        store.dispatch("search/setPaginationStatus", "lastPage");
      }
      //inne strony
      else if (page < numPages) {
        store.dispatch("search/setPaginationStatus", "otherPages");
      }
      //tylko strona 1
      else {
        store.dispatch("search/setPaginationStatus", "onePage");
      }
      return store.getters["search/getSearchListResults"];
    };
    ////////////////////sprawdz czy zła strona

    // watch(
    //   () => store.getters["search/getSearchPage"],
    //   () => {
    //     // const query = route.params.query.split("&")[0];
    //     console.log("jest");
    //   }
    // );
    //////////////////// pag buttons
    const prevButtonVisible = computed(function () {
      const status = store.getters["search/getPaginationStatus"];

      if (status === "lastPage" || status === "otherPages") {
        return true;
      } else return false;
    });
    const nextButtonVisible = computed(function () {
      const status = store.getters["search/getPaginationStatus"];
      if (status === "moreThan1Pages" || status === "otherPages") {
        return true;
      } else return false;
    });
    //////////////////// pag buttons zmiana strony
    const nextPage = function () {
      const page = store.getters["search/getSearchPage"];
      store.dispatch("search/setSearchingPage", page + 1);
      store.dispatch("search/generateSearchUrl");
    };
    const prevPage = function () {
      const page = store.getters["search/getSearchPage"];
      store.dispatch("search/setSearchingPage", page - 1);
      store.dispatch("search/generateSearchUrl");
    };

    ////////////////// show list
    const recipes = computed(function () {
      const page = store.getters["search/getSearchPage"];
      return setPagesAndFilter(page);
    });
    return {
      recipesLoaded,
      searchString,
      fetch,
      isLoading,
      isError,
      handleError,
      recipes,
      prevButtonVisible,
      nextButtonVisible,
      nextPage,
      prevPage,
      currPageShow,
      numOfPagesShow,
    };
  },
};
</script>
<style scoped>
.pagination {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.next-btn {
  margin: auto 0 auto auto;
}
p {
  justify-self: center;
}
</style>
