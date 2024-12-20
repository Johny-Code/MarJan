import { firebaseConfig } from './scripts/firebaseConfig.js';

// Funkcja do przełączania rezerwacji
function toggleReservation(checkbox) {
    const giftId = checkbox.getAttribute('data-id');
    const reserved = checkbox.checked;
    const statusSpan = checkbox.nextElementSibling.querySelector('.status');
    const lang = document.documentElement.lang; // Assuming the language is set in the HTML tag

    // Aktualizacja statusu w Firebase
    const updates = {};
    updates[`/gifts/${giftId}/reserved`] = reserved;
    firebase.database().ref().update(updates);

    // Aktualizacja tekstu statusu
    statusSpan.textContent = reserved ? (lang === 'fr' ? 'Réservé' : 'Zarezerwowane') : (lang === 'fr' ? 'Libre' : 'Dostępny');
}

// Inicjalizacja Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const giftsSection = document.getElementById('gifts-section');

function renderGifts(lang) {

    if (!giftsSection) {
        console.error("Element gifts-section nie istnieje. Upewnij się, że jest poprawnie dodany w HTML.");
        return; // Zatrzymaj działanie funkcji, jeśli element nie istnieje
    }

    giftsSection.innerHTML = ''; // Wyczyść sekcję przed generowaniem

    dbRef.limitToFirst(10).once('value', (snapshot) => {
    dbRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            for (const categoryId in data) {
                const category = data[categoryId];

                // Nagłówek kategorii
                const categoryName = lang === 'fr' ? (category.category_name_french || 'Unknown Category') : (category.category_name_polish || 'Nieznana Kategoria');
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'category';
                categoryHeader.textContent = categoryName;
                giftsSection.appendChild(categoryHeader);

                // Tworzenie tabeli dla kategorii
                const table = document.createElement('table');
                table.setAttribute('data-category-id', categoryId);

                // Dodanie nagłówków tabeli
                const headerRow = document.createElement('tr');
                headerRow.innerHTML = `
                    <th>${lang === 'fr' ? 'Nom du cadeau' : 'Nazwa prezentu'}</th>
                    <th>${lang === 'fr' ? 'Réservation' : 'Rezerwacja'}</th>
                `;
                table.appendChild(headerRow);

                // Dodanie wierszy dla prezentów
                for (const giftId in category) {
                    if (giftId.startsWith('gift_')) {
                        const gift = category[giftId];
                        const giftName = lang === 'fr' ? gift.name_french : gift.name;
                        const giftUrl = gift.url ? `<a href="${gift.url}" target="_blank">[URL]</a>` : '';

                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${giftName} ${giftUrl}</td>
                            <td>
                                <label class="switch">
                                    <input type="checkbox" data-id="${giftId}" onchange="toggleReservation(this)" ${gift.reserved ? 'checked' : ''}>
                                    <span class="slider">
                                        <span class="status">${gift.reserved ? (lang === 'fr' ? 'Réservé' : 'Zarezerwowane') : (lang === 'fr' ? 'Libre' : 'Dostępny')}</span>
                                    </span>
                                </label>
                            </td>
                        `;
                        table.appendChild(row);
                    }
                }

                // Dodanie tabeli do sekcji
                giftsSection.appendChild(table);
            }
        }
    });
  });
}