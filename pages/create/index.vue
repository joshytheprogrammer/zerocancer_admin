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
            <UFormGroup label="Name" name="name">
              <UInput v-model="state.name" />
            </UFormGroup>
            <UFormGroup label="Regions" name="regions">
              <USelectMenu v-model="state.regions" searchable searchable-placeholder="Search regions..." :options="exisitingRegions" multiple placeholder="Select regions" value-attribute="id" option-attribute="name"/>
            </UFormGroup>
          </div>

          <div v-if="item.key === 'region'" class="space-y-3">
            <UFormGroup label="Name" name="name">
              <UInput v-model="region.name" />
            </UFormGroup>
            <UFormGroup label="Centres" name="centres">
              <USelectMenu v-model="region.centres" searchable searchable-placeholder="Search centres..."  :options="exisitingCentres" multiple placeholder="Select centres" value-attribute="id" option-attribute="name"/>
            </UFormGroup>
          </div>

          <div v-if="item.key === 'centre'" class="space-y-3">
            <UFormGroup label="Name" name="name">
              <UInput v-model="centre.name" />
            </UFormGroup>
            <UFormGroup label="Manager name" name="managerName">
              <UInput v-model="centre.managerName" />
            </UFormGroup>
            <UFormGroup label="Phone number" name="phone">
              <UInput v-model="centre.phone" />
            </UFormGroup>
            <UFormGroup label="Services" name="services">
              <USelectMenu v-model="centre.services" :options="['Screening only', 'Treatment', 'Screening, Diagnosis and Treatment', ]" />
            </UFormGroup>
            <UFormGroup label="Address" name="address">
              <UInput v-model="centre.address" />
            </UFormGroup>
            <UFormGroup label="Link to Google Maps" name="mapsLink">
              <UInput v-model="centre.mapsLink" />
            </UFormGroup>
            <UFormGroup label="Link to Google Form" name="formLink">
              <UInput v-model="centre.formLink" />
            </UFormGroup>
          </div>

          <template #footer>
            <UButton :loading="loading" type="submit" color="black">
              {{ loading ? 'Please wait...' : 'Add '+ item.label }}
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

const toast = useToast();

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

const state = reactive({
  name: undefined,
  regions: []
});

const region = reactive({
  name: undefined,
  centres: []
});

const centre = reactive({
  name: undefined,
  managerName: undefined,
  phone: undefined,
  services: undefined,
  mapsLink: undefined,
  formLink: undefined,
  address: undefined,
});

const exisitingRegions = ref([]); // Request the Regions array from firebase
const exisitingCentres = ref([]); // Request the Regions array from firebase

let loading = ref(false);

function submitState() {
  loading.value = true;
  console.log(state)
}

function submitRegion() {
  loading.value = true;
  console.log(region)
}

function submitCentre() {
  loading.value = true;
  console.log(centre)
}

function callSubmit(key) {
  if(key === 'state'){submitState()}
  else if(key === 'region'){submitRegion()}
  else if(key === 'centre'){submitCentre()}
}
</script>

