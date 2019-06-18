<template>
  <div class="AccountInfo">
    <Avatar :hash="account" />
    <h2 class="AccountInfo__account" :title="account">{{ account }}</h2>
    <span class="AccountInfo__balance" @click="showEth = !showEth">
      <template v-if="showEth">
        ~{{ balance | toEther | formatPrice }} ETH
      </template>
      <template v-else>
        {{ balance }} wei
      </template>
    </span>
    <div class="AccountInfo__stakes">
      <div>
        <h5>My stake</h5>
        {{ stake | formatPrice }} wei
      </div>
      <div>
        <h5>My limit</h5>
        {{ limit | formatPrice }} gas
      </div>
      <div>
        <h5>All stakes</h5>
        {{ allStakes | formatPrice }} wei
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { ETHER } from '@/constants';
import Avatar from '@/components/Avatar';

export default {
  name: 'AccountInfo',
  components: { Avatar },
  data() {
    return {
      showEth: false
    };
  },
  filters: {
    toEther(value) {
      return value / ETHER;
    },
    formatPrice(value) {
      return Number(value).toLocaleString();
    }
  },
  computed: {
    ...mapState(['account', 'balance', 'stake', 'limit', 'allStakes'])
  }
};
</script>

<style lang="scss" scoped>
.AccountInfo {
  &__account {
    overflow: hidden;
    text-overflow: ellipsis;
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
      color: var(--grey);
      margin: 0;
    }
  }
}
</style>
