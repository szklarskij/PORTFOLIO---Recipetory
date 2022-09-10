<template>
  <section>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <base-container v-else>
      <div class="recipe-grid">
        <img :src="image" :alt="label" @load="onImgLoad" />
        <div class="grid-el">
          <div class="label">
            <h2>
              {{ label }}
            </h2>
            <p>By {{ source }}</p>
          </div>

          <div v-if="badges">
            <base-badge
              v-for="badge in badges"
              :key="badge"
              :type="badge"
            ></base-badge>
          </div>
          <div class="nutrients">
            <ul>
              <li>
                Energy: {{ totalNutrients.ENERC_KCAL.quantity.toFixed(0) }}
                {{ totalNutrients.ENERC_KCAL.unit }}
              </li>
              <li>
                Protein: {{ totalNutrients.PROCNT.quantity.toFixed(0) }}
                {{ totalNutrients.PROCNT.unit }}
              </li>
              <li>
                Fat: {{ totalNutrients.FAT.quantity.toFixed(0) }}
                {{ totalNutrients.FAT.unit }}
              </li>
              <li>
                Carbs: {{ totalNutrients.CHOCDF.quantity.toFixed(0) }}
                {{ totalNutrients.CHOCDF.unit }}
              </li>
              <li>
                Cholesterol: {{ totalNutrients.CHOLE.quantity.toFixed(0) }}
                {{ totalNutrients.CHOLE.unit }}
              </li>
              <li>
                Sugars: {{ totalNutrients.SUGAR.quantity.toFixed(0) }}
                {{ totalNutrients.SUGAR.unit }}
              </li>
            </ul>
          </div>
        </div>
        <div class="ingredients-container">
          <div class="servings">
            <p>Servings:</p>
            <input
              type="number"
              @click="validateInput"
              v-model="servingsInput"
            />
          </div>
          <div class="ingredients">
            <ul v-for="ing in ingredients" :key="ing.text">
              <li>
                {{ (ing.quantity * servingsInput) / servings }}
                {{ ing.measure }}
                {{ ing.unit }}
                {{ ing.food }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </base-container>
  </section>
</template>
<script>
import { ref, computed } from "vue";
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
      console.log("img loaded");
      imageLoaded.value = true;
    };
    const imageLoaded = ref(false);
    let thisRecipe = null;

    const recipes = store.getters["search/getSearchList"];
    const isLoading = ref(true);
    ///////////////////////////////////////////////////////////////////////recipe elements
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

    const validateInput = function () {
      console.log(servings.value);
    };

    /////////////////////////////////////////////////////////////////////// init
    const init = async function () {
      if (recipes.length !== 0) {
        // console.log(recipes);

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
          }

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
        } catch (error) {
          store.dispatch("search/setError", error);
        }
        console.log(thisRecipe);
      }
    };
    const loadImage = function () {
      try {
        servingsInput.value = thisRecipe.servings;
        const img = new Image();
        img.src = thisRecipe.imageLarge;
        img.onload = function () {
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
      validateInput,
    };
  },
};
</script>
{
<style scoped>
h2 {
  font-size: 1.5rem;
  margin: 0;
}
.label {
  /* display: inline; */
  margin: 0;
}

.label p {
  font-size: 1.2rem;
  margin: 0;
  padding-bottom: 1rem;
  /* align-self: flex-end; */
}

img {
  /* object-fit: cover; */
  width: 100%;
}

.recipe-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1.5fr;
  grid-template-rows: 1fr;
}

.ingredients-container {
  grid-column: 1/-1;
}

ul {
  list-style: none;
  /* margin: 1rem 0; */
  padding: 0;
}
li {
  margin: 0 0 1rem 0;
}
</style>
}
