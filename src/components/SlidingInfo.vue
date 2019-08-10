<template>
  <transition name="slide">
    <div class="SlidingInfo" v-bind="$attrs">
      <div class="SlidingInfo__inner mt-2">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SlidingInfo',
  inheritAttrs: false
};
</script>

<style lang="scss" scoped>
.SlidingInfo {
  text-align: left;

  &__inner {
    background: var(--blue-bg);
    padding: 8px 16px;
  }
}
</style>
