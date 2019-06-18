import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'staking',
      component: () =>
        import(/* webpackChunkName: "staking" */ './views/Staking.vue')
    },
    {
      path: '/voting',
      name: 'voting',
      component: () =>
        import(/* webpackChunkName: "voting" */ './views/Voting.vue')
    },
    {
      path: '*',
      name: 'err',
      component: () =>
        import(/* webpackChunkName: "voting" */ './views/NotFound.vue')
    }
  ]
});
