<template>
  <div class="mx-auto my-8">
    <UContainer>
      <img class="w-36 pb-4 mx-auto" src="/logo.png" alt="Zero Cancer Logo">
      <NuxtLink class="block my-4" to="/create/envoy">
        <UButton block>
          Create Envoy
        </UButton>
      </NuxtLink>
      <NuxtLink class="block my-4" to="/create/location">
        <UButton block>
          Create Location
        </UButton>
      </NuxtLink>
      <NuxtLink class="block my-4" to="/create/cause">
        <UButton block>
          Create Cause
        </UButton>
      </NuxtLink>
      <NuxtLink class="block my-4" to="/view/location">
        <UButton block>
          View Locations
        </UButton>
      </NuxtLink>
      <NuxtLink class="block my-4" to="/view/donations">
        <UButton block>
          View Donations
        </UButton>
      </NuxtLink>
      <UButton class="my-4" @click="logout" block>
        Logout
      </UButton>
    </UContainer>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});

import {
  signOut,
} from 'firebase/auth'

const auth = useFirebaseAuth();

async function logout() {
  await signOut(auth)
}
</script>