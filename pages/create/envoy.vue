<template>
  <UForm :state="envoy" :validate="vItem" @submit="submitEnvoy" class="space-y-3">
    <UFormGroup label="Name" name="fullName">
      <UInput v-model="envoy.fullName" />
    </UFormGroup>
    <UButton :loading="loading" type="submit" color="black">
      {{ loading ? 'Please wait...' : 'Add Envoy' }}
    </UButton>
  </UForm>
</template>


<script setup>
definePageMeta({
  middleware: ['auth'],
});

import { doc, setDoc } from 'firebase/firestore'

const db = useFirestore();
const toast = useToast();
const {validate} = useCreateUtilities();

const envoy = reactive({
  fullName: undefined,
  title: undefined,
  email: undefined,
  imgLink: undefined,
  specialties: [],
  memberships: [],
  qualifications: [],
  placeOfWork: undefined,
  visionLink: undefined,
  visionStatement: undefined
});

let loading = ref(false);

async function submitEnvoy() {
  loading.value = true;

  await setDoc(doc(db, "envoys"), envoy)
  .then(() => {
    toast.add({ title: 'Envoy added successfully' })
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

