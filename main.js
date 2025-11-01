console.log("Sheikah Slate booting up")

let currentPage = 0; // Possible values: "runes", "map", "photos"
let pageOrder = ["runes", "map", "photos", "compendium"]
let galleryShown = false;
let photoIndex = 0;
let num_photos = 5;
let touchstartX = 0;
let touchendX = 0;
let mp3s = [];
for (let i = 0; i < 7; i++) {
    mp3s.push(new Audio(`/assets/runeSfx/${i}.mp3`));
}
const swipeZone = document.body; // Or any specific element you want to track

// Custom console.log that shows messages in a debug area on the page
function debug(message) {
    console.log(message);
    let log = document.getElementById("log");
    if (log) {
        log.innerText += message + "\n";
        log.scrollTop = log.scrollHeight; // Auto-scroll to the bottom
    }
}

debug("hi")
swipeZone.addEventListener('touchstart', e => {
    if (screen.orientation.type.includes("portrait-primary")) {
        touchstartX = e.changedTouches[0].screenY;
    } else {
        touchstartX = e.changedTouches[0].screenX;
    }
});

swipeZone.addEventListener('touchend', e => {
    if (screen.orientation.type.includes("portrait-primary")) {
        touchendX = e.changedTouches[0].screenY;
    } else {
        touchendX = e.changedTouches[0].screenX;
    }
    handleGesture();
});

function handleGesture() {
    // Define a minimum horizontal distance for a valid swipe
    const swipeThreshold = 50;

    let mult = 1;
    if (screen.orientation.type.includes("portrait-primary")) {
        mult = -1;
    }

    if (touchendX < touchstartX - swipeThreshold) {
        // Swipe Left: Navigate to the next page
        debug("Swiped left!");
        changePage(1 * mult);
    }

    if (touchendX > touchstartX + swipeThreshold) {
        // Swipe Right: Navigate to the previous page
        debug("Swiped right!");
        changePage(-1 * mult);

    }
}

function changePage(delta) {
    if (!galleryShown) {
        if (currentPage === 0 && delta === -1) return;
        if (currentPage === pageOrder.length - 1 && delta === 1) return;
        let newPage = currentPage + delta;

        document.startViewTransition(() => {
            document.getElementById(pageOrder[currentPage] + "Page").classList.add("hidden");
            document.getElementById(pageOrder[newPage] + "Page").classList.remove("hidden");
            currentPage = newPage;
        });
        if (pageOrder[newPage] === "map") {
            injectIframeCSS();
        }
    } else {
        if (photoIndex === 0 && delta === -1) return;
        if (photoIndex === num_photos - 1 && delta === 1) return;
        let newPage = photoIndex + delta;

        document.startViewTransition(() => {
            document.getElementById("galleryPhoto").setAttribute("src", `images/library/${photoIndex}.png`);
            photoIndex = newPage;
        });
    }

}

// Runes
let activeRune = 0;
let lastSfxTime = 0;
let runeNames = ["Remote Bomb +", "Remote Bomb +", "Magnesis", "Stasis +", "Cryonis", "Camera", "Master Cycle Zero"];
let runeSubtitles = [
    "A bomb that can be detonated remotely.",
    "A bomb that can be detonated remotely.",
    "Manipulate metallic objects using magnetism.",
    "Stop the flow of time for an object.",
    "Create a pillar of ice from a water surface.",
    "Instantly render a visible image into a picture.",
    "Summon Master Cycle Zero."
]
let runeDescriptions = [
    "Powered-up bombs now have a stronger blast and recharge faster. The force of the blast can damage monsters or destroy objects. There are round and cube so use whichever best fits the situation.",
    "Powered-up bombs now have a stronger blast and recharge faster. The force of the blast can damage monsters or destroy objects. There are round and cube so use whichever best fits the situation.",
    "The Magnesis Rune allows you to lift and move metallic objects using magnetic force. You can manipulate these objects to solve puzzles, create bridges, or even use them as weapons against enemies.",
    "The Stasis Rune lets you freeze objects in time temporarily. When you hit an object with Stasis, it will stop moving for a short period, allowing you to set up powerful kinetic energy releases when time resumes.",
    "The Cryonis Rune enables you to create pillars of ice on water surfaces. These ice pillars can be used as platforms to cross bodies of water, reach higher areas, or block enemy movements.",
    "The Camera Rune allows you to take pictures of your surroundings. You can capture images of landmarks, creatures, and items, which are then stored in your Hyrule Compendium for later reference.",
    "The Master Cycle Zero is a powerful motorcycle that you can summon using this rune. It allows for fast travel across Hyrule, making exploration and transportation much more efficient."
]

function runeClickHandler(event) {
    activeRune = event.target.getAttribute("data-value");
    document.startViewTransition(() => {
        document.querySelectorAll(".rune.selected").forEach((el) => {
            el.classList.remove("selected");
        });
        document.querySelector(`.rune[data-value='${activeRune}']`).classList.add("selected");
        document.getElementById("runeName").innerText = runeNames[activeRune];
        document.getElementById("runeSubtitle").innerText = runeSubtitles[activeRune];
        document.getElementById("runeDescription").innerHTML = runeDescriptions[activeRune] //.split('').map(char => `<span>${char}</span>`).join('');
        document.getElementById("runeDescription").setAttribute("style", "--n: " + runeDescriptions[activeRune].length);
        document.getElementById("runeSubtitle").animate( [
            { width: '0px' },
            { width: '20rem' }
        ], {
            duration: 1000, easing: 'ease-out'
        });
        if (runeNames[activeRune] === "Camera") {
            galleryShown = true;
            setTimeout(() => {
                    document.getElementById("runesPage").classList.add("hidden");
                    document.getElementById( "galleryPage").classList.remove("hidden");
            }, 1200 );
        }
    })
    // setTimeout(()=>{
    //     document.getElementById("runeSubtitle").style.animation = "typing 3.5s;"
    //     document.getElementById("runeDescriptions").style.animation = "typing 3.5s;";
    // }, 100);
    // setTimeout(()=>{
    //     document.getElementById("runeSubtitle").style.animation = ""
    //     document.getElementById("runeDescriptions").style.animation = "";
    // }, 3600);
    let currentTime = Date.now();
    if (currentTime - lastSfxTime > 2000) { // Throttle to prevent rapid replays
        mp3s[activeRune].currentTime = 0; // Rewind to start
        mp3s[activeRune].play();
        lastSfxTime = currentTime;
    }
}

runeClickHandler({target: document.querySelector(`.rune[data-value='${activeRune}']`)});

document.querySelectorAll(".rune").forEach((el) => {
    el.addEventListener("click", runeClickHandler);
});

function injectIframeCSS() {
    debug("injectIframeCSS");
    // debugger
    const iframe = document.getElementById('mapIframe');
    if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const style = document.createElement('style');
        style.innerHTML = `
            @font-face {
                font-family: Calamity-Regular;
                src: url('/assets/Calamity-Regular/Calamity-Regular.otf') format('opentype');
            }
            .zd-map-botw .leaflet-tooltip.zd-location-label, .zd-map-totk .leaflet-tooltip.zd-location-label, .zd-map-eow .leaflet-tooltip.zd-location-label {
                font-family: 'Calamity-Regular', sans-serif;
            }

        `;
        iframeDoc.head.appendChild(style);
    }
}

document.getElementById("galleryButton").addEventListener("click", () => {
    galleryShown = false;
    document.startViewTransition(() => {
        document.getElementById("galleryPage").classList.add("hidden");
        document.getElementById("runesPage").classList.remove("hidden");
    });
});