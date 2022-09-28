import router from "@/router";
import { useRoute } from "vue-router";
import { EDAMAM_ID } from "../../../config.js";
import { EDAMAM_KEY } from "../../../config.js";
import { LABELS_ARR } from "../../../config.js";

export default {
  setSearchString(context, payload) {
    context.commit("setSearchString", payload.toLowerCase());
  },

  async fetchString(context) {
    const searchString = context.getters.searchString;

    //fetch
    context.commit("spinnerOn");

    let url = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchString}&app_id=${EDAMAM_ID}&app_key=${EDAMAM_KEY}`;

    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(
        data.message || "Failed to fetch data from server."
      );
      throw error;
    }

    let recipeArr = [];
    let unsortedRecipeArr = [];

    data.hits.forEach((item, index) => {
      let filteredLabels = [];

      LABELS_ARR.forEach((label) => {
        if (item.recipe.healthLabels.includes(label)) {
          filteredLabels.push(label.toLowerCase());
        }
      });

      const recipe = {
        id: item.recipe.uri.split("recipe_")[1],
        label: item.recipe.label,
        image: item.recipe.image,
        imageLarge: item.recipe.images.LARGE
          ? item.recipe.images.LARGE.url
          : item.recipe.image,
        source: item.recipe.source,
        calories: item.recipe.calories,
        healthLabels: filteredLabels,
        url: item.recipe.url,
        ingredients: item.recipe.ingredients,
        totalNutrients: item.recipe.totalNutrients,
        totalTime: item.recipe.totalTime,
        totalWeight: item.recipe.totalWeight,
        servings: item.recipe.yield,

        unsortedIndex: index.toString(),
      };
      recipeArr.push(recipe);
    });



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
    const sortOption = context.getters.getSortOption;
    let sortType = context.getters.getSortType;
    if (sortType === "n" && (sortOption === "l" || sortOption === "s")) {
      sortType = "a";
    }

    const filters = context.getters.getFilters;

    let charArr = [];
    filters.forEach((f) => {
      const char = f.slice(0, 1);
      charArr.push(char);
    });
    const filterParam = charArr.join("");

    const url = `/search/${input}&p=${page}$s=${sortOption}${sortType}!${filterParam}`;
    context.commit("setUrl", url);
    router.push(url);
  },

  initUrl(context) {
    const url = useRoute().path;
    context.commit("setUrl", url);
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

    const recipeArr = context.getters.getSearchList;
    if (sortOption === "l") {
      //sprawdz order
      if (sortType === "d") {
        recipeArr.sort((a, b) => b.label.localeCompare(a.label));
      } else {
        //
        recipeArr.sort((a, b) => a.label.localeCompare(b.label));
      }
    }
    ////////////////sort by source
    else if (sortOption === "s") {
      //sprawdz order
      if (sortType === "d") {
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
  },
  // filters
  changeFilters(context, payload) {
    context.commit("changeFilters", payload);
  },

  setNumberOfPages(context, payload) {
    context.commit("setNumberOfPages", payload);
  },

  listChange(context) {
    context.commit("listChange");
  },
  setUrl(context, payload) {
    context.commit("setUrl", payload);
  },
  setRecipeId(context, payload) {
    context.commit("setRecipe", payload);
  },
};
