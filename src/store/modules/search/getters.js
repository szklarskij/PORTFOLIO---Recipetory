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
  getSearchListUnsorted(state) {
    return state.searchListUnsorted;
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
  getSortType(state) {
    return state.sortType;
  },
  getSortOption(state) {
    return state.sortOption;
  },
  checkForceFetch(state) {
    return state.forceFetch;
  },
  checkClearInput(state) {
    return state.clearInput;
  },
  getFilters(state) {
    return state.filters;
  },
  getNumberOfPages(state) {
    return state.numberOfPages;
  },
  // getError(state) {
  //   return state.error;
  // },
};
