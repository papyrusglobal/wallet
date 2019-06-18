<template>
  <div class="Header">
    <router-link to="/">
      <img src="/logo.svg" width="176" height="40" />
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Header'
};
</script>

<style lang="scss" scoped>
.Header {
  text-align: center;
  padding: 40px 0 0;
}
</style>
