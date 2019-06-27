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
          v-model="gas"
          full-width
          type="number"
          min="0"
          style="flex-basis: 50%; margin-left: 8px;"
          :max="isUnstakeAction ? stake : null"
          class="mb-4"
          :error="amountHasError"
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
    const { action, amount } = this.$route.query;
    return {
      staking: false,
      action: ['stake', 'unstake'].includes(action) ? action : 'stake',
      amount: !isNaN(parseInt(amount, 10)) ? parseInt(amount, 10) : null
    };
  },
  mounted() {
    this.$store.dispatch('loadFreezedStakes');
  },
  computed: {
    isUnstakeAction() {
      return this.action === 'unstake';
    },
    amountHasError() {
      return this.isUnstakeAction && this.amount > Number(this.stake);
    },
    gas: {
      get() {
        return this.amount
          ? new BigNumber(this.amount).multipliedBy(10000).toNumber()
          : null;
      },
      set(value) {
        this.amount = value
          ? new BigNumber(value).dividedBy(10000).toNumber()
          : null;
      }
    },
    ...mapState(['account', 'stake', 'freezedStakes']),
    ...mapGetters(['hasFreezedStakes'])
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
