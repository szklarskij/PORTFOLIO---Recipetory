<template>
  <div>
    <base-container>
      <div class="padding">
        <div v-if="true">
          <p class="welcome">Welcome to</p>
          <h1>- Recipetory -</h1>

          <div class="svgs">
            <img src="../../assets/Salad.svg" alt="salad" width="100" />
            <img src="../../assets/Pizza.svg" alt="pizza" width="100" />
            <img
              src="../../assets/Spaghetti.svg"
              alt="spaghettin"
              width="100"
            />
            <img
              src="../../assets/Pie.svg"
              alt="pie"
              width="100"
              class="svg-hide"
            />
            <img
              src="../../assets/Sausage.svg"
              alt="sausage"
              width="100"
              class="svg-hide"
            />
          </div>
          <div class="search" @click="focus">
            <ion-icon name="search-outline"></ion-icon>
            <div>
              <h2>Start searching for recipes!</h2>
              <p class="hide">
                Please enter specific keywords at the top of the page e.g.
                "pizza"
              </p>
            </div>
          </div>
          <div v-if="!isAuth" class="buttons">
            <base-button @click="register">
              <p class="signup">Register new account</p>
            </base-button>
            <base-button @click="login" styleMode="flat">
              <p class="signup">Login</p>
            </base-button>
          </div>
          <div v-else class="buttons">
            <base-button @click="logout" styleMode="flat">
              <p class="signup">Logout</p>
            </base-button>
          </div>
        </div>
      </div>
    </base-container>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup(_, context) {
    const router = useRouter();
    const store = useStore();
    const register = function () {
      store.dispatch("auth/registerFromMainPage", true);
      router.push("/auth");
    };

    const login = function () {
      router.push("/auth");
    };
    const smallView = inject("small-view");

    const logout = function () {
      store.dispatch("auth/logout");
      router.push("/search");
    };
    const isAuth = computed(function () {
      return store.getters["auth/isAuthenticated"];
    });

    const focus = function () {
      // console.log(smallView);
      if (!smallView.value) {
        document.getElementById("searchBtn").focus();
      } else {
        context.emit("select-mobile-input");
      }
    };
    return { register, login, logout, isAuth, focus };
  },
};
</script>

<style scoped>
.welcome {
  text-align: center;
  white-space: nowrap;
  font-size: 2rem;
  color: var(--text-dark);
}
.search {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* height: 50vh; */
  /* min-height: 35vh; */
  /* padding: 2rem; */
}
ion-icon {
  color: inherit;
  font-size: 7rem;
  margin-right: 3rem;
}

.svgs {
  height: 10rem;
  margin: 8.6rem 8.2rem;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
h1 {
  white-space: nowrap;
  text-align: center;
  font-size: 6.2rem;
  font-family: "Aladin", cursive;
  color: var(--text-dark);
}
h2 {
  font-size: 3.6rem;
}

.signup {
  font-size: 2rem;
  padding: 0 2rem;
}
.buttons {
  display: flex;
  margin-top: 8.6rem;
  justify-content: center;
  gap: 2rem;
}
/* 830 */
@media (max-width: 51.87em) {
  .svgs {
    margin: 8.6rem 0;
  }
  h2 {
    font-size: 2.6rem;
  }
}

/* 612 */

@media (max-width: 38.25em) {
  .svgs {
    height: 8rem;
  }
  .hide {
    display: none;
  }
}
/* 520 */

@media (max-width: 32.5em) {
  .svg-hide {
    display: none;
  }
  .svgs {
    margin: 5.6rem 0;
  }
  h2 {
    font-size: 2rem;
  }
  .buttons {
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    margin-top: 3.6rem;
  }
}
/* 405 */
@media (max-width: 25.31em) {
  h1 {
    font-size: 5.2rem;
  }
  .svgs {
    margin: 3rem 0;
  }
  .hide {
    display: none;
  }
}
/* 360 */
@media (max-width: 20em) {
  h1 {
    font-size: 4.2rem;
  }
  .svgs {
    margin: 3rem 0;
    height: 5rem;
  }
  .hide {
    display: none;
  }
  .search ion-icon {
    margin-right: 1rem;
  }
  .signup {
    font-size: 1.6rem;
  }
}
</style>
