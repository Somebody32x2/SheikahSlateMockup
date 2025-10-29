console.log("Sheikah Slate booting up")

let currentPage = 1; // Possible values: "runes", "map", "photos"
let pageOrder = ["camera", "runes", "map", "photos", "compendium"]
let touchstartX = 0;
let touchendX = 0;

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
        debug("Swiped left!");
        changePage(1);
    }

    if (touchendX > touchstartX + swipeThreshold) {
        // Swipe Right: Navigate to the previous page
        debug("Swiped right!");
        changePage(-1);

    }
}

function changePage(delta) {
    if (currentPage === 0 && delta === -1) return;
    if (currentPage === pageOrder.length - 1 && delta === 1) return;
    let newPage = currentPage + delta;

    document.startViewTransition(() => {
        document.getElementById(pageOrder[currentPage] + "Page").classList.add("hidden");
        document.getElementById(pageOrder[newPage] + "Page").classList.remove("hidden");
        currentPage = newPage;
    });
    if (pageOrder[newPage] === "camera") {
        getVideo();
    }
    if (pageOrder[newPage] === "map") {
        injectIframeCSS();
    }

}

// Runes
let activeRune = 0;
let runeNames = ["Remote Bomb +", "Remote Bomb +", "Magnesis", "Stasis +", "Cryonis", "Camera", "Master Cycle Zero"];
function runeClickHandler(event) {
    activeRune = event.target.getAttribute("data-value");
    document.startViewTransition(()=> {
        document.querySelectorAll(".rune.selected").forEach((el) => {el.classList.remove("selected");});
        document.querySelector(`.rune[data-value='${activeRune}']`).classList.add("selected");
        document.getElementById("runeName").innerText = runeNames[activeRune];
    })
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
// var video = document.querySelector("#cameraVideo");
// video.setAttribute('autoplay', '');
// video.setAttribute('muted', '');
// video.setAttribute('playsinline', '')
// const constraints = {
//     audio: false,
//     video: {
//         facingMode: 'user'
//     }
// }

// function getVideo() {
//     navigator.mediaDevices.getUserMedia(constraints)
//         .then(localMediaStream => {
//             console.log(localMediaStream);
//
// //  DEPRECIATION :
// //       The following has been depreceated by major browsers as of Chrome and Firefox.
// //       video.src = window.URL.createObjectURL(localMediaStream);
// //       Please refer to these:
// //       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
// //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
//             console.dir(video);
//             if ('srcObject' in video) {
//                 video.srcObject = localMediaStream;
//             } else {
//                 video.src = URL.createObjectURL(localMediaStream);
//             }
//             // video.src = window.URL.createObjectURL(localMediaStream);
//             video.play();
//         })
//         .catch(err => {
//             console.error(`OH NO!!!!`, err);
//         });
// }
