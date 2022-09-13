import { createStore } from "vuex";

import searchModule from "./modules/search/index.js";
import recipeModule from "./modules/recipe/index.js";
import authModule from "./modules/auth/index.js";

const store = createStore({
  modules: {
    search: searchModule,
    recipe: recipeModule,
    auth: authModule,
  },
});

export default store;
