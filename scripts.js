
const firebaseConfig = {
    apiKey: "AIzaSyAGZMjOSeECO8i93vOIGYxoT4I2LbmT6I8",
    authDomain: "lista-prezentowa-marjan.firebaseapp.com",
    databaseURL: "https://lista-prezentowa-marjan-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "lista-prezentowa-marjan",
    storageBucket: "lista-prezentowa-marjan.appspot.com",
    messagingSenderId: "631667451184",
    appId: "1:631667451184:web:cebd9e98c75f56076054f5",
    measurementId: "G-D4FE1G6XBN"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Inicjalizacja danych z Firebase
function initializeData() {
    const dbRef = database.ref('gifts/');
    console.log('Jestem w funkcji initializeData()')
    dbRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Dla każdego prezentu ustaw odpowiedni stan
            console.log("Data: ", data)
            for (const category in data) {
                const gifts = data[category];
                for (const giftId in gifts) {
                    if (giftId.startsWith("gift_")) {
                        const gift = gifts[giftId];
                        const checkbox = document.querySelector(`input[data-id="${giftId}"]`);
                        console.log("Checkbox: ", checkbox)
                        if (checkbox) {
                            checkbox.checked = gift.reserved;
                            const status = checkbox.nextElementSibling.querySelector('.status');
                            status.textContent = gift.reserved ? "Zarezerwowane" : "Dostępny";
                        }
                    }
                }
            }
        }
    });
}

// Obsługa zmiany rezerwacji
function toggleReservation(element) {
    const giftId = element.dataset.id;
    const category = element.closest('table').dataset.categoryId;
    const reserved = element.checked;

    const lang = document.documentElement.lang || 'pl';
    const status = element.nextElementSibling.querySelector('.status');
    status.textContent = reserved ? (lang === 'fr' ? "Réservé" : "Zarezerwowane") : (lang === 'fr' ? "Libre" : "Dostępny");

    // Aktualizacja w Firebase
    database.ref(`gifts/${category}/${giftId}/reserved`).set(reserved)
        .then(() => {
            alert(lang === 'fr' ? "Votre cadeau a été réservé!" : "Twój prezent został zarezerwowany!");
        })
        .catch((error) => {
            console.error("Error updating reservation: ", error);
        });
}

// Monitorowanie zmian w bazie danych
function monitorDatabaseChanges() {
    const dbRef = database.ref('gifts/');
    dbRef.on('value', () => {
        alert("Zaktualizowano dane. Odśwież stronę, aby zobaczyć najnowsze zmiany!");
    });
}

function writeTestData() {
    const dbRef = database.ref('test/');
    dbRef.set({
        message: "Hello from GitHub Pages! Jan Dupa"
    })
    .then(() => {
        console.log("Data written successfully. Kupa!");
    })
    .catch((error) => {
        console.error("Error writing data: ", error);
    });
}

function readTestData() {
    const dbRef = database.ref('test/');
    dbRef.get()
    .then((snapshot) => {
        if (snapshot.exists()) {
            document.getElementById('firebase-data').innerText = snapshot.val().message;
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error("Error fetching data: ", error);
    });
}


// Funkcja do zmiany języka
function switchLanguage(lang) {
    const elements = document.querySelectorAll('.intro, .gifts');
    elements.forEach(el => el.style.display = 'none');
    document.getElementById('intro-' + lang).style.display = 'block';
    document.getElementById('gifts-' + lang).style.display = 'block';
}

function toggleReservation(element) {
    const slider = element.nextElementSibling;
    const status = slider.querySelector('.status');
    const lang = document.documentElement.lang || 'pl';

    try {
        if (element.checked) {
            status.textContent = lang === 'fr' ? "Réservé" : "Zarezerwowane";
            alert(lang === 'fr' ? "Merci beaucoup, votre cadeau a été réservé!" : "Bardzo dziękujemy, Twój prezent został zarezerwowany!");
        } else {
            status.textContent = lang === 'fr' ? "Libre" : "Dostępny";
            alert(lang === 'fr' ? "Votre cadeau a été libéré de la réservation." : "Twój prezent został zwolniony z rezerwacji.");
        }
    } catch (error) {
        console.error("Error handling reservation toggle: ", error);
    }
}

// Udostępnianie funkcji globalnie
window.switchLanguage = switchLanguage;
window.toggleReservation = toggleReservation;
window.toggleReservation = toggleReservation;

// Wykonanie akcji po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    monitorDatabaseChanges();
    writeTestData();
    readTestData();
});
