<template>
  <div>
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="q" placeholder="Filter causes..." />
    </div>

    <UTable :loading="loading" :rows="filteredRows" :columns="columns">
      <template #actualAmount-data="{ row }">
        {{ new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'}).format(row.actualAmount) }}
      </template>
      <template #goalAmount-data="{ row }">
        {{ new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'}).format(row.goalAmount) }}
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>

    <USlideover v-model="isEditOpen">
      <div class="px-4 py-8 border-b border-b-gray-500 flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Editing Cause - {{ editing.name }}
        </h3>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isEditOpen = false" />
      </div>
      <div class="p-4 ">
        <EditCause @close="toggleEdit" :id="editing.id" />
      </div>
    </USlideover>
  </div>
</template>

<script setup>
import { collection, getDocs} from 'firebase/firestore'

const db = useFirestore();

const causes = ref([])
const q = ref('')
let loading = ref(false)

let isEditOpen = ref(false)

let editing = reactive({})

fetchCauses()

const items = (row) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => toggleEdit(row.id, row.name)
    },
    // { 
    //   label: 'Delete',
    //   icon: 'i-heroicons-trash-20-solid'
    // }
  ]
]

const columns = [
   {
    'key': 'name',
    'label': 'Cause Name',
    'sortable': "true"
   },
   {
    'key': 'status',
    'label': 'Status',
    'sortable': "true"
   },
   {
    'key': 'actualAmount',
    'label': 'Amount Raised'
   },
   {
    'key': 'goalAmount',
    'label': 'Amount Desired'
   },
   {
    'key': 'actions'
   }
];

const filteredRows = computed(() => {
  if (!q.value) {
    return causes.value
  }

  return causes.value.filter((cause) => {
    return Object.values(cause).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
});

async function toggleEdit(id, name) {
  isEditOpen.value = !isEditOpen.value
  editing = {id: id, name: name}
  if(!isEditOpen.value){await fetchCauses();}
}

async function fetchCauses() {
  const newCauses = []
  loading.value = true
  const causesSnapshot = await getDocs(collection(db, 'causes'));
  causesSnapshot.forEach((doc) => {
      newCauses.push({ id: doc.id, ...doc.data() });
  });

  causes.value = newCauses;
  loading.value = false
}

</script>