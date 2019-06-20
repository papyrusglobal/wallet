import Toast from './Toast';

const ToastMethods = (Vue, globalOptions = {}) => {
  return {
    open(options) {
      let message;
      if (typeof options === 'string') {
        message = options;
      }
      const defaultOptions = {
        message
      };
      const propsData = Object.assign(
        {},
        defaultOptions,
        globalOptions,
        options
      );
      return new (Vue.extend(Toast))({
        el: document.createElement('div'),
        propsData
      });
    },
    info(message, options = {}) {
      return this.open(
        Object.assign(
          {
            message
          },
          options
        )
      );
    },
    success(message, options = {}) {
      return this.open(
        Object.assign(
          {
            message,
            type: 'success'
          },
          options
        )
      );
    },
    error(message, options = {}) {
      return this.open(
        Object.assign(
          {
            message,
            type: 'error'
          },
          options
        )
      );
    }
  };
};

export default ToastMethods;
