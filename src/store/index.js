import { createStore } from "vuex";

import searchModule from "./modules/search/index.js";
import recipeModule from "./modules/recipe/index.js";

const store = createStore({
  modules: {
    search: searchModule,
    recipe: recipeModule,
  },
});

export default store;
