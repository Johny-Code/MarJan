import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAGZMjOSeECO8i93vOIGYxoT4I2LbmT6I8",
    authDomain: "lista-prezentowa-marjan.firebaseapp.com",
    projectId: "lista-prezentowa-marjan",
    storageBucket: "lista-prezentowa-marjan.firebasestorage.app",
    messagingSenderId: "631667451184",
    appId: "1:631667451184:web:cebd9e98c75f56076054f5",
    measurementId: "G-D4FE1G6XBN"
  };
  
firebase.initializeApp(firebaseConfig);
database = firebase.database();

function writeTestData() {
    const dbRef = database.ref('test/');
    dbRef.set({
        message: "Hello from GitHub Pages!"
    }).then(() => {
        console.log("Data written successfully.");
    }).catch((error) => {
        console.error("Error writing data: ", error);
    });
}

function readTestData() {
    const dbRef = database.ref('test/');
    dbRef.get().then((snapshot) => {
        if (snapshot.exists()) {
            document.getElementById('firebase-data').innerText = snapshot.val().message;
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error("Error fetching data: ", error);
    });
}

function switchLanguage(lang) {
    elements.forEach(el => el.style.display = 'none');
    document.getElementById('intro-' + lang).style.display = 'block';
    document.getElementById('gifts-' + lang).style.display = 'block';
}

function toggleReservation(element) {
    const slider = element.nextElementSibling;
    const status = slider.querySelector('.status');
    const lang = document.documentElement.lang || 'pl'; 

    if (element.checked) {
        status.textContent = lang === 'fr' ? "Réservé" : "Zarezerwowane";
        alert(lang === 'fr' ? "Merci beaucoup, votre cadeau a été réservé!" : "Bardzo dziękujemy, Twój prezent został zarezerwowany!");
    } else {
        status.textContent = lang === 'fr' ? "Libre" : "Dostępny";
        alert(lang === 'fr' ? "Votre cadeau a été libéré de la réservation." : "Twój prezent został zwolniony z rezerwacji.");
    }
}

window.switchLanguage = switchLanguage;
window.toggleReservation = toggleReservation;

document.addEventListener('DOMContentLoaded', () => {
    writeTestData();
    readTestData();
});
