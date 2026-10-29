<script setup>
// ItemForm.vue — um formulário é um componente filho com o seu próprio RASCUNHO (reactive). v-model preenche o
// rascunho, o browser e um computed validam-no, o submit emite UM objeto limpo. O pai decide o que fazer com ele.
// Bónus A: modo editar — o pai passa `item`; o rascunho é preenchido a partir da prop (cópia, não ligação) e o
// submit emite `update` em vez de `save`.
// A form is a child component with its own DRAFT (reactive). v-model fills the draft, the browser and a computed
// validate it, submit emits ONE clean object. The parent decides what to do with it.
// Bonus A: edit mode — the parent passes `item`; the draft is filled from the prop (a copy, not a link) and
// submit emits `update` instead of `save`.
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  cats: { type: Array, required: true },
  item: { type: Object, default: null }, // bonus A · bónus A — null = create mode
})
const emit = defineEmits(['save', 'update', 'cancel'])

const empty = { name: '', category: '', price: null, tags: '' }
const form = reactive({ ...empty })

// bonus A: when the parent hands us an item to edit, copy it into the draft (the prop stays untouched)
// bónus A: quando o pai nos dá um item para editar, copiamo-lo para o rascunho (a prop fica intacta)
watch(
  () => props.item,
  (item) => Object.assign(form, item ? { ...item, tags: item.tags.join(', ') } : empty),
  { immediate: true },
)

const editing = computed(() => props.item !== null)

// your rules, re-computed as they type · as tuas regras, recalculadas a cada tecla
const errors = computed(() => {
  const e = {}
  if (form.name.trim().length < 3) e.name = 'at least 3 characters'
  if (!form.category) e.category = 'pick a category'
  if (!(form.price > 0)) e.price = 'must be a number > 0'
  return e
})
const isValid = computed(() => Object.keys(errors.value).length === 0)

function submit() {
  if (!isValid.value) return // the button may be disabled, but never trust the DOM · nunca confies no DOM
  const clean = {
    name: form.name.trim(),
    category: form.category,
    price: form.price,
    tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
  }
  if (editing.value) emit('update', { ...props.item, ...clean })
  else emit('save', clean)
  reset()
}

function reset() {
  Object.assign(form, empty) // in place — reassigning a reactive would lose reactivity
  if (editing.value) emit('cancel')
}
</script>

<template>
  <form id="item-form" @submit.prevent="submit">
    <h3>{{ editing ? `Edit “${item.name}”` : 'New item' }}</h3>

    <label>
      Name
      <input v-model.trim="form.name" placeholder="Name" required minlength="3" />
      <small v-if="errors.name">{{ errors.name }}</small>
    </label>

    <label>
      Category
      <select v-model="form.category" required>
        <option value="" disabled>Category…</option>
        <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
      </select>
      <small v-if="errors.category">{{ errors.category }}</small>
    </label>

    <label>
      Price (€)
      <input v-model.number="form.price" type="number" min="0" step="0.01" required />
      <small v-if="errors.price">{{ errors.price }}</small>
    </label>

    <label>
      Tags
      <input v-model.trim="form.tags" placeholder="tags, comma separated" />
    </label>

    <p>
      <button :disabled="!isValid">{{ editing ? 'Save' : 'Add' }}</button>
      <button v-if="editing" type="button" @click="reset">Cancel</button>
    </p>
  </form>
</template>

<style scoped>
#item-form { display: grid; gap: .5rem; margin: 1rem 0; padding: 1rem; background: #fff; border: 1px solid #ddd; }
#item-form label { display: grid; gap: .2rem; font-size: .9rem; color: #444; }
#item-form input, #item-form select, #item-form button { font: inherit; padding: .4rem .6rem; }
#item-form small { color: #b00020; }
#item-form p { margin: 0; display: flex; gap: .5rem; }
</style>
