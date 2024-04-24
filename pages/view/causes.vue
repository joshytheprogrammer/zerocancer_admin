<template>
  <div class="mx-auto my-8">
    <UCard>
      <template #header>
        <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          View Causes
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and edit all the causes created by zerocancer.
        </p>
      </template>

      <div class="space-y-3">
        <ViewCauses />
      </div>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});
</script>

