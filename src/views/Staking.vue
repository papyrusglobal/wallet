<template>
  <div class="Staking">
    <CardSeparator />
    <v-tour
      name="StakingTour"
      :steps="$options.tourSteps"
      :callbacks="{ onStop: onTourStop }"
    />
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
          id="step-1"
          full-width
          type="number"
          min="0"
          :max="isUnstakeAction ? stake : null"
          class="mb-4"
          style="flex-basis: 50%; margin-right: 8px;"
          :error="amountHasError"
          :disabled="staking"
          :label="`Wei ${action === 'stake' ? 'at stake' : 'to unstake'}`"
        />
        <Input
          v-tooltip="
            'gas = wei * block gas limit * ((24 * 60 * 60) / 3) / (all stakes + wei)'
          "
          :value="gas"
          full-width
          type="number"
          min="0"
          style="flex-basis: 50%; margin-left: 8px;"
          class="mb-4"
          readonly
          :disabled="staking"
          :label="`Gas you ${action === 'stake' ? 'receive' : 'pay'}`"
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
        id="step-2"
        full-width
        :disabled="!amount || amountHasError"
        :loading="staking"
      >
        {{ action }}
      </Button>
    </form>
    <div v-if="hasFreezedStakes">
      <CardSeparator />
      <FreezedStakes id="step-3" :stakes="freezedStakes" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import * as ls from '@/utils/storage';
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
    const { action, amount } = this.$route.query;
    return {
      staking: false,
      action: ['stake', 'unstake'].includes(action) ? action : 'stake',
      amount: !isNaN(parseInt(amount, 10)) ? parseInt(amount, 10) : null,
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
    if (+ls.getItem('StakingTourFinished') !== 1) {
      this.$tours['StakingTour'].start();
    }
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
    },
    onTourStop() {
      ls.setItem('StakingTourFinished', 1);
    }
  },
  tourSteps: [
    {
      target: '#step-1',
      content: 'Step 1'
    },
    {
      target: '#step-2',
      content: 'Step 2'
    },
    {
      target: '#step-3',
      content: 'Step 3',
      params: {
        placement: 'top'
      }
    }
  ]
};
</script>
