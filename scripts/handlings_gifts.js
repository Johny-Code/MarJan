import { firebaseConfig } from './scripts/firebaseConfig.js';

// Inicjalizacja Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get the section to render the gifts
const giftsSection = document.getElementById('gifts-section');

function renderGifts() {
    giftsSection.innerHTML = `
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Reservation</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td>Gift 1</td>
                            <td><button>Reserve</button></td>
                        </tr>
                </tbody>
            </table>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderGifts();
});
