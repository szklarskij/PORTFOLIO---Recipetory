import { createRouter, createWebHistory } from "vue-router";
import RecipeStart from "./pages/search/RecipeStart.vue";
import RecipeSelected from "./pages/recipe/RecipeSelected.vue";
import RecipeResults from "./pages/search/RecipeResults.vue";
import FavouritePage from "./pages/favourites/FavouritePage.vue";
import UserAuth from "./pages/auth/UserAuth.vue";
import NotFound from "./pages/NotFound.vue";
import store from "./store/index.js";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/search" },
    { path: "/search/", component: RecipeStart },
    {
      path: "/search/:query",
      name: "search",
      component: RecipeResults,
    },
    { path: "/recipe/:id", component: RecipeSelected },
    {
      path: "/favourites",
      component: FavouritePage,
      meta: { requiresAuth: true },
    },
    { path: "/auth", component: UserAuth },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

router.beforeEach(function (to, from, next) {
  // set redirect url after login

  if (to.path === "/auth") {
    store.dispatch("auth/setLastUrl", from.fullPath);

    if (store.getters["auth/isAuthenticated"]) {
      router.replace("/search");
      console.log("replace");
    }
  }
  // guard

  if (to.meta.requiresAuth && !store.getters["auth/isAuthenticated"]) {
    next("/auth");
  } else {
    next();
  }
});

export default router;
