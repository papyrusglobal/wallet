<template>
  <div>
    <Header />
    <MetamaskError v-if="!hasMetamask">
      No web3 error. Please use
      <a href="https://metamask.io/" target="_blank">MetaMask</a>.
      <Button slot="action" @click="reloadPage">Reload page</Button>
    </MetamaskError>
    <Spinner
      v-else-if="initializing"
      size="48"
      style="margin: 40px auto; display: block"
    />
    <MetamaskError v-else-if="!metamaskIsConnected">
      No account error. Did you sign in to Metamask?
      <Button slot="action" @click="connectToMetamask" :loading="loading"
        >Retry</Button
      >
    </MetamaskError>
    <MetamaskError v-else-if="!hasPapyrusNetwork">
      Please choose Papyrus network in metamask.
      <p style="font-size: 1rem; line-height: 1.4rem; font-weight: normal;">
        To do that you need to choose Networks tab in metamask and then select
        Custom PRC and fill in New RPC URL field with<br>
        <span style="background-color: var(--white); padding: 0 4px;">https://gateway-testnet.papyrus.network</span>
      </p>
      <Button slot="action" @click="connectToMetamask" :loading="loading"
        >Retry</Button
      >
    </MetamaskError>
    <SuperContainer v-else class="mt-6">
      <Card>
        <Navigation class="mb-6" />
        <keep-alive>
          <AccountInfo v-if="this.$route.name !== 'err'" />
        </keep-alive>
        <router-view />
      </Card>
    </SuperContainer>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Header from '@/components/Header';
import MetamaskError from '@/components/MetamaskError';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import Navigation from '@/components/Navigation';
import SuperContainer from '@/components/SuperContainer';
import Card from '@/components/Card';
import AccountInfo from '@/components/AccountInfo';

export default {
  components: {
    AccountInfo,
    Card,
    SuperContainer,
    Navigation,
    Spinner,
    Button,
    MetamaskError,
    Header
  },
  props: {
    hasMetamask: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState(['initializing', 'connectedNetwork']),
    ...mapGetters(['hasPapyrusNetwork', 'metamaskIsConnected'])
  },
  methods: {
    reloadPage() {
      window.location.reload();
    },
    async connectToMetamask() {
      if (this.loading) return;
      this.loading = true;
      await this.$store.dispatch('initApp');
      this.loading = false;
    }
  }
};
</script>
