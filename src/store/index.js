import Vue from 'vue';
import Vuex from 'vuex';
import * as main from './main';

Vue.use(Vuex);

let store;
const createStore = () => {
  store = new Vuex.Store({
    ...main
  });
  return store;
};

export const getStore = () => store;
export default createStore;
