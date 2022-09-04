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

    ///////////////////// paginacja;

    let numOfPages = null;
    const currPageShow = computed(function () {
      return store.getters["search/getSearchPage"];
    });
    const numOfPagesShow = computed(function () {
      return numOfPages;
    });
    const getSearchResultPage = function (page = 1) {
      const results = store.getters["search/getSearchList"];
      const resultsPerPage = store.getters["search/getResultsPerPage"];
      // console.log(store.getters["search/getSearchList"]);

      store.dispatch("search/setSearchingPage", page);
      const start = (page - 1) * resultsPerPage; //// przeniesc do configa
      const end = page * resultsPerPage;
      ///buttons
      const numPages = Math.ceil(results.length / resultsPerPage);
      numOfPages = numPages;
      store.dispatch("search/setSearchListResults", results.slice(start, end));
      //strona 1 i więcej stron
      console.log(numPages);
      if (page === 1 && numPages > 1) {
        store.dispatch("search/setPaginationStatus", "moreThan1Pages");
      }

      //ostatnia strona
      else if (page === numPages && numPages !== 1) {
        console.log("ostatnia strona");
        store.dispatch("search/setPaginationStatus", "lastPage");
      }
      //inne strony
      else if (page < numPages) {
        store.dispatch("search/setPaginationStatus", "otherPages");
      }
      //tylko strona 1
      else {
        console.log("tylko 1 s");
        store.dispatch("search/setPaginationStatus", "onePage");
      }
      return store.getters["search/getSearchListResults"];
    };
    // const resultsOnPages = computed(function () {
    //   console.log(store.getters["search/getSearchListResults"]);
    //   return store.getters["search/getSearchListResults"];
    // });
    //////////////////// pag buttons
    const prevButtonVisible = computed(function () {
      const status = store.getters["search/getPaginationStatus"];

      if (status === "lastPage" || status === "otherPage") {
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
    };
    const prevPage = function () {
      const page = store.getters["search/getSearchPage"];
      store.dispatch("search/setSearchingPage", page - 1);
    };
    ////////////////// show list
    const recipes = computed(function () {
      const page = store.getters["search/getSearchPage"];
      return getSearchResultPage(page);
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
