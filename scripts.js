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
        if (element.checked) {
            status.textContent = "Zarezerwowane";
            alert("Bardzo dziękujemy, Twój prezent został zarezerwowany!");
        } else {
            status.textContent = "Dostępny";
            alert("Twój prezent został zwolniony z rezerwacji.");
        }
    }

    window.switchLanguage = switchLanguage;
    window.toggleReservation = toggleReservation;
});