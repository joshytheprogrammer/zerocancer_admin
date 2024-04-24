<template>
  <div>
    <p v-if="loading">Please wait...</p>
    <div v-if="donation.paystack" >
      <h2>User Details</h2>
      <p>Name: {{ donation.fullName }}</p>
      <p>Email: {{ donation.email }}</p>
      <p>Phone: {{ donation.phone }}</p>
      <p>Reason: {{ donation.reason }}</p>
      <p>Amount: {{ new Intl.NumberFormat('en-NG', {style: 'currency', currency: donation?.currency}).format(donation.amount)}}</p>
      <p>Linkedin: <a class="underline" target="_blank" :href="'https://www.linkedin.com/in/'+donation.linkedin">@{{ donation.linkedin }}</a></p>
      <p>Paystack Reference: {{ donation.paystackReference }}</p>

      <h2>Payment Details</h2>
      <p>Payment Method: {{ donation.paystack.authorization.channel }}</p>
      <p>Payment Created: 
        {{
          new Date(donation.paystack.createdAt).toLocaleString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
        }}
      </p>
      <p>Payment Completed: 
        {{
          new Date(donation.paystack.paidAt).toLocaleString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
        }}
      </p>
      <p>Payment From: {{ donation.paystack.ip_address }}</p>
    </div>
  </div>
</template>

<script setup>
const props  = defineProps(['id']);
const emit = defineEmits(['close']);

import { doc, getDoc } from 'firebase/firestore'

const db = useFirestore();
let donation = reactive({})
let loading = ref(false);

onMounted(async () => {
  loading.value = true
  await getDoc(doc(db, 'donations', props.id)).then((doc) => {
    donation = {id: doc.id, ...doc.data()};
  }).catch((e)=>{
    console.log(e)
  }).finally(() => {
    loading.value = false
  });
});
</script>