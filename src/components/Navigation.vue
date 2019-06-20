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
export default {
  name: 'Navigation',
  methods: {
    scrollToTop() {
      if (
        (window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop) > 0
      ) {
        window.scrollTo(0, 0);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.Navigation {
  display: flex;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
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
        bottom: -1px;
        width: 100%;
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
