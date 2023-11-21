<template>
  <div class="block mx-auto my-8">
    <UContainer>
      <img class="w-36 pb-4 mx-auto" src="/logo.png" alt="Zero Cancer Logo">
      <p class="text-center py-2">This page is under development!!!</p>
      <UButton block>
        <NuxtLink to="/create/">Create</NuxtLink>
      </UButton>
    </UContainer>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});

</script>

<style lang="scss" scoped>

</style>