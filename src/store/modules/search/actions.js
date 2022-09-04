// import { EDAMAM_ID } from "../../../config.js";

import router from "@/router";

// import { useRoute, useRouter } from "vue-router";
export default {
  setSearchString(context, payload) {
    context.commit("setSearchString", payload);
  },

  async fetchString(context, payload) {
    context.commit("setSearchString", payload);

    context.commit("spinnerOn");

    //fetch

    let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${payload}&app_id=f71a3a7b&app_key=5f2135c7e0a7cb360b90cd46b9437971`;

    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();

    let recipeArr = [];

    data.hits.forEach((item) => {
      const recipe = {
        label: item.recipe.label,
        image: item.recipe.image,
        source: item.recipe.source,
      };
      recipeArr.push(recipe);
    });
    // context.dispatch("sort", [
    //   context.getters["search/getSortOption"],
    //   context.getters["search/getSortType"],
    // ]);

    context.commit("setSearchList", recipeArr);
  },
  setError(context, payload) {
    context.commit("setError", payload);
  },
  spinnerOff(context) {
    context.commit("spinnerOff");
  },
  resetSearchList(context) {
    context.commit("setSearchList", []);
  },
  setSearchingPage(context, payload) {
    context.commit("setSearchingPage", payload);
  },
  setPaginationStatus(context, payload) {
    context.commit("setPaginationStatus", payload);
  },
  setSearchListResults(context, payload) {
    // console.log(payload);
    context.commit("setSearchListResults", payload);
  },
  setSearchListToUnsorted(context) {
    context.commit("setSearchListToUnsorted");
  },

  generateSearchUrl(context) {
    const input = context.getters.searchString;
    const page = context.getters.getSearchPage;
    const sortOption = context.getters.getSortOption.slice(0, 1);
    let sortType = context.getters.getSortType;
    if (!sortType) {
      sortType = "a";
    } else {
      sortType = context.getters.getSortType.slice(0, 1);
    }

    const url = `/search/${input}&p=${page}$s=${sortOption}${sortType}`;
    router.push(url);
  },
  /////////////////sort
  setSortParams(context, payload) {
    context.commit("setSortParams", payload);
  },
  sort(context, payload) {
    context.commit("setSortParams", payload);

    const sortOption = payload[0];
    const sortType = payload[1];
    const unsorted = context.getters.getSearchListUnsorted;

    const recipeArr = context.getters.getSearchListResults;
    if (sortOption === "label") {
      //sprawdz order
      if (sortType === "descending") {
        recipeArr.sort((a, b) => b.label.localeCompare(a.label));
      } else {
        //
        recipeArr.sort((a, b) => a.label.localeCompare(b.label));
      }
    }
    ////////////////sort by source
    if (sortOption === "source") {
      //sprawdz order
      if (sortType === "descending") {
        recipeArr.sort((a, b) => b.source.localeCompare(a.source));
      } else {
        //
        recipeArr.sort((a, b) => a.source.localeCompare(b.source));
      }
    }
    ////////////////no sort
    if (!sortOption || sortOption === "none") {
      context.commit("setSearchListResults", unsorted);
    }
    context.dispatch("generateSearchUrl");
  },
};
