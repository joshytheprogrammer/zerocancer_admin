<template>
   <!-- -->
  <UForm :validate="vItem" :state="envoy" @submit="submitEnvoy" class="space-y-3">
    <UContainer>
      <NuxtLink class="mx-auto w-fit block" to="/">
        <img class="w-36 pb-4 mx-auto" src="/logo.png" alt="Zero Cancer Logo">
      </NuxtLink>
    </UContainer>
    <UFormGroup label="Name" name="fullName">
      <UInput v-model="envoy.fullName" placeholder="Enter the Full Name of the envoy" />
    </UFormGroup>
    <UFormGroup label="Title" name="title">
      <UInput v-model="envoy.title" placeholder="Enter the envoy's title" />
    </UFormGroup>
    <UFormGroup label="Email" name="email">
      <UInput v-model="envoy.email" placeholder="Enter the envoy's email" />
    </UFormGroup>
    <UFormGroup label="Image Link" name="profileImage">
      <UInput v-model="envoy.profileImage"  placeholder="Enter the image link" />
    </UFormGroup>
    <UFormGroup label="Specialties" name="specialties">
      <USelectMenu
        clear-search-on-close
        v-model="envoy.specialties"
        name="specialties"
        :options="envoy.specialties"
        multiple
        searchable
        creatable
        value-attribute=""
        show-create-option-when="always"
        placeholder="Add specialties"
      />
    </UFormGroup>
    <UFormGroup label="Memberships" name="memberships">
      <USelectMenu
        clear-search-on-close
        v-model="envoy.memberships"
        name="memberships"
        :options="envoy.memberships"
        multiple
        searchable
        creatable
        show-create-option-when="always"
        placeholder="Add memberships"
      />
    </UFormGroup>
    <UFormGroup label="Qualifications" name="qualifications">
      <USelectMenu
        clear-search-on-close
        v-model="envoy.qualifications"
        name="qualifications"
        :options="envoy.qualifications"
        multiple
        searchable
        creatable
        show-create-option-when="always"
        placeholder="Add qualifications"
      />
    </UFormGroup>
    <UFormGroup label="Place of Work" name="placeOfWork">
      <UInput v-model="envoy.placeOfWork" placeholder="Enter the envoys place of work" />
    </UFormGroup>
    <UFormGroup label="Vision Link" name="visionLink">
      <UInput v-model="envoy.visionLink" placeholder="Enter the link to the video vision" />
    </UFormGroup>
    <UFormGroup label="Vision Statement" name="visionStatement">
      <UTextarea v-model="envoy.visionStatement" placeholder="Enter the envoys vision statement" />
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

import { collection, addDoc } from 'firebase/firestore'

const db = useFirestore();
const toast = useToast();
const router = useRouter();
const {validate} = useCreateUtilities();

const envoy = reactive({
  fullName: undefined,
  title: undefined,
  email: undefined,
  profileImage: undefined,
  specialties: [],
  memberships: [],
  qualifications: [],
  placeOfWork: undefined,
  visionLink: undefined,
  visionStatement: undefined,
  dateAdded: new Date()
});

let loading = ref(false);

async function submitEnvoy() {
  loading.value = true;

  await addDoc(collection(db, "envoys"), envoy)
  .then(() => {
    toast.add({ title: 'Envoy added successfully' })
    router.push('/')
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
  return validate(envoy)
}

</script>

