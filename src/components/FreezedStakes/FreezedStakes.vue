<template>
  <div class="FreezedStakes">
    Unstakes Pending
    <template v-if="stakes.length">
      <StakeItem
        v-for="(stake, index) in stakes"
        :key="`${index}-${stake.timestamp}`"
        :index="index"
        :stake="stake"
        :now="now"
        class="mt-3"
      />
    </template>
    <div class="FreezedStakes__no-unstakes mt-3" v-else>Unstake to withdraw</div>
  </div>
</template>

<script>
import { setNowMixin } from '@/components/mixins';
import StakeItem from '@/components/FreezedStakes/StakeItem';

export default {
  name: 'FreezedStakes',
  components: { StakeItem },
  mixins: [setNowMixin],
  props: {
    stakes: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.FreezedStakes {
  text-align: left;

  &__no-unstakes {
    color: var(--blue-grey);
    font-size: 0.9rem;
  }
}
</style>
