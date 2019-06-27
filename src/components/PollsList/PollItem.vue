<template>
  <li
    class="PollItem"
    :class="{
      '--inactive': isInactive,
      '--disabled': disabled,
      '--has-votes': poll.votes > 0,
      '--voted': isVoted
    }"
    @click="!isInactive && !disabled && $emit('select', poll.address)"
  >
    <Avatar :hash="poll.address" size="40" class="PollItem__avatar" />
    <div class="PollItem__text">
      <span class="text-overflow">{{ poll.address }}</span>
      <span class="PollItem__votes">
        {{ poll.votes }} vote{{ poll.votes === 1 ? '' : 's' }}
      </span>
      <span class="PollItem__due"
        >&rsaquo; {{ timeLeft | millisecondsToWords('closed') }}</span
      >
    </div>
  </li>
</template>

<script>
import { mapGetters } from 'vuex';
import { millisecondsToWords } from '@/utils/filters';
import Avatar from '@/components/Avatar';

export default {
  name: 'PollItem',
  components: { Avatar },
  filters: {
    millisecondsToWords
  },
  props: {
    poll: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    now: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters(['votedAddresses']),
    isVoted() {
      return (
        !!this.poll.voted ||
        (!('voted' in this.poll) &&
          this.votedAddresses.includes(this.poll.address))
      );
    },
    timeLeft() {
      return this.poll.timestamp * 1000 - this.now;
    },
    isInactive() {
      return this.timeLeft <= 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.PollItem {
  $parent: &;

  display: flex;
  align-items: center;
  padding: 8px 0;
  transition: opacity 0.25s;

  &.--has-votes {
    #{$parent}__votes {
      color: var(--blue);
    }
  }

  &.--voted {
    #{$parent}__votes {
      color: var(--green);
    }
  }

  &.--inactive {
    opacity: 0.57;
  }

  &:not(.--inactive):not(.--disabled) {
    cursor: pointer;

    &:hover {
      #{$parent}__text {
        background: var(--blue-bg);
      }
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
}
</style>
