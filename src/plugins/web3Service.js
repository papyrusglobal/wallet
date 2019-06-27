import Web3 from 'web3';
import abi from '@/abis/abi.json';

const GAS_PAYMENT = 150000;
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
  account = null;
  isAuthority = null;

  constructor(provider) {
    this.provider = provider;
    this.web3 = new Web3(provider);
    this.contract = new this.web3.eth.Contract(
      abi,
      process.env.VUE_APP_BIOS_ADDRESS
    );
  }

  async askPermission() {
    const { provider } = this;
    if (!provider) return;
    if ('enable' in provider && typeof provider.enable === 'function') {
      provider.enable().catch(() => {
        // do nothing
      });
    }
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
    this.account = (await this.web3.eth.getAccounts())[0];
    return this.account;
  }

  async getNetworkId() {
    return this.web3.eth.net.getId();
  }

  async getBalance(account) {
    return this.web3.eth.getBalance(account || this.account);
  }

  async getStake() {
    return this.contract.methods
      .stakes(this.account)
      .call({ from: this.account });
  }

  async getLatestBlock() {
    const blockNumber = await this.web3.eth.getBlockNumber();
    if (!this.block || this.block.number !== blockNumber) {
      this.block = await this.web3.eth.getBlock(blockNumber);
    }
    return this.block;
  }

  async getVersion() {
    return this.contract.methods.version().call({ from: this.account });
  }

  async getAllStakes() {
    return this.getBalance(process.env.VUE_APP_BIOS_ADDRESS);
  }

  async stake(value, callbacks = {}) {
    return this.process(
      this.contract.methods
        .freeze()
        .send({ from: this.account, gas: 0, value }),
      callbacks
    );
  }

  async unstake(value, callbacks = {}) {
    return this.process(
      this.contract.methods.melt(value).send({ from: this.account, gas: 0 }),
      callbacks
    );
  }

  async withdraw(callbacks = {}) {
    return this.process(
      this.contract.methods
        .withdraw()
        .send({ from: this.account, gas: GAS_PAYMENT }),
      callbacks
    );
  }

  async getSealerStates() {
    return this.contract.methods.sealerStates(this.account).call({
      from: this.account,
      gas: 0
    });
  }

  async getFreezedStakes() {
    const res = await this.contract.methods
      .getMeltingSlots()
      .call({ from: this.account, gas: 0 });
    if (!res) return [];
    const amounts = res[0];
    const timestamp = res[1];
    return amounts.map((amount, index) => ({
      amount,
      timestamp: timestamp[index]
    }));
  }

  async getIsAuthority() {
    if (this.isAuthority === null) {
      const authorities =
        (await this.contract.methods.getAuthorities().call({
          from: this.account
        })) || [];
      this.isAuthority = authorities.includes(this.account);
    }
    return this.isAuthority;
  }

  async getAuthorityState() {
    const data = await this.contract.methods
      .getAuthorityState(this.account)
      .call({ from: this.account });
    if (!data) return;
    return {
      votes: Number(data[0]),
      slots: data[1].map((address, index) => ({
        address,
        timestamp: Number(data[2][index])
      }))
    };
  }

  async getAddNewPollAddresses() {
    const addresses = await this.contract.methods
      .getAddNewPollAddresses()
      .call({
        from: this.account,
        gas: 0
      });
    if (!addresses) {
      return [];
    }
    const addressesData = await Promise.all(
      addresses.map(address =>
        this.contract.methods.addNewPoll(address).call({
          from: this.account,
          gas: 0
        })
      )
    );
    return addresses.map((address, index) => ({
      address,
      timestamp: addressesData[index].closeTime,
      votes: Number(addressesData[index].votes)
    }));
  }

  async getAuthorityBlacklistPollAddresses() {
    const addresses = await this.contract.methods
      .getAuthorityBlacklistPollAddresses()
      .call({
        from: this.account,
        gas: 0
      });
    if (!addresses) {
      return [];
    }
    const addressesData = await Promise.all(
      addresses.map(address =>
        this.contract.methods.authorityBlacklistPoll(address).call({
          from: this.account,
          gas: 0
        })
      )
    );
    return addresses.map((address, index) => ({
      address,
      timestamp: addressesData[index].closeTime,
      votes: Number(addressesData[index].votes),
      voted: addressesData[index].voted || false
    }));
  }

  async dropClosedPolls(callbacks = {}) {
    return this.process(
      this.contract.methods.handleClosedPolls.send({
        from: this.account,
        gas: 0
      }),
      callbacks
    );
  }

  async proposeNewAuthority(address, callbacks = {}) {
    return this.process(
      this.contract.methods.proposeNewAuthority(address).send({
        from: this.account,
        gas: GAS_PAYMENT
      }),
      callbacks
    );
  }

  async proposeBlacklistAuthority(address, callbacks = {}) {
    return this.process(
      this.contract.methods.proposeBlacklistAuthority(address).send({
        from: this.account,
        gas: GAS_PAYMENT
      }),
      callbacks
    );
  }

  async voteForNewAuthority(votes, address, callbacks = {}) {
    return this.process(
      this.contract.methods.voteForNewAuthority(votes, address).send({
        from: this.account,
        gas: GAS_PAYMENT
      }),
      callbacks
    );
  }

  async voteForBlackListAuthority(address, callbacks = {}) {
    return this.process(
      this.contract.methods.voteForBlackListAuthority(address).send({
        from: this.account,
        gas: GAS_PAYMENT
      }),
      callbacks
    );
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
  install(Vue, { store, provider }) {
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
