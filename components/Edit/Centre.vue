<template>
  <div>
    <UForm :state="centre" :validate="validateCentre" @submit="submitCentre" class="space-y-3">
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
        {{ loading ? 'Please wait...' : 'Update Centre' }}
      </UButton>
    </UForm>
  </div>
</template>

<script setup>
const props  = defineProps(['id']);
import { doc, getDoc } from 'firebase/firestore'

const db = useFirestore();
let centre = reactive({})
let loading = ref(false)

loading.value = true
await getDoc(doc(db, 'locations', 'centres', 'centre', props.id)).then((doc) => {
  centre = {id: doc.id, ...doc.data()};
}).finally(() => {
  loading.value = false
});

function submitCentre() {

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