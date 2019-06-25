<template>
  <img
    v-if="src"
    :src="src"
    v-bind="$attrs"
    class="Avatar"
    :width="size"
    :height="size"
  />
</template>

<script>
import Identicon from 'identicon.js';

export default {
  name: 'Avatar',
  props: {
    hash: {
      type: String,
      required: true,
      validator: value => value.length >= 15
    },
    size: {
      type: [Number, String],
      default: 64
    },
    colored: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    options() {
      return {
        foreground: this.colored && [255, 120, 0, 255],
        background: [237, 239, 242, 255],
        format: 'svg'
      };
    },
    isValidHash() {
      return this.hash && this.hash.length >= 15;
    },
    src() {
      if (!this.isValidHash) return undefined;
      const hashSrc = new Identicon(this.hash, this.options).toString();
      return `data:image/svg+xml;base64,${hashSrc}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.Avatar {
  border-radius: 50%;
}
</style>
