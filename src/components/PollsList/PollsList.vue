<template>
  <ul class="PollsList">
    <template v-if="polls.length">
      <PollItem
        v-for="poll in polls"
        :key="poll.address"
        :poll="poll"
        :disabled="disabled"
        :now="now"
        @select="!disabled && $emit('select', $event)"
      />
    </template>
    <template v-else>
      <li class="PollsList__empty">
        Nothing here.
      </li>
    </template>
  </ul>
</template>

<script>
import { setNowMixin } from '@/components/mixins';
import PollItem from '@/components/PollsList/PollItem';

export default {
  name: 'PollsList',
  components: { PollItem },
  mixins: [setNowMixin],
  props: {
    polls: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.PollsList {
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: left;

  &__empty {
    color: var(--grey);
    text-align: center;
    margin: 32px 0 16px;
  }
}
</style>
