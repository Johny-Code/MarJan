document.addEventListener('DOMContentLoaded', function () {
    const imagePaths = [
        "images/MarJan/photo_1.jpg",
        "images/MarJan/photo_2.jpg",
        "images/MarJan/photo_3.jpg",
        "images/MarJan/photo_4.jpg",
        "images/MarJan/photo_5.jpg",
        "images/MarJan/photo_6.jpg",
        "images/MarJan/photo_7.jpg",
        "images/MarJan/photo_8.jpg",
        "images/MarJan/photo_9.jpg"
    ];
    let currentImageIndex = 0;
    const headerElement = document.querySelector('.bgimg');

    function changeBackgroundImage() {
        currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
        headerElement.style.backgroundImage = `url('${imagePaths[currentImageIndex]}')`;
    }

    // Set the first image as the initial background
    headerElement.style.backgroundImage = `url('${imagePaths[0]}')`;

    setInterval(changeBackgroundImage, 10000);
});
