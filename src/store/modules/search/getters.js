export default {
  searchString(state) {
    return state.searchString;
  },
  isSearchingListLoading(state) {
    return state.isSearchingListLoading;
  },
  isError(state) {
    return state.error;
  },
  getSearchList(state) {
    return state.searchList;
  },
  recipesLoaded(state) {
    if (state.searchList.length === 0) {
      return false;
    } else {
      return true;
    }
  },
  getSearchPage(state) {
    return state.searchPage;
  },
  getResultsPerPage(state) {
    return state.resultsPerPage;
  },
  getPaginationStatus(state) {
    return state.paginationStatus;
  },
  getSearchListResults(state) {
    return state.searchListResults;
  },
};
