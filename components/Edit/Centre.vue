<template>
  <div>
    <p v-if="loading">Please wait...</p>
    <UForm v-else :state="centre" :validate="validate" @submit="submitCentre" class="space-y-3">
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
        <USelectMenu v-model="centre.services" :options="['Selling only', 'Screening only', 'Screening and treatment', 'Screening, diagnosis and treatment']" />
      </UFormGroup>
      <UFormGroup label="Product Seller" name="isSeller">
        <UToggle color="primary" v-model="centre.isSeller" />
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

function validate(state) {
  const errors = [];

  // Rule 1: No field can be left empty
  if (!state.name) errors.push({ path: 'name', message: 'Name is required' });
  if (!state.managerName) errors.push({ path: 'managerName', message: 'Manager name is required' });
  if (!state.phone) errors.push({ path: 'phone', message: 'Phone number is required' });
  if (!state.services) errors.push({ path: 'services', message: 'Services are required' });
  if (!state.address) errors.push({ path: 'address', message: 'Address is required' });
  if (!state.mapsLink) errors.push({ path: 'mapsLink', message: 'Map link is required' });
  if (!state.formLink) errors.push({ path: 'formLink', message: 'Form link is required' });

  // Rule 2: Make sure the phoneNumber is a Nigerian phone number. Use regex
  const phoneNumbers = centre.phone.split(',').map(num => num.trim());
  const nigerianPhoneRegex = /^((\+)?(234)|0)(7|8|9)(0|1)\d{8}$/;

  phoneNumbers.forEach(phone => {
    if (!nigerianPhoneRegex.test(phone)) {
      errors.push({ path: 'phone', message: 'Invalid Nigerian phone number' });
    }
  });
  
  // Rule 3: Make sure the link to maps fits all possible maps format but not anything else.
  const googleMapsRegex = /^(https:\/\/maps\.google\.com\/|https:\/\/maps\.app\.goo\.gl\/|https:\/\/goo\.gl\/maps\/)/;
  if (!googleMapsRegex.test(centre.mapsLink)) {
    errors.push({ path: 'mapsLink', message: 'Invalid map link format' });
  }

  // Rule 4: Link to form must fit all possible google form format but nothing else.
  const googleFormRegex = /^https:\/\/(docs\.google\.com\/forms|forms\.gle)\/.*/;
  if (!googleFormRegex.test(state.formLink)) {
    errors.push({ path: 'formLink', message: 'Invalid form link format' });
  }

  return errors;
}

</script>

<style lang="scss" scoped>

</style>