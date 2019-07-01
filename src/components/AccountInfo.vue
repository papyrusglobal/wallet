<template>
  <div class="AccountInfo">
    <Avatar :hash="account" colored class="AccountInfo__avatar" />
    <h2 class="AccountInfo__address text-overflow" :title="account">
      {{ account }}
    </h2>
    <span
      class="AccountInfo__balance"
      @click="
        touched = true;
        showEth = !showEth;
      "
      id="step-2"
    >
      <template v-if="showEth">
        {{ pprBalance }} PPR
      </template>
      <template v-else>
        {{ balance | formatPrice(10) }} wei
      </template>
    </span>
    <div class="AccountInfo__stakes">
      <div id="step-3">
        <h5>My stake</h5>
        {{ stake | formatPrice }} wei
      </div>
      <div id="step-4">
        <h5>My limit</h5>
        {{ limit | formatPrice }} gas
      </div>
      <div id="step-5">
        <h5>All stakes</h5>
        {{ allStakes | formatPrice }} wei
      </div>
    </div>
  </div>
</template>

<script>
import numbro from 'numbro';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { ETHER } from '@/constants';
import Avatar from '@/components/Avatar';

export default {
  name: 'AccountInfo',
  components: { Avatar },
  data() {
    return {
      touched: false,
      showEth: true
    };
  },
  watch: {
    balance() {
      if (!this.touched && Number(this.pprBalance) < 0.1) {
        this.showEth = false;
      }
    }
  },
  filters: {
    toEther(value) {
      return new BigNumber(value).dividedBy(ETHER);
    },
    formatPrice(value, totalLength = 6) {
      return value
        ? numbro(value).format({
            totalLength,
            mantissa: 4,
            trimMantissa: true,
            optionalMantissa: true,
            thousandSeparated: true
          })
        : 0;
    }
  },
  computed: {
    ...mapState(['account', 'balance', 'stake', 'limit', 'allStakes']),
    pprBalance() {
      return this.$options.filters.toEther(this.balance);
    }
  }
};
</script>

<style lang="scss" scoped>
.AccountInfo {
  &__avatar {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
      box-shadow 0.3s;
    &:hover {
      transform: translate(0px, -12%) scale(1.5);
      box-shadow: 0 24px 24px -4px var(--blue-grey);
    }
  }

  &__address {
    font-size: 1.2rem;
    line-height: 1.4rem;
    margin: 16px 0 0 0;
  }

  &__balance {
    display: inline-flex;
    padding: 2px 12px 0px;
    margin-top: 8px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: var(--blue-bg);
    }
  }

  &__stakes {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;

    & > div {
      flex: 0 0 33.3333%;
      padding: 0 8px;
    }

    h5 {
      color: var(--blue-grey);
      margin: 0;
    }
  }
}
</style>
