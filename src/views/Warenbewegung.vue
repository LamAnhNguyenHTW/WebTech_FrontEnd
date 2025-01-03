<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const isModalOpen = ref(false); // Modal-Anzeige
const produkte = ref([] as Array<any>)
const selectedProduct = ref<any>(null)
const quantity = ref(1)
const warenbewegungen = ref<Array<any>>([])
const kunden = ref([] as Array<any>) // Kunden
const lieferanten = ref([] as Array<any>) // Lieferanten
const selectedKunde = ref<any>(null) // Ausgewählter Kunde
const selectedLieferant = ref<any>(null) // Ausgewählter Lieferant
const isOutgoing = ref(false) // Warenausgang aktiv
const isIncoming = ref(false) // Wareneingang aktiv

const baseUrl = import.meta.env.VITE_APP_BACKEND_BASE_URL;
const apiUrl = baseUrl + '/api/produkte';

// Lade die Produkt-, Kunden- und Lieferantenliste
const loadProducts = async () => {
  try {
    const response = await axios.get(apiUrl)
    produkte.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Fehler beim Abrufen der Produkte:', error)
  }
}

const loadKunden = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/kunden`);
    console.log('API Kunden:', response.data); // Logge die Daten
    kunden.value = Array.isArray(response.data) ? response.data : [];
    console.log('Kunden in Ref:', kunden.value); // Überprüfe den gespeicherten Wert
  } catch (error) {
    console.error('Fehler beim Abrufen der Kunden:', error);
  }
};

const loadLieferanten = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/lieferanten`);
    console.log('API Lieferanten:', response.data); // Logge die Daten
    lieferanten.value = Array.isArray(response.data) ? response.data : [];
    console.log('Lieferanten in Ref:', lieferanten.value); // Überprüfe den gespeicherten Wert
  } catch (error) {
    console.error('Fehler beim Abrufen der Lieferanten:', error);
  }
};

onMounted(() => {
  loadProducts()
  loadKunden()
  loadLieferanten()
  loadWarenbewegungen()
})

