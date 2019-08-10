<template>
  <transition name="slide" @after-leave="handleLeave">
    <div
      v-show="isActive"
      class="Toast"
      :class="{ [`--${type}`]: !!this.type }"
      @click="handleClick"
    >
      <div class="Toast__inner">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script>
const removeElement = el => {
  if (typeof el.remove !== 'undefined') {
    el.remove();
  } else {
    el.parentNode.removeChild(el);
  }
};

export default {
  name: 'Toast',
  props: {
    message: {
      type: String,
      required: true
    },
    delay: {
      type: Number,
      default: 5000
    },
    type: {
      type: String,
      default: null
    },
    onClose: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isActive: false,
      container: null
    };
  },
  beforeMount() {
    this.setup();
  },
  mounted() {
    this.show();
  },
  methods: {
    setup() {
      this.container = document.querySelector('#toasts-container');
      if (this.container) return;

      this.container = document.createElement('div');
      this.container.id = 'toasts-container';
      document.body.appendChild(this.container);
    },
    show() {
      if (this.shouldQueue()) {
        setTimeout(this.show, 200);
        return;
      }
      this.container.insertAdjacentElement('afterbegin', this.$el);
      this.isActive = true;
      this.timer = setTimeout(this.close, this.delay);
    },
    close() {
      clearTimeout(this.timer);
      this.isActive = false;
    },
    shouldQueue() {
      return this.container.childElementCount > 0;
    },
    handleClick() {
      this.onClose.apply(null, arguments);
      this.close();
    },
    handleLeave() {
      this.$destroy();
      removeElement(this.$el);
    }
  }
};
</script>

<style lang="scss" scoped>
.Toast {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  color: var(--white);
  background: var(--blue);
  text-align: center;
  cursor: pointer;
  z-index: 1000;

  &.--error {
    background: var(--red);
  }

  &.--success {
    background: var(--green);
  }

  &__inner {
    padding: 16px 40px;
  }
}
</style>
