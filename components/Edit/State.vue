<template>
  <div>
    <p v-if="loading">Please wait...</p>
    <UForm v-else :state="state" :validate="validateState" @submit="submitState" class="space-y-3">
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="Regions" name="regions">
        <USelectMenu v-model="state.regions" searchable searchable-placeholder="Search regions..."  :options="exisitingRegions" multiple placeholder="Select regions" value-attribute="id" option-attribute="name"/>
      </UFormGroup>
      
      <UButton :loading="loading" type="submit" color="black">
        Update State
      </UButton>
    </UForm>
  </div>
</template>

<script setup>
const props  = defineProps(['id']);
const emit = defineEmits(['close']);

import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore'

const db = useFirestore();
let state = reactive({})
let loading = ref(false);
const toast = useToast();

const exisitingRegions = ref([]);
fetchExisitngRegions();

onMounted(async () => {
  loading.value = true
  await getDoc(doc(db, 'locations', 'states', 'state', props.id)).then((doc) => {
    state = {id: doc.id, ...doc.data()};
  }).finally(() => {
    loading.value = false
  });
})

async function submitState() {
  loading.value = true;

  await setDoc(doc(db, "locations", "states", 'state', state.id), state)
  .then(() => {
    toast.add({ title: 'State updated successfully' })
    emit('close')
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error({code: errorCode, message: errorMessage})
    toast.add({ title: 'An error occurred!!!' })
  }).finally(() => {
    loading.value = false;
  });
}


async function fetchExisitngRegions() {
  const newExisitingRegions = [];

  const regionsSnapshot = await getDocs(collection(db, 'locations', 'regions', 'region'));
  regionsSnapshot.forEach((doc) => {
    newExisitingRegions.push({ id: doc.id, name: doc.data().name });
  });

  exisitingRegions.value = newExisitingRegions;
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
</script>