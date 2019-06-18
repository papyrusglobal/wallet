<template>
  <svg
    version="1.1"
    xlink:href="http://www.w3.org/1999/xlink"
    xml:space="preserve"
    x="0px"
    y="0px"
    viewBox="22 22 44 44"
    :width="size"
    :height="size"
    v-bind="$attrs"
  >
    <circle cx="44" cy="44" r="20.2" stroke-width="3.6" fill="none">
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="rotate"
        from="0 44 44"
        to="360 44 44"
        dur="1.4s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
</template>

<script>
export default {
  name: 'Spinner',
  props: {
    size: {
      type: [Number, String],
      default: 24
    }
  }
};
</script>

<style lang="scss" scoped>
svg {
  display: inline-block;
  font-size: 24px;
  fill: currentColor;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  flex-shrink: 0;
  user-select: none;
  color: blue;

  circle {
    stroke-dasharray: 80px, 200px;
    stroke-dashoffset: 0px;
    stroke: currentColor;
    animation: circular-progress 1.4s ease-in-out infinite;

    @keyframes circular-progress {
      0% {
        stroke-dasharray: 1px, 200px;
        stroke-dashoffset: 0px;
      }
      50% {
        stroke-dasharray: 100px, 200px;
        stroke-dashoffset: -15px;
      }
      100% {
        stroke-dasharray: 100px, 200px;
        stroke-dashoffset: -125px;
      }
    }
  }
}
</style>
