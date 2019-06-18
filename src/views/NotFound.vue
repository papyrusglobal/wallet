<template functional>
  <div class="NotFound">
    <div class="NotFound__code">
      404
    </div>
    <div class="NotFound__message">Page not found</div>
    <router-link to="/">
      Yankee go home!
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style lang="scss" scoped>
.NotFound {
  text-align: center;
  max-width: 360px;
  margin: 80px auto 40px;

  &__message {
    font-size: 1.4rem;
    line-height: 150%;
  }

  &__code {
    line-height: 100%;
    font-size: 10rem;
    font-weight: bold;
    color: var(--blue);
    transform: rotate(5deg);
    animation: colorize infinite 3s linear, scalize infinite 1s ease-in-out;
    user-select: none;

    @keyframes colorize {
      0% {
        color: var(--blue);
      }

      50% {
        color: var(--red);
      }
    }

    @keyframes scalize {
      0% {
        transform: scale(1) rotate(5deg);
      }

      50% {
        transform: scale(1.5) rotate(-5deg);
      }
    }
  }
}
</style>
