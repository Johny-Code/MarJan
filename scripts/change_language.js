// Variable to store the current language
let current_language = localStorage.getItem('current_language') || 'pl'; // Default to 'pl'

// Function to switch language
function switchLanguage(language) {
    // Update the global current_language variable
    current_language = language;

    // Save the language preference in localStorage
    localStorage.setItem('current_language', language);

    // Toggle visibility of language-specific content
    document.getElementById('header_title-pl').style.display = language === 'pl' ? 'block' : 'none';
    document.getElementById('header_title-fr').style.display = language === 'fr' ? 'block' : 'none';
    document.getElementById('intro-pl').style.display = language === 'pl' ? 'block' : 'none';
    document.getElementById('intro-fr').style.display = language === 'fr' ? 'block' : 'none';
    document.getElementById('footer_text-pl').style.display = language === 'pl' ? 'block' : 'none';
    document.getElementById('footer_text-fr').style.display = language === 'fr' ? 'block' : 'none';

    // Trigger the renderGifts function to re-render gifts
    if (typeof renderGifts === 'function') {
        renderGifts(current_language);
    }
}

// Initialize the page with the saved language preference
document.addEventListener('DOMContentLoaded', function () {
    switchLanguage(current_language);
});