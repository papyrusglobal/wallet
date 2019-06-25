<template>
  <li
    class="PollItem"
    :class="{ '--inactive': timeLeft <= 0 }"
    @click="$emit('select', address)"
  >
    <Avatar :hash="address" size="40" class="PollItem__avatar" />
    <div class="PollItem__text">
      <span class="text-overflow">{{ address }}</span>
      <span class="PollItem__votes">
        {{ votes }} vote{{ votes === 1 ? '' : 's' }}
      </span>
      <span class="PollItem__due"
        >&rsaquo; {{ timeLeft | millisecondsToWords }}</span
      >
    </div>
  </li>
</template>

<script>
import { millisecondsToWords } from '@/utils/filters';
import Avatar from '@/components/Avatar';

const POLL_CONSTANT_TIME = 67 * 1000;

export default {
  name: 'PollItem',
  components: { Avatar },
  filters: {
    millisecondsToWords
  },
  props: {
    address: {
      type: String,
      required: true
    },
    now: {
      type: Number,
      required: true
    }
    // votes: {
    //   type: Number,
    //   default: 0
    // }
  },
  data() {
    return {
      votes: 0
    };
  },
  beforeMount() {
    this.votes = Math.floor(Math.random() * 50);
    this.mountTime = Date.now() + Math.floor(Math.random() * 100) * 1000;
  },
  computed: {
    timeLeft() {
      return POLL_CONSTANT_TIME + this.mountTime - this.now;
    }
  }
};
</script>

<style lang="scss" scoped>
.PollItem {
  $parent: &;

  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 8px 0;
  transition: opacity 0.25s;

  /*&:last-child {*/
  /*padding-bottom: 0;*/
  /*}*/

  &.--inactive {
    opacity: 0.57;
  }

  &:hover {
    #{$parent}__text {
      background: var(--blue-bg);
    }
  }

  &__avatar {
    flex-shrink: 1;
    margin-right: 8px;
  }

  &__text {
    flex-basis: auto;
    flex-grow: 1;
    min-width: 0;
    padding: 9px 8px 7px;
    transition: background-color 0.15s;
  }

  &__votes {
    color: var(--blue);
  }
}
</style>
