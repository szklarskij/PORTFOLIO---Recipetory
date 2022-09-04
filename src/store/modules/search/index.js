import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
      searchString: "",
      searchList: [],
      isSearchingListLoading: false,
      error: null,
      searchPage: 1,
      resultsPerPage: 10,
      paginationStatus: null,
      searchListResults: [],
      searchListUnsorted: [],
      sortOption: "none",
      sortType: null,
    };
  },
  mutations,
  actions,
  getters,
};
