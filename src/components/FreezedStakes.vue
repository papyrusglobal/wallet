<template>
  <div class="FreezedStakes">
    Pending Freezed Stakes:
    <div class="FreezedStakes__table">
      <div>
        <h5>Time left</h5>
        2m 25s
      </div>
      <div>
        <h5>Amount</h5>
        1 wei
      </div>
      <div class="FreezedStakes__table-last">
        <Button outline small :loading="withdrawing" @click="withdraw">
          Withdraw
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button';

export default {
  name: 'FreezedStakes',
  components: { Button },
  data() {
    return {
      withdrawing: false
    };
  },
  methods: {
    async withdraw() {
      this.withdrawing = true;
      try {
        await this.$store.dispatch('withdraw');
      } catch (err) {
        // eslint-disable-next-line
        console.log(err);
      } finally {
        this.withdrawing = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.FreezedStakes {
  text-align: left;

  &__table {
    display: flex;
    align-items: center;
    margin-top: 8px;

    > div {
      padding-right: 24px;

      &:last-child {
        flex: 1 0 auto;
        text-align: right;
        padding-right: 0;
      }
    }
  }

  h5 {
    margin: 0;
    color: var(--grey);
  }
}
</style>
