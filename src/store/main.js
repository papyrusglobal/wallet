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
  async initApp({ commit, getters, dispatch }) {
    const account = await this.$service.getAccount();
    commit('setState', ['account', account]);
    const networkId = await this.$service.getNetworkId();
    commit('setState', ['connectedNetwork', networkId]);
    if (account && getters['hasPapyrusNetwork']) {
      dispatch('loadAccountData');
    }
    commit('setState', ['initializing', false]);
    // Check every 2 seconds check connection to Metamask
    dispatch('checkMetamaskConnection');
  },

  async checkMetamaskConnection({ state, dispatch }) {
    clearTimeout(timer);
    const account = await this.$service.getAccount();
    if (state.account !== account) {
      dispatch('initApp');
    } else {
      timer = setTimeout(() => dispatch('checkMetamaskConnection'), 2000);
    }
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

  async loadFreezedStakes({ commit, state }) {
    const { stake, timestamp } = await this.$service.getFreezedStakes(
      state.account
    );
    const amount = stake.toString(10);
    if (Number(amount) > 0) {
      commit('setFreezedStakes', [{ amount, timestamp }]);
    } else {
      commit('setFreezedStakes', []);
    }
  },

  async stake({ state, dispatch }, amount) {
    return this.$service.stake(state.account, amount, {
      onReceipt: onReceipt(dispatch),
      onConfirmation: onConfirmation(dispatch)
    });
  },

  async unstake({ state, dispatch }, amount) {
    return this.$service.unstake(state.account, amount, {
      onReceipt: onReceipt(dispatch),
      onConfirmation: () => {
        onConfirmation(dispatch)();
        dispatch('loadFreezedStakes');
      }
    });
  },

  async withdraw({ state, dispatch }) {
    return this.$service.withdraw(state.account, {
      onReceipt: onReceipt(dispatch),
      onConfirmation: () => {
        onConfirmation(dispatch)();
        dispatch('loadFreezedStakes');
      }
    });
  }
};

function onReceipt(dispatch) {
  return () => dispatch('loadAccountData');
}

function onConfirmation(dispatch) {
  return () => dispatch('loadAccountData');
}
