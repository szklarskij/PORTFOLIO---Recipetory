import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  namespaced: true,
  state() {
    return {
      recipe: null,
      rating: null,
      userRating: null,
      opinions: [
        { user: "test@wp.pl", time: "20-20-2022", opinion: "testing testing" },
        {
          user: "test2@wp.pl",
          time: "20-20-2022",
          opinion:
            "testing2 testing2 testing2 testing2testing2 testing2testing2 testing2testing2 testing2testing2 testing2testing2 testing2testing2 testing2testing2 testing2testing2 testing2testing2 testing2testing2 testing2testing2 testing2testing2 testing2testing2 testing2",
        },
      ],
    };
  },
  mutations,
  actions,
  getters,
};
