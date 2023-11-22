<template>
  <div>
    <p v-if="loading">Please wait...</p>
    <UForm v-else :state="centre" :validate="validateCentre" @submit="submitCentre" class="space-y-3">
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
      
      <UButton type="submit" color="black">
        Update Centre
      </UButton>
    </UForm>
  </div>
</template>

<script setup>
const props  = defineProps(['id']);
const emit = defineEmits(['close']);

import { doc, getDoc, setDoc } from 'firebase/firestore'

const db = useFirestore();
let centre = reactive({})
let loading = ref(false)
const toast = useToast();

onMounted(async () => {
  loading.value = true
  await getDoc(doc(db, 'locations', 'centres', 'centre', props.id)).then((doc) => {
    centre = {id: doc.id, ...doc.data()};
  }).finally(() => {
    loading.value = false
  });
})

async function submitCentre() {
  loading.value = true;

  await setDoc(doc(db, "locations", "centres", 'centre', centre.id), centre)
  .then(() => {
    toast.add({ title: 'Centre updated successfully' })
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
</script>

<style lang="scss" scoped>

</style>