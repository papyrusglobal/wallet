<template>
  <div class="Staking">
    <CardSeparator />
    <form @submit.prevent="submit">
      <div class="Staking__switcher mb-5">
        <div class="Staking__switcher-item">
          <input
            v-model="action"
            type="radio"
            name="action"
            id="stake"
            value="stake"
          />
          <label for="stake">Stake</label>
        </div>
        <div class="Staking__switcher-item">
          <input
            v-model="action"
            type="radio"
            name="action"
            id="unstake"
            value="unstake"
          />
          <label for="unstake">Unstake</label>
        </div>
      </div>
      <Input
        v-model.number="amount"
        full-width
        type="number"
        min="0"
        :max="isUnstakeAction ? stake : null"
        class="mb-4"
        :error="amountHasError"
        :disabled="staking"
        :placeholder="`How many wei you want to ${action}`"
      />
      <Input full-width type="text" readonly :value="account" class="mb-5" />
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
import CardSeparator from '@/components/CardSeparator';
import Button from '@/components/Button';
import Input from '@/components/Input';
import FreezedStakes from '@/components/FreezedStakes';

export default {
  name: 'Staking',
  components: {
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
    ...mapState(['account', 'stake', 'freezedStakes']),
    ...mapGetters(['hasFreezedStakes'])
  },
  methods: {
    async submit() {
      this.staking = true;
      try {
        const hash = await this.$store.dispatch(this.action, this.amount);
        this.$toast.info(`Transaction #${hash} is being sent to the network`);
        this.amount = null;
      } catch (err) {
        this.$toast.error('Something went wrong!');
      } finally {
        this.staking = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.Staking {
  &__switcher {
    display: flex;

    &-item {
      flex: 0 0 50%;
    }

    label {
      padding: 16px 0 14px;
      display: block;
      background-color: var(--white);
      border: 1px solid var(--blue-bg);
      cursor: pointer;
      transition: background-color 0.15s;

      &:hover {
        color: var(--blue);
      }
    }

    input {
      display: none;

      &:checked ~ label {
        color: var(--blue);
        font-weight: bold;
        background-color: var(--blue-bg);
      }
    }
  }
}
</style>
