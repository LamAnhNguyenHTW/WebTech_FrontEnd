<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const produkte = ref([] as Array<any>)
const inputData = ref({
  name: '',
  price: 0,
  quantity: 1,
})

const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL;
const apiUrl = baseUrl + '/api/produkte';



// Produkte vom Backend laden
const loadProducts = async () => {
  try {
    const response = await axios.get(apiUrl)

    // Überprüfen, ob die Antwort ein Array ist
    if (Array.isArray(response.data)) {
      produkte.value = response.data
    } else {
      console.error('Erhaltene Daten sind kein Array:', response.data)
      produkte.value = []  // Leeres Array setzen, um Fehler zu vermeiden
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Produkte:', error)
    produkte.value = []  // Leeres Array setzen, falls ein Fehler auftritt
  }
}


// Produkt hinzufügen
const addProduct = async () => {
  if (inputData.value.name && inputData.value.price > 0) {
    const newProduct = {
      name: inputData.value.name,
      price: inputData.value.price,
      quantity: inputData.value.quantity,
    }
    try {
      const response = await axios.post(apiUrl, newProduct)
      produkte.value.push(response.data) // Neues Produkt zur Liste hinzufügen
      // Eingabefelder zurücksetzen
      inputData.value.name = ''
      inputData.value.price = 0
      inputData.value.quantity = 1
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Produkts:', error)
    }
  } else {
    alert('Bitte gib einen Produktnamen und einen gültigen Preis an.')
  }
}

// Warenausgang buchen
const bookExit = async (index: number, quantityToExit: number) => {
  const produkt = produkte.value[index]
  if (quantityToExit > 0 && quantityToExit <= produkt.quantity) {
    try {
      // PUT-Anfrage an den Backend-Endpunkt zum Buchen des Warenausgangs
      const response = await axios.put(`${apiUrl}/${produkt.id}/exit`, quantityToExit)
      // Produkt nach dem Warenausgang aktualisieren
      produkte.value[index] = response.data
    } catch (error) {
      console.error('Fehler beim Buchen des Warenausgangs:', error)
    }
  } else {
    alert('Ungültige Menge. Bitte gib eine Menge an, die kleiner oder gleich der verfügbaren Menge ist.')
  }
}

// Produkt löschen
const deleteProduct = async (index: number) => {
  const produkt = produkte.value[index]
  const confirmDelete = confirm('Möchten Sie dieses Produkt wirklich löschen?')
  if (confirmDelete) {
    try {
      await axios.delete(`${apiUrl}/${produkt.id}`)
      produkte.value.splice(index, 1) // Produkt aus der Liste entfernen
    } catch (error) {
      console.error('Fehler beim Löschen des Produkts:', error)
    }
  }
}

// Beim Laden der Seite Produkte vom Server holen
onMounted(() => {
  loadProducts()
})
</script>

<template>
  <h1>Produktübersicht</h1>

  <form @submit.prevent="addProduct">
    <div class="form-group">
      <label for="product-name">Produktname:</label>
      <input
        id="product-name"
        type="text"
        v-model="inputData.name"
        placeholder="Produktname"
        required
      />
    </div>

    <div class="form-group">
      <label for="product-price">Preis:</label>
      <input
        id="product-price"
        type="number"
        v-model="inputData.price"
        placeholder="Preis"
        min="0.01"
        step="0.01"
        required
      />
    </div>

    <div class="form-group">
      <label for="product-quantity">Anzahl:</label>
      <input
        id="product-quantity"
        type="number"
        v-model="inputData.quantity"
        placeholder="Anzahl"
        min="1"
        step="1"
      />
    </div>

    <button type="submit" :disabled="!inputData.name || !inputData.price">Produkt hinzufügen</button>
  </form>

  <p v-if="produkte.length === 0">Keine Produkte hinzugefügt.</p>

  <table v-else>
    <thead>
    <tr>
      <th>Name</th>
      <th>Anzahl</th>
      <th>Preis</th>
      <th>Gesamtpreis</th>
      <th>Warenausgang buchen</th>
      <th>Aktion</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(produkt, index) in produkte" :key="index">
      <td>{{ produkt.name }}</td>
      <td>{{ produkt.quantity }}</td>
      <td>{{ produkt.price }} €</td>
      <td>{{ produkt.totalValue }} €</td>
      <td>
        <!-- Temporäre Eingabe für jedes Produkt -->
        <div class="book-exit-container">
          <input
            type="number"
            v-model.number="produkt.tempQuantity"
            min="1"
            :max="produkt.quantity"
            class="quantity-input"
          />
          <button
            @click="bookExit(index, produkt.tempQuantity)"
            :disabled="produkt.tempQuantity <= 0"
            class="book-exit-btn"
          >
            Buchen
          </button>
        </div>
      </td>
      <td>
        <button @click="deleteProduct(index)" class="delete-btn">Löschen</button>
      </td>
    </tr>
    </tbody>
  </table>

  <div v-if="produkte.length > 0" class="inventur">
    <h2>Inventur</h2>
    <p>
      Gesamtwert der Produkte auf Lager:
      {{ produkte.reduce((total, produkt) => total + produkt.totalValue, 0) }} €
    </p>
    <p>
      Gesamtanzahl der Produkte auf Lager:
      {{ produkte.reduce((total, produkt) => total + produkt.quantity, 0) }}
    </p>
  </div>
  <p v-else>
    Keine Produkte zum Berechnen verfügbar.
  </p>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input, button {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  background-color: cadetblue;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.8rem;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

td {
  text-align: right;
}

h1, h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.inventur {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  margin-bottom: 2rem;
  margin-left: 20px;
}

.delete-btn {
  background-color: darkred;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1rem;
}

.delete-btn:hover {
  background-color: red;
}

.book-exit-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 80px;
}

.book-exit-btn {
  background-color: cadetblue;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1rem;
}

.book-exit-btn:disabled {
  background-color: gray;
  cursor: not-allowed;
}
</style>
