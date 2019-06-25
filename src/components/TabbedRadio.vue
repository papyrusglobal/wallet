<template>
  <div class="TabbedRadio">
    <div
      v-for="option in options"
      :key="option.value"
      class="TabbedRadio__item"
      :class="{ '--disabled': option.disabled }"
      :tabindex="option.disabled ? -1 : 0"
      @keydown.enter.space="$emit('change', option.value)"
    >
      <input
        type="radio"
        :name="option.name"
        :id="option.value"
        :value="option.value"
        :checked="value === option.value"
        :disabled="option.disabled"
        @change="$emit('change', $event.target.value)"
      />
      <label :for="option.value">{{ option.label }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabbedRadio',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {},
    options: {
      type: Array,
      required: true,
      validator: arr => arr.length > 1
    },
    name: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.TabbedRadio {
  display: flex;

  &__item {
    position: relative;
    z-index: 0;
    flex-grow: 1;
    flex-basis: 88px;
    min-width: 0;

    &:focus {
      z-index: 1;
    }

    &.--disabled {
      label {
        cursor: default;
        color: var(--grey);
      }
    }

    label {
      padding: 16px 16px 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      background-color: var(--white);
      border: 1px solid var(--blue-bg);
      cursor: pointer;
      transition: background-color 0.15s;
    }

    &:not(.--disabled) label:hover {
      color: var(--blue);
    }

    &:not(:last-child) {
      label {
        border-right: none;
      }
    }

    input {
      display: none;

      &:checked ~ label {
        color: var(--blue);
        font-weight: bold;
        background-color: var(--blue-bg);
      }
    }
  }
}
</style>
