import { createRouter, createWebHistory } from "vue-router";

import RecipeStart from "./pages/search/RecipeStart.vue";
import RecipeResults from "./pages/search/RecipeResults.vue";
import FavouritePage from "./pages/favourites/FavouritePage.vue";
import UserAuth from "./pages/auth/UserAuth.vue";
import NotFound from "./pages/NotFound.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/search" },
    { path: "/search/", component: RecipeStart },
    {
      path: "/search/:query",
      name: "search",
      component: RecipeResults,
      props: true,
    },
    { path: "/favourites", component: FavouritePage },
    { path: "/auth", component: UserAuth },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

// router.beforeEach(function (to, from, next) {
//   const fromQuery = from.params.query;
//   const toQuery = to.params.query;
//   if (fromQuery) {
//     const checkFrom = fromQuery.substring(0, fromQuery.indexOf("&"));
//     const checkTo = toQuery.substring(0, toQuery.indexOf("&"));
//     console.log(checkFrom, checkTo);
//     if (checkFrom === checkTo) {
//       next("/search");
//     }
//   }
//   next();
// });
export default router;
