const firebaseConfig = {
    apiKey: 'AIzaSyAGZMjOSeECO8i93vOIGYxoT4I2LbmT6I8',
    authDomain: 'lista-prezentowa-marjan.firebaseapp.com',
    databaseURL: 'https://lista-prezentowa-marjan-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: 'lista-prezentowa-marjan',
    storageBucket: 'lista-prezentowa-marjan.appspot.com',
    messagingSenderId: '631667451184',
    appId: '1:631667451184:web:cebd9e98c75f56076054f5',
    measurementId: 'G-D4FE1G6XBN'
};

// Inicjalizacja Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Variable to store the current language
let current_language = localStorage.getItem('current_language') || 'pl'; // Default to 'pl'
let initialLoad = true; // Flaga dla pierwszego załadowania danych
let isChanging = false

// Function to switch language
function switchLanguage(language) {
    // Update the global current_language variable
    current_language = language;

    // Save the language preference in localStorage
    localStorage.setItem('current_language', language);

    initLanguage()

    renderGifts();
    
}

const initLanguage = () => {
    // Toggle visibility of language-specific content
    document.getElementById('header_title-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('header_title-fr').style.display = current_language === 'fr' ? 'block' : 'none';
    document.getElementById('intro-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('intro-fr').style.display = current_language === 'fr' ? 'block' : 'none';
    document.getElementById('footer_text-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('footer_text-fr').style.display = current_language === 'fr' ? 'block' : 'none';
}

function renderGifts(){
    // Get the section to render the gifts
    const giftsSection = document.getElementById('gifts-section');
    giftsSection.innerHTML = ''; // Wyczyść sekcję przed generowaniem
    
    const dbRef = database.ref('gifts/');

    dbRef.once('value', (snapshot) => {
        const data = snapshot.val();
        console.log('Fetched data:', data); // Debugging line to check fetched data
        if (data) {
            for (const categoryId in data) {
                const category = data[categoryId];

                // Nagłówek kategorii
                const categoryName = current_language === 'fr' ? category.category_name_french : category.category_name_polish;
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
                     <th class="header-row">${current_language === 'fr' ? 'Nom du cadeau' : 'Nazwa prezentu'}</th>
                     <th class="header-row">${current_language === 'fr' ? 'Réservation' : 'Rezerwacja'}</th>
                 `;
                 table.appendChild(headerRow);
 
                 // Dodanie wierszy dla prezentów
                 for (const giftId in category) {
                     if (giftId.startsWith('gift_')) {
                         const gift = category[giftId];
                         const giftName = current_language === 'fr' ? gift.name_french : gift.name;
                         const giftUrl = gift.url ? `<a href="${gift.url}" target="_blank">[${current_language === 'fr' ? 'lien' : 'link'}]</a>` : '';

                         const row = document.createElement('tr');
                         if (gift.reservable === false) {
                            row.innerHTML = `
                             <td>${giftName} ${giftUrl}</td>
                             <td>${current_language === 'fr' ? 'en toute quantité ;)' : 'w dowolnej ilości ;)'}</td>
                             `;
                         } else {
                            row.innerHTML = `
                                <td>${giftName} ${giftUrl}</td>
                                <td>
                                    <label class="switch">
                                        <input type="checkbox" data-id="${giftId}" onchange="toggleReservation(this)" ${gift.reserved ? 'checked' : ''}>
                                        <span class="slider">
                                            <span class="status">${gift.reserved ? (current_language === 'fr' ? 'Réservé' : 'Zarezerwowane') : (current_language === 'fr' ? 'Libre' : 'Dostępny')}</span>
                                        </span>
                                    </label>
                                </td>
                            `;
                        }
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

        const slider = element.nextElementSibling;
        const status = slider.querySelector('.status');

        // Aktualizacja tekstu statusu w interfejsie
        status.textContent = reserved ? (current_language === 'fr' ? "Réservé" : "Zarezerwowane") : (current_language === 'fr' ? "Libre" : "Dostępny");

        // Sprawdzanie poprawności danych przed zapisaniem w Firebase
        if (!giftId || !category) {
            console.error("Brak giftId lub categoryId. Nie można zapisać w Firebase.");
            return;
        }

        // Aktualizacja Firebase
        isChanging=true
        database.ref(`gifts/${category}/${giftId}/reserved`).set(reserved)
            .then(() => {
                console.log("Zaktualizowano stan rezerwacji w Firebase:", {
                    giftId,
                    category,
                    reserved
                });
                
                isChanging=false

                setTimeout(() => {
                    alert(reserved 
                        ? (current_language === 'fr' ? "Cadeau réservé avec succès !" : "Prezent zarezerwowany pomyślnie!") 
                        : (current_language === 'fr' ? "Réservation annulée avec succès !" : "Rezerwacja anulowana pomyślnie!"));
                }, 100)
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
    const dbRef = database.ref('gifts/');
    dbRef.on('value', (snapshot) => {
        if(isChanging) return
        if (initialLoad) {
            // Pierwsze załadowanie – pomijamy alert
            initialLoad = false;
        } else {
            // Kolejne zmiany – wyświetlamy alert
            if (current_language === 'pl') {
                alert("Gdzieś na świecie zaktualizowano tę listę prezentową. Odświeżyliśmy ją dla Ciebie ;)");
            } else {
                alert("Quelque part dans le monde, cette liste de cadeaux a été mise à jour. Nous l'avons actualisée pour vous ;)");
            }
            location.reload()
        }
    });
}

// Initialize the page with the saved language preference
document.addEventListener('DOMContentLoaded', function () {
    monitorDatabaseChanges();
    initLanguage()
    renderGifts()
});

// Udostępnianie funkcji globalnie
window.toggleReservation = toggleReservation;
window.switchLanguage = switchLanguage;

