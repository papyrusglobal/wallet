<template>
  <img v-if="src" :src="src" v-bind="$attrs" class="Avatar" />
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
    }
  },
  computed: {
    isValidHash() {
      return this.hash && this.hash.length >= 15;
    },
    src() {
      if (!this.isValidHash) return undefined;
      const hashSrc = new Identicon(this.hash, {
        foreground: [255, 120, 0, 255],
        background: [237, 239, 242, 255],
        format: 'svg'
      }).toString();
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
