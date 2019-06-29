<template>
  <div class="Header">
    <router-link to="/">
      <img src="/logo.svg" width="176" height="40" id="step-1" />
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
}
</style>
