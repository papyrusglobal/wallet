<template>
  <nav class="Navigation">
    <li>
      <router-link :to="{ name: 'staking' }" exact @click.native="scrollToTop">
        Staking
      </router-link>
    </li>
    <li>
      <router-link :to="{ name: 'voting' }" @click.native="scrollToTop">
        Voting
      </router-link>
    </li>
  </nav>
</template>

<script>
import { getScrollTop } from '@/utils/window';

export default {
  name: 'Navigation',
  props: {
    inCard: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    scrollToTop() {
      if (getScrollTop() > 0) {
        window.scrollTo(0, 0);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.Navigation {
  display: flex;
  margin: -40px;
  margin-bottom: 0;
  list-style-type: none;
  text-align: center;
  background-color: var(--white);
  position: sticky;
  top: 0;

  li {
    flex-grow: 1;
    flex-basis: 88px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.9rem;
    letter-spacing: 0.08rem;

    a {
      position: relative;
      display: block;
      padding: 18px 16px 13px;
      color: var(--black);
      border-bottom: 1px solid var(--card-separator);

      &:after {
        content: '';
        position: absolute;
        left: 0;
        border-bottom: 0px solid var(--blue);
        bottom: -1px;
        width: 100%;
        transition: border 0.2s;
      }

      &.router-link-active,
      &.router-link-exact-active {
        color: var(--blue);

        &:after {
          border-bottom: 2px solid var(--blue);
        }
      }

      &:hover {
        transition: color 0.15s;
        text-decoration: none;
        color: var(--blue);
      }
    }
  }
}
</style>
