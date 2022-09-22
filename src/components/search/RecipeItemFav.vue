<template>
  <div class="el">
    <li @click="goToRecipe">
      <div class="star-container">
        <ion-icon class="star" name="star-outline"></ion-icon>
      </div>
      <div>
        <h3>{{ label }}</h3>
        <p>By: {{ source }}</p>
      </div>
    </li>

    <ion-icon @click="del" class="trash" name="trash-outline"></ion-icon>
  </div>
</template>
<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  props: {
    label: { type: String },
    source: { type: String },
    id: { type: String },
  },

  setup(props, context) {
    const router = useRouter();
    const badges = ref(props.healthLabels);
    const goToRecipe = function () {
      router.push("/recipe/" + props.id);
    };

    const del = function () {
      context.emit("remove-recipe", props.id);
    };

    return { badges, goToRecipe, del };
  },
};
</script>
<style scoped>
.star-container {
  display: flex;
}

.star {
  font-size: 3rem;
  align-self: center;
  justify-self: center;
  margin-left: 2rem;
}
li {
  background-color: white;
  list-style: none;
  gap: 2rem;
  display: flex;
  margin: 0;
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  /* padding: 1rem; */
  margin: 1rem auto;
  /* max-width: 60rem; */
  transition: 0.6s ease;
  width: 100%;
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
  transition: 0.6s ease;
  transform: translateX(-1rem);
}
img {
  /* border-radius: 50%; */
  /* overflow: hidden; */
  object-fit: contain;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}
div {
  display: block;
}

.el {
  display: flex;
}

.trash {
  font-size: 3rem;
  align-self: center;
  padding: 1rem;
}
.trash:hover,
.trash:active {
  cursor: pointer;
  color: var(--color-error);
}
</style>
