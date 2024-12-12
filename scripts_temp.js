// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.intro, .gifts');

    function switchLanguage(lang) {
        elements.forEach(el => el.style.display = 'none');
        document.getElementById('intro-' + lang).style.display = 'block';
        document.getElementById('gifts-' + lang).style.display = 'block';
    }

    function toggleReservation(element) {
        const slider = element.nextElementSibling;
        const status = slider.querySelector('.status');
        const lang = document.documentElement.lang || 'pl'; // Default to Polish if no language is set

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
});