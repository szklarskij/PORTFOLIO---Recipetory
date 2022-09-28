export default {
  setRecipe(context, payload) {
    context.commit("setRecipe", payload);
  },
  async addRating(context, payload) {
    const rate = payload[0];
    const recipeId = payload[1];
    const userId = context.rootGetters["auth/userId"];
    const token = context.rootGetters["auth/token"];
    const post = {
      rate: rate,
    };

    const response = await fetch(
      `https://recipe-f6325-default-rtdb.europe-west1.firebasedatabase.app/rating/${recipeId}/${userId}/.json?auth=${token}`,
      {
        method: "PATCH",
        body: JSON.stringify(post),
      }
    );
    if (!response.ok) {
      const error = new Error("Failed to save rating to server!");
      throw error;
    }
  },

  async loadRecipeRating(context, payload) {
    const recipeId = payload;

    const response = await fetch(
      `https://recipe-f6325-default-rtdb.europe-west1.firebasedatabase.app/rating/${recipeId}.json`
    );

    if (!response.ok) {
      const error = new Error("Failed to load rating from server!");
      throw error;
    }
    const responseData = await response.json();

    let rating = [];
    if (responseData) {
      const rateArr = Object.values(responseData).flatMap((r) => r.rate);
      rating = rateArr.reduce((a, b) => a + b, 0) / rateArr.length;
    } else {
      rating = null;
    }

    context.commit("setRating", Math.round(rating * 100) / 100);
  },

  async loadUserRating(context, payload) {
    const recipeId = payload;
    const userId = context.rootGetters["auth/userId"];
    const response = await fetch(
      `https://recipe-f6325-default-rtdb.europe-west1.firebasedatabase.app/rating/${recipeId}/${userId}.json`
    );

    if (!response.ok) {
      const error = new Error("Failed to load rating from the server!");
      throw error;
    }

    const responseData = await response.json();
    let rate = null;
    if (responseData) {
      rate = responseData.rate;
    }
    context.commit("setUserRating", rate);
  },

  async postOpinion(context, payload) {
    const userMail = context.rootGetters["auth/userMail"];
    const token = context.rootGetters["auth/token"];
    const recipeId = payload[1];
    const today = new Date();
    const month = today.getMonth() + 1;
    const dateString =
      today.getDate() + "/" + month + "/" + today.getFullYear();
    const post = {
      user: `${userMail.substring(0, userMail.indexOf("@"))} on ${dateString}`,
      opinion: payload[0],
    };

    const response = await fetch(
      `https://recipe-f6325-default-rtdb.europe-west1.firebasedatabase.app/opinions/${recipeId}.json?auth=${token}`,
      {
        method: "POST",
        body: JSON.stringify(post),
      }
    );
    if (!response.ok) {
      const error = new Error("Failed to post an opinion to the server!");
      throw error;
    }
  },

  async getOpinions(context, payload) {
    const recipeId = payload;
    const response = await fetch(
      `https://recipe-f6325-default-rtdb.europe-west1.firebasedatabase.app/opinions/${recipeId}.json`
    );

    if (!response.ok) {
      const error = new Error("Failed to load rating from the server!");
      throw error;
    }

    const responseData = await response.json();
    if (responseData) {
      const opinions = Object.values(responseData);

      context.commit("setOpinions", opinions);
    } else {
      context.commit("setOpinions", []);
    }
  },

  resetOpinionAndRate(context) {
    context.commit("setOpinions", []);
    context.commit("setUserRating", null);
  },
};
