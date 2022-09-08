export default {
  setSearchString(state, payload) {
    state.searchString = payload;
  },
  setSearchList(state, payload) {
    state.searchList = payload;
  },
  setUnsortedList(state, payload) {
    state.searchListUnsorted = payload;
  },
  spinnerOn(state) {
    state.isSearchingListLoading = true;
  },
  spinnerOff(state) {
    state.isSearchingListLoading = false;
  },
  setError(state, payload) {
    state.error = payload;
  },
  setSearchingPage(state, payload) {
    state.searchPage = payload;
  },
  setPaginationStatus(state, payload) {
    state.paginationStatus = payload;
  },
  setSearchListResults(state, payload) {
    state.searchListResults = payload;
  },
  setSortParams(state, payload) {
    state.sortOption = payload[0];
    state.sortType = payload[1];
  },
  forceFetch(state) {
    state.forceFetch++;
    // console.log(state.forceFetch);
  },
  clearInput(state) {
    state.clearInput = true;
  },

  changeFilters(state, payload) {
    state.filters = payload;
  },
  setNumberOfPages(state, payload) {
    state.numberOfPages = payload;
  },
  listChange(state) {
    console.log("mutation listchange");
    state.listChange++;
  },
  setUrl(state, payload) {
    state.url = payload;
  },
};
