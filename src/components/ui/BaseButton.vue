<template>
  <div>
    <a :href="urlto" v-if="url" :class="styleMode">
      <slot></slot>
    </a>
    <button v-else-if="!link && !url" :class="styleMode">
      <slot></slot>
    </button>
    <router-link v-else :to="to" :class="styleMode">
      <slot></slot>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    styleMode: {
      type: String,
      requried: false,
      default: null,
    },
    link: {
      type: Boolean,
      requried: false,
      default: false,
    },
    to: {
      type: String,
      requried: false,
      default: "/",
    },
    url: {
      type: Boolean,
      requried: false,
      default: false,
    },
    urlto: {
      type: String,
      requried: false,
      default: "/",
    },
  },
};
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 1rem 1.6rem;
  font: inherit;
  border: none;
  cursor: pointer;
  background: var(--gradient);
  border-radius: 30px;
  margin-right: 0.5rem;
  display: inline-block;
  color: var(--text-light);
  transition: 0.6s ease;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: var(--color-button-hover);
  transition: 0.6s ease;
  transform: scale(1.1);
}
.search {
  background: none;
  background-color: rgb(104, 104, 104);
}
.flat {
  background: none;
  color: var(--color-grad-2);
  border: none;
}

.outline {
  background: none;
  background-color: transparent;
  border-color: #270041;
  color: #270041;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: var(--color-button);
}
</style>
