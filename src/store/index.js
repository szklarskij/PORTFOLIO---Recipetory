import { createStore } from "vuex";

import searchModule from "./modules/search/index.js";

const store = createStore({
  modules: {
    search: searchModule,
  },
  state() {
    return {
      searchString: "123",
    };
  },
});

export default store;
