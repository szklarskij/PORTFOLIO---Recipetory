import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
      searchSettings: {
        searchString: "test",
        searchPage: 1,
        sortOption: "none",
        sortType: null,
        filters: [],
      },

      searchString: "",
      searchList: [],
      searchListUnsorted: [],
      isSearchingListLoading: false,
      error: null,
      searchPage: 1,
      resultsPerPage: 8,
      numberOfPages: null,
      paginationStatus: null,
      searchListResults: [],
      sortOption: "none",
      sortType: null,
      forceFetch: 0,
      clearInput: false,
      filters: [],
    };
  },
  mutations,
  actions,
  getters,
};
