<template>
  <div>
    <!-- Eingabefelder für Latitude und Longitude -->
    <input v-model="newLat" type="number" placeholder="Latitude" />
    <input v-model="newLng" type="number" placeholder="Longitude" />
    <button @click="addCustomMarker">Marker Hinzufügen</button>

    <!-- Karte, auf der die Marker angezeigt werden -->
    <div ref="map" style="height: 500px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const mapElement = ref(null);
const map = ref(null);
const newLat = ref('');  // Bindet die Latitude-Eingabe
const newLng = ref('');  // Bindet die Longitude-Eingabe
const markers = ref([]);  // Hier speichern wir die Marker

onMounted(() => {
  if (window.google && window.google.maps) {
    initMap();
  }
});

function initMap() {
  // Initialisierung der Karte mit einem Standardzentrum
  map.value = new google.maps.Map(mapElement.value, {
    center: { lat: 52.5200, lng: 13.4050 },  // Standardposition (Berlin)
    zoom: 5,
  });
}

function addCustomMarker() {
  const lat = parseFloat(newLat.value);  // Konvertiert die Latitude in eine Zahl
  const lng = parseFloat(newLng.value);  // Konvertiert die Longitude in eine Zahl

  // Überprüft, ob beide Werte gültige Koordinaten sind
  if (!isNaN(lat) && !isNaN(lng)) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map.value,
      title: `Marker bei ${lat}, ${lng}`,
    });

    markers.value.push(marker);  // Fügt den Marker zur Liste der Marker hinzu

    // Zurücksetzen der Eingabefelder nach dem Hinzufügen
    newLat.value = '';
    newLng.value = '';
  } else {
    alert('Bitte gültige Koordinaten eingeben!');
  }
}
</script>

<style scoped>
/* Optionales Styling für das Formular und die Karte */
input {
  margin-right: 10px;
  padding: 5px;
}

button {
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

div[ref="map"] {
  margin-top: 20px;
}
</style>
