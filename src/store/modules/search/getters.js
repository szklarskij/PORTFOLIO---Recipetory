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
  recipesLoaded(state) {
    if (state.searchList.length === 0) {
      return false;
    } else {
      return true;
    }
  },
};
