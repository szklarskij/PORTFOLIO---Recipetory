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
  white-space: nowrap;
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
  background-color: none;
  /* background: none; */
  transition: 0.6s ease;
  transform: scale(1.05);
}
.search {
  white-space: nowrap;
  color: var(--text-dark);
  background: none;
  background-color: var(--color-search-button-1);
}

.search:hover,
.search:active {
  color: var(--text-light);
  background: none;
}

.flat {
  background: none;
  color: var(--color-grad-2);
  border: none;
}

.outline {
  background: none;
  border: solid;
  border-width: 2px;
  background-color: transparent;
  border-color: var(--color-grad-2);
  color: var(--color-grad-2);
  border-radius: 30px;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: var(--color-button);
}
</style>
