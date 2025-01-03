<script setup lang="ts">
import { ref, defineEmits } from 'vue'

interface Warenbewegung {
  id: number
  produktName: string
  menge: number
  type: 'Eingang' | 'Ausgang'
}

const emit = defineEmits()

const inputData = ref({
  produktName: '',
  menge: 1,
  type: 'Eingang' as 'Eingang' | 'Ausgang',
})

let idCounter = 1 // Einfache ID-Zählung für die Warenbewegungen

// Funktion zum Hinzufügen einer Warenbewegung
const addWarenbewegung = () => {
  if (inputData.value.produktName && inputData.value.menge > 0) {
    const newMovement: Warenbewegung = {
      id: idCounter++,
      produktName: inputData.value.produktName,
      menge: inputData.value.menge,
      type: inputData.value.type,
    }
    emit('addWarenbewegung', newMovement)

    // Zurücksetzen der Eingabewerte
    inputData.value.produktName = ''
    inputData.value.menge = 1
    inputData.value.type = 'Eingang'
  } else {
    alert('Bitte gib einen Produktnamen und eine gültige Menge an.')
  }
}
</script>

<template>
  <form @submit.prevent="addWarenbewegung" class="form">
    <div class="form-group">
      <label for="produktName">Produktname:</label>
      <input id="produktName" v-model="inputData.produktName" type="text" placeholder="Produktname" required />
    </div>

    <div class="form-group">
      <label for="menge">Menge:</label>
      <input id="menge" v-model="inputData.menge" type="number" placeholder="Menge" min="1" required />
    </div>

    <div class="form-group">
      <label for="type">Bewegung:</label>
      <select id="type" v-model="inputData.type">
        <option value="Eingang">Wareneingang</option>
        <option value="Ausgang">Warenausgang</option>
      </select>
    </div>

    <button type="submit">Waren buchen</button>
  </form>
</template>

<style scoped>
.form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  font-size: 1rem;
  cursor: pointer;
  background-color: cadetblue;
  color: white;
  border: none;
  border-radius: 4px;
  width: 100%;
}

button:hover {
  background-color: #5c8c8c;
}
</style>
