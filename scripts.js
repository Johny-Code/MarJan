document.addEventListener('DOMContentLoaded', function () {
    const giftsSection = document.getElementById('gifts-section');
    let language = 'pl'; // Default language

    // Initialize the page
    function initializePage() {
        fetch('reservation.json')
            .then(response => response.json())
            .then(data => generateGiftList(data));
    }

    // Generate gift list dynamically
    function generateGiftList(data) {
        giftsSection.innerHTML = ''; // Clear existing content
        data.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.textContent = language === 'pl' ? category.name : category.name_french || category.name;
            giftsSection.appendChild(categoryDiv);

            const table = document.createElement('table');
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>${language === 'pl' ? 'Nazwa prezentu' : 'Nom du cadeau'}</th>
                <th>${language === 'pl' ? 'Rezerwacja' : 'Réservation'}</th>`;
            table.appendChild(headerRow);

            category.items.forEach(item => {
                const row = document.createElement('tr');
                const linkText = language === 'pl' ? 'Link' : 'Lien';
                row.innerHTML = `
                    <td>${item.name} <a href="${item.link}" target="_blank">${linkText}</a></td>
                    <td>
                        <label class="switch">
                            <input type="checkbox" ${item.reserved ? 'checked' : ''} onchange="toggleReservation(this)">
                            <span class="slider">
                                <span class="status">${item.reserved ? (language === 'fr' ? 'Réservé' : 'Zarezerwowane') : (language === 'fr' ? 'Libre' : 'Dostępny')}</span>
                            </span>
                        </label>
                    </td>`;
                table.appendChild(row);
            });

            giftsSection.appendChild(table);
        });
    }

    // Switch language
    function switchLanguage(lang) {
        language = lang;
        initializePage(); // Re-render with new language
    }

    // Export functions
    window.switchLanguage = switchLanguage;
    window.initializePage = initializePage;
    window.toggleReservation = function (element) {
        const slider = element.nextElementSibling;
        const status = slider.querySelector('.status');

        if (element.checked) {
            status.textContent = language === 'fr' ? 'Réservé' : 'Zarezerwowane';
            alert(language === 'fr' ? 'Merci beaucoup, votre cadeau a été réservé!' : 'Bardzo dziękujemy, Twój prezent został zarezerwowany!');
        } else {
            status.textContent = language === 'fr' ? 'Libre' : 'Dostępny';
            alert(language === 'fr' ? 'Votre cadeau a été libéré de la réservation.' : 'Twój prezent został zwolniony z rezerwacji.');
        }
    };

    initializePage();
});
