<template>
  <section>
    <div v-if="isLoading && !failedFetch">
      <base-spinner></base-spinner>
    </div>
    <transition-group tag="ul" name="search-transition">
      <base-container v-if="!isLoading && !failedFetch">
        <div class="padding" v-if="!recipesLoaded">
          <h2>Recipes not found!</h2>
          <p>Please input another keywords</p>
        </div>
        <div class="padding" v-else>
          <h2>Recipes has been found!</h2>
          <p>Showing results of "{{ searchString }}"</p>
          <recipe-sort></recipe-sort>
          <recipe-filters></recipe-filters>
          <transition-group tag="ul" name="recipe-list">
            <recipe-item
              v-for="recipe in recipes"
              :key="recipe.id"
              :label="recipe.label"
              :image="recipe.image"
              :source="recipe.source"
              :healthLabels="recipe.healthLabels"
              :id="recipe.id"
            ></recipe-item>
          </transition-group>
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
      <base-container v-else-if="failedFetch">
        <div>
          <h2>Something goes wrong!</h2>
          <p>Check your internet connnection and try again.</p>
        </div>
      </base-container>
    </transition-group>
  </section>
</template>
<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import RecipeItem from "../../components/search/RecipeItem.vue";
import RecipeSort from "../../components/search/RecipeSort.vue";
import RecipeFilters from "../../components/search/RecipeFilters.vue";
import useValidateInput from "../../hooks/validateInput.js";

