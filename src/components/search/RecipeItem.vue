<template>
  <li @click="goToRecipe">
    <div class="image">
      <img :src="image" :alt="label" width="150" height="150" />
    </div>
    <div class="item-label">
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

  margin: 1rem auto;

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
  object-fit: contain;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  height: 15rem;
  width: auto;
}
.image {
  grid-row: 1/3;
  height: 15rem;
  width: auto;
}
.badges {
  grid-column: -2/-1;
}
div {
  display: block;
}

/* 1115 */
@media (max-width: 69.68em) {
  li:hover,
  li:active {
    cursor: pointer;
    transition: none;
    transform: none;
  }
}

/* 612 */

@media (max-width: 38.25em) {
}
/* 520 */
@media (max-width: 32.5em) {
  .image {
    grid-row: 1/2;
    align-self: flex-start;
    height: 120px;
  }
  .badges {
    justify-content: center;
    padding: 1rem 2rem;
    grid-column: 1/-1;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    background-color: var(--text-light);
  }
  img {
    width: 120px;
    height: 120px;
    border-bottom-left-radius: 0;
  }
  h3 {
    margin-top: 0.5rem;
    font-size: 2rem;
  }
  p {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  li {
    gap: 0rem;
    column-gap: 0.6rem;
  }
}
</style>
