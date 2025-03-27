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
    
}

const initLanguage = () => {
    // Toggle visibility of language-specific content
    document.getElementById('intro-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('intro-fr').style.display = current_language === 'fr' ? 'block' : 'none';

    document.getElementById('Cieszyn-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('Cieszyn-fr').style.display = current_language === 'fr' ? 'block' : 'none'; 

    document.getElementById('close-surrodings-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('close-surrodings-fr').style.display = current_language === 'fr' ? 'block' : 'none';

    // close-surrodings-img-fr
    document.getElementById('close-surrodings-img-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('close-surrodings-img-fr').style.display = current_language === 'fr' ? 'block' : 'none';

    document.getElementById('further-surrodings-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('further-surrodings-fr').style.display = current_language === 'fr' ? 'block' : 'none';

    document.getElementById('mountain-trails-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('mountain-trails-fr').style.display = current_language === 'fr' ? 'block' : 'none';

    document.getElementById('restaurants-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('restaurants-fr').style.display = current_language === 'fr' ? 'block' : 'none';

    document.getElementById('footer-text-pl').style.display = current_language === 'pl' ? 'block' : 'none';
    document.getElementById('footer-text-fr').style.display = current_language === 'fr' ? 'block' : 'none';
}


// Initialize the page with the saved language preference
document.addEventListener('DOMContentLoaded', function () {
    monitorDatabaseChanges();
    initLanguage()
});

// Udostępnianie funkcji globalnie
window.switchLanguage = switchLanguage;

