<template>
  <div class="StakeItem">
    <div>
      <h5>Amount</h5>
      {{ stake.amount | formatNumber }}
    </div>
    <div>
      <h5>Time left</h5>
      {{ timeLeft | millisecondsToWords('ready') }}
      <br />
    </div>
    <div class="FreezedStakes__table-last">
      <Button
        v-if="isHiddenWithdraw"
        outline
        small
        :loading="withdrawing"
        :disabled="isDisabledWithdraw"
        @click="withdraw"
        >Withdraw</Button
      >
    </div>
  </div>
</template>

<script>
import { millisecondsToWords } from '@/utils/filters';
import Button from '@/components/Button';

const TIME = Number(process.env.VUE_APP_WITHDRAW_CONSTANT_TIME) || 0;

export default {
  name: 'StakeItem',
  components: { Button },
  props: {
    now: {
      type: Number,
      required: true
    },
    index: {
      type: Number,
      default: 0
    },
    stake: {
      type: Object,
      required: true
    }
  },
  filters: {
    millisecondsToWords
  },
  data() {
    return {
      withdrawing: false,
      transactionSent: false
    };
  },
  computed: {
    timeLeft() {
      return TIME + this.stake.timestamp * 1000 - this.now;
    },
    isDisabledWithdraw() {
      return this.timeLeft > 0 || this.transactionSent;
    },
    isHiddenWithdraw() {
      return this.index === 0;
    }
  },
  methods: {
    async withdraw() {
      this.withdrawing = true;
      try {
        const hash = await this.$store.dispatch('withdraw');
        this.$toast.info(`Transaction #${hash} is being sent to the network`);
        this.transactionSent = true;
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
.StakeItem {
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
  color: var(--blue-grey);
}
</style>
