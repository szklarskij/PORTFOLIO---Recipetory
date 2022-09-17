<template>
  <div>
    <base-spinner v-if="isLoading"></base-spinner>

    <base-container v-else>
      <div class="padding" v-show="!isAuth">
        <h2 v-if="isLogging">Log in</h2>
        <h2 v-else>Register</h2>
        <form @submit.prevent="sumbitAuth">
          <div class="form-control">
            <label for="email">E-mail</label>
            <input
              type="email"
              @keydown="clearEmailError"
              id="email"
              v-model.trim="email"
              ref="emailInput"
            />
            <p class="error-valid" v-if="emailError">
              Please enter a valid email adress
            </p>
          </div>
          <div class="form-control">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              @keydown="clearPasswordError"
              v-model.trim="password"
            />
            <p class="error-valid" v-if="passwordError">
              Password must be at least 6 characters long
            </p>
          </div>
          <div class="form-control" v-if="!isLogging">
            <label for="re-password">Confirm password</label>
            <input
              type="password"
              @keydown="clearRePasswordError"
              id="re-password"
              v-model.trim="rePassword"
            />
            <p class="error-valid" v-if="rePasswordError">
              Retyped password is incorrect
            </p>
          </div>

          <div class="buttons">
            <base-button>
              <p v-if="!isLogging">Register</p>
              <p v-else>Log in</p>
            </base-button>
            <base-button styleMode="flat" @click.prevent="switchMode"
              ><p v-if="!isLogging">Login instead</p>
              <p v-else>Register new account</p></base-button
            >
          </div>
        </form>
      </div>
    </base-container>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    /////////////////////////////////////////////////////////////////////// auth elements

    const isLoading = ref(false);
    const isLogging = ref(true);
    const formIsValid = ref(true);
    const emailInput = ref(null);
    const email = ref("");
    const emailLogin = ref("");
    const emailError = ref(false);
    const password = ref("");
    const passwordLogin = ref("");
    const passwordError = ref(false);
    const rePassword = ref("");
    const rePasswordError = ref(false);
    const isAuth = computed(function () {
      return store.getters["auth/isAuthenticated"];
    });

    /////////////////////////////////////////////////////////////////////// switch between log and sign

    const switchMode = function () {
      emailError.value = false;
      passwordError.value = false;
      rePasswordError.value = false;
      email.value = "";
      password.value = "";
      rePassword.value = "";
      isLogging.value = !isLogging.value;
      emailInput.value.focus();
    };
    const clearEmailError = function () {
      emailError.value = false;
    };
    const clearPasswordError = function () {
      passwordError.value = false;
    };
    const clearRePasswordError = function () {
      rePasswordError.value = false;
    };

    /////////////////////////////////////////////////////////////////////// sumbit

    const sumbitAuth = async function () {
      formIsValid.value = true;
      emailError.value = false;
      passwordError.value = false;
      rePasswordError.value = false;

      if (email.value === "" || !email.value.includes("@")) {
        emailError.value = true;
        formIsValid.value = false;
      }
      if (password.value === "" || password.value.length < 6) {
        passwordError.value = true;
        formIsValid.value = false;
      }

      if (!isLogging.value && password.value !== rePassword.value) {
        rePasswordError.value = true;
        formIsValid.value = false;
      }
      if (formIsValid.value) {
        isLoading.value = true;
        try {
          if (!isLogging.value) {
            await store.dispatch("auth/signup", {
              email: email.value,
              password: password.value,
            });
            redirect();
          } else {
            await store.dispatch("auth/login", {
              email: email.value,
              password: password.value,
            });
            redirect();
          }
        } catch (err) {
          store.dispatch("search/setError", err.message);
          isLoading.value = false;
        }
      }
    };
    const redirect = function () {
      if (store.getters["auth/getLastUrl"]) {
        router.replace(store.getters["auth/getLastUrl"]);
      } else {
        router.replace("/search");
      }
      isLoading.value = false;
    };
    /////////////////////////////////////////////////////////////////////// register from main page

    const registerFromMainPage = function () {
      if (store.getters["auth/registerFromMainPage"]) {
        isLogging.value = false;
        store.dispatch("auth/registerFromMainPage", false);
      }
    };
    registerFromMainPage();

    return {
      isLoading,
      isLogging,
      switchMode,
      sumbitAuth,
      email,
      emailError,
      password,
      passwordError,
      rePassword,
      rePasswordError,
      emailLogin,
      passwordLogin,
      clearEmailError,
      clearRePasswordError,
      clearPasswordError,
      emailInput,
      isAuth,
    };
  },
};
</script>

<style scoped>
.padding {
  padding: 1rem;
}
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
.buttons {
  margin-top: 2rem;
  display: flex;
}
p {
  margin: 0;
}

.error-valid {
  color: red;
  margin: 0 0 1rem;
}
</style>
