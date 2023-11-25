<template>
  <div class="mx-auto my-8">
    <UContainer>
      <NuxtLink class="mx-auto w-fit block" to="/">
        <img class="w-36 pb-4 mx-auto" src="/logo.png" alt="Zero Cancer Logo">
      </NuxtLink>
    </UContainer>
    <UTabs :items="items" class="w-full">
      <template #item="{ item }">
        <UCard>
          <template #header>
            <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ item.label }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ item.description }}
            </p>
          </template>

          <div v-if="item.key === 'state'">
            <CreateState />
          </div>

          <div v-if="item.key === 'region'">
            <CreateRegion />
          </div>

          <div v-if="item.key === 'centre'">
            <CreateCentre />
          </div>
        </UCard>
      </template>
    </UTabs>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});

const items = [ 
  {
    key: 'centre',
    label: 'Centre',
    description: 'Expand the form\'s functionality by incorporating a new center option, allowing users to select a preferred location for product retrieval and enhancing their overall experience.'
  }, 
  {
    key: 'region',
    label: 'Region',
    description: 'Enhance the center explorer by adding a new region within an existing state to expand the scope of exploration without introducing redundancy.'
  },
  {
    key: 'state',
    label: 'State',
    description: 'Enhance the center explorer by adding a new state without duplicating existing functionalities to maintain user clarity.'
  }
];
</script>

