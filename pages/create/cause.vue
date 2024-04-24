<template>
  <!-- -->
 <UForm :validate="vItem" :state="cause" @submit="submitCause" class="space-y-3">
   <UContainer>
     <NuxtLink class="mx-auto w-fit block" to="/">
       <img class="w-36 pb-4 mx-auto" src="/logo.png" alt="Zero Cancer Logo">
     </NuxtLink>
   </UContainer>
    <UFormGroup label="Name" name="name">
      <UInput v-model="cause.name" placeholder="Enter the name of the cause" />
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
     {{ loading ? 'Please wait...' : 'Add Cause' }}
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
const {validate} = useCreateUtilities();
const router = useRouter();

const cause = reactive({
 name: undefined,
 description: undefined,
 status: 'ongoing',
 dateCreated: new Date(),
 isPrimary: false,
 actualAmount: 1,
 goalAmount: undefined
});

let loading = ref(false);

async function submitCause() {
  console.log(';working')
 loading.value = true;

 await addDoc(collection(db, "causes"), cause)
 .then(() => {
   toast.add({ title: 'Cause added successfully' })
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
  // Create a copy of the cause object
  const cleanedCause = { ...cause };

  // Remove the isPrimary property from the copy
  delete cleanedCause.isPrimary;

  // Validate the cleaned cause object
  return validate(cleanedCause);
}

// function vItem() {
//   return validate(cause)
// }

</script>

