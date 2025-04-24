window.current_language = localStorage.getItem('current_language') || 'pl';

function switchLanguage(language) {
    window.current_language = language;
    localStorage.setItem('current_language', language);
    initLanguage();

    if (typeof renderLocationList === 'function' && typeof locations !== 'undefined') {
        renderLocationList(locations);
    }

    if (typeof updateToggleButtonText === 'function') {
        updateToggleButtonText(); // Update button label
    }
}

function initLanguage() {
    const sections = [];

    sections.forEach(id => {
        const pl = document.getElementById(`${id}-pl`);
        const fr = document.getElementById(`${id}-fr`);
        if (pl && fr) {
            pl.style.display = window.current_language === 'pl' ? 'block' : 'none';
            fr.style.display = window.current_language === 'fr' ? 'block' : 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', initLanguage);
window.switchLanguage = switchLanguage;
