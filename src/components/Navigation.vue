<template>
  <nav class="Navigation">
    <li>
      <router-link :to="{ name: 'staking' }" exact>Staking</router-link>
    </li>
    <li>
      <router-link :to="{ name: 'voting' }">Voting</router-link>
    </li>
  </nav>
</template>

<script>
export default {
  name: 'Navigation'
};
</script>

<style lang="scss" scoped>
.Navigation {
  margin-top: 24px;
  list-style-type: none;
  text-align: center;
  padding-bottom: 40px;

  li {
    display: inline-flex;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.9rem;
    letter-spacing: 0.08rem;

    a {
      display: block;
      padding: 8px 24px;
      color: var(--black);

      &.router-link-active,
      &.router-link-exact-active {
        color: var(--blue);
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
