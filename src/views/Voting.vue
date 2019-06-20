<template>
  <div class="Voting">
    <CardSeparator />
    <form @submit.prevent="submit">
      <Select
        v-model="action"
        :options="$options.choices"
        :disabled="submitting"
        full-width
        as-object
        class="mb-5"
      />
      <Input
        v-model.number="amount"
        :disabled="submitting"
        type="number"
        full-width
        class="mb-4"
        placeholder="How many votes you want to use"
      />
      <Input full-width type="text" readonly :value="account" class="mb-5" />
      <Button
        full-width
        class="Voting__button"
        :loading="submitting"
        :disabled="!amount"
      >
        {{ action.type || 'Submit' }}
      </Button>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CardSeparator from '@/components/CardSeparator';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';

const choices = [
  {
    title: 'Propose a poll for a new authority',
    value: 'proposeNewAuthority',
    type: 'propose'
  },
  {
    title: 'Vote for the new authority',
    value: 'voteForNewAuthority',
    type: 'vote'
  },
  {
    title:
      'Propose a poll for blacklisting the authority to the authority black list',
    value: 'proposeBlacklistAuthority',
    type: 'propose'
  },
  {
    title: 'Vote for adding the participant into authority black list',
    value: 'voteForBlackListAuthority',
    type: 'vote'
  },
  {
    title: 'Propose a poll for changing BIOS contract',
    disabled: true
  },
  {
    title: 'Vote for changing BIOS contract',
    disabled: true
  }
];

export default {
  name: 'Voting',
  components: { Button, Select, Input, CardSeparator },
  data() {
    let actionIndex = this.$route.query.action;
    actionIndex = parseInt(actionIndex);
    actionIndex =
      !isNaN(actionIndex) && actionIndex <= choices.length ? actionIndex : 0;
    return {
      submitting: false,
      action:
        choices[actionIndex] && !choices[actionIndex].disabled
          ? choices[actionIndex]
          : choices[0],
      amount: null
    };
  },
  computed: {
    ...mapState(['account'])
  },
  methods: {
    submit() {
      this.submitting = true;
      setTimeout(() => {
        this.amount = null;
        this.$toast.success(
          'Successfully submit something to something. Good job!'
        );
        this.$toast.info('Also we should clean form.');
        this.submitting = false;
      }, 3000);
    }
  },
  choices
};
</script>

<!--<style lang="scss" scoped>-->
<!--.Voting {}-->
<!--</style>-->
