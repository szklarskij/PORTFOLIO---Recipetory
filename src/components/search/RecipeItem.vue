<template>
  <li @click="goToRecipe">
    <div class="image">
      <img :src="image" :alt="label" width="150" height="150" />
    </div>
    <div>
      <h3>{{ label }}</h3>
      <p>By: {{ source }}</p>
    </div>
    <div class="badges">
      <base-badge
        v-for="badge in badges"
        :key="badge"
        :type="badge"
      ></base-badge>
    </div>
  </li>
</template>
<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  props: {
    label: { type: String },
    image: { type: String },
    source: { type: String },
    healthLabels: { type: Array },
    id: { type: String },
  },

  setup(props) {
    const router = useRouter();
    const badges = ref(props.healthLabels);
    const goToRecipe = function () {
      router.push("/recipe/" + props.id);
    };
    return { badges, goToRecipe };
  },
};
</script>
<style scoped>
li {
  background-color: white;
  list-style: none;
  gap: 2rem;
  display: grid;
  grid-template-columns: 1fr 10fr;
  margin: 0;
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  /* padding: 1rem; */
  margin: 1rem auto;
  /* max-width: 60rem; */
  transition: transform 0.6s ease;
}

h3 {
  margin-top: 2rem;
  font-size: 2rem;
}
p {
  font-size: 1.6rem;
  margin-bottom: 2rem;
}

li:hover,
li:active {
  cursor: pointer;
  transition: transform 0.6s ease;
  transform: translateX(-1rem);
}
img {
  /* border-radius: 50%; */
  /* overflow: hidden; */
  object-fit: contain;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  height: 100%;
}
.image {
  grid-row: 1/3;
}
.badges {
  grid-column: -2/-1;
}
div {
  display: block;
}
/* 720*/
@media (max-width: 45em) {
  li {
    gap: 1rem;
  }
}
/* 612 */

@media (max-width: 38.25em) {
  h3 {
    margin-top: 0.5rem;
    font-size: 2rem;
  }
  p {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  li {
    gap: 0.8rem;
  }
}
/* 520 */
@media (max-width: 32.5em) {
  .image {
    grid-row: 1/2;
    align-self: flex-start;
    /* height: 80%; */
  }
  .badges {
    justify-content: center;
    margin: 0 2rem 1rem;
    grid-column: 1/-1;
  }
  img {
    width: 120px;
    border-bottom-left-radius: 0;
  }
}
</style>
