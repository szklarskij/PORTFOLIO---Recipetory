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

        <ul>
          <recipe-item
            v-for="recipe in recipes"
            :key="recipe.id"
            :label="recipe.label"
            :image="recipe.image"
            :source="recipe.source"
            :healthLabels="recipe.healthLabels"
            :id="recipe.id"
          ></recipe-item>
        </ul>
      </div>
    </base-container>
  </div>
</template>

<script>
import RecipeItem from "../../components/search/RecipeItem.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  components: { RecipeItem },
  setup() {
    const router = useRouter();
    const store = useStore();
    const isLoading = ref(true);
    const isList = computed(function () {
      if (store.getters["favourites/getFavourites"].length === 0) {
        return false;
      } else {
        return true;
      }
    });

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
    return { isList, isLoading, recipes };
  },
};
</script>

<style scoped>
.padding {
  padding: 1rem;
}
</style>
