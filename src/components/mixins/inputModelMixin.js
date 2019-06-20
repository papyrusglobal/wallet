export default {
  name: 'inputModelMixin',
  model: {
    prop: 'value',
    event: 'changing'
  },
  props: {
    value: {},
    error: {
      type: Boolean,
      default: false
    }
  }
};
