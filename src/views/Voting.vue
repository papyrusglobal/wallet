<template>
  <div class="Voting">
    <CardSeparator />
    <form @submit.prevent="submit" ref="form">
      <Select
        v-model="action"
        :options="$options.choices"
        :disabled="submitting"
        full-width
        as-object
        class="mb-5"
      />
      <Input
        v-model="address"
        full-width
        type="text"
        :disabled="submitting"
        :value="address"
        :error="hasAddressError"
        :class="{ [`mb-${action.fields.includes('votes') ? 4 : 5}`]: true }"
        placeholder="Address of authority"
      />
      <Input
        v-if="action.fields.includes('votes')"
        v-model.number="votes"
        :disabled="submitting"
        type="number"
        full-width
        class="mb-5"
        placeholder="How many votes you want to use"
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
    <div v-if="hasAuthorities">
      <CardSeparator />
      <TabbedRadio
        v-model="type"
        name="type"
        :options="[
          {
            label: 'New authority polls',
            value: 'new'
          },
          {
            label: 'Blacklist polls',
            value: 'blacklist'
          }
        ]"
      />
      <PollsList
        :authorities="authorities[type]"
        class="mt-4"
        @select="onSelectAuthority"
      />
      <Button
        outline
        full-width
        small
        class="mt-4"
        :loading="clearing"
        @click="clearInactivePolls"
      >
        Clear inactive polls
      </Button>
    </div>
  </div>
</template>

<script>
import { isAddress } from 'web3-utils';
import { mapState } from 'vuex';
import CardSeparator from '@/components/CardSeparator';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import TabbedRadio from '@/components/TabbedRadio';
import PollsList from '@/components/PollsList';
import { getElementOffsetTop, getScrollTop } from '@/utils/window';

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
  components: {
    PollsList,
    TabbedRadio,
    Button,
    Select,
    Input,
    CardSeparator
  },
  data() {
    let actionIndex = this.$route.query.action;
    actionIndex = parseInt(actionIndex);
    actionIndex =
      !isNaN(actionIndex) && actionIndex <= choices.length ? actionIndex : 0;
    return {
      clearing: false,
      submitting: false,
      action:
        choices[actionIndex] && !choices[actionIndex].disabled
          ? choices[actionIndex]
          : choices[0],
      votes: null,
      address: null,
      type: 'new'
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
    hasAddressError() {
      return !!this.address && !isAddress(this.address);
    },
    hasAuthorities() {
      return Object.values(this.authorities).some(a => a.length > 0);
    },
    canSubmit() {
      const { fields } = this.action;
      return (
        !this.submitting &&
        !this.hasAddressError &&
        fields.every(field => !!this[field])
      );
    },
    ...mapState(['account', 'authorities'])
  },
  mounted() {
    this.loadPolls();
    this.$on('hook:beforeDestroy', () => {
      clearTimeout(this.timer);
    });
  },
  methods: {
    onSelectAuthority(address) {
      const method =
        this.type === 'blacklist'
          ? 'voteForBlackListAuthority'
          : 'voteForNewAuthority';
      this.address = address;
      this.action = choices.find(c => c.value === method);
      this.$nextTick(() => {
        const offsetTop = getElementOffsetTop(this.$refs.form) - 96;
        if (getScrollTop() > offsetTop) {
          window.scrollTo(0, offsetTop);
        }
        this.focusFirstEmptyInput();
      });
    },
    focusFirstEmptyInput() {
      const inputs = this.$refs.form.querySelectorAll('input');
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value === '') {
          inputs[i].focus();
          return;
        }
      }
      this.$refs.form.querySelector('button').focus();
    },
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
    async clearInactivePolls() {
      this.clearing = true;
      try {
        const hash = await this.$store.dispatch('dropClosedPolls');
        this.$toast.info(`Transaction #${hash} is being sent to the network`);
      } catch (err) {
        //
      } finally {
        this.clearing = false;
      }
    },
    async loadPolls() {
      await this.$store.dispatch('loadPollAddresses');
      this.timer = setTimeout(this.loadPolls, 5000);
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
        //
      } finally {
        this.submitting = false;
      }
    }
  },
  choices
};
</script>
