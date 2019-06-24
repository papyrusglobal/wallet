let timer;

export const state = () => ({
  initializing: true,
  connectedNetwork: false,
  account: null,
  balance: 0,
  stake: 0,
  limit: 0,
  allStakes: 0,
  freezedStakes: [
    // {
    //   timestamp: 0,
    //   stake: 0
    // }
  ]
});

export const getters = {
  hasPapyrusNetwork: state =>
    state.connectedNetwork === Number(process.env.VUE_APP_PAPYRUS_NETWORK_ID),
  metamaskIsConnected: state => !!state.account,
  hasFreezedStakes: state => state.freezedStakes.length > 0
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
    // Check every 2 seconds check connection to Metamask
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
    const { stake, timestamp } = await this.$service.getFreezedStakes();
    const amount = stake.toString(10);
    if (Number(amount) > 0) {
      commit('setFreezedStakes', [{ amount, timestamp }]);
    } else {
      commit('setFreezedStakes', []);
    }
  },

  async loadPollAddresses() {
    const [addresses, blacklistAddresses] = await Promise.all([
      this.$service.addNewPollAddresses(),
      this.$service.authorityBlacklistPollAddresses()
    ]);
    // eslint-disable-next-line
    console.log(addresses, blacklistAddresses);
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
      onReceipt: onReceipt(dispatch),
      onConfirmation: onConfirmation(dispatch)
    });
  },

  async voteForNewAuthority({ dispatch }, { address, votes }) {
    return this.$service.voteForNewAuthority(votes, address, {
      onReceipt: onReceipt(dispatch),
      onConfirmation: onConfirmation(dispatch)
    });
  },

  async proposeBlacklistAuthority({ dispatch }, { address }) {
    return this.$service.proposeBlacklistAuthority(address, {
      onReceipt: onReceipt(dispatch),
      onConfirmation: onConfirmation(dispatch)
    });
  },

  async voteForBlackListAuthority({ dispatch }, { address }) {
    return this.$service.voteForBlackListAuthority(address, {
      onReceipt: onReceipt(dispatch),
      onConfirmation: onConfirmation(dispatch)
    });
  }
};

function onReceipt(dispatch) {
  return () => dispatch('loadAccountData');
}

function onConfirmation(dispatch) {
  return () => dispatch('loadAccountData');
}
