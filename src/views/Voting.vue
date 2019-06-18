<template>
  <Card class="Voting">
    <AccountInfo />
    <CardSeparator />
    <h1 style="margin: 0; padding: 50px 0;">
      Let's vote bitch!
    </h1>
  </Card>
</template>

<script>
import Card from '@/components/Card';
import CardSeparator from '@/components/CardSeparator';
import AccountInfo from '@/components/AccountInfo';

export default {
  name: 'Voiting',
  components: { AccountInfo, Card, CardSeparator }
};
</script>

<style lang="scss" scoped>
.Voting {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
</style>
