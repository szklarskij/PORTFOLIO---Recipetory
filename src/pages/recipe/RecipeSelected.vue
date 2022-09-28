<template>
  <section>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <base-container v-else-if="!isLoading && !failedFetch">
      <div class="recipe-grid">
        <div class="img-wrapper">
          <img :src="image" :alt="label" @load="onImgLoad" />
        </div>
        <div class="grid-el">
          <div class="label">
            <div class="label-div">
              <h2>
                {{ label }}
              </h2>
              <p class="bookmark" v-if="!bookmarked" @click="setBookmark">
                <ion-icon name="bookmark-outline"></ion-icon>
              </p>
              <p class="bookmark" v-else @click="setBookmark">
                <ion-icon name="bookmark"></ion-icon>
              </p>
            </div>
            <p>By {{ source }}</p>
          </div>
          <base-badge
            v-for="badge in badges"
            :key="badge"
            :type="badge"
          ></base-badge>
        </div>
        <div class="grid-el-last">
          <div class="badges" v-if="badges"></div>
          <div class="nutri-btn">
            <base-button
              v-if="smallView"
              styleMode="outline"
              @click="showNutri"
              >{{ isNutri ? "Hide nutrients" : "Show nutrients" }}</base-button
            >
          </div>
          <div class="nutri-expand" :class="expand">
            <div class="nutrients">
              <h3 class="nutri-label">Nutrients per one serving</h3>
              <ul class="nutrients-list">
                <li class="nutrients-el">
                  Energy: {{ totalNutrients.ENERC_KCAL.quantity.toFixed(0) }}
                  {{ totalNutrients.ENERC_KCAL.unit }}
                </li>
                <li class="nutrients-el">
                  Protein: {{ totalNutrients.PROCNT.quantity.toFixed(0) }}
                  {{ totalNutrients.PROCNT.unit }}
                </li>
                <li class="nutrients-el">
                  Fat: {{ totalNutrients.FAT.quantity.toFixed(0) }}
                  {{ totalNutrients.FAT.unit }}
                </li>
                <li class="nutrients-el">
                  Carbs: {{ totalNutrients.CHOCDF.quantity.toFixed(0) }}
                  {{ totalNutrients.CHOCDF.unit }}
                </li>
                <li class="nutrients-el">
                  Cholesterol: {{ totalNutrients.CHOLE.quantity.toFixed(0) }}
                  {{ totalNutrients.CHOLE.unit }}
                </li>
                <li class="nutrients-el">
                  Sugars: {{ totalNutrients.SUGAR.quantity.toFixed(0) }}
                  {{ totalNutrients.SUGAR.unit }}
                </li>
                <li class="nutrients-el">
                  Total weight: {{ totalWeight.toFixed(0) }} g
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="ingredients-container">
        <p class="prep-time" v-if="time !== 0">
          Preparation time: {{ time }} min
        </p>

        <h3 class="title">
          <span>Recipe ingredients per</span
          ><span
            ><input type="number" min="1" max="20" v-model="servingsInput" />
            {{ servingsInput === 1 ? "serving" : "servings" }}</span
          >
        </h3>

        <div class="ingredients">
          <ul class="igredients-list">
            <li
              class="igredients-el"
              v-for="ing in ingredients"
              :key="ing.text"
            >
              <ion-icon name="checkmark-outline"></ion-icon>
              {{
                ing.quantity === 0
                  ? ""
                  : Math.round(
                      ((ing.quantity * servingsInputFix) / servings) * 100
                    ) / 100
              }}
              {{
                ing.measure
                  ? ing.measure.includes("unit")
                    ? ""
                    : ing.measure
                  : ""
              }}
              {{ ing.unit }}
              {{ ing.food }}
            </li>
          </ul>
          <div></div>
        </div>
      </div>
      <div class="link-to-recipe">
        <base-button url :urlto="url">Go to the recipe's page!</base-button>
      </div>
      <div class="rating-container">
        <div>
          <h3 class="rating-label">Rate this recipe</h3>
          <div class="rating-stars">
            <div
              class="star-container"
              @mouseover="setStars(1)"
              @mouseleave="hoverStarLeave"
              @click="rate(1)"
            >
              <ion-icon
                v-if="star1 !== 'star-active'"
                :class="star1"
                name="star-outline"
              ></ion-icon>
              <ion-icon v-else :class="star1" name="star"></ion-icon>
            </div>
            <div
              class="star-container"
              @mouseover="setStars(2)"
              @mouseleave="hoverStarLeave"
              @click="rate(2)"
            >
              <ion-icon
                v-if="star2 !== 'star-active'"
                :class="star2"
                name="star-outline"
              ></ion-icon>

              <ion-icon v-else :class="star2" name="star"></ion-icon>
            </div>
            <div
              class="star-container"
              @click="rate(3)"
              @mouseover="setStars(3)"
              @mouseleave="hoverStarLeave"
            >
              <ion-icon
                v-if="star3 !== 'star-active'"
                :class="star3"
                name="star-outline"
              ></ion-icon>
              <ion-icon v-else :class="star3" name="star"></ion-icon>
            </div>
            <div
              class="star-container"
              @click="rate(4)"
              @mouseover="setStars(4)"
              @mouseleave="hoverStarLeave"
            >
              <ion-icon
                :class="star4"
                v-if="star4 !== 'star-active'"
                name="star-outline"
              ></ion-icon>
              <ion-icon :class="star4" v-else name="star"></ion-icon>
            </div>
            <div
              class="star-container"
              @click="rate(5)"
              @mouseover="setStars(5)"
              @mouseleave="hoverStarLeave"
            >
              <ion-icon
                :class="star5"
                v-if="star5 !== 'star-active'"
                name="star-outline"
              ></ion-icon>
              <ion-icon :class="star5" v-else name="star"></ion-icon>
            </div>
          </div>
        </div>
        <div>
          <div>
            <h3 class="rating-label no-wrap">Current rating by users</h3>
            <span class="rating-average">{{
              recipeScore ? recipeScore + "/5" : "N/A"
            }}</span>
          </div>
        </div>
      </div>
      <div class="opinion-padding">
        <div class="opinion-container">
          <h3 v-if="opinions.length > 0" class="opinion-label">
            User opinions
          </h3>
          <h3 v-else class="opinion-label">No user opinions</h3>
          <ul class="opinion-list">
            <li
              class="opinion-list-el"
              v-for="opinion in opinions"
              :key="opinion.user + opinion.time"
            >
              <div class="opinion-header">
                <p>{{ opinion.user }}</p>
              </div>
              <p class="opinion-body">{{ opinion.opinion }}</p>
            </li>
            <p v-if="!isAuth" key="a">Please log in to add a new opinion</p>
          </ul>
        </div>
        <div v-if="isAuth" class="opinion-container">
          <h3 class="opinion-label">Add a new opinion</h3>
          <div class="opinion-flex">
            <form class="opinion-form" @submit.prevent="postOpinion">
              <textarea
                class="add-opinion-text"
                rows="3"
                v-model.trim="opinionInput"
              ></textarea>
              <base-button @click="postOpinion" styleMode="outline"
                >Post</base-button
              >
            </form>
          </div>
        </div>
      </div>
    </base-container>
    <base-container v-else>
      <h2>Something goes wrong!</h2>
      <p>Check your internet connnection and try again.</p>
    </base-container>
  </section>
