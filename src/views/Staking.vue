<template>
  <div class="Staking">
    <CardSeparator />
    <v-tour
      v-if="$options.tourSteps.length"
      name="StakingTour"
      :steps="$options.tourSteps"
      :callbacks="{
        onStop: onTourStop,
        onPreviousStep: index => onTourChange(index, true),
        onNextStep: onTourChange
      }"
    />
    <form @submit.prevent="submit">
      <TabbedRadio
        v-model="action"
        id="step-6"
        name="action"
        :options="[
          { label: 'Stake', value: 'stake' },
          { label: 'Unstake', value: 'unstake', id: 'step-8' }
        ]"
        class="mb-5"
      />
      <div class="mb-4">
        <div style="display: flex;">
          <Input
            v-model="amount"
            full-width
            type="number"
            min="0"
            :max="isUnstakeAction ? stake : null"
            style="flex-basis: 100%; margin-right: 8px;"
            :error="hasAmountError"
            :error-text="
              !!+amount && gas < 1
                ? `You should ${
                    isUnstakeAction ? 'release' : 'get'
                  } at least 1 gas`
                : null
            "
            :disabled="staking"
            :label="
              `${$root.$options.tokens.wei} ${
                !isUnstakeAction ? 'at stake' : 'to unstake'
              }`
            "
          />
          <Input
            v-tooltip="
              `${$root.$options.tokens.gas} = ${$root.$options.tokens.wei} * block gas limit * (3 * 24 * 60 * 60) / (all stakes + ${$root.$options.tokens.wei})`
            "
            :value="gas"
            full-width
            min="0"
            style="flex-basis: 100%; margin-left: 8px;"
            readonly
            :disabled="staking"
            :label="
              `${$root.$options.tokens.gas.charAt(0).toUpperCase() +
                $root.$options.tokens.gas.slice(1)} you ${
                !isUnstakeAction ? 'receive' : 'lose'
              }`
            "
          />
        </div>
        <SlidingInfo v-if="!!+amount && !hasAmountError">
          It will
          <strong>{{ !isUnstakeAction ? 'increase' : 'decrease' }}</strong>
          your gas limit at
          <strong>{{ gas }} {{ $root.$options.tokens.gas }}</strong> per 3 days
        </SlidingInfo>
      </div>
      <div class="relative-container">
        <Input
          v-model.trim="addressToStake"
          :value="addressToStake"
          :error="hasAddressError"
          :label="`${!isUnstakeAction ? 'To' : 'From'} address`"
          :disabled="staking"
          full-width
          id="step-7"
          type="text"
          class="mb-5"
        />
        <transition name="fade">
          <span
            v-show="!isMyAddress"
            class="link restore-link"
            @click.prevent="addressToStake = account"
          >
            {{ !isUnstakeAction ? 'Stake' : 'Unstake' }} to my address
          </span>
        </transition>
      </div>
      <Button
        full-width
        :disabled="!+amount || hasAmountError || hasAddressError"
        :loading="staking"
      >
        {{ action }}
      </Button>
    </form>
    <div v-if="hasFreezedStakes">
      <CardSeparator />
      <FreezedStakes id="step-9" :stakes="freezedStakes" />
    </div>
  </div>
</template>

<script>
import { isAddress } from 'web3-utils';
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import * as ls from '@/utils/storage';
import CardSeparator from '@/components/CardSeparator';
import Button from '@/components/Button';
import Input from '@/components/Input';
import FreezedStakes from '@/components/FreezedStakes';
import TabbedRadio from '@/components/TabbedRadio';
import SlidingInfo from '@/components/SlidingInfo';

export default {
  name: 'Staking',
  components: {
    SlidingInfo,
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
      addressToStake: this.account,
      blockGasLimit: 1
    };
  },
  async created() {
    this.addressToStake = this.account;
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
    hasAmountError() {
      if (!+this.amount) return null;
      if (!this.isUnstakeAction) {
        return this.gas < 1;
      }
      return this.gas < 1 || +this.amount > Number(this.stake);
    },
    gas: {
      get() {
        if (!+this.amount) return null;
        const wei = new BigNumber(this.amount);
        const gas = wei
          .multipliedBy(this.blockGasLimit)
          .multipliedBy(3 * 24 * 60 * 60)
          .dividedBy(wei.plus(this.allStakes || 0));
        return gas.integerValue(BigNumber.ROUND_DOWN).toString();
      }
    },
    hasAddressError() {
      return !this.addressToStake || !isAddress(this.addressToStake);
    },
    isMyAddress() {
      return !this.hasAddressError && this.addressToStake === this.account;
    }
  },
  methods: {
    async submit() {
      if (!+this.amount || this.hasAmountError) return;
      this.staking = true;
      try {
        const hash = await this.$store.dispatch(this.action, {
          amount: String(this.amount),
          address: this.addressToStake
        });
        this.$toast.info(`Transaction #${hash} is being sent to the network`);
        this.amount = null;
      } catch (err) {
        // this.$toast.error('Something went wrong!');
      } finally {
        this.staking = false;
      }
    },
    onTourChange(index, previous = false) {
      if (index === (previous ? 8 : 6)) {
        this.action = 'unstake';
      } else {
        this.action = 'stake';
      }
    },
    onTourStop() {
      this.action = 'stake';
      ls.setItem('StakingTourFinished', 1);
    }
  },
  tourSteps: [
    {
      target: '#step-1',
      content:
        '<h3 class="mt-0 mb-3">Welcome to the papyrus wallet!</h3>' +
        'Papyrus Wallet works with MetaMask extension and gives you a particularly user-friendly interface for all features of Papyrus Network'
    },
    {
      target: '#step-2',
      content:
        'On this screen you can see four main parameters — your current balance'
    },
    {
      target: '#step-3',
      content:
        'Your staked PPR tokens that gives you access to the Papyrus Network infrastructure',
      params: {
        placement: 'top'
      }
    },
    {
      target: '#step-4',
      content:
        'Derivative of your stakes - your GasLimit provided to you for three days',
      params: {
        placement: 'top'
      }
    },
    {
      target: '#step-5',
      content: 'All the stakes in the system',
      params: {
        placement: 'top'
      }
    },
    {
      target: '#step-6',
      content:
        'To stake your tokens just chose staking tab and then fill the fields with stakes and press Stake button',
      params: {
        placement: 'top'
      }
    },
    {
      target: '#step-7',
      content:
        'By default - stake will be processed onto your address, function to delegate stakes is in-progress now and will be available soon'
    },
    {
      target: '#step-8',
      content:
        'You can easily unstake your tokens, just go to the Unstake tab and enter value for unstaking',
      params: {
        placement: 'top'
      }
    }
    // {
    //   target: '#step-9',
    //   content:
    //     'When unstaking is done your tokens are frozen and you have to wait for some time to process with withdraw.' +
    //     '<div class="mt-2">When withdraw button is available - just push the button and your stakes will be back to your balance!</div>'
    // }
  ]
};
</script>

<style lang="scss" scoped>
.relative-container {
  position: relative;
}

.restore-link {
  position: absolute;
  top: 6px;
  right: 16px;
  font-size: 12px;
}
</style>