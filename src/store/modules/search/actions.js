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
    console.log(data);
    // const recipe = data.hits.map((item) => {
    //   ({
    //     label: item.recipe.label,
    //     image: item.recipe.image,
    //     source: item.recipe.source,
    //     ingredients: item.recipe.ingredientLines,
    //   });
    // });

    let recipeArr = [];

    data.hits.forEach((item) => {
      const recipe = {
        label: item.recipe.label,
        image: item.recipe.image,
        source: item.recipe.source,
        ingredients: item.recipe.ingredientLines,
      };
      recipeArr.push(recipe);
    });
    context.commit("setSearchList", recipeArr);
    context.commit("spinnerOff");
  },
};
