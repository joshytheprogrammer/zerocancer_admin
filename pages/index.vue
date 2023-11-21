<template>
  <div class="block mx-auto my-8">
    <UContainer>
      <img class="w-36 pb-4 mx-auto" src="/logo.png" alt="Zero Cancer Logo">
      <p class="text-center py-2">This page is under development!!!</p>
      <NuxtLink to="/create/">
        <UButton block>
          Create
        </UButton>
      </NuxtLink>
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