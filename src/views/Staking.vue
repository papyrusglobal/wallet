<template>
  <div class="Staking">
    <Toast :show="hash !== null">
      Transaction #{{ hash }} is being sent to the network
    </Toast>
    <Card>
      <AccountInfo />
      <CardSeparator />
      <form @submit.prevent="submit">
        <div class="Staking__switcher">
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
          :max="stake"
          class="Staking__input"
          :error="amountHasError"
          :disabled="staking"
          :placeholder="`How many wei you want to ${action}`"
        />
        <Input
          full-width
          type="text"
          readonly
          :value="account"
          class="Staking__input"
        />
        <Button
          full-width
          class="Staking__button"
          :disabled="!amount || amountHasError"
          :loading="staking"
        >
          {{ action }}
        </Button>
      </form>
      <div>
        <CardSeparator />
        <FreezedStakes />
      </div>
    </Card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Card from '@/components/Card';
import CardSeparator from '@/components/CardSeparator';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Toast from '@/components/Toast';
import AccountInfo from '@/components/AccountInfo';
import FreezedStakes from '@/components/FreezedStakes';

export default {
  name: 'Staking',
  components: {
    FreezedStakes,
    AccountInfo,
    Toast,
    Button,
    CardSeparator,
    Card,
    Input
  },
  data() {
    const { action, amount } = this.$route.query;
    return {
      staking: false,
      hash: null,
      action: ['stake', 'unstake'].includes(action) ? action : 'stake',
      amount: !isNaN(parseInt(amount, 10)) ? parseInt(amount, 10) : null
    };
  },
  computed: {
    amountHasError() {
      return this.action === 'unstake' && this.amount > this.stake;
    },
    ...mapState(['account', 'stake'])
  },
  methods: {
    async submit() {
      this.staking = true;
      try {
        const hash = await this.$store.dispatch(this.action, this.amount);
        this.showToast(hash);
        this.amount = null;
      } catch (err) {
        //
      } finally {
        this.staking = false;
      }
    },
    showToast(hash) {
      clearTimeout(this.toastTimeout);
      this.hash = hash;
      this.toastTimeout = setTimeout(() => (this.hash = null), 5000);
    }
  }
};
</script>

<style lang="scss" scoped>
.Staking {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  text-align: center;

  &__switcher {
    margin-bottom: 16px;
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

      &:hover {
        background-color: var(--blue-bg);
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

  &__input {
    margin: 8px 0;
  }

  &__button {
    margin-top: 16px;
  }
}
</style>
