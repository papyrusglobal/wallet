import Vue from 'vue';
import App from './App.vue';
import router from './router';
import createStore from './store';
import './styles/main.scss';

import Web3Service from './plugins/web3Service';

Vue.config.productionTip = false;

async function startApp() {
  const hasMetamask =
    window.web3 !== undefined && window.web3.currentProvider !== undefined;

  const store = createStore();

  new Vue({
    router,
    store,
    render: h => h(App, { props: { hasMetamask } })
  }).$mount('#app');

  if (hasMetamask) {
    Vue.use(Web3Service, { store });
    store.dispatch('initApp');
  }
}

startApp();