export default {
  components: { RecipeItem, RecipeSort, RecipeFilters },
  name: "recipe-results",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const failedFetch = ref(false);

    const searchString = computed(function () {
      return store.getters["search/searchString"];
    });
    const recipesLoaded = computed(function () {
      return store.getters["search/recipesLoaded"];
    });
    const isLoading = computed(function () {
      return store.getters["search/isSearchingListLoading"];
    });

    /////////////////////////////////////////////////////////////////////// set params on load

    const setParamsOnLoad = function () {
      const query = route.params.query;

      //recipe
      let recipeQuery;
      if (query.includes("&") && query.includes("$") && query.includes("!")) {
        recipeQuery = route.params.query.slice(0, query.indexOf("&"));
      } else router.replace("/invalidUrl");

      if (!useValidateInput(recipeQuery, store)) {
        router.replace("/search");
        return;
      }
      store.dispatch("search/setSearchString", recipeQuery);

      //page

      const pageQuery = route.params.query.slice(query.indexOf("&") + 1);
      const page = pageQuery.slice(
        pageQuery.indexOf("=") + 1,
        pageQuery.indexOf("$")
      );
      if (+page) store.dispatch("search/setSearchingPage", +page);

      //sorting

      const sortQuery = route.params.query.slice(query.indexOf("$") + 1);
      const sort = Array.from(
        sortQuery.slice(sortQuery.indexOf("=") + 1, sortQuery.indexOf("=") + 3)
      );

      store.dispatch("search/setSortParams", sort);

      //filters

      const filterQuery = query.split("!")[1];
      if (!filterQuery) return;
      let filterArr = [];

      if (filterQuery.includes("v")) filterArr.push("vegetarian");
      if (filterQuery.includes("p")) filterArr.push("pescatarian");
      if (filterQuery.includes("e")) filterArr.push("egg-free");
      if (filterQuery.includes("a")) filterArr.push("alcohol-free");
      store.dispatch("search/changeFilters", filterArr);
    };

    /////////////////////////////////////////////////////////////////////// set params on load

    const routeParam = computed(function () {
      return route.params.query;
    });

    watch(
      routeParam,
      function () {
        if (routeParam.value) {
          setParamsOnLoad();
        }
      },
      { flush: "post" }
    );

    /////////////////////////////////////////////////////////////////////// fetch

    const fetch = async function () {
      let query;
      const loadQuery = route.params.query;
      if (!loadQuery) {
        query = store.getters["search/getUrl"];
      } else query = loadQuery;

      try {
        const searchString = query.split("&")[0];
        await store.dispatch("search/fetchString", searchString);
      } catch (error) {
        failedFetch.value = true;
        store.dispatch("search/setError", error);
      }
      store.dispatch("search/spinnerOff");
    };

    /////////////////////////////////////////////////////////////////////// fetch when component loaded

    const checkForceFetch = computed(function () {
      return store.getters["search/checkForceFetch"];
    });

    watch(
      checkForceFetch,
      function () {
        fetch();
      },
      { flush: "post" }
    );

    /////////////////////////////////////////////////////////////////////// pagination

    const currPageShow = computed(function () {
      return store.getters["search/getSearchPage"];
    });
    const numOfPagesShow = computed(function () {
      return store.getters["search/getNumberOfPages"];
    });
    const updateReactiveList = function (page = 1, filt) {
      // filter

      let zeroMatches = false;
      let results = [];
      const searchL = store.getters["search/getSearchList"];
      const filters = filt;
      if (filters.length > 0) {
        searchL.forEach((recipe) => {
          const filterPass = filters.every((filter) => {
            return recipe.healthLabels.includes(filter);
          });
          if (filterPass) {
            results.push(recipe);
          } else {
            zeroMatches = true;
          }
        });
      } else results = store.getters["search/getSearchList"];

      // sort => actions sort

      // results on page

      const resultsPerPage = store.getters["search/getResultsPerPage"];

      store.dispatch("search/setSearchingPage", page);
      const start = (page - 1) * resultsPerPage; //// przeniesc do configa
      const end = page * resultsPerPage;
      ///buttons
      const numPages = Math.ceil(results.length / resultsPerPage);
      store.dispatch("search/setNumberOfPages", numPages);

      if (numPages < store.getters["search/getSearchPage"] && !zeroMatches) {
        router.push("/*");
      }

      store.dispatch("search/setSearchListResults", results.slice(start, end));
      //one page and more
      if (page === 1 && numPages > 1) {
        store.dispatch("search/setPaginationStatus", "moreThan1Pages");
      }

      //last page
      else if (page === numPages && numPages !== 1) {
        store.dispatch("search/setPaginationStatus", "lastPage");
      }
      //other pages
      else if (page < numPages) {
        store.dispatch("search/setPaginationStatus", "otherPages");
      }

      //only one page
      else {
        store.dispatch("search/setPaginationStatus", "onePage");
      }
      return store.getters["search/getSearchListResults"];
    };

    /////////////////////////////////////////////////////////////////////// pagination buttons

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

    // change pages

    const nextPage = function () {
      const page = store.getters["search/getSearchPage"];
      store.dispatch("search/setSearchingPage", page + 1);
      store.dispatch("search/generateSearchUrl");
    };
    const prevPage = function () {
      router;
      const page = store.getters["search/getSearchPage"];
      store.dispatch("search/setSearchingPage", page - 1);
      store.dispatch("search/generateSearchUrl");
    };

    /////////////////////////////////////////////////////////////////////// show list

    const recipes = computed(function () {
      const page = store.getters["search/getSearchPage"];
      const filters = store.getters["search/getFilters"];

      return updateReactiveList(page, filters);
    });

    /////////////////////////////////////////////////////////////////////// init

    setParamsOnLoad();
    fetch();
    return {
      recipesLoaded,
      searchString,
      fetch,
      isLoading,
      recipes,
      prevButtonVisible,
      nextButtonVisible,
      nextPage,
      prevPage,
      currPageShow,
      numOfPagesShow,
      failedFetch,
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
.padding {
  padding: 1rem;
}
ul {
  padding: 0 0 0 1rem;
}

.search-transition-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.search-transition-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.search-transition-enter-active {
  transition: all 0.3s ease-out;
}
.search-transition-leave-active {
  transition: all 0.3s ease-in;
}
.search-transition-enter-to,
.search-transition-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.recipe-list-enter-from {
  opacity: 0;
}

.recipe-list-enter-active {
  transition: all 1s ease-out;
}

.recipe-list-enter-to,
.recipe-list-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.recipe-list-leave-active {
  transition: all 1s ease-in;
  position: absolute;
}

.recipe-list-leave-to {
  opacity: 0;
}

.recipe-list-move {
  transition: transform 0.8s ease;
}
</style>
