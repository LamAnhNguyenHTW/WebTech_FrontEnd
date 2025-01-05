<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Lieferanten-Liste
const lieferanten = ref<Array<any>>([]);
const inputData = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
  rating: 1,
});
const editingSupplier = ref<any>(null);
const isAddModalVisible = ref(false);
const isEditModalVisible = ref(false);

const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL;
const apiUrl = `${baseUrl}/api/lieferanten`;

// Lieferanten laden
const loadSuppliers = async () => {
  try {
    const response = await axios.get(apiUrl);
    lieferanten.value = Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Fehler beim Abrufen der Lieferanten:', error);
    lieferanten.value = [];
  }
};

// Lieferanten hinzufügen
const addSupplier = async () => {
  if (!inputData.value.name || !inputData.value.address) {
    alert('Bitte Name und Adresse ausfüllen.');
    return;
  }
  try {
    const response = await axios.post(apiUrl, { ...inputData.value });
    lieferanten.value.push(response.data);
    resetInputData();
    isAddModalVisible.value = false;
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Lieferanten:', error);
  }
};

// Lieferanten bearbeiten
const editSupplier = async () => {
  if (!inputData.value.name || !inputData.value.address) {
    alert('Bitte Name und Adresse ausfüllen.');
    return;
  }
  try {
    const response = await axios.put(`${apiUrl}/${editingSupplier.value.id}`, { ...inputData.value });
    const index = lieferanten.value.findIndex((s) => s.id === editingSupplier.value.id);
    if (index !== -1) lieferanten.value[index] = response.data;
    resetInputData();
    isEditModalVisible.value = false;
  } catch (error) {
    console.error('Fehler beim Bearbeiten des Lieferanten:', error);
  }
};

// Lieferanten löschen
const deleteSupplier = async (index: number) => {
  const supplier = lieferanten.value[index];
  const confirmDelete = confirm('Möchten Sie diesen Lieferanten wirklich löschen?');
  if (confirmDelete) {
    try {
      await axios.delete(`${apiUrl}/${supplier.id}`);
      lieferanten.value.splice(index, 1);
    } catch (error) {
      console.error('Fehler beim Löschen des Lieferanten:', error);
    }
  }
};

// Eingabe zurücksetzen
const resetInputData = () => {
  inputData.value = {
    name: '',
    address: '',
    phone: '',
    email: '',
    rating: 1,
  };
};

// Bearbeiten starten
const startEditing = (supplier: any) => {
  editingSupplier.value = supplier;
  inputData.value = { ...supplier };
  isEditModalVisible.value = true;
};

// Modal für Hinzufügen öffnen
const showAddModal = () => {
  resetInputData();
  isAddModalVisible.value = true;
};

onMounted(() => {
  loadSuppliers();
});
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- Linke Spalte: Lieferantenliste -->
      <div class="suppliers-container">
        <div class="header">
          <h1>Lieferantenübersicht</h1>
          <button @click="showAddModal" class="add-supplier-btn">
            +
          </button>
        </div>

        <div class="table-container">
          <p v-if="lieferanten.length === 0">Keine Lieferanten vorhanden.</p>

          <table v-else>
            <thead>
            <tr>
              <th>Name</th>
              <th>Adresse</th>
              <th>Telefon</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Aktion</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(lieferant, index) in lieferanten" :key="lieferant.id">
              <td>{{ lieferant.name }}</td>
              <td>{{ lieferant.address }}</td>
              <td>{{ lieferant.phone }}</td>
              <td>{{ lieferant.email }}</td>
              <td>
                {{ lieferant.rating.toFixed(1) }}
                <span class="star-icon">★</span>
              </td>
              <td>
                <button @click="startEditing(lieferant)" class="edit-btn">✏️</button>
                <button @click="deleteSupplier(index)" class="delete-btn">🗑️</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Rechte Spalte: Platz für Google Maps -->
      <div class="map-container">
        <iframe
          src="https://www.google.com/maps/d/u/0/embed?mid=1byVpWH5ksH7Up9-j7xOBvSxQ6y0jIik&ehbc=2E312F&noprof=1"
          width="100%"
          height="100%"
          style="border:0;"
          allow="fullscreen"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>

    <!-- Hinzufügen-Modal -->
    <div v-if="isAddModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>Lieferant hinzufügen</h2>
        <form @submit.prevent="addSupplier">
          <div class="form-group">
            <label for="supplier-name">Name:</label>
            <input
              id="supplier-name"
              type="text"
              v-model="inputData.name"
              placeholder="Name"
              required
            />
          </div>
          <div class="form-group">
            <label for="supplier-address">Adresse:</label>
            <input
              id="supplier-address"
              type="text"
              v-model="inputData.address"
              placeholder="Adresse"
              required
            />
          </div>
          <div class="form-group">
            <label for="supplier-phone">Telefonnummer:</label>
            <input
              id="supplier-phone"
              type="text"
              v-model="inputData.phone"
              placeholder="Telefonnummer"
            />
          </div>
          <div class="form-group">
            <label for="supplier-email">E-Mail:</label>
            <input
              id="supplier-email"
              type="email"
              v-model="inputData.email"
              placeholder="E-Mail"
            />
          </div>
          <div class="form-group">
            <label for="supplier-rating">Rating:</label>
            <input
              id="supplier-rating"
              type="number"
              v-model="inputData.rating"
              placeholder="Rating"
              min="1"
              max="5"
            />
          </div>
          <div class="button-group">
            <button type="submit" :disabled="!inputData.name || !inputData.address">Lieferant hinzufügen</button>
            <button type="button" class="cancel-btn" @click="isAddModalVisible = false">Abbrechen</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Bearbeiten-Modal -->
    <div v-if="isEditModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>Lieferant bearbeiten</h2>
        <form @submit.prevent="editSupplier">
          <div class="form-group">
            <label for="edit-supplier-name">Name:</label>
            <input
              id="edit-supplier-name"
              type="text"
              v-model="inputData.name"
              placeholder="Name"
              required
            />
          </div>
          <div class="form-group">
            <label for="edit-supplier-address">Adresse:</label>
            <input
              id="edit-supplier-address"
              type="text"
              v-model="inputData.address"
              placeholder="Adresse"
              required
            />
          </div>
          <div class="form-group">
            <label for="edit-supplier-phone">Telefonnummer:</label>
            <input
              id="edit-supplier-phone"
              type="text"
              v-model="inputData.phone"
              placeholder="Telefonnummer"
            />
          </div>
          <div class="form-group">
            <label for="edit-supplier-email">E-Mail:</label>
            <input
              id="edit-supplier-email"
              type="email"
              v-model="inputData.email"
              placeholder="E-Mail"
            />
          </div>
          <div class="form-group">
            <label for="edit-supplier-rating">Rating:</label>
            <input
              id="edit-supplier-rating"
              type="number"
              v-model="inputData.rating"
              placeholder="Rating"
              min="1"
              max="5"
            />
          </div>
          <div class="button-group">
            <button type="submit" :disabled="!inputData.name || !inputData.address">Änderungen speichern</button>
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

.content-wrapper {
  display: flex;
  gap: 20px;
  height: calc(100vh - 40px);
}

.suppliers-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Anpassung der Google Map */
.map-container {
  flex: 1;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 90px;
  overflow: hidden;
}

.map-container iframe {
  width: 100%;
  height: 100%;
  border: none;
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

.add-supplier-btn {
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

.add-supplier-btn:hover {
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

.star-icon {
  color: gold;
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
