<template>
  <div class="FreezedStakes">
    Pending Freezed Stakes:
    <StakeItem
      v-for="(stake, index) in stakes"
      :key="stake.timestamp"
      :index="index"
      :stake="stake"
      :now="now"
    />
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
}
</style>
