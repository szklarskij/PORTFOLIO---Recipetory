export default {
  async setFavourites(context, payload) {
    const favArr = JSON.stringify(payload);

    const userId = context.rootGetters["auth/userId"];
    const token = context.rootGetters["auth/token"];
    const response = await fetch(
      `https://recipe-f6325-default-rtdb.europe-west1.firebasedatabase.app/favs/${userId}.json?auth=${token}`,
      {
        method: "PUT",
        body: JSON.stringify(favArr),
      }
    );
    if (!response.ok) {
      const error = new Error("Failed to save favourite recipes to server!");
      throw error;
    } else context.commit("setFavourites", payload);
  },

  async fetchFavourites(context) {
    const userId = context.rootGetters["auth/userId"];
    const token = context.rootGetters["auth/token"];

    const response = await fetch(
      `https://recipe-f6325-default-rtdb.europe-west1.firebasedatabase.app/favs/${userId}.json?auth=${token}`
    );

    if (!response.ok) {
      const error = new Error("Failed to load favourite recipes from server!");
      throw error;
    }
    const responseData = await response.json();
    const favArr = JSON.parse(responseData);
    context.commit("setFavourites", favArr);
  },
  resetFavourites(context) {
    context.commit("setFavourites", []);
  },

  setKey(context, payload) {
    context.commit("setKey", payload);
  },
};
