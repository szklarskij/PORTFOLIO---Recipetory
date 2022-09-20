<template>
  <header>
    <base-dialog :show="!!isError" :title="dialogTitle" @close="handleError">
      <p>{{ isError }}</p>
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
        <ion-icon @click="openNav" name="menu-outline"></ion-icon>
      </div>
      <div
        @click="openNav"
        class="close-nav-btn"
        v-if="navOpened && mediumView"
      >
        <ion-icon name="close-outline"></ion-icon>
      </div>
      <div class="mobile-nav" v-if="navOpened && mediumView">
        <ul>
          <li v-if="smallView" class="search-mobile">
            <form @submit.prevent="submitSearch">
              <input id="searchBtn" type="text" v-model.trim="searchInput" />
            </form>
            <div class="search-mobile-btn">
              <base-button @click="submitSearch" styleMode="search"
                ><p class="p-search"></p
              ></base-button>
            </div>
          </li>

          <li>
            <router-link @click="openNav" v-if="url" :to="url"
              >Search results</router-link
            >
          </li>
          <li>
            <router-link @click="openNav" to="/favourites"
              >Favourites</router-link
            >
          </li>
          <li>
            <router-link @click="openNav" v-if="!isAuth" to="/auth"
              >Login</router-link
            >
            <div class="logout" @click="logout" v-else>Logout</div>
          </li>
        </ul>
        <div class="backdrop"></div>
      </div>
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
    //mobile
    const screenWidth = ref(window.innerWidth);
    const handleResize = function () {
      screenWidth.value = window.innerWidth;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const mediumView = computed(function () {
      return screenWidth.value <= 1115;
    });
    const smallView = computed(function () {
      return screenWidth.value <= 612;
    });

    const navOpened = ref(false);
    const openNav = function () {
      navOpened.value = !navOpened.value;
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
      navOpened.value = false;
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
      dialogTitle,
      mediumView,
      smallView,
      openNav,
      navOpened,
    };
  },
};
</script>

<style scoped>
header {
  font-size: 1.6rem;
  /* min-width: 100vh; */
  /* width: 100%; */
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
  transition: 0.3s ease;
}
input:focus {
  border-color: var(--color-search-button-1);
  outline: none;
  border-style: double;
  width: 35rem;
  transition: 0.3s ease;
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

.mobile-nav {
  position: fixed;
  /* left: 50%; */
  top: 20%;
  width: 100%;
  z-index: 12;
}
.mobile-nav ul {
  display: flex;
  flex-direction: column;
}
.mobile-nav li {
  z-index: 15;
  font-size: 4rem;
  margin-bottom: 2rem;
  /* background-color: var(--color-grad-2); */
  color: var(--text-light);
  display: flex;
  justify-content: center;
  width: 100%;
}
.p-search:before {
  content: "Search for recipe";
}
.close-nav-btn {
  /* display: flex; */
  position: fixed;
  top: 2%;
  right: 5%;
  z-index: 99;
}
.close-nav-btn ion-icon {
  /* z-index: 99; */

  font-size: 8rem;
  color: var(--text-light);
}

.search-mobile {
  display: flex;
  gap: 2rem;
  flex-direction: column;
  align-content: center;
}

.search-mobile form {
  margin: 0;
  display: flex;
  justify-content: center;
}

.search-mobile input {
  width: 90%;
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
