import { firebaseConfig } from './scripts/firebaseConfig.js';

// Inicjalizacja Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Funkcja generująca dynamiczne tabele na podstawie danych z Firebase
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

// Funkcja obsługująca zmianę stanu rezerwacji
function toggleReservation(element) {
    try {
        const giftId = element.dataset.id;
        const category = element.closest('table')?.dataset.categoryId;
        const reserved = element.checked;

        const lang = document.documentElement.lang || 'pl';
        const slider = element.nextElementSibling;
        const status = slider.querySelector('.status');

        // Aktualizacja tekstu statusu w interfejsie
        status.textContent = reserved ? (lang === 'fr' ? "Réservé" : "Zarezerwowane") : (lang === 'fr' ? "Libre" : "Dostępny");

        // Sprawdzanie poprawności danych przed zapisaniem w Firebase
        if (!giftId || !category) {
            console.error("Brak giftId lub categoryId. Nie można zapisać w Firebase.");
            return;
        }

        // Aktualizacja Firebase
        database.ref(`gifts/${category}/${giftId}/reserved`).set(reserved)
            .then(() => {
                console.log("Zaktualizowano stan rezerwacji w Firebase:", {
                    giftId,
                    category,
                    reserved
                });
            })
            .catch((error) => {
                console.error("Błąd podczas zapisywania danych w Firebase:", error);
            });
    } catch (error) {
        console.error("Error handling reservation toggle:", error);
    }
}

// Funkcja monitorująca zmiany w bazie danych
function monitorDatabaseChanges() {
    let initialLoad = true; // Flaga dla pierwszego załadowania danych

    const dbRef = database.ref('gifts/');
    dbRef.on('value', (snapshot) => {
        if (initialLoad) {
            // Pierwsze załadowanie – pomijamy alert
            initialLoad = false;
        } else {
            // Kolejne zmiany – wyświetlamy alert
            alert("Gdzieś na świecie zaktualizowano tę listę prezentową. Odświeżyliśmy ją dla Ciebie ;)");
            location.reload()
        }
    });
}

// Funkcja zmieniająca język
function switchLanguage(lang) {
    const elements = [
        document.getElementById('intro-' + lang),
        document.getElementById('gifts-' + lang),
        document.getElementById('footer_text-' + lang),
        document.getElementById('header_title-' + lang)
    ];

    elements.forEach(el => {
        if (el) {
            el.style.display = 'block'; // Show the element
        } else {
            console.warn(`Element for language ${lang} not found.`);
        }
    });

    // Hide other elements
    const otherLang = lang === 'pl' ? 'fr' : 'pl';
    const otherElements = [
        document.getElementById('intro-' + otherLang),
        document.getElementById('gifts-' + otherLang),
        document.getElementById('footer_text-' + otherLang),
        document.getElementById('header_title-' + otherLang)
    ];

    otherElements.forEach(el => {
        if (el) {
            el.style.display = 'none'; // Hide the element
        } else {
            console.warn(`Element for language ${otherLang} not found.`);
        }
    });

    renderGifts(lang);
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    const defaultLang = 'pl'; // Domyślny język
    renderGifts(defaultLang);
    monitorDatabaseChanges();
});


// Udostępnianie funkcji globalnie
window.toggleReservation = toggleReservation;
window.switchLanguage = switchLanguage;