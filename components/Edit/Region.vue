<template>
  <div>
    <p v-if="loading">Please wait...</p>
    <UForm v-else :state="region" :validate="vItem" @submit="submitRegion" class="space-y-3">
      <UFormGroup label="Name" name="name">
        <UInput v-model="region.name" />
      </UFormGroup>
      <UFormGroup label="Centres" name="centres">
        <USelectMenu v-model="region.centres" searchable searchable-placeholder="Search centres..." :options="exisitingCentres" multiple placeholder="Select centres" value-attribute="id" option-attribute="name"/>
      </UFormGroup>
      
      <UButton :loading="loading" type="submit" color="black">
        Update Region
      </UButton>
    </UForm>
  </div>
</template>

<script setup>
const props  = defineProps(['id']);
const emit = defineEmits(['close']);

import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore'

const db = useFirestore();
const {validate} = useCreateUtilities();
let region = reactive({})
let loading = ref(false);
const toast = useToast();

const exisitingCentres = ref([]);
fetchExisitngCentres();

onMounted(async () => {
  loading.value = true
  await getDoc(doc(db, 'locations', 'regions', 'region', props.id)).then((doc) => {
    region = {id: doc.id, ...doc.data()};
  }).finally(() => {
    loading.value = false
  });
})

async function submitRegion() {
  loading.value = true;

  await setDoc(doc(db, "locations", "regions", 'region', region.id), region)
  .then(() => {
    toast.add({ title: 'Region updated successfully' })
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


async function fetchExisitngCentres() {
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