export default {
  name: 'setNowMixin',
  data() {
    return {
      now: Date.now()
    };
  },
  mounted() {
    this.setNow();
    this.$on('hook:beforeDestroy', () => {
      clearTimeout(this.setNowTimeout);
    });
  },
  methods: {
    setNow() {
      this.now = Date.now();
      this.setNowTimeout = setTimeout(this.setNow, 100);
    }
  }
};
