<template>
  <div>
    <p v-if="loading">Please wait...</p>
    <UForm v-else :state="cause" :validate="validate" @submit="submitCause" class="space-y-3">
      <UFormGroup label="Name" name="name">
        <UInput v-model="cause.name" />
      </UFormGroup>
      <UFormGroup label="Description" name="description">
        <UTextarea v-model="cause.description" placeholder="Enter the cause description" />
      </UFormGroup>
      <UFormGroup label="Status" name="status">
        <USelect v-model="cause.status" :options="['ongoing', 'completed']" />
      </UFormGroup>
      <!-- <UFormGroup label="Is this our primary cause" name="isPrimary">
        <UToggle disabled color="primary" value="false" v-model="cause.isPrimary" />
      </UFormGroup> -->
      <UFormGroup label="How much do we have?" name="actualAmount">
        <UInput v-model="cause.actualAmount" placeholder="Enter how much we have" />
      </UFormGroup>
      <UFormGroup label="How much do we want?" name="goalAmount">
        <UInput v-model="cause.goalAmount" placeholder="Enter how much we want" />
      </UFormGroup>
      
      <UButton :loading="loading" type="submit" color="black">
        Update Cause
      </UButton>
    </UForm>
  </div>
</template>

<script setup>
const props  = defineProps(['id']);
const emit = defineEmits(['close']);

import { doc, getDoc, setDoc } from 'firebase/firestore'

const db = useFirestore();

let cause = reactive({})
let loading = ref(false);

const toast = useToast();

onMounted(async () => {
  loading.value = true
  await getDoc(doc(db, 'causes', props.id)).then((doc) => {
    cause = {id: doc.id, ...doc.data()};
  }).finally(() => {
    loading.value = false
  });
})

async function submitCause() {
  loading.value = true;

  await setDoc(doc(db, 'causes', cause.id), cause)
  .then(() => {
    toast.add({ title: 'Cause updated successfully' })
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
  if (!state.description) errors.push({ path: 'description', message: 'Description is required' });
  if (!state.status) errors.push({ path: 'status', message: 'Status is required' });
  if (!state.actualAmount) errors.push({ path: 'actualAmount', message: 'Actual amount is required' });
  if (!state.goalAmount) errors.push({ path: 'goalAmount', message: 'Goal amount is required' });

  return errors;
}
</script>