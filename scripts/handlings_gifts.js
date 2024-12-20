import { firebaseConfig } from './scripts/firebaseConfig.js';

// Inicjalizacja Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function renderGifts(lang) {
    const giftsSection = document.getElementById('gifts-section');

    if (!giftsSection) {
        console.error("Element gifts-section nie istnieje. Upewnij się, że jest poprawnie dodany w HTML.");
        return; // Zatrzymaj działanie funkcji, jeśli element nie istnieje
    }

    giftsSection.innerHTML = ''; // Wyczyść sekcję przed generowaniem

    const dbRef = database.ref('gifts/');
    dbRef.once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            for (const categoryId in data) {
                const category = data[categoryId];

                // Nagłówek kategorii
                const categoryName = lang === 'fr' ? category.category_name_french : category.category_name_polish;
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
}