// Funktion zum Laden der Warenbewegungen
const loadWarenbewegungen = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/produkte/warenbewegungen`);
    if (Array.isArray(response.data)) {
      warenbewegungen.value = response.data.map((bewegung: any) => {
        const datumArray = bewegung.datum; // Datum als Array
        const datum = new Date(datumArray[0], datumArray[1] - 1, datumArray[2], datumArray[3], datumArray[4], datumArray[5]); // Umwandeln in Date-Objekt

        // Formatieren des Datums im gewünschten Format (DD/MM/YYYY, HH:mm:ss)
        const formattedDatum = datum.toLocaleString('de-DE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false, // 24-Stunden-Format
        }).replace(',', ''); // Entfernt das Komma zwischen Datum und Zeit

        // Ersetzt den Punkt (.) durch Schrägstriche (/) im Datum
        const finalFormattedDatum = formattedDatum.replace(/\./g, '/');

        return {
          ...bewegung,
          datum: finalFormattedDatum
        };
      });
    } else {
      console.error('Erhaltene Warenbewegungen sind kein Array:', response.data);
      warenbewegungen.value = [];
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Warenbewegungen:', error);
    warenbewegungen.value = [];
  }
};


const deleteWarenbewegung = async (id: number) => {
  console.log("Gelöschte ID:", id);  // Debugging: Zeigt die ID in der Konsole an
  if (!id) {
    alert('Die ID ist ungültig.');
    return;
  }
  try {
    const response = await axios.delete(`${baseUrl}/api/warenbewegungen/${id}`);
    if (response.status === 204) {
      loadWarenbewegungen();  // Neue Warenbewegungen laden
      alert('Warenbewegung erfolgreich gelöscht!');
    } else {
      alert('Fehler beim Löschen der Warenbewegung. Status: ' + response.status);
    }
  } catch (error:any) {
    console.error('Fehler beim Löschen der Warenbewegung:', error);
    alert('Fehler beim Löschen der Warenbewegung: ' + error.message);
  }
};

const handleConfirmSelection = async () => {
  if (isIncoming.value && selectedLieferant.value) {
    await bookIncoming();
  } else if (isOutgoing.value && selectedKunde.value) {
    await bookOutgoing();
  }
  closeModal();
}

const bookIncoming = async () => {
  if (!selectedProduct.value || !selectedLieferant.value || quantity.value <= 0) {
    alert('Bitte ein Produkt, einen Lieferanten und eine gültige Menge auswählen.');
    return;
  }

  try {
    const response = await axios.put(
      `${apiUrl}/${selectedProduct.value.id}/entry?quantityToAdd=${quantity.value}&lieferantId=${selectedLieferant.value.id}`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200) {
      await loadWarenbewegungen();
      alert(`Wareneingang für ${selectedProduct.value.name} von ${selectedLieferant.value.name} erfolgreich gebucht!`);
      await loadProducts();
      // Reset selections
      selectedProduct.value = null;
      selectedLieferant.value = null;
      quantity.value = 1;
    }
  } catch (error) {
    console.error('Fehler beim Buchen des Wareneingangs:', error);
    alert('Fehler beim Buchen des Wareneingangs.');
  }
}

const bookOutgoing = async () => {
  if (!selectedProduct.value || !selectedKunde.value || quantity.value <= 0) {
    alert('Bitte ein Produkt, einen Kunden und eine gültige Menge auswählen.');
    return;
  }

  try {
    const response = await axios.put(
      `${apiUrl}/${selectedProduct.value.id}/exit?quantityToExit=${quantity.value}&kundeId=${selectedKunde.value.id}`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200) {
      await loadWarenbewegungen();
      alert(`Warenausgang für ${selectedProduct.value.name} an ${selectedKunde.value.name} erfolgreich gebucht!`);
      await loadProducts();
      // Reset selections
      selectedProduct.value = null;
      selectedKunde.value = null;
      quantity.value = 1;
    }
  } catch (error) {
    console.error('Fehler beim Buchen des Warenausgangs:', error);
    alert('Fehler beim Buchen des Warenausgangs.');
  }
}


// Öffnet das Modal für Wareneingang oder Warenausgang
const openModal = (type: 'eingang' | 'ausgang') => {
  isModalOpen.value = true;
  if (type === 'eingang') {
    isIncoming.value = true;
    isOutgoing.value = false;
  } else {
    isOutgoing.value = true;
    isIncoming.value = false;
  }

  // Sicherstellen, dass Lieferanten oder Kunden geladen sind, wenn das Modal geöffnet wird
  if (isIncoming.value) {
    loadLieferanten();
  }
  if (isOutgoing.value) {
    loadKunden();
  }
};


// Schließt das Modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Bestätigt die Auswahl
const confirmSelection = () => {
  if (isIncoming.value && selectedLieferant.value) {
    alert(`Lieferant ${selectedLieferant.value.name} ausgewählt.`);
  } else if (isOutgoing.value && selectedKunde.value) {
    alert(`Kunde ${selectedKunde.value.name} ausgewählt.`);
  }
  closeModal();
};

console.log('Lieferanten:', lieferanten.value);
console.log('Kunden:', kunden.value);

console.log('Selected Lieferant:', selectedLieferant.value);
console.log('Selected Kunde:', selectedKunde.value);

</script>

<template>
  <div class="page-container">
    <!-- Header für die Seite -->
    <div class="header">
      <h1>Inventur - Warenbewegung</h1>
    </div>

    <div class="content-container">
      <!-- Container für die Eingabefelder und Buttons (rechte Box) -->
      <div class="form-container">
        <div>
          <label for="product-select">Produkt auswählen:</label>
          <select v-model="selectedProduct" id="product-select">
            <option value="" disabled selected>Wähle ein Produkt</option>
            <option v-for="produkt in produkte" :key="produkt.id" :value="produkt">
              {{ produkt.name }} (Menge im Lager: {{ produkt.quantity }})
            </option>
          </select>
        </div>

        <div>
          <label for="quantity">Menge:</label>
          <input id="quantity" type="number" v-model="quantity" min="1" placeholder="Menge eingeben" />
        </div>

        <div>
          <button @click="openModal('eingang')" class="income-btn">Wareneingang buchen</button>
        </div>

        <div>
          <button @click="openModal('ausgang')" class="outcome-btn">Warenausgang buchen</button>
        </div>
      </div>

      <!-- Container für die Tabelle der Warenbewegungen (linke Box) -->
      <div class="table-container">
        <table v-if="warenbewegungen.length > 0">
          <thead>
          <tr>
            <th>Produkt</th>
            <th>Menge</th>
            <th>Typ</th>
            <th>Datum</th>
            <th>Lieferant/Kunde</th> <!-- Spalte für Lieferant/Kunde -->
            <th>Aktionen</th> <!-- Spalte für Aktionen -->
          </tr>
          </thead>
          <tbody>
          <tr v-for="(bewegung, index) in warenbewegungen" :key="index">
            <td>{{ bewegung.produktName }}</td>
            <td>{{ bewegung.menge }}</td>
            <td>
              <div class="movement-type">
                <span v-if="bewegung.typ === 'Eingang'" class="movement-arrow incoming">↑</span>
                <span v-if="bewegung.typ === 'Ausgang'" class="movement-arrow outgoing">↓</span>
                <span class="movement-text">{{ bewegung.typ }}</span>
              </div>
            </td>
            <td>{{ bewegung.datum }}</td>
            <td>{{ bewegung.lieferantName || bewegung.kundeName }}</td>
            <td>
              <button @click="deleteWarenbewegung(bewegung.id)" class="delete-btn">🗑️</button>
            </td>
          </tr>
          </tbody>
        </table>
        <p v-else>Keine Warenbewegungen vorhanden.</p>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="isModalOpen" class="modal-overlay">
    <div class="modal">
      <h2 v-if="isIncoming">Lieferanten auswählen</h2>
      <h2 v-if="isOutgoing">Kunden auswählen</h2>

      <!-- Lieferantenauswahl (nur für Wareneingang) -->
      <select v-if="isIncoming" v-model="selectedLieferant" class="modal-select">
        <option :value="null" disabled>Wähle einen Lieferanten</option>
        <option v-for="lieferant in lieferanten" :key="lieferant.id" :value="lieferant">
          {{ lieferant.name }}
        </option>
      </select>

      <!-- Kundenauswahl (nur für Warenausgang) -->
      <select v-if="isOutgoing" v-model="selectedKunde" class="modal-select">
        <option :value="null" disabled>Wähle einen Kunden</option>
        <option v-for="kunde in kunden" :key="kunde.id" :value="kunde">
          {{kunde.name}}
        </option>
      </select>

      <!-- Modal Buttons -->
      <div class="modal-buttons">
        <button @click="closeModal" class="cancel-btn">Abbrechen</button>
        <button
          @click="handleConfirmSelection"
          :disabled="isIncoming && !selectedLieferant"
          class="confirm-btn"
        >
          Bestätigen
        </button>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Container für die gesamte Seite */
.page-container {
  width: 250%;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* Einheitliche Schriftart für die gesamte Seite */
body {
  font-family: 'Arial', sans-serif; /* Oder eine andere Schriftart deiner Wahl */
}

/* Für die Tabelle spezifische Schriftartregel */
table th, table td {
  font-family: 'Arial', sans-serif; /* Schriftart auch für Tabellenüberschriften und Zellen */
}


.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 5rem; /* Reduziert von 20rem auf 2rem */
  margin-bottom: 2rem;
  padding: 0 10px;
}

h1 {
  margin: 0;
  color: #2c3e50;
}

/* Flexbox-Container, der die Eingabeformulare und Tabelle nebeneinander anordnet */
.content-container {
  display: flex;
  justify-content: space-between;
  gap: 30px;
}

/* Container für das Formular (Produkt- und Mengenauswahl) */
.form-container {
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 50%;  /* 50% der Gesamtbreite */
}

label {
  font-size: 1rem;
  color: #333;
}

input[type="number"],
select {
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1.1rem;
  width: 100%;
  box-sizing: border-box;
}

input[type="number"]:focus,
select:focus {
  border-color: #4caf50;
  outline: none;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
  margin-top: 15px;
}

.income-btn:hover,.outcome-btn:hover {
  background-color: #45a049;
}

.delete-btn {
  padding: 5px;
  margin: 0 5px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.delete-btn:hover {
  transform: scale(1.2);
  color: #e74c3c;
}


/* Container für die Tabelle der Warenbewegungen */
.table-container {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 110%;
}

table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}


table th,
table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f1f1f1;
  font-size: 1.1rem;
}

table th {
  background-color: #f4f4f9;
  color: #333;
  font-weight: 600;
}

table tr:hover {
  background-color: #f1f1f1;
}

/* Styling der Nachricht, wenn keine Warenbewegungen vorhanden sind */
p {
  font-size: 1rem;
  color: #7f8c8d;
  font-style: italic;
}

/* Container für die scrollbare Tabelle */
.table-container {
  max-height: 450px; /* Maximale Höhe der Tabelle */
  overflow-y: auto;  /* Vertikale Scrollbar aktivieren */
  border: 1px solid #ddd;
  margin-top: 20px;
  border-radius: 8px;
}
/* Modal Overlay */
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

/* Modal Container */
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

/* Modal Header */
.modal h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.5rem;
}

/* Modal Select Boxes */
.modal-select {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1.1rem;
  box-sizing: border-box;
}

/* Modal Buttons */
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-buttons .cancel-btn {
  order: 2; /* Abbrechen-Button rechts */
}

.modal-buttons .confirm-btn {
  order: 1; /* Bestätigen-Button links */
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin-top: 15px;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
}

.confirm-btn {
  background-color: #4caf50;
  color: white;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

.confirm-btn:hover {
  background-color: #45a049;
}

.movement-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.movement-arrow {
  font-size: 1.2em;
  font-weight: bold;
}

.incoming {
  color: #4CAF50; /* Green color for incoming */
}

.outgoing {
  color: #f44336; /* Red color for outgoing */
}

.movement-text {
  margin-left: 4px;
}

</style>
