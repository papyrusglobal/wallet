<template>
  <div class="VoteCards">
    <div class="VoteCards__list">
      <div
        v-for="(slot, index) in slots"
        :key="index"
        :tabindex="disabled ? -1 : 0"
        :class="{
          '--selected': value === index,
          '--used': slot.timestamp > 0,
          '--disabled': disabled
        }"
        class="VoteCards__item"
        @click="handleChange(index)"
        @keydown.enter.space="handleChange(index)"
      />
    </div>
    <transition name="slide">
      <div
        v-if="currentSlot && currentSlot.timestamp > 0"
        class="VoteCards__info"
      >
        <div class="VoteCards__info-inner mt-2">
          <span class="VoteCards__info-date"
            >Vote slot used {{ currentSlotDate }} on</span
          >
          <span class="text-overflow">{{ currentSlot.address }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { format, formatDistanceToNow } from 'date-fns';

const DAY = 24 * 60 * 60 * 1000;

export default {
  name: 'VoteCards',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    slots: {
      type: Array,
      required: true
    }
  },
  computed: {
    currentSlot() {
      return this.slots[this.value];
    },
    currentSlotDate() {
      if (!this.currentSlot) return;
      const date = new Date(this.currentSlot.timestamp * 1000);
      const diff = new Date() - date;
      if (diff >= DAY) {
        return format(date, 'dd MMMM yyyy HH:mm');
      }
      return `${formatDistanceToNow(date)} ago`;
    }
  },
  methods: {
    handleChange(value) {
      if (this.disabled) return;
      this.$emit('change', value === this.value ? null : value);
    }
  },
  numberOfSlots: Array(7).fill(0)
};
</script>

<style lang="scss" scoped>
.VoteCards {
  &__list {
    display: flex;
    justify-content: space-between;
  }

  &__item {
    flex-basis: 44px;
    border: 1px solid var(--input-border);
    cursor: pointer;
    height: 56px;
    padding: 16px 0 14px;
    width: 14.3%;
    transition: all 0.15s;

    &.--used {
      background-color: var(--orange-bg);
      border-color: var(--orange);
    }

    &:not(.--disabled) {
      &:hover,
      &:focus {
        border-color: var(--light-blue);
      }
    }

    &.--selected {
      border-color: var(--blue);
      background-color: var(--blue);
      color: #fff;
      font-size: 1.2rem;
      padding: 17px 0 13px;
      font-weight: bold;
    }

    &.--disabled {
      opacity: 0.54;
      outline: none;
    }
  }

  &__info {
    text-align: left;

    &-inner {
      background: var(--orange-bg);
      padding: 8px 16px;
    }

    &-date {
      color: var(--orange);
      font-size: 0.9rem;
    }
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