</template>
<script>
import { ref, computed, watch, inject } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { EDAMAM_ID } from "../../config.js";
import { EDAMAM_KEY } from "../../config.js";
import { LABELS_ARR } from "../../config.js";
export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const onImgLoad = function () {
      imageLoaded.value = true;
    };

    const isAuth = computed(function () {
      return store.getters["auth/isAuthenticated"];
    });

    const imageLoaded = ref(false);
    const failedFetch = ref(false);
    let thisRecipe = null;

    const recipes = store.getters["search/getSearchList"];
    const isLoading = ref(true);

    const smallView = inject("small-view");

    /////////////////////////////////////////////////////////////////////// recipe elements
    const label = computed(function () {
      return thisRecipe.label;
    });
    const source = computed(function () {
      return thisRecipe.source;
    });
    const image = computed(function () {
      return thisRecipe.imageLarge;
    });
    const badges = computed(function () {
      return thisRecipe.healthLabels;
    });
    const calories = computed(function () {
      return Math.floor(thisRecipe.calories);
    });
    const servings = computed(function () {
      return thisRecipe.servings;
    });

    const servingsInput = ref(null);
    const servingsInputFix = ref(null);

    const time = computed(function () {
      return thisRecipe.totalTime;
    });
    const totalWeight = computed(function () {
      return thisRecipe.totalWeight;
    });
    const url = computed(function () {
      return thisRecipe.url;
    });
    const ingredients = computed(function () {
      return thisRecipe.ingredients;
    });
    const healthLabels = computed(function () {
      return thisRecipe.healthLabels;
    });
    const totalNutrients = computed(function () {
      return thisRecipe.totalNutrients;
    });
    /////////////////////////////////////////////////////////////////////// bookmarks

    const bookmarked = computed(function () {
      if (
        store.getters["favourites/getFavourites"].some(
          (r) => r.id === thisRecipe.id
        )
      ) {
        return true;
      } else return false;
    });

    const setBookmark = function () {
      let favArr = [];
      favArr = store.getters["favourites/getFavourites"];

      const savedRecipe = {
        id: thisRecipe.id,
        label: thisRecipe.label,
        source: thisRecipe.source,
      };

      //remove from fav
      if (
        store.getters["auth/isAuthenticated"] &&
        favArr.some((r) => r.id === thisRecipe.id)
      ) {
        const index = favArr.findIndex((r) => r.id === thisRecipe.id);
        favArr.splice(index, 1);

        store.dispatch("favourites/setFavourites", favArr);
      } else if (store.getters["auth/isAuthenticated"]) {
        favArr.push(savedRecipe);
        store.dispatch("favourites/setFavourites", favArr);
      } else {
        router.push("/auth");
      }
    };

    /////////////////////////////////////////////////////////////////////// validate input

    watch(servingsInput, (newVal) => {
      if (newVal === "") return;
      if (newVal <= 0 || newVal > 30) {
        servingsInput.value = servingsInputFix.value;
      } else {
        servingsInputFix.value = newVal;
      }
    });
    /////////////////////////////////////////////////////////////////////// show nutrients on mobile

    const showNutri = function () {
      if (isNutri.value) {
        expand.value = "";
      } else {
        expand.value = "expand";
      }
      isNutri.value = !isNutri.value;
    };
    const expand = ref("");

    const isNutri = ref(false);
    if (!smallView.value) expand.value = "expand";

    const sV = computed(function () {
      return smallView.value;
    });
    watch(sV, function () {
      expand.value = "expand";
      isNutri.value = true;
    });
    /////////////////////////////////////////////////////////////////////// rating

    const star1 = ref("");
    const star2 = ref("");
    const star3 = ref("");
    const star4 = ref("");
    const star5 = ref("");

    const setStars = function (s) {
      if (s === 1) {
        star1.value = "star-active";
        star2.value = "";
        star3.value = "";
        star4.value = "";
        star5.value = "";
      } else if (s === 2) {
        star1.value = "star-active";
        star2.value = "star-active";
        star3.value = "";
        star4.value = "";
        star5.value = "";
      } else if (s === 3) {
        star1.value = "star-active";
        star2.value = "star-active";
        star3.value = "star-active";
        star4.value = "";
        star5.value = "";
      } else if (s === 4) {
        star1.value = "star-active";
        star2.value = "star-active";
        star3.value = "star-active";
        star4.value = "star-active";
        star5.value = "";
      } else if (s === 5) {
        star1.value = "star-active";
        star2.value = "star-active";
        star3.value = "star-active";
        star4.value = "star-active";
        star5.value = "star-active";
      }
    };

    const hoverStarLeave = function () {
      if (!userScore.value) {
        star1.value = "";
        star2.value = "";
        star3.value = "";
        star4.value = "";
        star5.value = "";
      }

      if (userScore.value === 1) {
        star1.value = "star-active";
        star2.value = "";
        star3.value = "";
        star4.value = "";
        star5.value = "";
      } else if (userScore.value === 2) {
        star1.value = "star-active";
        star2.value = "star-active";
        star3.value = "";
        star4.value = "";
        star5.value = "";
      } else if (userScore.value === 3) {
        star1.value = "star-active";
        star2.value = "star-active";
        star3.value = "star-active";
        star4.value = "";
        star5.value = "";
      } else if (userScore.value === 4) {
        star1.value = "star-active";
        star2.value = "star-active";
        star3.value = "star-active";
        star4.value = "star-active";
        star5.value = "";
      } else if (userScore.value === 5) {
        star1.value = "star-active";
        star2.value = "star-active";
        star3.value = "star-active";
        star4.value = "star-active";
        star5.value = "star-active";
      }
    };

    const rate = async function (r) {
      if (!store.getters["auth/isAuthenticated"]) {
        router.push("/auth");
      } else {
        try {
          await store.dispatch("recipe/addRating", [r, thisRecipe.id]);
          checkUserRating();
          store.dispatch("recipe/loadRecipeRating", thisRecipe.id);
        } catch (error) {
          store.dispatch("search/setError", "Failed to send rating to server");
        }
      }
    };

    const recipeScore = computed(function () {
      return store.getters["recipe/getRecipeRating"];
    });
    const userScore = computed(function () {
      return store.getters["recipe/getUserRating"];
    });

    const checkUserRating = async function () {
      try {
        await store.dispatch("recipe/loadUserRating", thisRecipe.id);
        await store.dispatch("recipe/loadRecipeRating", thisRecipe.id);

        setStars(userScore.value);
      } catch (error) {
        store.dispatch(
          "search/setError",
          "Failed to load user's rating from server"
        );
      }
    };
    /////////////////////////////////////////////////////////////////////// opinions
    const opinions = computed(function () {
      return store.getters["recipe/getOpinions"];
    });
    const opinionInput = ref("");

    const postOpinion = async function () {
      if (isAuth.value && opinionInput.value !== "") {
        try {
          const opinion = opinionInput.value;
          opinionInput.value = "";
          await store.dispatch("recipe/postOpinion", [opinion, thisRecipe.id]);

          getOpinions();
        } catch (error) {
          store.dispatch("search/setError", error);
        }
      }
    };
    const getOpinions = async function () {
      try {
        await store.dispatch("recipe/getOpinions", thisRecipe.id);
      } catch (error) {
        store.dispatch(
          "search/setError",
          "Failed to load users' opinions from server"
        );
      }
    };
    /////////////////////////////////////////////////////////////////////// init
    const init = async function () {
      if (recipes.length !== 0) {
        thisRecipe = recipes.find((recipe) => recipe.id === route.params.id);

        loadImage();
      } else if (store.getters["recipe/getRecipe"]) {
        thisRecipe = store.getters["recipe/getRecipe"];
        loadImage();
      } else {
        try {
          const response = await fetch(
            `https://api.edamam.com/api/recipes/v2/${route.params.id}?type=public&app_id=${EDAMAM_ID}&app_key=${EDAMAM_KEY}`
          );

          ////label arr do configa
          let filteredLabels = [];

          const data = await response.json();
          if (!response.ok) {
            let error;
            if (response.status === 404) {
              error = new Error("Wrong recipe id at url.");
            } else {
              error = new Error("Failed to fetch data from server.");
            }

            router.replace("/search");
            throw error;
          } else {
            LABELS_ARR.forEach((label) => {
              if (data.recipe.healthLabels.includes(label)) {
                filteredLabels.push(label.toLowerCase());
              }
            });
            thisRecipe = {
              id: route.params.id,
              label: data.recipe.label,
              image: data.recipe.image,
              imageLarge: data.recipe.images.LARGE
                ? data.recipe.images.LARGE.url
                : data.recipe.image,
              source: data.recipe.source,
              calories: data.recipe.calories,
              healthLabels: filteredLabels,
              url: data.recipe.url,
              ingredients: data.recipe.ingredients,
              totalNutrients: data.recipe.totalNutrients,
              totalTime: data.recipe.totalTime,
              totalWeight: data.recipe.totalWeight,
              servings: data.recipe.yield,
            };

            store.dispatch("recipe/setRecipe", thisRecipe);

            loadImage();
          }
        } catch (error) {
          isLoading.value = false;
          failedFetch.value = true;
          store.dispatch("search/setError", error);
        }
      }
      checkUserRating();
      getOpinions();
    };
    const loadImage = function () {
      try {
        servingsInput.value = thisRecipe.servings;
        const img = new Image();
        img.src = thisRecipe.imageLarge;
        img.onload = function () {
          // store.dispatch('search/spinnerOff')
          isLoading.value = false;
        };
      } catch (error) {
        store.dispatch("search/setError", error);
      }
    };
    /////////////////////////////////////////////////////////////////////// DEMO
    store.dispatch("recipe/resetOpinionAndRate");
    init();
    return {
      isLoading,
      onImgLoad,
      imageLoaded,
      label,
      source,
      image,
      badges,
      calories,
      servings,
      time,
      totalWeight,
      url,
      ingredients,
      healthLabels,
      totalNutrients,
      servingsInput,
      servingsInputFix,
      failedFetch,
      bookmarked,
      setBookmark,
      smallView,
      showNutri,
      isNutri,
      expand,
      setStars,
      hoverStarLeave,
      star1,
      star2,
      star3,
      star4,
      star5,
      rate,
      recipeScore,
      opinions,
      isAuth,
      opinionInput,
      postOpinion,
    };
  },
};
</script>
{
<style scoped>
h2 {
  padding-top: 1rem;
  font-size: 3.6rem;
  margin: 0;
}

.label {
  margin: 0 0 2rem;
  padding: 0;
}
.label-div {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.title {
  display: flex;
  font-size: 2rem;
  align-self: center;
  /* text-align: center; */
}
.bookmark {
  margin: 0;
  /* padding: 1rem 0 0 0; */
  scale: 1;
  transition: 0.3s ease;
}
.bookmark:hover,
.bookmark:active {
  cursor: pointer;
  scale: 1.1;
  transition: 0.3s ease;
}
.bookmark ion-icon {
  font-size: 4rem;
  padding: 1.4rem 1rem 0 1rem;
}
input {
  font-size: 2rem;
  width: 3.8rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.label p {
  font-size: 2rem;
  padding: 0;
}

img {
  object-fit: cover;
  transition: 0.6s ease;
  height: 100%;
  width: 100%;
}
.img-wrapper {
  border-top-left-radius: 12px;
  background-color: red;
  display: flex;
  overflow: hidden;

  transition: 0.6s ease;
  grid-row: 1/3;
}

img:hover,
img:active {
  -webkit-transition: 0.6s ease;
  transition: 0.6s ease;
  transform: scale(1.5);
  -ms-transform: scale(1.5); /* IE 9 */
  -moz-transform: scale(1.5); /* Firefox */
  -webkit-transform: scale(1.5); /* Safari and Chrome */
  -o-transform: scale(1.5); /* Opera */
}

.badges {
  margin-bottom: 1rem;
}

.recipe-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1.5fr;
  /* grid-template-rows: 1fr 1fr; */
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  background-color: var(--text-light);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.26);
}

.nutri-btn {
  display: flex;
  justify-items: center;
  justify-content: center;
}
.nutri-expand {
  display: grid;
  height: 0;
  transition: all 0.3s ease-out;
}
.expand {
  height: 14em;
  transition: all 0.3s ease-out;
}

.nutrients {
  min-height: 0;
  overflow: hidden;
}
.nutri-label {
  font-weight: 700;
  margin-bottom: 1rem;
}

.ingredients-container {
  display: flex;
  flex-direction: column;
  padding: 4rem 8rem 0 8rem;
}

.ingredients {
  margin: 4rem 4rem 6rem 4rem;
}

.nutrients-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}
.nutrients-el {
  display: flex;
  margin: 0;
  margin-bottom: 0.5rem;
  font-size: 1.6rem;
}
.prep-time {
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 4rem;
  text-align: center;
}

