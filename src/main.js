import Vue from 'vue';
import App from './App.vue';
import router from './router';
import createStore from './store';
import Toasts from './components/Toasts';
import './styles/main.scss';

Vue.config.productionTip = false;

startApp();

async function startApp() {
  const hasMetamask =
    window.web3 !== undefined && window.web3.currentProvider !== undefined;

  const store = createStore();

  Vue.use(Toasts, { store });

  new Vue({
    router,
    store,
    render: h => h(App, { props: { hasMetamask } })
  }).$mount('#app');

  if (!hasMetamask) return;
  const Web3Service = (await import(
    /* webpackChunkName: "web3" */ './plugins/web3Service'
  )).default;
  const provider = await getProvider();
  if (provider) {
    Vue.use(Web3Service, { store, provider });
    // store.$service.askPermission();
  }
  store.dispatch('initApp');
}

async function getProvider() {
  if ('ethereum' in window) {
    return window.ethereum;
  } else if ('web3' in window) {
    return window.web3.currentProvider;
  }
  return null;
}
