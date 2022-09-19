<template>
  <div>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <base-container v-else>
      <div class="padding" v-if="!isList">
        <h2>Recipes not found!</h2>
        <p>Favourite list is empty. Search for recipes and bookmark them.</p>
      </div>
      <div class="padding" v-else>
        <h2>Favourites</h2>
        <p>List of your bookmarked recipes.</p>

        <transition-group tag="ul" name="recipe-list">
          <recipe-item-fav
            v-for="recipe in recipes"
            :key="recipe.id"
            :label="recipe.label"
            :source="recipe.source"
            :id="recipe.id"
            @remove-recipe="del"
          ></recipe-item-fav>
        </transition-group>
      </div>
    </base-container>
  </div>
</template>

<script>
import RecipeItemFav from "../../components/search/RecipeItemFav.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  emits: ["delete"],
  components: { RecipeItemFav },
  setup() {
    const router = useRouter();
    const store = useStore();
    const isLoading = ref(true);
    const isList = computed(function () {
      if (
        !store.getters["favourites/getFavourites"] ||
        store.getters["favourites/getFavourites"].length === 0
      ) {
        return false;
      } else {
        return true;
      }
    });

    const del = function (idd) {
      const index = recipes.value.findIndex((r) => r.id === idd);
      recipes.value.splice(index, 1);

      store.dispatch("favourites/setFavourites", recipes.value);
    };

    const recipes = computed(function () {
      return store.getters["favourites/getFavourites"];
    });

    //init
    const fetchFavs = async function () {
      try {
        await store.dispatch("favourites/fetchFavourites");
        isLoading.value = false;
      } catch (error) {
        isLoading.value = false;
        router.push("/search");
        store.dispatch("search/setError", error);
      }
    };
    fetchFavs();
    return { isList, isLoading, recipes, del };
  },
};
</script>

<style scoped>
ul {
  margin-top: 2rem;
  padding: 0;
}

.recipe-list-leave-from {
  opacity: 1;
}

.recipe-list-leave-active {
  transition: all 0.3s ease-in;
  opacity: 1;
}

.recipe-list-leave-to {
  opacity: 0;
}
</style>
