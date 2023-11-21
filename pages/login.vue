<template>
  <div>
    Email,
    Password
  </div>
</template>

<script setup>
import {
  signInWithEmailAndPassword,
} from 'firebase/auth'

const auth = useFirebaseAuth();

const user = {
  email: "admin@zerocancer.africa",
  password: "NnR7#py6?:qm"
}

signInWithEmailAndPassword(auth, user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error({code: errorCode, message: errorMessage})
  });
</script>

<style lang="scss" scoped>

</style>