.igredients-list {
  gap: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  list-style: none;
  padding: 0;
  margin: 0;
  transform: translateX(10%);
}
.igredients-el {
  margin: 0;
  font-size: 1.6rem;
}
.link-to-recipe {
  text-align: center;
  margin-bottom: 6rem;
}
.rating-container {
  justify-content: space-around;
  display: flex;
  margin-bottom: 6rem;
}
.rating-label {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}
.rating-stars {
  display: flex;
  justify-content: center;
  /* margin: 0 6vw; */
  color: lightgray;
  margin-bottom: 3rem;
}
.rating-stars ion-icon {
  font-size: 3rem;
  margin-top: 0.5rem;
}
.star-container {
  cursor: pointer;
}
.star-active {
  color: var(--text-dark);
}
.star-container {
  min-width: 6rem;
  display: flex;
  /* flex: 1; */
  justify-content: center;
}
.rating-average {
  font-size: 3rem;
  display: flex;
  justify-content: center;
}

.opinion-container {
  display: flex;
  flex-direction: column;

  margin: 0 4rem 6rem 4rem;
}

.opinion-list {
  display: flex;
  flex-direction: column;
}
.opinion-list-el {
  list-style: none;
}
.opinion-label {
  margin-bottom: 2rem;
  font-size: 2rem;
}
.opinion-header {
  font-weight: 700;
}
.opinion-body {
  margin-bottom: 2rem;
}
.opinion-flex {
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  margin-bottom: 3rem;
  gap: 1rem;
}
.add-opinion-text {
  width: 100%;
  font-size: 1.4rem;
}
.opinion-form {
  display: flex;
  /* width: 100vw; */
  gap: 1rem;
}
.opinion-padding {
  padding-bottom: 2rem;
}

