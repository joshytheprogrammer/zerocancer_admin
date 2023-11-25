<template>
  <div>
    <UForm :state="state" :validate="validateState" @submit="submitState" class="space-y-3">
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="Regions" name="regions">
        <USelectMenu v-model="state.regions" searchable searchable-placeholder="Search regions..." :options="exisitingRegions" multiple placeholder="Select regions" value-attribute="id" option-attribute="name"/>
      </UFormGroup>
      
      <UButton :loading="loading" type="submit" color="black">
        {{ loading ? 'Please wait...' : 'Add State' }}
      </UButton>
    </UForm>
  </div>
</template>

<script setup>
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
import { uuid } from 'vue-uuid';

const state = reactive({
  name: undefined,
  regions: []
});

let loading = ref(false);

async function submitState() {
  loading.value = true;
  
  const stateID = generateID(state);

  await setDoc(doc(db, "locations", "states", 'state', stateID), state)
  .then(() => {
    clearObjectValues(state)
    toast.add({ title: 'State created successfully' })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.error({code: errorCode, message: errorMessage})
    toast.add({ title: 'An error occurred!!!' })
  }).finally(() => {
    fetchItems();
    loading.value = false;
  });
}

function validateState() {
  const errors = [];

  function validateProperty(property, path) {
    if (!property || (typeof property === 'string' && property.trim() === '')) {
      errors.push({ path, message: 'Required' });
    } else if (Array.isArray(property)) {
      property.forEach((item, index) => {
        const itemPath = `${path}[${index}]`;
        validateProperty(item, itemPath);
      });
    } else if (typeof property === 'object') {
      for (const key in property) {
        if (property.hasOwnProperty(key)) {
          const nestedPath = path ? `${path}.${key}` : key;
          validateProperty(property[key], nestedPath);
        }
      }
    }
  }

  for (const key in state) {
    if (state.hasOwnProperty(key)) {
      const propertyPath = key;
      validateProperty(state[key], propertyPath);
    }
  }

  return errors;
}

function generateID(item) {
  return item.name?.toLowerCase().replace(/\s/g, "-") + "-" + uuid.v4().slice(0, 8)
}

function clearObjectValues(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = '';
    }
  }
}
</script>
