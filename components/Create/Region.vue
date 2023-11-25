<template>
  <UForm :state="region" :validate="vItem" @submit="submitRegion" class="space-y-3">
    <UFormGroup label="Name" name="name">
      <UInput v-model="region.name" />
    </UFormGroup>
    <UFormGroup label="Centres" name="centres">
      <USelectMenu v-model="region.centres" searchable searchable-placeholder="Search centres..."  :options="exisitingCentres" multiple placeholder="Select centres" value-attribute="id" option-attribute="name"/>
    </UFormGroup>
    
    <UButton :loading="loading" type="submit" color="black">
      {{ loading ? 'Please wait...' : 'Add Region' }}
    </UButton>
  </UForm>
</template>

<script setup>
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'

const db = useFirestore();
const toast = useToast();
const {generateID, clearObjectValues, validate} = useCreateUtilities();
fetchCentres();

const region = reactive({
  name: undefined,
  centres: []
});

const exisitingCentres = ref([]); 

let loading = ref(false);

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
    fetchCentres();
    loading.value = false;
  });
}

async function fetchCentres() {
  const newExisitingCentres = [];

  const centresSnapshot = await getDocs(collection(db, 'locations', 'centres', 'centre'));
  centresSnapshot.forEach((doc) => {
    newExisitingCentres.push({ id: doc.id, name: doc.data().name });
  });
  
  exisitingCentres.value = newExisitingCentres;
}

function vItem() {
  return validate(region)
}


</script>
