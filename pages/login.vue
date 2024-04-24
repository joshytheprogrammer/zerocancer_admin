<template>
  <div class="block my-8 mx-auto py-4 max-w-lg">
    <UContainer>
      <div v-if="checkingAuthentication">
        <UProgress animation="carousel" />
        <p class="text-center my-4">
          Authenticating...
        </p>
      </div>
      <UForm v-else="!checkingAuthentication" :state="user" class="space-y-4" :validate="validate" @submit="onSubmit">
        <UFormGroup label="Email" name="email">
          <UInput v-model="user.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="user.password" type="password" />
        </UFormGroup>

        <UButton :loading="loading" type="submit">
          Submit
        </UButton>
      </UForm>
    </UContainer>
  </div>
</template>

<script setup>
import {
  signInWithEmailAndPassword,
} from 'firebase/auth'

definePageMeta({
  layout: false
})

const router = useRouter();
const auth = useFirebaseAuth();
const toast = useToast();

let loading = ref(false);
let checkingAuthentication = ref(true);

onMounted(() => {
  setTimeout(() => {
    checkingAuthentication.value = false;
  }, 20000);
});

const user = reactive({
  email: undefined,
  password: undefined
});

function validate(user) {
  const errors = []
  // Validate email
  if (!user.email) {
    errors.push({ path: 'email', message: 'Required' });
  } else if (!validateEmail(user.email)) {
    errors.push({ path: 'email', message: 'Invalid email format' });
  }

  // Validate password
  if (!user.password) {
    errors.push({ path: 'password', message: 'Required' });
  } else if (!validatePassword(user.password)) {
    errors.push({ path: 'password', message: 'Password is too weak' });
  }

  return errors
}

async function onSubmit() {
  loading.value = true;

  await signInWithEmailAndPassword(auth, user.email, user.password)
  .then(() => {
    toast.add({ title: 'Authentication successful' })
    router.push('/')
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error({code: errorCode, message: errorMessage})
  }).finally(() => {
    loading.value = false;
  });
}

function validateEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[a-zA-Z]{2,})$/;
  return regex.test(email);
}

function validatePassword(password) {
  // Check password length
  if (password.length < 8) {
    return false;
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return false;
  }

  // Check for at least one special character
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return false;
  }

  return true;
}
</script>