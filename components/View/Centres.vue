<template>
  <div>
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="q" placeholder="Filter centres..." />
    </div>

    <UTable :loading="loading" :rows="filteredRows" :columns="columns">
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>

    <USlideover v-model="isEditOpen">
      <UCard>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Editing - {{ editing.name }}
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isEditOpen = false" />
        </div>
      </UCard>
      <div class="p-4 ">
        <EditCentre :id="editing.id" />
      </div>
    </USlideover>
  </div>
</template>

<script setup>
import { collection, getDocs} from 'firebase/firestore'

const db = useFirestore();

const centres = ref([])
const q = ref('')
let loading = ref(false)
let isEditOpen = ref(false)
let editing = reactive({})

fetchCentre()

const items = (row) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => toggleEdit(row.id, row.name)
    },
    { 
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid'
    }
  ]
]

const columns = [
   {
    'key': 'name',
    'label': 'Centre Name',
    'sortable': "true"
   },
   {
    'key': 'managerName',
    'label': 'Manager Name',
    'sortable': "true"
   },
   {
    'key': 'phone',
    'label': 'Manager Phone'
   },
   {
    'key': 'actions'
   }
];

const filteredRows = computed(() => {
  if (!q.value) {
    return centres.value
  }

  return centres.value.filter((centre) => {
    return Object.values(centre).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
});

function toggleEdit(id, name) {
  isEditOpen.value = !isEditOpen.value
  editing = {id: id, name: name}
}

async function fetchCentre() {
  loading.value = true
  const centresSnapshot = await getDocs(collection(db, 'locations', 'centres', 'centre'));
    centresSnapshot.forEach((doc) => {
      centres.value.push({ id: doc.id, ...doc.data() });
  });
  loading.value = false
}

</script>