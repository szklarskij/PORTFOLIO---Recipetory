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
      <h1><router-link to="/" @click="clearInput">Recipetory</router-link></h1>
      <div class="search-container">
        <form @submit.prevent="submitSearch">
          <input type="text" v-model.trim="searchInput" />
        </form>
        <base-button @click="submitSearch" styleMode="search"
          >Search for recipe</base-button
        >
      </div>
      <ul>
        <li>
          <router-link v-if="url" :to="url">Search results</router-link>
        </li>
        <li>
          <router-link to="/favourites">Favourites</router-link>
        </li>
        <li>
          <router-link v-if="!isAuth" to="/auth">Login</router-link>
          <div class="logout" @click="logout" v-else>Logout</div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import useValidateInput from "../../hooks/validateInput.js";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const searchInput = ref("");

    const url = computed(function () {
      return store.getters["search/getUrl"];
    });
    const submitSearch = function () {
      if (searchInput.value === "") return;
      if (useValidateInput(searchInput.value, store)) {
        router.replace("/search");
        store.dispatch("search/sort", ["n", "n"]);
        store.dispatch("search/changeFilters", []);
        store.dispatch("search/resetSearchList");
        store.dispatch("search/setSearchingPage", 1);
        store.dispatch("search/setSearchString", searchInput.value);
        store.dispatch("search/generateSearchUrl");
        store.dispatch("search/forceFetch");
        searchInput.value = "";
      }
    };
    //logout
    const logout = function () {
      store.dispatch("auth/logout");
      router.push("/search");
    };

    //is logged
    const isAuth = computed(function () {
      return store.getters["auth/isAuthenticated"];
    });

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

    return {
      searchInput,
      submitSearch,
      clearInput,
      isError,
      handleError,
      url,
      isAuth,
      logout,
    };
  },
};
</script>

<style scoped>
header {
  font-size: 1.6rem;

  width: 100%;
  height: 7.4rem;
  background: var(--gradient);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.26);

  display: flex;
  justify-content: center;
  align-items: center;
}

header a,
.logout {
  text-decoration: none;
  color: var(--text-light);
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
}
.logout:hover,
a:active,
a:hover,
a.router-link-active {
  cursor: pointer;
  border: 1px solid var(--text-light);
  border-radius: 30px;
}

h1 {
  margin: 0;
  font-family: "Aladin", cursive;
  font-size: 4.4rem;
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

input {
  margin-right: 2rem;
  /* background-color: var(--backgroud-color); */
  color: var(--text-dark);
  padding: 1rem;
  width: 40rem;
  border-radius: 30px;
  border: none;
  font-size: 1.6rem;
}
input:focus {
  /* border-color: var(--color-grey-light-3); */
  outline: none;
  /* border-style: double; */
  /* border-width: thin; */
}

header nav {
  width: 90%;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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
  justify-self: flex-end;
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
