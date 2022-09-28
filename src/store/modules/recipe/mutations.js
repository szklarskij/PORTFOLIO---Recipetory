export default {
  setRecipe(state, payload) {
    state.recipe = payload;
  },
  setRating(state, payload) {
    state.rating = payload;
  },
  setUserRating(state, payload) {
    state.userRating = payload;
  },
  setOpinions(state, payload) {
    state.opinions = payload;
  },
};
