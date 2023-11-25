<template>
  <div>
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="q" placeholder="Filter regions..." />
    </div>

    <UTable :loading="loading" :rows="filteredRows" :columns="columns">
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
      <template #regions-data="{ row }">
        <UBadge class="m-0.5" v-for="item in row.regions" color="white" variant="solid">{{reverseEngineerID(item)}}</UBadge>
      </template>
    </UTable>

    <USlideover v-model="isEditOpen">
      <div class="px-4 py-8 border-b border-b-gray-500 flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Editing State - {{ editing.name }}
        </h3>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isEditOpen = false" />
      </div>
      <div class="p-4 ">
        <EditState @close="toggleEdit" :id="editing.id" />
      </div>
    </USlideover>
  </div>
</template>


<script setup>
import { collection, getDocs} from 'firebase/firestore'

const db = useFirestore();
const { reverseEngineerID } = useViewUtilities();

const states = ref([])
const q = ref('')
let loading = ref(false)
let isEditOpen = ref(false)
let editing = reactive({})

fetchStates()

const items = (row) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => toggleEdit(row.id, row.name)
    },
  ]
]

const columns = [
   {
    'key': 'name',
    'label': 'State Name',
    'sortable': "true"
   },
   {
    'key': 'regions',
    'label': 'State Regions',
   },
   {
    'key': 'actions'
   }
];

const filteredRows = computed(() => {
  if (!q.value) {
    return states.value
  }

  return states.value.filter((state) => {
    return Object.values(state).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
});

async function toggleEdit(id, name) {
  isEditOpen.value = !isEditOpen.value
  editing = {id: id, name: name}
  if(!isEditOpen.value){await fetchStates();}
}

async function fetchStates() {
  const newStates = []
  loading.value = true
  const statesSnapshot = await getDocs(collection(db, 'locations', 'states', 'state'));
  statesSnapshot.forEach((doc) => {
    newStates.push({ id: doc.id, ...doc.data() });
  });

  states.value = newStates;
  loading.value = false
}

</script>