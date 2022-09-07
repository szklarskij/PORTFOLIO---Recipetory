<template>
  <header>
    <base-dialog
      :show="!!isError"
      title="An error occured!"
      @close="handleError"
    >
      <p>{{ isError }}</p>
    </base-dialog>
    <nav>
      <h1><router-link to="/" @click="clearInput">G recipes</router-link></h1>
      <div class="search-container">
        <form @submit.prevent="submitSearch">
          <input type="text" v-model.trim="searchInput" />
        </form>
        <base-button @click="submitSearch" mode="flat"
          >Search for recipe</base-button
        >
      </div>
      <ul>
        <!-- <li>
          <router-link to="/search">Search</router-link>
        </li> -->
        <li>
          <router-link to="/favourites">Favourites</router-link>
        </li>
        <li>
          <router-link to="/auth">Login</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import useValidateInput from "../../hooks/validateInput.js";

export default {
  setup() {
    const store = useStore();
    console.log(store.getters["search/getSearchSettings"]);

    const searchInput = ref("");

    const submitSearch = function () {
      if (useValidateInput(searchInput.value, store)) {
        store.dispatch("search/resetSearchList");
        store.dispatch("search/setSearchingPage", 1);
        store.dispatch("search/setSearchString", searchInput.value);
        store.dispatch("search/generateSearchUrl");
        store.dispatch("search/forceFetch");
        searchInput.value = "";
      }
    };

    //reset input

    const clearInput = function () {
      searchInput.value = "";
    };
    //error
    const isError = computed(function () {
      return store.getters["search/isError"];
    });

    const handleError = function () {
      store.dispatch("search/setError", null);
      clearInput();
      // router.replace("/search");
    };

    return { searchInput, submitSearch, clearInput, isError, handleError };
  },
};
</script>

<style>
header {
  width: 100%;
  height: 5rem;
  background-color: #1a9c00;
  display: flex;
  justify-content: center;
  align-items: center;
}

header a {
  text-decoration: none;
  color: #ffffff;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
}

a:active,
a:hover,
a.router-link-active {
  border: 1px solid #ffffff;
}

h1 {
  margin: 0;
}

h1 a {
  color: white;
  margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
  border-color: transparent;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 0.5rem;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
