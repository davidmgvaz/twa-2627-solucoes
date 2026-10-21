<script setup>
// ItemDetail.vue — o detalhe como componente filho: recebe o item por prop e deriva o resto com computed.
// Bónus C: um <slot> onde o pai injeta um rodapé (um botão Editar, por exemplo).
// The detail as a child component: receives the item through a prop, derives the rest with computed.
// Bonus C: a <slot> where the parent injects a footer (an Edit button, for example).
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
})

// the nested object of the item (author, specs…) · o objeto aninhado do item
const nested = computed(() =>
  Object.entries(props.item).find(([, v]) => v && typeof v === 'object' && !Array.isArray(v)),
)
</script>

<template>
  <section id="detail">
    <h2>{{ item.name }}</h2>
    <dl>
      <dt>Category</dt><dd>{{ item.category }}</dd>
      <dt>Price</dt><dd>{{ item.price.toFixed(2) }} €</dd>
      <dt>Tags</dt><dd>{{ item.tags.join(', ') || '—' }}</dd>
      <template v-if="nested">
        <template v-for="(v, k) in nested[1]" :key="k">
          <dt>{{ nested[0] }}.{{ k }}</dt><dd>{{ v }}</dd>
        </template>
      </template>
    </dl>
    <!-- bonus C: whatever the parent puts between <ItemDetail>…</ItemDetail> lands here -->
    <slot />
  </section>
</template>

<style scoped>
#detail { margin-top: 1rem; padding: 1rem; background: #fff; border: 1px solid #ddd; }
#detail dl { display: grid; grid-template-columns: max-content 1fr; gap: .25rem 1rem; }
#detail dt { color: #666; }
</style>
