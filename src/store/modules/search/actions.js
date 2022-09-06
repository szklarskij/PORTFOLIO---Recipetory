// import { EDAMAM_ID } from "../../../config.js";

import router from "@/router";

// import { useRoute, useRouter } from "vue-router";
export default {
  setSearchString(context, payload) {
    context.commit("setSearchString", payload);
  },

  async fetchString(context) {
    // context.commit("setSearchString", payload);
    const searchString = context.getters.searchString;
    context.commit("spinnerOn");

    //fetch

    let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchString}&app_id=f71a3a7b&app_key=5f2135c7e0a7cb360b90cd46b9437971`;

    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();

    let recipeArr = [];
    let unsortedRecipeArr = [];

    data.hits.forEach((item, index) => {
      const labelArr = [
        "Vegetarian",
        "Pescatarian",
        "Egg-Free",
        "Alcohol-Free",
      ];
      let filteredLabels = [];

      labelArr.forEach((label) => {
        if (item.recipe.healthLabels.includes(label)) {
          filteredLabels.push(label.toLowerCase());
        }
      });

      const recipe = {
        label: item.recipe.label,
        image: item.recipe.image,
        source: item.recipe.source,
        calories: item.recipe.calories,
        healthLabels: filteredLabels,
        url: item.recipe.url,
        unsortedIndex: index.toString(),
      };

      recipeArr.push(recipe);
      // unsortedRecipeArr.push(recipe);
    });
    context.commit("clearInput");
    context.commit("setSearchList", recipeArr);
    context.commit("setUnsortedList", unsortedRecipeArr);
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
  forceFetch(context, payload) {
    context.commit("forceFetch", payload);
  },
  generateSearchUrl(context) {
    const input = context.getters.searchString;
    const page = context.getters.getSearchPage;
    const sortOption = context.getters.getSortOption.slice(0, 1);
    let sortType = context.getters.getSortType;
    if (!sortType) {
      sortType = "n";
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
    // const unsorted = context.getters.getSearchListUnsorted;

    const recipeArr = context.getters.getSearchList;
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
    else if (sortOption === "source") {
      //sprawdz order
      if (sortType === "descending") {
        recipeArr.sort((a, b) => b.source.localeCompare(a.source));
      } else {
        //
        recipeArr.sort((a, b) => a.source.localeCompare(b.source));
      }
    }
    ////////////////no sort
    else {
      recipeArr.sort((a, b) =>
        a.unsortedIndex.localeCompare(b.unsortedIndex, undefined, {
          numeric: true,
        })
      );
    }
    // console.log("genrating on sort");
    context.dispatch("generateSearchUrl");
  },
  // filters
  changeFilters(context, payload) {
    context.commit("changeFilters", payload);
    // const filters = payload;
    // let recipeArr = context.getters.getSearchList;
    // console.log(recipeArr);
    // recipeArr.filter((recipe) => {
    //   recipe.label.length > 1;
    // });
    // console.log(recipeArr);
  },

  setNumberOfPages(context, payload) {
    context.commit("setNumberOfPages", payload);
  },
};
