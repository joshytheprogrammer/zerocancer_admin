<template>
  <div>
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="q" placeholder="Filter donations..." />
    </div>

    <UTable :loading="loading" :rows="filteredRows" :columns="columns">
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
      <template #amount-data="{ row }">
        {{ new Intl.NumberFormat('en-NG', {style: 'currency', currency: row.currency}).format(row.amount) }}
      </template>
      <template #linkedin-data="{ row }">
        <a class="underline" target="_blank" :href="'https://www.linkedin.com/in/'+row.linkedin">@{{ row.linkedin }}</a>
      </template>
      <template #paystack.createdAt-data="{ row }">
        {{
          new Date(row.paystack.createdAt).toLocaleString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
        }}
      </template>
    </UTable>

    <!-- <USlideover v-model="isEditOpen">
      <div class="px-4 py-8 border-b border-b-gray-500 flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Editing State - {{ editing.name }}
        </h3>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isEditOpen = false" />
      </div>
      <div class="p-4 ">
        <EditState @close="toggleEdit" :id="editing.id" />
      </div>
    </USlideover> -->
  </div>
</template>


<script setup>
import { collection, getDocs} from 'firebase/firestore'

const db = useFirestore();
const { reverseEngineerID } = useViewUtilities();

const donations = ref([])
const q = ref('')
let loading = ref(false)
let isEditOpen = ref(false)
let editing = reactive({})

fetchDonations()

const items = (row) => [
  [
    {
      label: 'View',
      icon: 'i-mdi-eye',
      click: () => toggleEdit(row.id, row.name)
    },
  ]
]

const columns = [
   {
    'key': 'fullName',
    'label': 'Full Name',
    'sortable': "true"
   },
   {
    'key': 'amount',
    'label': 'Amount Donated',
    'sortable': "true"
   },
   {
    'key': 'linkedin',
    'label': 'Linkedin Handle'
   },
   {
    'key': 'paystack.createdAt',
    'label': 'Donation Initiated',
    'sortable': "true"
   },
   {
    'key': 'actions'
   }
];

const filteredRows = computed(() => {
  if (!q.value) {
    return donations.value
  }

  return donations.value.filter((item) => {
    return Object.values(item).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
});

async function toggleEdit(id, name) {
  isEditOpen.value = !isEditOpen.value
  editing = {id: id, name: name}
  if(!isEditOpen.value){await fetchDonations();}
}

async function fetchDonations() {
  const newDonations = []
  loading.value = true

  const donationsSnapshot = await getDocs(collection(db, 'donations'));
  donationsSnapshot.forEach((doc) => {
    newDonations.push({ id: doc.id, ...doc.data() });
  });

  // Sort newDonations array by paystack.createdAt key
  newDonations.sort((a, b) => {
    const dateA = new Date(a.paystack.createdAt);
    const dateB = new Date(b.paystack.createdAt);
    return dateB - dateA;
  });


  donations.value = newDonations;
  loading.value = false
}

</script>