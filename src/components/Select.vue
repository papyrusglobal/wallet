<template>
  <select
    v-bind="$attrs"
    v-on="$listeners"
    class="Select"
    :class="{ '--full-width': fullWidth, '--error': this.error }"
    @change="handleChange"
  >
    <template v-if="options">
      <option
        v-for="option in options"
        :selected="isSelected(option)"
        :key="option.title.split(' ').join('_')"
        :disabled="option.disabled"
        :value="valueAttr ? option[valueAttr] : option.value"
      >
        {{ option.title }}
      </option>
    </template>
    <slot v-else />
  </select>
</template>

<script>
import shallowequal from 'shallowequal';
import { fullWidthMixin, inputModelMixin } from '@/components/mixins';

export default {
  name: 'Select',
  mixins: [fullWidthMixin, inputModelMixin],
  props: {
    options: {
      type: Array,
      default: null
    },
    valueAttr: {
      type: String,
      default: null
    },
    asObject: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChange(event) {
      const { valueAttr } = this;
      this.$emit(
        'changing',
        this.asObject && this.options
          ? this.options.find(
              o => (valueAttr ? o[valueAttr] : o.value) === event.target.value
            )
          : event.target.value
      );
    },
    isSelected(option) {
      return this.asObject && this.options
        ? shallowequal(this.value, option)
        : this.value === option;
    }
  }
};
</script>

<style lang="scss" scoped>
.Select {
  max-width: 100%;
  padding: 20px 56px 18px 16px;
  border: 1px solid var(--input-border);
  background-color: var(--white);
  background-image: url('../assets/icons/arrow_down.svg');
  background-repeat: no-repeat;
  background-size: 24px;
  background-position: right 16px center;
  border-radius: 0;
  outline: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;

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
