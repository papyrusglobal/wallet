<template functional>
  <div class="MetamaskError">
    <img
      src="@/assets/images/metamask-logo.svg"
      alt="Metamask"
      title="Metamask"
      width="104"
      height="93"
    />
    <div class="MetamaskError__text">
      <slot />
    </div>
    <slot name="action" />
  </div>
</template>

<style lang="scss" scoped>
.MetamaskError {
  max-width: 360px;
  width: 100%;
  margin: 40px auto;
  text-align: center;

  &__text {
    font-size: 1.5rem;
    line-height: 140%;
    font-weight: bold;
    margin: 20px 0 30px;
  }
}
</style>
