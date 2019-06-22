import Web3 from 'web3';
import abi from '@/abis/abi.json';

const noop = () => {};
const cbCaller = function(fn, ...args) {
  if (fn && typeof fn === 'function') {
    fn(...args);
  }
};

export class Web3Service {
  web3 = null;
  contract = null;
  provider = null;

  constructor(provider) {
    this.provider = provider;
    this.web3 = new Web3(provider);
    this.contract = new this.web3.eth.Contract(
      abi,
      process.env.VUE_APP_BIOS_ADDRESS
    );
  }

  async getLimit(account) {
    return new Promise((resolve, reject) => {
      this.provider.sendAsync(
        {
          jsonrpc: '2.0',
          method: 'eth_getLimit',
          params: [account, 'latest'],
          from: account,
          id: 1
        },
        (err, res) => {
          if (err) reject(err);
          resolve(res.result);
        }
      );
    });
  }

  async getAccount() {
    return (await this.web3.eth.getAccounts())[0];
  }

  async getNetworkId() {
    return this.web3.eth.net.getId();
  }

  async getBalance(account) {
    return this.web3.eth.getBalance(account);
  }

  async getStake(account) {
    return this.contract.methods.stakes(account).call({ from: account });
  }

  async getVersion(account) {
    return this.contract.methods.version().call({ from: account });
  }

  async getAllStakes() {
    return this.getBalance(process.env.VUE_APP_BIOS_ADDRESS);
  }

  async stake(account, value, callbacks = {}) {
    return this.process(
      this.contract.methods.freeze().send({ from: account, gas: 0, value }),
      callbacks
    );
  }

  async unstake(account, value, callbacks = {}) {
    return this.process(
      this.contract.methods.melt(value).send({ from: account, gas: 0 }),
      callbacks
    );
  }

  async withdraw(account, callbacks = {}) {
    return this.process(
      this.contract.methods.withdraw().send({ from: account, gas: 100000 }),
      callbacks
    );
  }

  async getFreezedStakes(account) {
    return this.contract.methods
      .getMeltingHead()
      .call({ from: account, gas: 0 });
  }

  async process(
    transaction,
    { onConfirmation = noop, onReceipt = noop, onError = noop }
  ) {
    return new Promise((resolve, reject) => {
      transaction
        .once('transactionHash', hash => {
          resolve(hash);
        })
        .once('confirmation', (confirmationNo, receipt) => {
          cbCaller(onConfirmation, confirmationNo, receipt);
        })
        .once('receipt', receipt => {
          cbCaller(onReceipt, receipt);
        })
        .on('error', err => {
          reject(err);
          cbCaller(onError, err);
        });
    });
  }
}

export default {
  install(Vue, { store, provider = window.web3.currentProvider }) {
    const service = new Web3Service(provider);
    Object.defineProperty(Vue.prototype, '$service', {
      get() {
        return service;
      }
    });
    if (store) {
      store.$service = service;
    }
  }
};
