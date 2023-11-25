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

          <div v-if="item.key === 'state'">
            <CreateState />
          </div>

          <div v-if="item.key === 'region'">
            <CreateRegion />
          </div>


          <UForm v-if="item.key === 'centre'" :state="centre" :validate="validateCentre" @submit="submitCentre" class="space-y-3">
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
              <USelectMenu v-model="centre.services" :options="['Screening only', 'Treatment', 'Screening + Diagnosis and Treatment', ]" />
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
            
            <UButton :loading="loading" type="submit" color="black">
              {{ loading ? 'Please wait...' : 'Add Centre' }}
            </UButton>
          </UForm>
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
import { uuid } from 'vue-uuid';

const db = useFirestore();
const toast = useToast();
fetchItems();

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

const exisitingRegions = ref([]);
const exisitingCentres = ref([]); 

let loading = ref(false);

async function submitState() {
  loading.value = true;
  
  const stateID = generateID(state);

  await setDoc(doc(db, "locations", "states", 'state', stateID), state)
  .then(() => {
    clearObjectValues(state)
    toast.add({ title: 'State created successfully' })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error({code: errorCode, message: errorMessage})
    toast.add({ title: 'An error occurred!!!' })
  }).finally(() => {
    fetchItems();
    loading.value = false;
  });
}

async function submitRegion() {
  loading.value = true;
  
  const regionID = generateID(region);

  await setDoc(doc(db, "locations", "regions", 'region', regionID), region)
  .then(() => {
    clearObjectValues(region)
    toast.add({ title: 'Region created successfully' })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error({code: errorCode, message: errorMessage})
    toast.add({ title: 'An error occurred!!!' })
  }).finally(() => {
    fetchItems();
    loading.value = false;
  });
}

async function submitCentre() {
  loading.value = true;
  
  const centreID = generateID(centre);

  await setDoc(doc(db, "locations", "centres", 'centre', centreID), centre)
  .then(() => {
    clearObjectValues(centre)
    toast.add({ title: 'Centre created successfully' })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error({code: errorCode, message: errorMessage})
    toast.add({ title: 'An error occurred!!!' })
  }).finally(() => {
    fetchItems();
    loading.value = false;
  });
}

function validateState() {
  const errors = [];

  function validateProperty(property, path) {
    if (!property || (typeof property === 'string' && property.trim() === '')) {
      errors.push({ path, message: 'Required' });
    } else if (Array.isArray(property)) {
      property.forEach((item, index) => {
        const itemPath = `${path}[${index}]`;
        validateProperty(item, itemPath);
      });
    } else if (typeof property === 'object') {
      for (const key in property) {
        if (property.hasOwnProperty(key)) {
          const nestedPath = path ? `${path}.${key}` : key;
          validateProperty(property[key], nestedPath);
        }
      }
    }
  }

  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      const propertyPath = key;
      validateProperty(state[key], propertyPath);
    }
  }

  return errors;
}

function validateRegion() {
  const errors = [];

  function validateProperty(property, path) {
    if (!property || (typeof property === 'string' && property.trim() === '')) {
      errors.push({ path, message: 'Required' });
    } else if (Array.isArray(property)) {
      property.forEach((item, index) => {
        const itemPath = `${path}[${index}]`;
        validateProperty(item, itemPath);
      });
    } else if (typeof property === 'object') {
      for (const key in property) {
        if (property.hasOwnProperty(key)) {
          const nestedPath = path ? `${path}.${key}` : key;
          validateProperty(property[key], nestedPath);
        }
      }
    }
  }

  for (const key in region) {
    if (region.hasOwnProperty(key)) {
      const propertyPath = key;
      validateProperty(region[key], propertyPath);
    }
  }

  return errors;
}

function validateCentre() {
  const errors = [];

  for (const key in centre) {
    if (centre.hasOwnProperty(key)) {
      if (!centre[key] || centre[key].trim() === '') {
        errors.push({path: key, message: 'Required'});
      }
    }
  }

  return errors;
}

async function fetchItems() {
  const newExisitingRegions = [];
  const newExisitingCentres = [];

  const regionsSnapshot = await getDocs(collection(db, 'locations', 'regions', 'region'));
  regionsSnapshot.forEach((doc) => {
    newExisitingRegions.push({ id: doc.id, name: doc.data().name });
  });

  const centresSnapshot = await getDocs(collection(db, 'locations', 'centres', 'centre'));
  centresSnapshot.forEach((doc) => {
    newExisitingCentres.push({ id: doc.id, name: doc.data().name });
  });

  // Replace the entire array
  exisitingRegions.value = newExisitingRegions;
  exisitingCentres.value = newExisitingCentres;
}

function generateID(item) {
  return item.name?.toLowerCase().replace(/\s/g, "-") + "-" + uuid.v4().slice(0, 8)
}

function clearObjectValues(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = '';
    }
  }
}
</script>

