document.addEventListener('DOMContentLoaded', function () {
    const imagePaths = [
        "images/background_desktop/1.png",
        "images/background_desktop/2.png",
        "images/background_desktop/3.png",
        "images/background_desktop/4.png",
        "images/background_desktop/5.png",
        "images/background_desktop/6.png",
        "images/background_desktop/7.png",
        "images/background_desktop/8.png"
    ];

    const imagePathsMobile = [
        "images/background_mobile/1.png",
        "images/background_mobile/2.png",
        "images/background_mobile/3.png",
        "images/background_mobile/4.png",
        "images/background_mobile/5.png",
        "images/background_mobile/6.png",
        "images/background_mobile/7.png",
        "images/background_mobile/8.png"
    ];
    
    let currentImageIndex = 0;
    const headerElement = document.querySelector('.bgimg');

    
    function changeBackgroundImage() {
        const { matches: isMobile } = window.matchMedia("(max-width: 768px)")
        if (isMobile) {
            currentImageIndex = (currentImageIndex + 1) % imagePathsMobile.length;
            headerElement.style.backgroundImage = `url('${imagePathsMobile[currentImageIndex]}')`;
        }
        else {
            currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
            headerElement.style.backgroundImage = `url('${imagePaths[currentImageIndex]}')`;
        }
            
    }

    // Set the first image as the initial background
    headerElement.style.backgroundImage = `url('${imagePaths[0]}')`;

    setInterval(changeBackgroundImage, 10000);
});
