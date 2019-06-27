import Vue from 'vue';
import { parseEnvVariable } from '@/utils/env';

let timer;

export const state = () => ({
  initializing: true,
  connectedNetwork: false,
  account: null,
  balance: 0,
  stake: 0,
  limit: 0,
  allStakes: 0,
  freezedStakes: [],
  authorities: {
    new: [],
    blacklist: []
  },
  authorityState: {
    loaded: false,
    votes: undefined,
    slots: Array(7).fill(0)
  }
});

export const getters = {
  hasPapyrusNetwork: state => {
    const availableNetworks = parseEnvVariable(
      process.env.VUE_APP_PAPYRUS_NETWORK_ID
    );
    return availableNetworks.includes(state.connectedNetwork);
  },
  metamaskIsConnected: state => !!state.account,
  hasFreezedStakes: state => state.freezedStakes.length > 0,
  votedAddresses: state => state.authorityState.slots.map(slot => slot.address),
  isAuthorityStateLoaded: ({ authorityState }) => authorityState.loaded,
  isAuthority: ({ authorityState }) => authorityState.votes !== undefined
};

export const mutations = {
  setState(state, [key, value]) {
    if (key in state) {
      state[key] = value;
    }
  },
  setAccountData(state, { balance, stake, limit, allStakes }) {
    state.balance = balance;
    state.stake = stake;
    state.limit = limit;
    state.allStakes = allStakes;
  },
  setFreezedStakes(state, freezedStakes) {
    state.freezedStakes = freezedStakes;
  },
  setAuthorities(state, { addresses, blacklistAddresses }) {
    state.authorities = {
      new: addresses.reverse(),
      blacklist: blacklistAddresses.reverse()
    };
  },
  setAuthorityState(state, authorityState) {
    if (authorityState === undefined) {
      Vue.set(state.authorityState, 'loaded', true);
      return;
    }
    state.authorityState = {
      loaded: true,
      ...authorityState
    };
  }
};

export const actions = {
  async initApp({ dispatch }) {
    await dispatch('loadInitialData');
    this.$service.askPermission();
  },

  async checkMetamaskConnection({ state, dispatch }) {
    clearTimeout(timer);
    const account = await this.$service.getAccount();
    if (state.account !== account) {
      dispatch('loadInitialData', account);
    } else {
      // Every 2 seconds check connection to Metamask
      timer = setTimeout(() => dispatch('checkMetamaskConnection'), 2000);
    }
  },

  async loadInitialData({ commit, dispatch }, account) {
    account = account || (await this.$service.getAccount());
    commit('setState', ['account', account]);
    const networkId = await this.$service.getNetworkId();
    commit('setState', ['connectedNetwork', networkId]);
    if (account && getters['hasPapyrusNetwork']) {
      dispatch('loadAccountData');
    }
    commit('setState', ['initializing', false]);
    dispatch('checkMetamaskConnection');
    return true;
  },

  async loadAccountData({ state, commit }, account) {
    account = account || state.account;

    const [balance, stake, limit, allStakes] = await Promise.all([
      this.$service.getBalance(account),
      this.$service.getStake(account),
      this.$service.getLimit(account),
      this.$service.getAllStakes()
    ]);

    commit('setAccountData', { balance, stake, limit, allStakes });
  },

  async loadFreezedStakes({ commit }) {
    const stakes = await this.$service.getFreezedStakes();
    if (stakes.length > 0) {
      commit('setFreezedStakes', stakes);
    } else {
      commit('setFreezedStakes', []);
    }
  },

  async loadPollAddresses({ commit }) {
    const [addresses, blacklistAddresses] = await Promise.all([
      this.$service.getAddNewPollAddresses(),
      this.$service.getAuthorityBlacklistPollAddresses()
    ]);
    commit('setAuthorities', { addresses, blacklistAddresses });
  },

  async loadAuthorityState({ commit }) {
    const authorityState = await this.$service.getAuthorityState();
    commit('setAuthorityState', authorityState);
  },

  async dropClosedPolls({ dispatch }) {
    await this.$service.dropClosedPolls({
      onConfirmation: onVotingEvent(dispatch)
    });
  },

  async stake({ dispatch }, amount) {
    return this.$service.stake(amount, {
      onReceipt: onReceipt(dispatch),
      onConfirmation: onConfirmation(dispatch)
    });
  },

  async unstake({ dispatch }, amount) {
    return this.$service.unstake(amount, {
      onReceipt: onReceipt(dispatch),
      onConfirmation: () => {
        onConfirmation(dispatch)();
        dispatch('loadFreezedStakes');
      }
    });
  },

  async withdraw({ dispatch }) {
    return this.$service.withdraw({
      onReceipt: onReceipt(dispatch),
      onConfirmation: () => {
        onConfirmation(dispatch)();
        dispatch('loadFreezedStakes');
      }
    });
  },

  async proposeNewAuthority({ dispatch }, { address }) {
    return this.$service.proposeNewAuthority(address, {
      onReceipt: onVotingEvent(dispatch),
      onConfirmation: onVotingEvent(dispatch)
    });
  },

  async voteForNewAuthority({ dispatch }, { address, vote }) {
    return this.$service.voteForNewAuthority(vote, address, {
      onReceipt: onVotingEvent(dispatch),
      onConfirmation: onVotingEvent(dispatch)
    });
  },

  async proposeBlacklistAuthority({ dispatch }, { address }) {
    return this.$service.proposeBlacklistAuthority(address, {
      onReceipt: onVotingEvent(dispatch),
      onConfirmation: onVotingEvent(dispatch)
    });
  },

  async voteForBlackListAuthority({ dispatch }, { address }) {
    return this.$service.voteForBlackListAuthority(address, {
      onReceipt: onVotingEvent(dispatch),
      onConfirmation: onVotingEvent(dispatch)
    });
  }
};

function onReceipt(dispatch) {
  return () => dispatch('loadAccountData');
}

function onConfirmation(dispatch) {
  return () => dispatch('loadAccountData');
}

function onVotingEvent(dispatch) {
  return () => {
    dispatch('loadAccountData');
    dispatch('loadPollAddresses');
    dispatch('loadAuthorityState');
  };
}
