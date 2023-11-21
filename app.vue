<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()
const user = useCurrentUser()

onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      router.push('/login')
    } else if (user && typeof route.query.redirect === 'string') {
      // user logged in
      router.push(route.query.redirect)
    }
  })
});
</script>