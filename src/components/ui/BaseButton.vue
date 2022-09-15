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
  background-color: var(--color-button);
  border: none;
  cursor: pointer;
  border-radius: 30px;
  margin-right: 0.5rem;
  display: inline-block;
  color: var(--text-dark);
  transition: 0.6s ease;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: var(--color-button-hover);
  border-color: #270041;
  transition: 0.6s ease;
  transform: scale(1.02);
}

.flat {
  background-color: transparent;
  color: #3a0061;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #270041;
  color: #270041;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #edd2ff;
}
</style>
