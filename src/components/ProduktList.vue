<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'ProduktList',
  props: ['produkt'],
  emits: ['delete'],
})
</script>

<template>
  <div class="produkt-list">
    <p>{{ produkt.name }} - Preis: {{ produkt.price }} € - Menge: {{ produkt.quantity }}</p>
    <button :aria-description="'Produkte Löschen ' + produkt" v-on:click="$emit('delete')">Löschen</button>
  </div>
</template>

<style scoped>
.produkt-list {
  margin: 8px;
  border: 2px solid var(--color-border);
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.produkt-list p {
  flex-grow: 1;
}

.produkt-list button {
  background: darkred;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.produkt-list button:hover {
  background: darkcyan;
}
</style>
