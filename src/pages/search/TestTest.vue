<template>
  <section>
    <p>
      TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
    </p>
    <button @click="set">set</button>
    <p>{{ setVal }}</p>
  </section>
</template>
<script>
import { ref } from "vue";
export default {
  setup() {
    const set = function () {
      setVal.value = "changed";
    };
    const setVal = ref("test");
    return { setVal, set };
  },
};
</script>