/* 1115 */
@media (max-width: 69.68em) {
  .rating-container {
    flex-direction: column;
  }

  .label {
    margin: 0 0 1rem;
  }
  .nutrients-list {
    margin-bottom: 1rem;
  }
  .nutrients-el {
    font-size: 1.4rem;
  }
  h2 {
    font-size: 3rem;
  }
}

/* 830 */
@media (max-width: 51.87em) {
  .ingredients {
    margin: 4rem 2rem 6rem 2rem;
  }

  .igredients-list {
    transform: translateX(0);
  }
}

/* 612 */

@media (max-width: 38.25em) {
  .grid-el {
    grid-column: 1/-1;
    grid-row: 1/2;
    margin: 1rem 1rem 0 1rem;
  }
  .grid-el-last {
    grid-column: 1/-1;
    /* grid-row: 1/2; */
    margin: 1rem 1rem 0 1rem;
  }
  .badges {
    text-align: center;
  }

  .img-wrapper {
    grid-column: 1/3;
    grid-row: 2/3;
    border-top-left-radius: 0px;
    /* height: 8/0%; */
  }

  .nutrients-list {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    /* width: 40%; */
    flex-basis: 2rem;
  }
  .prep-time {
    text-align: center;
  }

  .ingredients-container {
    display: flex;
    flex-direction: column;
    padding: 4rem 4rem 0 4rem;
  }
  .nutrients-el {
    align-self: center;
  }

  .nutri-btn {
    margin-bottom: 3rem;
  }
  .nutri-label {
    text-align: center;
  }
  .opinion-label {
    text-align: center;
  }
}

/* 520 */

@media (max-width: 32.5em) {
  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .igredients-list {
    grid-template-columns: 1fr;
    margin: 0 2rem;
  }
  .ingredients-container {
    padding: 4rem 0 0 0;
  }

  .opinion-flex {
    flex-direction: column;
  }
  .opinion-container {
    margin: 3rem 1rem;
  }
}

@media (max-width: 20em) {
  .star-container {
    min-width: 5rem;
  }
}
</style>
}
