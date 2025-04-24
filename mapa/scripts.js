const locations = [
    { position: { lat: 49.731313, lng: 18.631563 }, info: { pl: "Dom Pani Młodej", fr: "Maison de la mariée" } },
    { position: { lat: 49.747438, lng: 18.635688 }, info: { pl: "Klasztor sióstr Boromeuszek", fr: "Couvent des sœurs Borroméennes" } },
    { position: { lat: 49.782812, lng: 18.942813 }, info: { pl: "Gościniec Szumny - sala weselna", fr: "Auberge Szumny - salle de mariage" } },
    { position: { lat: 49.762187, lng: 18.912312 }, info: { pl: "Gościniec Nałęże - noclegi", fr: "Auberge Nałęże - hébergement" } },
    { position: { lat: 49.732813, lng: 18.634937 }, info: { pl: "Gościniec Błogocice - noclegi", fr: "Auberge Błogocice - hébergement" } },
    { position: { lat: 49.715937, lng: 18.717688 }, info: { pl: "Zameczek w Dzięgielowie - poprawiny", fr: "Château à Dzięgielów - lendemain de noces" } },
];

let map;
const markers = [];

const toggleBtnLabels = {
    pl: { show: 'Pokaż listę', hide: 'Ukryj listę' },
    fr: { show: 'Afficher la liste', hide: 'Masquer la liste' }
};

function updateToggleButtonText() {
    const toggleBtn = document.getElementById('toggle-list-btn');
    const list = document.getElementById('location-ul');
    const lang = window.current_language || 'pl';

    if (!toggleBtn || !list) return;

    const isVisible = getComputedStyle(list).display !== 'none';
    toggleBtn.textContent = isVisible ? toggleBtnLabels[lang].hide : toggleBtnLabels[lang].show;
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-list-btn');
    const list = document.getElementById('location-list');

    toggleBtn.addEventListener('click', () => {
        const isVisible = list.style.display !== 'none';
        list.style.display = isVisible ? 'none' : 'block';
        updateToggleButtonText();
    });

    updateToggleButtonText(); // Set initial button label
});

function renderLocationList(locations) {
    const listContainer = document.getElementById('location-list');
    const lang = window.current_language || 'pl';

    // Create list HTML
    let listHTML = '<ul id="location-ul">';
    locations.forEach((loc, index) => {
        listHTML += `<li>
            <a href="#" onclick="focusOnLocation(${index}); return false;">
                ${loc.info[lang] || loc.info.pl}
            </a>
        </li>`;
    });
    listHTML += '</ul>';

    // Inject list without button first
    listContainer.innerHTML = listHTML;

    // Add toggle button separately
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-list-btn';
    toggleButton.className = 'toggle-button';
    listContainer.appendChild(toggleButton);

    const list = document.getElementById('location-ul');
    toggleButton.addEventListener('click', () => {
        const isVisible = list.style.display !== 'none';
        list.style.display = isVisible ? 'none' : 'block';
        updateToggleButtonText();
    });

    updateToggleButtonText(); // Initial label
}

function initMap() {
    const cieszyn = { lat: 49.748812, lng: 18.633437 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: cieszyn,
    });

    locations.forEach((loc, index) => {
        const marker = new google.maps.Marker({
            position: loc.position,
            map: map,
            animation: google.maps.Animation.DROP,
        });

        const infoWindow = new google.maps.InfoWindow();

        marker.addListener('mouseover', () => {
            const lang = window.current_language || 'pl';
            infoWindow.setContent(loc.info[lang] || loc.info.pl);
            infoWindow.open(map, marker);
        });

        marker.addListener('mouseout', () => {
            infoWindow.close();
        });

        markers.push(marker);
    });

    renderLocationList(locations);
}

function focusOnLocation(index) {
    const marker = markers[index];
    if (marker && map) {
        const position = marker.getPosition();
        const panStep = 100; // Number of steps for smooth animation
        const delay = 2; // Delay in ms between steps

        const start = map.getCenter();
        const latStep = (position.lat() - start.lat()) / panStep;
        const lngStep = (position.lng() - start.lng()) / panStep;

        let currentStep = 0;
        const smoothPan = () => {
            if (currentStep < panStep) {
                const newLat = start.lat() + latStep * currentStep;
                const newLng = start.lng() + lngStep * currentStep;
                map.setCenter({ lat: newLat, lng: newLng });
                currentStep++;
                setTimeout(smoothPan, delay);
            } else {
                map.setCenter(position);
                map.setZoom(14); // Optional zoom level

                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(() => marker.setAnimation(null), 1400); // Stop bouncing after 1.4 sec
            }
        };

        smoothPan();
    }
}

