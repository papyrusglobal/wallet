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
        v-if="action.fields.includes('votes')"
        v-model.number="votes"
        :disabled="submitting"
        type="number"
        full-width
        class="mb-4"
        placeholder="How many votes you want to use"
      />
      <Input
        v-model="address"
        full-width
        type="text"
        :disabled="submitting"
        :value="address"
        class="mb-5"
        placeholder="Address of authority"
      />
      <Button
        full-width
        class="Voting__button"
        :loading="submitting"
        :disabled="!canSubmit"
      >
        {{ action.type || 'Submit' }}
      </Button>
    </form>
  </div>
</template>

<script>
// import { isAddress } from 'web3-utils';
import { mapState } from 'vuex';
import CardSeparator from '@/components/CardSeparator';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';

const choices = [
  {
    title: 'Propose a poll for a new authority',
    value: 'proposeNewAuthority',
    type: 'propose',
    fields: ['address']
  },
  {
    title: 'Vote for the new authority',
    value: 'voteForNewAuthority',
    type: 'vote',
    fields: ['votes', 'address']
  },
  {
    title:
      'Propose a poll for blacklisting the authority to the authority black list',
    value: 'proposeBlacklistAuthority',
    type: 'propose',
    fields: ['address']
  },
  {
    title: 'Vote for adding the participant into authority black list',
    value: 'voteForBlackListAuthority',
    type: 'vote',
    fields: ['address']
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
      votes: null,
      address: null
    };
  },
  watch: {
    action(next) {
      if (!next.fields.includes('votes')) {
        this.votes = null;
      }
    }
  },
  computed: {
    canSubmit() {
      const { fields } = this.action;
      return !this.submitting && fields.every(field => !!this[field]);
    },
    ...mapState(['account'])
  },
  mounted() {
    this.$store.dispatch('loadPollAddresses');
  },
  methods: {
    clearForm() {
      this.address = null;
      this.votes = null;
    },
    getFormData() {
      return this.action.fields.reduce((res, field) => {
        res[field] = this[field];
        return res;
      }, {});
    },
    async submit() {
      const { value: method } = this.action;
      this.submitting = true;
      try {
        const data = this.getFormData();
        const hash = await this.$store.dispatch(method, data);
        this.$toast.info(`Transaction #${hash} is being sent to the network`);
        this.clearForm();
      } catch (err) {
        this.$toast.error('Something went wrong!');
      } finally {
        this.submitting = false;
      }
    }
  },
  choices
};
</script>
