export default {
  setSearchString(state, payload) {
    state.searchString = payload;
  },
  setSearchList(state, payload) {
    state.searchList = payload;
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
};
