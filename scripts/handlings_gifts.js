import { firebaseConfig } from './scripts/firebaseConfig.js';

// Inicjalizacja Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Sprawdzenie połączenia z bazą danych
database.ref('.info/connected').on('value', (snapshot) => {
    if (snapshot.val() === true) {
        console.log('Połączenie z bazą danych zostało nawiązane.');
    } else {
        console.log('Brak połączenia z bazą danych.');
    }
});