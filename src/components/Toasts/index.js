import ToastMethods from './ToastMethods';

export default {
  install(Vue, options = {}) {
    const { store, ...otherOptions } = options;
    const methods = ToastMethods(Vue, otherOptions);
    Object.defineProperty(Vue.prototype, '$toast', {
      get() {
        return methods;
      }
    });
    if (store) {
      store.$toast = methods;
    }
    window.$toast = methods;
  }
};
