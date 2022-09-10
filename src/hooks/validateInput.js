// import { useStore } from "vuex";

import router from "@/router";

export default function useValidateInput(searchString, store) {
  if (!searchString) {
    router.replace("/invalidUrl");
    return;
  }

  let validationOk = true;
  if (searchString.length < 3) {
    store.dispatch("search/setError", "Please input at least 3 characters");
    validationOk = false;
  }
  //poprawne litery
  let charsOk = true;
  const charArr = searchString.split("");
  const checkChar = function (char) {
    if (typeof char !== "string") {
      return false;
    }
    return char.toLowerCase() !== char.toUpperCase();
  };
  charArr.forEach((l) => {
    const check = checkChar(l);

    if (!check) {
      charsOk = false;
    }
  });

  if (!charsOk) {
    store.dispatch("search/setError", "Invalid character input");
    validationOk = false;
  }

  return validationOk;
}
