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
        </div>
        <div class="grid-el-last">
          <div class="badges" v-if="badges">
            <base-badge
              v-for="badge in badges"
              :key="badge"
              :type="badge"
            ></base-badge>
          </div>
          <div class="nutrients">
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
            <p class="prep-time" v-if="true || time !== 0">
              Preparation time: {{ time }} min
            </p>
          </div>
        </div>
      </div>
      <div class="ingredients-container">
        <p class="title">
          <span>Recipe ingredients per</span
          ><span
            ><input type="number" min="1" max="20" v-model="servingsInput" />
            servings</span
          >
        </p>

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
                      ((ing.quantity * servingsInput) / servings) * 100
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

        <div class="link-to-recipe">
          <base-button url :urlto="url">Go to the recipe's page!</base-button>
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
import { ref, computed, watch } from "vue";
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

    const imageLoaded = ref(false);
    const failedFetch = ref(false);
    let thisRecipe = null;

    const recipes = store.getters["search/getSearchList"];
    const isLoading = ref(true);

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

    watch(servingsInput, (newVal, oldVal) => {
      if (newVal <= 0 || newVal > 20) servingsInput.value = oldVal;
    });

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
      failedFetch,
      bookmarked,
      setBookmark,
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
  /* height: 100%; */
  /* width: 40rem; */
  /* -webkit-transition: 0.6s ease; */
  transition: 0.6s ease;
  grid-row: 1/3;
  /* max-width: 100%;
  min-width: 100%; */
}

img:hover {
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

.grid-el-last {
  /* grid-row */
}

.ingredients-container {
  display: flex;
  flex-direction: column;
  padding: 4rem 8rem 6rem 8rem;
}

.ingredients {
  margin: 4rem 5rem 4rem 5rem;
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
  margin-bottom: 1rem;
}

.igredients-list {
  gap: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  list-style: none;
  padding: 0;
  margin: 0;
}
.igredients-el {
  margin: 0;
  font-size: 1.6rem;
}
.link-to-recipe {
  align-self: center;
}

/* 1115 */
@media (max-width: 69.68em) {
  .label {
    margin: 0;
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
    margin: 4rem 2rem 4rem 2rem;
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
  .nutrients {
    margin: 0 auto;
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
    padding: 4rem 4rem 6rem 4rem;
  }
  .nutrients-el {
    align-self: center;
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
    padding: 4rem 0 6rem 0;
  }
}
</style>
}
