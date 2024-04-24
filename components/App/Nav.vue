<template>
  <div class="mx-auto my-8">
    <img class="w-36 pb-4 mx-auto" src="/logo.png" alt="Zero Cancer Logo">
    <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
  </div>
</template>

<script setup>
import {
  signOut,
} from 'firebase/auth'

const auth = useFirebaseAuth();

async function logout() {
  await signOut(auth)
}

const route = useRoute()

const links = [{
  label: 'Home',
  to: '/'
}, {
  label: 'Create Cause',
  to: '/create/cause'
}, {
}, {
  label: 'Create Location',
  to: '/create/location'
}, {
}, {
  label: 'Create Envoy',
  to: '/create/envoy'
}, {
}, {
  label: 'View Location',
  to: '/view/location'
}, {
  label: 'View Donations',
  to: '/view/donations'
}];

</script>
