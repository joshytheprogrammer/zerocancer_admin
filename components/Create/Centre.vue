<template>
  <UForm :state="centre" :validate="vItem" @submit="submitCentre" class="space-y-3">
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
</template>

<script setup>
import { doc, setDoc } from 'firebase/firestore'

const db = useFirestore();
const toast = useToast();
const {generateID, clearObjectValues, validate} = useCreateUtilities();

const centre = reactive({
  name: undefined,
  managerName: undefined,
  phone: undefined,
  services: undefined,
  mapsLink: undefined,
  formLink: undefined,
  address: undefined,
});

let loading = ref(false);

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
    loading.value = false;
  });
}

function vItem() {
  return validate(centre)
}

</script>

