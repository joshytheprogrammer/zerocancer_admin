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
      <template #centres-data="{ row }">
        <UBadge class="m-0.5" v-for="item in row.centres" color="white" variant="solid">{{reverseEngineerID(item)}}</UBadge>
        <!-- {{ row.centres }} -->
      </template>
    </UTable>

    <USlideover v-model="isEditOpen">
      <div class="px-4 py-8 border-b border-b-gray-500 flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Editing Region - {{ editing.name }}
        </h3>
        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isEditOpen = false" />
      </div>
      <div class="p-4 ">
        <EditRegion @close="toggleEdit" :id="editing.id" />
      </div>
    </USlideover>
  </div>
</template>

<script setup>
import { collection, getDocs} from 'firebase/firestore'

const db = useFirestore();

const regions = ref([])
const q = ref('')
let loading = ref(false)
let isEditOpen = ref(false)
let editing = reactive({})

fetchRegions()

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
    'label': 'Region Name',
    'sortable': "true"
   },
   {
    'key': 'centres',
    'label': 'Region Centres',
   },
   {
    'key': 'actions'
   }
];

const filteredRows = computed(() => {
  if (!q.value) {
    return regions.value
  }

  return regions.value.filter((region) => {
    return Object.values(region).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
});

async function toggleEdit(id, name) {
  isEditOpen.value = !isEditOpen.value
  editing = {id: id, name: name}
  if(!isEditOpen.value){await fetchRegions();}
}

async function fetchRegions() {
  const newRegions = []
  loading.value = true
  const regionsSnapshot = await getDocs(collection(db, 'locations', 'regions', 'region'));
  regionsSnapshot.forEach((doc) => {
    newRegions.push({ id: doc.id, ...doc.data() });
  });

  regions.value = newRegions;
  loading.value = false
}

function reverseEngineerID(generatedID) {
  // Extract the name part by removing the UUID part and splitting by hyphens
  const namePart = generatedID.replace(/-[\da-f]+$/, "").split("-");

  // Capitalize each word in the name part
  const formattedName = namePart.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return formattedName;
}

</script>