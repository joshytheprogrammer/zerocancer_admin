<template>
  <UForm :state="state" :validate="vItem" @submit="submitState" class="space-y-3">
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup label="Regions" name="regions">
      <USelectMenu v-model="state.regions" searchable searchable-placeholder="Search regions..." :options="exisitingRegions" multiple placeholder="Select regions" value-attribute="id" option-attribute="name"/>
    </UFormGroup>
    
    <UButton :loading="loading" type="submit" color="black">
      {{ loading ? 'Please wait...' : 'Add State' }}
    </UButton>
  </UForm>
</template>

<script setup>
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'

const db = useFirestore();
const toast = useToast();
const {generateID, clearObjectValues, validate} = useCreateUtilities();
fetchRegions()

const state = reactive({
  name: undefined,
  regions: []
});

const exisitingRegions = ref([]);

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
    fetchRegions();
    loading.value = false;
  });
}

async function fetchRegions() {
  const newExisitingRegions = [];

  const regionsSnapshot = await getDocs(collection(db, 'locations', 'regions', 'region'));
  regionsSnapshot.forEach((doc) => {
    newExisitingRegions.push({ id: doc.id, name: doc.data().name });
  });

  exisitingRegions.value = newExisitingRegions;
}

function vItem() {
  return validate(state)
}
</script>
