<template functional>
  <div class="SuperContainer" v-bind="data.$attrs" :class="data.staticClass">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SuperContainer'
};
</script>

<style lang="scss" scoped>
.SuperContainer {
  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}
</style>
