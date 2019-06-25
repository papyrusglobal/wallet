<template>
  <li
    class="PollItem"
    :class="{
      '--inactive': isInactive,
      '--has-votes': authority.votes > 0,
      '--voted': isVoted
    }"
    @click="!isInactive && $emit('select', authority.address)"
  >
    <Avatar :hash="authority.address" size="40" class="PollItem__avatar" />
    <div class="PollItem__text">
      <span class="text-overflow">{{ authority.address }}</span>
      <span class="PollItem__votes">
        {{ authority.votes }} vote{{ authority.votes === 1 ? '' : 's' }}
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
    authority: {
      type: Object,
      required: true
    },
    now: {
      type: Number,
      required: true
    }
  },
  computed: {
    isVoted() {
      return (
        !!this.authority.voted ||
        this.votedAddresses.includes(this.authority.address)
      );
    },
    timeLeft() {
      return this.authority.timestamp * 1000 - this.now;
    },
    isInactive() {
      return this.timeLeft <= 0;
    },
    ...mapGetters(['votedAddresses'])
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

  &:not(.--inactive) {
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
