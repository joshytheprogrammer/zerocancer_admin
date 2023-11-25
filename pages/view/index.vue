<template>
  <div class="mx-auto my-8">
    <UContainer>
      <NuxtLink to="/">
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

          <div v-if="item.key === 'state'" class="space-y-3">
            
          </div>

          <div v-if="item.key === 'region'" class="space-y-3">
            <ViewRegions />
          </div>

          <div v-if="item.key === 'centre'" class="space-y-3">
            <ViewCentres />
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

import { collection, getDocs,doc, setDoc } from 'firebase/firestore'

const db = useFirestore()
const toast = useToast();

const items = [ 
  {
    key: 'centre',
    label: 'Centre',
    description: 'View and edit information about the centres shown to the user'
  }, 
  {
    key: 'region',
    label: 'Region',
    description: 'View and edit information about the regions shown to the user'
  },
  {
    key: 'state',
    label: 'State',
    description: 'View and edit information about the states shown to the user'
  }
];


</script>

