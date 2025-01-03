<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const produkte = ref([] as Array<any>); // Liste der Produkte
const totalValue = ref(0); // Gesamtwert aller Produkte

const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL;
const apiUrl = baseUrl + '/api/produkte';

// Lädt die Produktliste von der API
const loadProducts = async () => {
  try {
    const response = await axios.get(apiUrl);
    if (Array.isArray(response.data)) {
      produkte.value = response.data;
      calculateTotalValue();  // Gesamtwert neu berechnen
    } else {
      console.error('Erhaltene Daten sind kein Array:', response.data);
      produkte.value = [];
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Produkte:', error);
    produkte.value = [];
  }
};

// Berechnung des Einzelwerts eines Produkts
const calculateProductValue = (produkt: any) => {
  return produkt.price * produkt.quantity;
}

// Berechnung des Gesamtwerts aller Produkte
const calculateTotalValue = () => {
  totalValue.value = produkte.value.reduce(
    (total, produkt) => total + calculateProductValue(produkt),
    0
  );
};

onMounted(() => {
  loadProducts();
});
</script>

<template>
  <div class="page-container">
    <h1>Inventur</h1>

    <div class="table-container">
      <h3>Produkte im Lager</h3>
      <table v-if="produkte.length > 0">
        <thead>
        <tr>
          <th>Produkt</th>
          <th>Verfügbar im Lager</th>
          <th>Wert pro Produkt</th>
          <th>Gesamtwert</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(produkt, index) in produkte" :key="index">
          <td>{{ produkt.name }}</td>
          <td>{{ produkt.quantity }}</td>
          <td>{{ produkt.price }} €</td>
          <td>{{ calculateProductValue(produkt).toFixed(2) }} €</td>
        </tr>
        </tbody>
      </table>
      <p v-else>Keine Produkte im Lager gefunden.</p>
    </div>

    <div v-if="produkte.length > 0" class="total-value">
      <h3>Gesamtwert des Lagers: {{ totalValue.toFixed(2) }} €</h3>
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

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 1; /* Sicherstellen, dass die Kopfzeile über den Zeilen bleibt */
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


table tr:hover {
  background-color: #f9f9f9;
}

/* Gesamtwert des Lagers */
.total-value {
  margin-top: 30px;
  font-weight: bold;
  font-size: 1.2rem;
}

/* Styling für Überschriften */
h1 {
  margin-left: 10px;
  margin-top: 5rem;
  font-size: 2rem;
  color: #333;
}

h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  margin-left: 10px;
}

/* Resposive Design */
@media (max-width: 768px) {
  .page-container {
    padding: 15px;
  }

  .table-container {
    padding: 15px;
  }

  table th,
  table td {
    padding: 8px;
  }

  .total-value {
    font-size: 1rem;
  }
}
</style>
