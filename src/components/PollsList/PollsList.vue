<template>
  <ul class="PollsList">
    <template v-if="authorities.length">
      <PollItem
        v-for="address in authorities"
        :key="address"
        :address="address"
        :now="now"
        @select="$emit('select', $event)"
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
    authorities: {
      type: Array,
      default: () => []
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
