<template>
  <li>
    <img :src="image" :alt="label" width="150" height="150" />
    <div>
      <h3>{{ label }}</h3>
      <p>By: {{ source }}</p>
      <!-- <h3>{{ label }}</h3> -->
    </div>
  </li>
</template>
<script>
export default {
  props: ["label", "image", "source"],
};
</script>
<style scoped>
li {
  list-style: none;
  gap: 3rem;
  display: flex;
  margin: 0;
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  /* padding: 1rem; */
  margin: 1rem auto;
  max-width: 60rem;
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
</style>
