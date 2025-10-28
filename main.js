console.log("Sheikah Slate booting up")

let currentPage = "runes"; // Possible values: "runes", "map", "photos"

let touchstartX = 0;
let touchendX = 0;

const swipeZone = document.body; // Or any specific element you want to track

swipeZone.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
});

swipeZone.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleGesture();
});

function handleGesture() {
    // Define a minimum horizontal distance for a valid swipe
    const swipeThreshold = 50;

    if (touchendX < touchstartX - swipeThreshold) {
        // Swipe Left: Navigate to the next page
        console.log("Swiped left!");
        // Example: Go to a 'next' page
        // window.location.href = "next-page.html";
    }

    if (touchendX > touchstartX + swipeThreshold) {
        // Swipe Right: Navigate to the previous page
        console.log("Swiped right!");
        // Example: Go to a 'previous' page
        // window.location.href = "previous-page.html";
    }
}

// Runes
let activeRune = 0;
let runeNames = ["Remote Bomb +", "Remote Bomb +", "Magnesis", "Stasis +", "Cryonis", "Camera", "Sheikah Cycle", "Amibo"];
function runeClickHandler(event) {
    activeRune = event.target.getAttribute("data-value");
    document.startViewTransition(()=> {
        document.querySelectorAll(".rune.selected").forEach((el) => {el.classList.remove("selected");});
        document.querySelector(`.rune[data-value='${activeRune}']`).classList.add("selected");
    })
}

document.querySelectorAll(".rune").forEach((el) => {
    el.addEventListener("click", runeClickHandler);
}