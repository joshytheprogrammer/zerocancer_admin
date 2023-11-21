<template>
  <div class="mx-auto my-8">
    <UContainer>
      <NuxtLink to="/">
        <img class="w-36 pb-4 mx-auto" src="/logo.png" alt="Zero Cancer Logo">
      </NuxtLink>
    </UContainer>
    <UTabs :items="items" class="w-full">
      <template #item="{ item }">
        <UCard @submit.prevent="callSubmit(item.key)">
          <template #header>
            <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ item.label }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ item.description }}
            </p>
          </template>

          <div v-if="item.key === 'state'" class="space-y-3">
          
          </div>

          <div v-if="item.key === 'region'" class="space-y-3">
          
          </div>

          <div v-if="item.key === 'centre'" class="space-y-3">
          
          </div>

          <template #footer>
            <UButton type="submit" color="black">
              Add {{ item.label }}
            </UButton>
          </template>
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
    key: 'state',
    label: 'State',
    description: 'Enhance the center explorer by adding a new state without duplicating existing functionalities to maintain user clarity.'
  }, 
  {
    key: 'region',
    label: 'Region',
    description: 'Enhance the center explorer by adding a new region within an existing state to expand the scope of exploration without introducing redundancy.'
  }, 
  {
    key: 'centre',
    label: 'Centre',
    description: 'Expand the form\'s functionality by incorporating a new center option, allowing users to select a preferred location for product retrieval and enhancing their overall experience.'
  }
];

function callSubmit(key) {
  if(key === 'state'){submitState()}
  else if(key === 'region'){submitRegion()}
  else if(key === 'centre'){submitCentre()}
}

function submitState() {
  console.log("State submitted")
}

function submitRegion() {
  console.log("Region submitted")
}

function submitCentre() {
  console.log("Centre submitted")
}
</script>

