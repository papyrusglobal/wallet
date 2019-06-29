<template>
  <div class="Voting">
    <CardSeparator />
    <div
      v-if="isAuthorityStateLoaded && !isAuthority"
      class="Voting__not-authority"
    >
      You're not an authority node and you can't propose or vote on authorities!
    </div>
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
        v-model.trim="address"
        full-width
        type="text"
        :disabled="submitting"
        :value="address"
        :error="hasAddressError || hasPollAddressError"
        :error-text="
          hasPollAddressError &&
            'You can only vote for authorities from active polls'
        "
        :class="{ [`mb-${action.fields.includes('vote') ? 4 : 5}`]: true }"
        label="Address of authority"
      />
      <VoteCards
        v-if="action.fields.includes('vote')"
        v-model.number="vote"
        :slots="authorityState.slots"
        :disabled="submitting"
        class="mb-5"
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
    <div v-if="hasPolls">
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
        :polls="polls[type]"
        :disabled="!isAuthority"
        class="mt-4"
        @select="onSelectAuthority"
      />
      <Button
        v-tooltip="''"
        outline
        full-width
        small
        class="mt-4"
        :loading="clearing"
        @click="clearInactivePolls"
      >
        Finalise Polls
      </Button>
    </div>
  </div>
</template>

<script>
import { isAddress } from 'web3-utils';
import { mapState, mapGetters } from 'vuex';
import CardSeparator from '@/components/CardSeparator';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import TabbedRadio from '@/components/TabbedRadio';
import PollsList from '@/components/PollsList';
import { getElementOffsetTop, getScrollTop } from '@/utils/window';
import VoteCards from '@/components/VoteCards';

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
    fields: ['address', 'vote']
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
    VoteCards,
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
      vote: null,
      address: null,
      type: 'new'
    };
  },
  watch: {
    action(next) {
      if (!next.fields.includes('vote')) {
        this.vote = null;
      }
    }
  },
  computed: {
    ...mapState(['account', 'polls', 'authorityState']),
    ...mapGetters(['isAuthorityStateLoaded', 'isAuthority']),
    hasAddressError() {
      return !!this.address && !isAddress(this.address);
    },
    hasPollAddressError() {
      if (!this.address || this.action.type === 'propose') return false;
      const pollType =
        this.action.value === 'voteForBlackListAuthority' ? 'blacklist' : 'new';
      const poll = this.polls[pollType].find(i => i.address === this.address);
      if (!poll) return true;
      return poll.timestamp * 1000 < Date.now();
    },
    hasPolls() {
      return Object.values(this.polls).some(a => a.length > 0);
    },
    canSubmit() {
      const { fields } = this.action;
      return (
        this.isAuthority &&
        !this.submitting &&
        !this.hasAddressError &&
        !this.hasPollAddressError &&
        fields.every(
          field =>
            this[field] !== null &&
            this[field] !== undefined &&
            this[field] !== ''
        )
      );
    }
  },
  async mounted() {
    await this.load();
    await this.$store.dispatch('loadAuthorityState');
    this.$on('hook:beforeDestroy', () => {
      clearTimeout(this.timer);
    });
    this.$nextTick(() => {
      if (this.polls.new.length === 0 && this.polls.blacklist.length > 0) {
        this.type = 'blacklist';
      }
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
      this.vote = null;
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
    async load() {
      await this.$store.dispatch('loadPollAddresses');
      this.timer = setTimeout(this.load, 5000);
    },
    async submit() {
      if (!this.canSubmit) return;
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

<style lang="scss" scoped>
.Voting {
  &__not-authority {
    background-color: var(--red-bg);
    color: red;
    margin-bottom: 24px;
    text-align: left;
    padding: 8px 16px;
  }
}
</style>
