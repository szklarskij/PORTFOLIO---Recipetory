<template>
  <header>
    <base-dialog :show="!!isError" :title="dialogTitle" @close="handleError">
      <p>{{ isError }}</p>
    </base-dialog>
    <base-dialog v-if="showDemo" show title="DEMO" @close="handleDemo">
      <the-demo></the-demo>
    </base-dialog>
    <nav>
      <h1><router-link to="/" @click="clearInput">Recipetory</router-link></h1>
      <div v-if="!smallView" class="search-container">
        <form @submit.prevent="submitSearch">
          <input id="searchBtn" type="text" v-model.trim="searchInput" />
        </form>
        <base-button @click="submitSearch" styleMode="search"
          ><p class="p-search"></p
        ></base-button>
      </div>
      <ul v-if="!mediumView">
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
      <div v-else class="mobile-menu">
        <ion-icon @click="setMobileMenu" name="menu-outline"></ion-icon>
      </div>

      <mobile-menu
        v-if="mobileMenuOpened && mediumView"
        @close-mobile-menu="setMobileMenu"
        ><ul class="mobile-list">
          <li v-if="smallView" class="search-mobile">
            <form @submit.prevent="submitSearch">
              <input
                id="searchBtn-mobile"
                type="text"
                v-model.trim="searchInput"
                autofocus
              />
            </form>
            <div class="search-mobile-btn">
              <base-button @click="submitSearch" styleMode="search"
                ><p class="p-search"></p
              ></base-button>
            </div>
          </li>

          <li v-if="url">
            <router-link @click="setMobileMenu" :to="url"
              >Search results</router-link
            >
          </li>
          <li>
            <router-link @click="setMobileMenu" to="/favourites"
              >Favourites</router-link
            >
          </li>
          <li>
            <router-link @click="setMobileMenu" v-if="!isAuth" to="/auth"
              >Login</router-link
            >
            <div class="logout" @click="logout" v-else>Logout</div>
          </li>
        </ul>
      </mobile-menu>
    </nav>
  </header>
</template>

<script>
import TheDemo from "./../layout/TheDemo.vue";
import { useStore } from "vuex";
import { ref, computed, inject, watch } from "vue";
import { useRouter } from "vue-router";
import useValidateInput from "../../hooks/validateInput.js";

export default {
  components: { TheDemo },
  setup() {
    /////////////////////////////////////////////////////////////////////// watch for mobile input open
    const selectMobileInput = inject("select-mobile-input");
    watch(selectMobileInput, function () {
      mobileMenuOpened.value = true;
    });

    const mediumView = inject("medium-view");
    const smallView = inject("small-view");

    /////////////////////////////////////////////////////////////////////// open mobile menu
    const mobileMenuOpened = ref(false);
    const setMobileMenu = function () {
      mobileMenuOpened.value = !mobileMenuOpened.value;
    };

    const store = useStore();
    const router = useRouter();

    const dialogTitle = ref("An error occured!");

    const searchInput = ref("");

    const url = computed(function () {
      return store.getters["search/getUrl"];
    });

    const submitSearch = function () {
      if (searchInput.value === "") return;
      mobileMenuOpened.value = false;
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
      mobileMenuOpened.value = false;
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
    };
    //demo
    const showDemo = ref(false);

    const checkVisited = localStorage.getItem("demo");
    if (checkVisited !== "visited") showDemo.value = true;

    const handleDemo = function () {
      showDemo.value = false;
      localStorage.setItem("demo", "visited");
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
      dialogTitle,
      mediumView,
      smallView,
      setMobileMenu,
      mobileMenuOpened,
      handleDemo,
      showDemo,
    };
  },
};
</script>

<style scoped>
header {
  font-size: 1.6rem;
  overscroll-behavior: none;
  position: static;
  top: 100rem;
  background: var(--gradient);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.26);
  overflow-x: none;
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
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

form {
  justify-self: flex-end;
  margin-right: 2rem;
}
input {
  /* background-color: var(--backgroud-color); */
  color: var(--text-dark);
  padding: 1rem;
  width: 30rem;
  border-radius: 30px;
  border: none;
  font-size: 1.6rem;
  transform-origin: right;
  transition: transform 0.3s ease;
}
input:focus {
  border-color: var(--color-search-button-1);
  outline: none;
  border-style: double;
  transform: scaleX(1.1);
  transform-origin: right;
  transition: transform 0.3s ease;
  /* border-width: thin; */
}

header nav {
  width: 90%;
  margin: auto;
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr;
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
  white-space: nowrap;
}

.search-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  justify-content: center;
  align-items: center;
}

ion-icon {
  font-size: 5rem;
  color: var(--text-light);
}
.mobile-menu {
  justify-self: flex-end;
  padding: 0 2rem;
  cursor: pointer;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.mobile-list {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.mobile-list li {
  z-index: 15;
  font-size: 3rem;
  margin: 0 0 2rem 0;
  color: var(--text-light);
  display: flex;
  justify-content: center;
  width: 100%;
}
.p-search:before {
  content: "Search for recipe";
}

.search-mobile {
  display: flex;
  gap: 2rem;
  flex-direction: column;
  align-content: center;
}

.search-mobile form {
  margin: 0;
  font-size: 3rem;
  display: flex;
  justify-content: center;
}

.search-mobile input {
  width: 90%;
  font-size: 3rem;
}
.search-mobile input:focus {
  transform: scaleX(1);
}
.search-mobile-btn {
  display: flex;
  justify-content: center;
  margin-bottom: 5rem;
}
/*QUERIES*/
/* 1220 */
@media (max-width: 76.25em) {
  header nav {
    width: 98%;
  }
}
/* 1115 */
@media (max-width: 69.68em) {
  header nav {
    width: 100%;
  }
  input {
    width: 25rem;
  }
  input:focus {
    width: 28rem;
  }
  header nav {
    grid-template-columns: 0.5fr 2fr 0.2fr;
  }
}
/* 750 */
@media (max-width: 46.87em) {
  .p-search:before {
    content: "";
  }
  .p-search:after {
    content: "Search";
  }
  header nav {
    grid-template-columns: 1fr 5fr 1fr;
  }
  .search-container {
    grid-template-columns: 4fr 1fr;
  }
  input {
    width: 20rem;
  }
  input:focus {
    width: 22rem;
  }
}
/* 612 */

@media (max-width: 38.25em) {
  header nav {
    grid-template-columns: 1fr 1fr;
  }
  input {
    font-size: 4rem;
    transition: none;
  }
  input:focus {
    width: 90%;
    transition: none;
    border-style: none;
  }
}
</style>
