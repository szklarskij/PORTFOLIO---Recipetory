export default {
  setFavourites(state, payload) {
    state.favArr = payload;
  },
  setKey(state, payload) {
    state.securityKey = payload;
  },
};
