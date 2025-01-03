<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Kunden-Liste
const kunden = ref([] as Array<any>)
const inputData = ref({
  name: '',
  adresse: '',
  telefon: '',
  email: '',
})
const editingCustomer = ref<any>(null)
const isAddModalVisible = ref(false)
const isEditModalVisible = ref(false)

const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL
const apiUrl = baseUrl + '/api/kunden'

// Kunden laden
const loadCustomers = async () => {
  try {
    const response = await axios.get(apiUrl)
    if (Array.isArray(response.data)) {
      kunden.value = response.data
    } else {
      console.error('Erhaltene Daten sind kein Array:', response.data)
      kunden.value = []
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Kunden:', error)
    kunden.value = []
  }
}

// Kunden hinzufügen
const addCustomer = async () => {
  if (inputData.value.name && inputData.value.adresse) {
    const newCustomer = {
      name: inputData.value.name,
      adresse: inputData.value.adresse,
      telefon: inputData.value.telefon,
      email: inputData.value.email,
    }
    try {
      const response = await axios.post(apiUrl, newCustomer)
      kunden.value.push(response.data)
      resetInputData()
      isAddModalVisible.value = false
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Kunden:', error)
    }
  } else {
    alert('Bitte gib einen Namen und eine Adresse an.')
  }
}

// Kunden bearbeiten
const editCustomer = async () => {
  if (editingCustomer.value) {
    try {
      const updatedCustomer = {
        name: inputData.value.name,
        adresse: inputData.value.adresse,
        telefon: inputData.value.telefon,
        email: inputData.value.email,
      }
      const response = await axios.put(`${apiUrl}/${editingCustomer.value.id}`, updatedCustomer)
      const index = kunden.value.findIndex(c => c.id === editingCustomer.value.id)
      kunden.value[index] = response.data
      isEditModalVisible.value = false
      editingCustomer.value = null
      resetInputData()
    } catch (error) {
      console.error('Fehler beim Bearbeiten des Kunden:', error)
    }
  }
}

// Kunden löschen
const deleteCustomer = async (index: number) => {
  const customer = kunden.value[index]
  const confirmDelete = confirm('Möchten Sie diesen Kunden wirklich löschen?')
  if (confirmDelete) {
    try {
      await axios.delete(`${apiUrl}/${customer.id}`)
      kunden.value.splice(index, 1)
    } catch (error) {
      console.error('Fehler beim Löschen des Kunden:', error)
    }
  }
}

// Eingabe zurücksetzen
const resetInputData = () => {
  inputData.value = {
    name: '',
    adresse: '',
    telefon: '',
    email: '',
  }
}

// Bearbeiten starten
const startEditing = (customer: any) => {
  editingCustomer.value = customer
  inputData.value.name = customer.name
  inputData.value.adresse = customer.adresse
  inputData.value.telefon = customer.telefon
  inputData.value.email = customer.email
  isEditModalVisible.value = true
}

// Modal für Hinzufügen öffnen
const showAddModal = () => {
  resetInputData()
  isAddModalVisible.value = true
}

onMounted(() => {
  loadCustomers()
})

</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="customers-container">
        <div class="header">
          <h1>Kundenübersicht</h1>
          <button @click="showAddModal" class="add-customer-btn">+</button>
        </div>

        <div class="table-container">
          <p v-if="kunden.length === 0">Keine Kunden vorhanden.</p>

          <table v-else>
            <thead>
            <tr>
              <th>Name</th>
              <th>Adresse</th>
              <th>Telefon</th>
              <th>Email</th>
              <th>Aktion</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(kunde, index) in kunden" :key="kunde.id">
              <td>{{ kunde.name }}</td>
              <td>{{ kunde.adresse }}</td>
              <td>{{ kunde.telefon }}</td>
              <td>{{ kunde.email }}</td>
              <td>
                <button @click="startEditing(kunde)" class="edit-btn">✏️</button>
                <button @click="deleteCustomer(index)" class="delete-btn">🗑️</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="map-container">
        <div class="map-placeholder">Google Maps wird hier implementiert</div>
      </div>
    </div>
  </div>

  <!-- Hinzufügen-Modal -->
  <div v-if="isAddModalVisible" class="modal-overlay">
    <div class="modal">
      <h2>Kunde hinzufügen</h2>
      <form @submit.prevent="addCustomer">
        <div class="form-group">
          <label for="customer-name">Name:</label>
          <input
            id="customer-name"
            type="text"
            v-model="inputData.name"
            placeholder="Name"
            required
          />
        </div>
        <div class="form-group">
          <label for="customer-adresse">Adresse:</label>
          <input
            id="customer-adresse"
            type="text"
            v-model="inputData.adresse"
            placeholder="Adresse"
            required
          />
        </div>
        <div class="form-group">
          <label for="customer-phone">Telefonnummer:</label>
          <input
            id="customer-phone"
            type="text"
            v-model="inputData.telefon"
            placeholder="Telefonnummer"
          />
        </div>
        <div class="form-group">
          <label for="customer-email">E-Mail:</label>
          <input
            id="customer-email"
            type="email"
            v-model="inputData.email"
            placeholder="E-Mail"
          />
        </div>
        <div class="button-group">
          <button type="submit" :disabled="!inputData.name || !inputData.adresse">Kunde hinzufügen</button>
          <button type="button" class="cancel-btn" @click="isAddModalVisible = false">Abbrechen</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Bearbeiten-Modal -->
  <div v-if="isEditModalVisible" class="modal-overlay">
    <div class="modal">
      <h2>Kunde bearbeiten</h2>
      <form @submit.prevent="editCustomer">
        <div class="form-group">
          <label for="edit-customer-name">Name:</label>
          <input
            id="edit-customer-name"
            type="text"
            v-model="inputData.name"
            placeholder="Name"
            required
          />
        </div>
        <div class="form-group">
          <label for="edit-customer-adresse">Adresse:</label>
          <input
            id="edit-customer-adresse"
            type="text"
            v-model="inputData.adresse"
            placeholder="Adresse"
            required
          />
        </div>
        <div class="form-group">
          <label for="edit-customer-phone">Telefonnummer:</label>
          <input
            id="edit-customer-phone"
            type="text"
            v-model="inputData.telefon"
            placeholder="Telefonnummer"
          />
        </div>
        <div class="form-group">
          <label for="edit-customer-email">E-Mail:</label>
          <input
            id="edit-customer-email"
            type="email"
            v-model="inputData.email"
            placeholder="E-Mail"
          />
        </div>
        <div class="button-group">
          <button type="submit" :disabled="!inputData.name || !inputData.adresse">Änderungen speichern</button>
          <button type="button" class="cancel-btn" @click="isEditModalVisible = false">Abbrechen</button>
        </div>
      </form>
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

.content-wrapper {
  display: flex;
  gap: 20px;
  height: calc(100vh - 40px);
}

/* Anpassung der Kundenansicht */
.customers-container {
  flex: 1.3; /* Größere Tabelle */
  display: flex;
  flex-direction: column;
}

/* Anpassung der Google Map */
.map-container {
  flex: 0.9; /* Kleinere Google Map */
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 90px;
}


.map-placeholder {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: #666;
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

.add-customer-btn {
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

.add-customer-btn:hover {
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
