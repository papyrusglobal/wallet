<template>
  <div
    class="Input"
    :class="{
      '--full-width': fullWidth,
      '--error': this.error,
      '--focused': this.focused || ![null, undefined, ''].includes(this.value),
      '--labeled': ![null, undefined, ''].includes(this.label)
    }"
  >
    <label v-if="label" class="Input__label text-overflow">
      {{ label }}
    </label>
    <input
      :value="value"
      class="Input__field"
      v-bind="$attrs"
      v-on="listeners"
      @focus="focused = true"
      @blur="focused = false"
    />
    <div v-if="errorText" class="Input__error-text">
      {{ errorText }}
    </div>
  </div>
</template>

<script>
import fullWidthMixin from './mixins/fullWidthMixin';

export default {
  name: 'Input',
  model: {
    prop: 'value',
    event: 'input'
  },
  mixins: [fullWidthMixin],
  props: {
    value: {},
    error: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: [Boolean, String],
      default: null
    },
    label: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      focused: false
    };
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event => {
          this.$emit('input', event.target.value);
        }
      };
    }
  },
  methods: {
    onFocus(event) {
      this.$emit('focus', event);
      this.focused = true;
    },
    onBlur(event) {
      this.$emit('blur', event);
      this.focused = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.Input {
  $parent: &;
  position: relative;

  &__field {
    padding: 20px 16px 18px;
    border: 1px solid var(--input-border);
    transition: border 0.25s;

    &:focus {
      border-color: var(--light-blue);
    }
  }

  &__label {
    pointer-events: none;
    position: absolute;
    padding: 17px 17px 15px;
    transition: all 0.25s;
    color: var(--grey);
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
  }

  &__error-text {
    text-align: left;
    color: var(--red);
    font-size: 0.9rem;
    margin: 4px 0;
  }

  &.--focused {
    #{$parent}__label {
      padding: 6px 17px;
      font-size: 0.8rem;
    }
  }

  &.--full-width {
    #{$parent}__field {
      width: 100%;
    }
  }

  &.--error {
    #{$parent}__label {
      color: var(--red);
    }
    #{$parent}__field {
      outline-color: var(--red);
      border-color: var(--red);
    }
  }

  &.--labeled {
    #{$parent}__field {
      padding: 30px 16px 8px;
    }
  }
}
</style>
