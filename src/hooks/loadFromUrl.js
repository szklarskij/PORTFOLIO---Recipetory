export default function useLoadFromUrl() {
  const query = route.params.query;

  //recipe
  const recipeQuery = route.params.query.slice(0, query.indexOf("&"));
  if (!useValidateInput(recipeQuery, store)) {
    router.replace("/search");
    return;
  }
  store.dispatch("search/setSearchString", recipeQuery);
  //page
  const pageQuery = route.params.query.slice(query.indexOf("&") + 1);
  const page = pageQuery.slice(
    pageQuery.indexOf("=") + 1,
    pageQuery.indexOf("$")
  );
  if (+page) store.dispatch("search/setSearchingPage", +page);
  //sorting
  const sortQuery = route.params.query.slice(query.indexOf("$") + 1);
  const sort = Array.from(
    sortQuery.slice(sortQuery.indexOf("=") + 1, sortQuery.indexOf("=") + 3)
  );
  store.dispatch("search/setSortParams", sort);
  // store.dispatch("search/sort", sort);
  //filters
}
