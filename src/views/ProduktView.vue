<script setup lang="ts">
// Script-Teil bleibt unverändert
import { ref, onMounted } from 'vue'
import axios from 'axios'

const produkte = ref([] as Array<any>)
const inputData = ref({
  name: '',
  price: 0,
  quantity: 1,
})
const editingProduct = ref<any>(null)
const isAddModalVisible = ref(false)
const isEditModalVisible = ref(false)

const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL;
const apiUrl = baseUrl + '/api/produkte';

const loadProducts = async () => {
  try {
    const response = await axios.get(apiUrl)
    if (Array.isArray(response.data)) {
      produkte.value = response.data
    } else {
      console.error('Erhaltene Daten sind kein Array:', response.data)
      produkte.value = []
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Produkte:', error)
    produkte.value = []
  }
}

const addProduct = async () => {
  if (inputData.value.name && inputData.value.price > 0) {
    const newProduct = {
      name: inputData.value.name,
      price: inputData.value.price,
      quantity: inputData.value.quantity,
    }
    try {
      const response = await axios.post(apiUrl, newProduct)
      produkte.value.push(response.data)
      inputData.value.name = ''
      inputData.value.price = 0
      inputData.value.quantity = 1
      isAddModalVisible.value = false
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Produkts:', error)
    }
  } else {
    alert('Bitte gib einen Produktnamen und einen gültigen Preis an.')
  }
}

const editProduct = async () => {
  if (editingProduct.value) {
    try {
      const updatedProduct = {
        name: inputData.value.name,
        price: inputData.value.price,
        quantity: inputData.value.quantity,
      }
      const response = await axios.put(`${apiUrl}/${editingProduct.value.id}`, updatedProduct)
      const index = produkte.value.findIndex(p => p.id === editingProduct.value.id)
      produkte.value[index] = response.data
      isEditModalVisible.value = false
      editingProduct.value = null
      inputData.value = { name: '', price: 0, quantity: 1 }
    } catch (error) {
      console.error('Fehler beim Bearbeiten des Produkts:', error)
    }
  }
}

const deleteProduct = async (index: number) => {
  const produkt = produkte.value[index]
  const confirmDelete = confirm('Möchten Sie dieses Produkt wirklich löschen?')
  if (confirmDelete) {
    try {
      await axios.delete(`${apiUrl}/${produkt.id}`)
      produkte.value.splice(index, 1)
    } catch (error) {
      console.error('Fehler beim Löschen des Produkts:', error)
    }
  }
}

const startEditing = (produkt: any) => {
  editingProduct.value = produkt
  inputData.value.name = produkt.name
  inputData.value.price = produkt.price
  inputData.value.quantity = produkt.quantity
  isEditModalVisible.value = true
}

const showAddModal = () => {
  isAddModalVisible.value = true
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <div class="page-container">
    <div class="header">
      <h1>Produktübersicht</h1>
      <button @click="showAddModal" class="add-product-btn">
        +
      </button>
    </div>

    <div class="table-container">
      <p v-if="produkte.length === 0">Keine Produkte hinzugefügt.</p>

      <table v-else>
        <thead>
        <tr>
          <th>Name</th>
          <th>Preis</th>
          <th>Anzahl</th>
          <th>Aktion</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(produkt, index) in produkte" :key="index">
          <td>{{ produkt.name }}</td>
          <td>{{ produkt.price }} €</td>
          <td>{{ produkt.quantity }}</td>
          <td>
            <button @click="startEditing(produkt)" class="edit-btn">✏️</button>
            <button @click="deleteProduct(index)" class="delete-btn">🗑️</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal für das Hinzufügen von Produkten -->
    <div v-if="isAddModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>Produkt hinzufügen</h2>
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

          <div class="button-group">
            <button type="submit" :disabled="!inputData.name || !inputData.price">Produkt hinzufügen</button>
            <button type="button" class="cancel-btn" @click="isAddModalVisible = false">Abbrechen</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal für das Bearbeiten von Produkten -->
    <div v-if="isEditModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>Produkt bearbeiten</h2>
        <form @submit.prevent="editProduct">
          <div class="form-group">
            <label for="edit-product-name">Produktname:</label>
            <input
              id="edit-product-name"
              type="text"
              v-model="inputData.name"
              placeholder="Produktname"
              required
            />
          </div>

          <div class="form-group">
            <label for="edit-product-price">Preis:</label>
            <input
              id="edit-product-price"
              type="number"
              v-model="inputData.price"
              placeholder="Preis"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div class="form-group">
            <label for="edit-product-quantity">Anzahl:</label>
            <input
              id="edit-product-quantity"
              type="number"
              v-model="inputData.quantity"
              placeholder="Anzahl"
              min="1"
              step="1"
            />
          </div>

          <div class="button-group">
            <button type="submit" :disabled="!inputData.name || !inputData.price">Änderungen speichern</button>
            <button type="button" class="cancel-btn" @click="isEditModalVisible = false">Abbrechen</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  width: 250%;
  height: 100vh;
  max-width: 1200px;
  margin-right: 20rem;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 5rem;
  margin-bottom: 2rem;
  padding: 0 10px;
}

h1 {
  margin: 0;
  color: #2c3e50;
}

.table-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.add-product-btn {
  background-color: #2ecc71;
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s, background-color 0.2s;
}

.add-product-btn:hover {
  transform: scale(1.1);
  background-color: #27ae60;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 1;
}

th {
  background-color: #f8f9fa;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  color: #2c3e50;
}

td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
}

tbody tr:hover {
  background-color: #f5f5f5;
}

.edit-btn, .delete-btn {
  padding: 5px;
  margin: 0 5px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.edit-btn:hover {
  transform: scale(1.2);
  color: #3498db;
}

.delete-btn:hover {
  transform: scale(1.2);
  color: #e74c3c;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

button[type="submit"] {
  background-color: #3498db;
  color: white;
}

button[type="submit"]:hover {
  background-color: #2980b9;
}

button[type="submit"]:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

.cancel-btn:hover {
  background-color: #7f8c8d;
}

@media (max-width: 768px) {
  .page-container {
    padding: 10px;
  }

  .header {
    padding: 0 5px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .table-container {
    margin-top: 10px;
  }

  th, td {
    padding: 8px;
    font-size: 14px;
  }

  .edit-btn, .delete-btn {
    padding: 3px;
    font-size: 1rem;
  }

  .modal {
    padding: 15px;
  }
}
</style>
