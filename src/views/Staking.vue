<template>
  <div class="Staking">
    <CardSeparator />
    <form @submit.prevent="submit">
      <TabbedRadio
        v-model="action"
        name="action"
        :options="[
          { label: 'Stake', value: 'stake' },
          { label: 'Unstake', value: 'unstake' }
        ]"
        class="mb-5"
      />
      <div style="display: flex;">
        <Input
          v-model.number="amount"
          full-width
          type="number"
          min="0"
          :max="isUnstakeAction ? stake : null"
          class="mb-4"
          style="flex-basis: 50%; margin-right: 8px;"
          :error="amountHasError"
          :disabled="staking"
          :label="`Wei to ${action}`"
        />
        <Input
          :value="gas"
          full-width
          type="number"
          min="0"
          style="flex-basis: 50%; margin-left: 8px;"
          class="mb-4"
          readonly
          :disabled="staking"
          :label="`Gas you ${action === 'stake' ? 'get' : 'pay'}`"
        />
      </div>
      <Input
        full-width
        type="text"
        readonly
        :value="account"
        class="mb-5"
        label="To address"
      />
      <Button
        full-width
        :disabled="!amount || amountHasError"
        :loading="staking"
      >
        {{ action }}
      </Button>
    </form>
    <div v-if="hasFreezedStakes">
      <CardSeparator />
      <FreezedStakes :stakes="freezedStakes" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import CardSeparator from '@/components/CardSeparator';
import Button from '@/components/Button';
import Input from '@/components/Input';
import FreezedStakes from '@/components/FreezedStakes';
import TabbedRadio from '@/components/TabbedRadio';

export default {
  name: 'Staking',
  components: {
    TabbedRadio,
    FreezedStakes,
    Button,
    CardSeparator,
    Input
  },
  data() {
    const { action } = this.$route.query;
    return {
      staking: false,
      action: ['stake', 'unstake'].includes(action) ? action : 'stake',
      // amount: !isNaN(parseInt(amount, 10)) ? parseInt(amount, 10) : null,
      amount: null,
      blockGasLimit: 1
    };
  },
  async created() {
    let timeout;
    const loadBlock = async () => {
      this.blockGasLimit = (await this.$service.getLatestBlock()).gasLimit;
      timeout = setTimeout(loadBlock, 1000);
    };
    await loadBlock();
    this.$on('hook:beforeDestroy', () => {
      clearTimeout(timeout);
    });
  },
  async mounted() {
    this.$store.dispatch('loadFreezedStakes');
  },
  computed: {
    ...mapState(['account', 'stake', 'allStakes', 'freezedStakes']),
    ...mapGetters(['hasFreezedStakes']),
    isUnstakeAction() {
      return this.action === 'unstake';
    },
    amountHasError() {
      return this.isUnstakeAction && this.amount > Number(this.stake);
    },
    gas: {
      get() {
        if (!this.amount) return null;
        const wei = new BigNumber(this.amount);
        const gas = wei
          .multipliedBy(this.blockGasLimit)
          .multipliedBy((24 * 60 * 60) / 3)
          .dividedBy(this.allStakes + wei);
        return gas.toNumber();
      }
      // set(value) {
      //   if (!value) return null;
      //   const gas = new BigNumber(value);
      //   this.amount = gas
      //     .multipliedBy(this.allStakes + 3)
      //     .dividedBy(this.block.gasLimit)
      //     .dividedBy((24 * 60 * 60) / 3);
      // }
    }
  },
  methods: {
    async submit() {
      if (!this.amount || this.amountHasError) return;
      this.staking = true;
      try {
        const hash = await this.$store.dispatch(this.action, this.amount);
        this.$toast.info(`Transaction #${hash} is being sent to the network`);
        this.amount = null;
      } catch (err) {
        // this.$toast.error('Something went wrong!');
      } finally {
        this.staking = false;
      }
    }
  }
};
</script>
