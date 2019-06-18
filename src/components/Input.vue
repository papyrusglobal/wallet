<template>
  <input
    :value="value"
    :class="{ '--full-width': fullWidth, '--error': this.error }"
    v-bind="$attrs"
    class="Input"
    v-on="$listeners"
    @input="$emit('changing', $event.target.value)"
  />
</template>

<script>
import fullWidthMixin from './mixins/fullWidthMixin';

export default {
  name: 'Input',
  model: {
    prop: 'value',
    event: 'changing'
  },
  mixins: [fullWidthMixin],
  props: {
    value: {},
    error: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.Input {
  padding: 20px 16px 18px;
  border: 1px solid var(--input-border);
  outline: none;

  &:focus {
    border-color: var(--light-blue);
  }

  &.--full-width {
    width: 100%;
  }

  &.--error {
    border-color: var(--red);
  }
}
</style>
