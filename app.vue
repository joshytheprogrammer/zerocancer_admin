<template>
  <div id="app ">
    <UContainer class="min-h-screen">
      <ClientOnly>
        <div class="flex justify-center my-4">
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="gray"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
          />
        </div>

        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>
      <NuxtPage />
    </UContainer>
    <UNotifications />
    <AppFooter />
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()
const user = useCurrentUser()

const colorMode = useColorMode()

const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

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
