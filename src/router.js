import { createRouter, createWebHistory } from "vue-router";

import RecipeStart from "./pages/search/RecipeStart.vue";
import RecipeResults from "./pages/search/RecipeResults.vue";
import FavouritePage from "./pages/favourites/FavouritePage.vue";
import UserAuth from "./pages/auth/UserAuth.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/search" },
    { path: "/search/", component: RecipeStart },
    { path: "/search/:query", component: RecipeResults, props: true },
    { path: "/favourites", component: FavouritePage },
    { path: "/auth", component: UserAuth },
    // {
    //   path: "/coaches/:id",
    //   component: CoachDetail,
    //   props: true,
    //   children: [{ path: "contact", component: ContactCoach }],
    // },
    // { path: "/:notFound(.*)", component: NotFound },
  ],
});
export default router;
