<template>
  <div class="mx-auto my-8">
    <UCard>
      <template #header>
        <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          View Donations
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          A place to view all the donations made to zerocancer sorted according to the date donated.
        </p>
      </template>

      <div class="space-y-3">
        <ViewDonations />
      </div>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});


</script>

