import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
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
      sortOption: "n",
      sortType: "n",
      forceFetch: 0,
      clearInput: false,
      filters: [],
      listChange: 0,
      url: "",
    };
  },
  mutations,
  actions,
  getters,
};
