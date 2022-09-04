// import { EDAMAM_ID } from "../../../config.js";

export default {
  async setSearchString(context, payload) {
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
};
