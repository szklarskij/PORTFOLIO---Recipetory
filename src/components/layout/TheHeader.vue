<template>
  <header>
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
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    const router = useRouter();

    // onMounted(function () {
    //   return console.log(route.params.query);
    // });
    // const routeParam = computed(function)

    //get search string
    const searchInput = ref("");
    // let searchString = "";
    const clearInput = function () {
      searchInput.value = "";
    };
    const submitSearch = async function () {
      store.dispatch("search/resetSearchList");

      router.push("/search" + "/" + searchInput.value);
    };

    //reset input
    watch(
      () => route.params,
      () => {
        clearInput();
      }
    );

    return { searchInput, submitSearch, clearInput };
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
