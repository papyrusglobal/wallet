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

.slide-enter-active {
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  max-height: 128px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
