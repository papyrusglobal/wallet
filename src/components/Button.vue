<template>
  <button v-bind="binding" v-on="$listeners" :class="classes">
    <slot />
    <Spinner v-if="loading" class="Button__spinner"></Spinner>
  </button>
</template>

<script>
import { fullWidthMixin } from '@/components/mixins';
import Spinner from '@/components/Spinner';

export default {
  name: 'Button',
  components: { Spinner },
  mixins: [fullWidthMixin],
  props: {
    to: {
      type: [String, Object],
      default: null
    },
    href: {
      type: String,
      default: null
    },
    small: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    binding() {
      const binding = {
        ...this.$attrs,
        is: this.href ? 'a' : 'button',
        href: this.href
      };
      if (this.to) {
        binding.is = 'router-link';
        binding.to = this.to;
        delete binding.href;
      }
      if (this.loading) {
        binding.disabled = true;
      }
      return binding;
    },
    classes() {
      return {
        Button: true,
        '--full-width': this.fullWidth,
        '--outline': this.outline,
        '--small': this.small,
        '--loading': this.loading
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.Button {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.12rem;
  background-color: var(--blue);
  color: var(--white);
  border: 0;
  padding: 21px 24px 19px;
  text-align: center;
  min-width: 88px;
  cursor: pointer;
  user-select: none;
  transition: all 300ms ease;

  .Button__spinner {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    width: 24px;
    height: 24px;
    color: var(--white);
  }

  &:not(:disabled):not(.--loading):hover {
    transform: translate(0px, -4px);
    box-shadow: 0 4px 14px -4px var(--blue);
  }

  &:not(.--loading):disabled {
    opacity: 0.34;
    cursor: default;
  }

  &.--full-width {
    width: 100%;
  }

  &.--outline {
    background-color: transparent;
    border: 1px solid var(--blue);
    color: var(--blue);

    .Button__spinner {
      color: var(--blue);
    }
  }

  &.--small {
    font-size: 0.9rem;
    padding: 12px 24px 11px;

    .Button__spinner {
      width: 20px;
      height: 20px;
    }
  }

  &.--loading {
    position: relative;
    color: rgba(0, 0, 0, 0);
  }
}
</style>
