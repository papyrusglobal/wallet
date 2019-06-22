<template>
  <div class="FreezedStakes">
    Pending Freezed Stakes:
    <StakeItem
      v-for="stake in stakes"
      :key="stake.timestamp"
      :stake="stake"
      :now="now"
    />
  </div>
</template>

<script>
import StakeItem from '@/components/FreezedStakes/StakeItem';

export default {
  name: 'FreezedStakes',
  components: { StakeItem },
  props: {
    stakes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      now: Date.now()
    };
  },
  mounted() {
    this.setNow();
    this.$on('hook:beforeDestroy', () => {
      clearTimeout(this.timeout);
    });
  },
  methods: {
    setNow() {
      this.now = Date.now();
      this.timeout = setTimeout(this.setNow, 200);
    }
  }
};
</script>

<style lang="scss" scoped>
.FreezedStakes {
  text-align: left;
}
</style>
