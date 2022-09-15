import { createStore } from "vuex";

import searchModule from "./modules/search/index.js";
import recipeModule from "./modules/recipe/index.js";
import authModule from "./modules/auth/index.js";
import favModule from "./modules/favourites/index.js";

const store = createStore({
  modules: {
    search: searchModule,
    recipe: recipeModule,
    auth: authModule,
    favourites: favModule,
  },
});

export default store;
