<template>
  <div class="Card">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Card'
};
</script>

<style lang="scss" scoped>
.Card {
  background-color: var(--card);
  padding: 40px 40px;
}
</style>
