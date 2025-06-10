"use strict";

// --- 1. Centralizacija DOM Elemenata i Stanja ---
// Svaka komponenta (pumpa ili solenoid) je objekat sa svojim DOM elementima, statusom, itd.
const components = [
    {
        id: 'pump01', // Jedinstveni identifikator
        type: 'pump', // Tip komponente
        domElement: document.querySelector(".pump-ga-01"), // Glavni SVG element/grupa
        toggleButtonContainer: document.querySelector(".pump1-toggle"), // Kontejner dugmeta na kontrolnom panelu
        pipeElements: document.querySelectorAll(".pipe-ga-01"), // Povezane PLAVE cevi
        status: 0, // 0 = ISKLJUČENO, 1 = UKLJUČENO
        controlButton: document.querySelector(".btn1") // Dugme za kontrolu
    },
    {
        id: 'pump02',
        type: 'pump',
        domElement: document.querySelector(".pump-ga-02"),
        toggleButtonContainer: document.querySelector(".pump2-toggle"),
        pipeElements: document.querySelectorAll(".pipe-ga-02"), // Povezane ZELENE cevi
        status: 0,
        controlButton: document.querySelector(".btn2")
    },
    {
        id: 'pump03',
        type: 'pump',
        domElement: document.querySelector(".pump-ga-03"),
        toggleButtonContainer: document.querySelector(".pump3-toggle"),
        pipeElements: document.querySelectorAll(".pipe-ga-03"), // Povezane ŽUTE cevi
        status: 0,
        controlButton: document.querySelector(".btn3")
    },
    {
        id: 'solenoid',
        type: 'solenoid',
        domElement: document.querySelector(".sov"),
        toggleButtonContainer: document.querySelector(".sov-toggle"),
        // Solenoid direktno ne kontroliše sopstvene cevi kao pumpe,
        // ali njegov rad utiče na 'pipeOuter' i vizuelne elemente samog ventila.
        // Njegovi vizuelni 'status' elementi su oni sa klasom .sov-01 unutar .sov
        pipeElements: null,
        status: 0,
        controlButton: document.querySelector(".btn-sov")
    }
];

// Glavni panel za slušanje događaja klikova (delegacija događaja)
const controlPanel = document.querySelector(".control-panel");

// Crvena linija - glavni dovodni vod, kontrolisan logikom PUMPE 01 i SOLENOIDA
const pipeOuter = document.querySelectorAll(".pipe-outer");


// --- 2. Generička Funkcija za Vizuelno Prebacivanje Komponenti (ON/OFF) ---
// Ova funkcija ažurira vizuelni status komponente (dugmad na panelu i SVG elemente).
const toggleComponentVisuals = function(componentObj, turnOn) {
    // Određujemo klase za dodavanje/uklanjanje na osnovu željenog stanja (ON/OFF)
    const actionForVisible = turnOn ? "add" : "remove"; // Dodaj 'visible' za ON, ukloni za OFF
    const actionForHidden = turnOn ? "remove" : "add"; // Ukloni 'visible' za ON, dodaj za OFF (jer se prebacuju)

    // A. Ažuriranje dugmadi na kontrolnom panelu
    if (componentObj.toggleButtonContainer) {
        componentObj.toggleButtonContainer.querySelector(".toggle-on").classList[actionForVisible]("visible");
        componentObj.toggleButtonContainer.querySelector(".toggle-off").classList[actionForHidden]("visible");
    }

    // B. Ažuriranje vizuelnog statusa SVG elemenata komponente (npr. samu pumpu, solenoid)
    // Koristimo .pump i .sov-01 selektore kao u vašem originalnom kodu.
    const statusChangeElements = componentObj.domElement.querySelectorAll('.pump, .sov-01');
    statusChangeElements.forEach(el => {
        el.classList[actionForHidden]("stop"); // 'stop' klasa čini da vizuelno izgleda isključeno
    });

    // C. Ažuriranje stanja povezanih cevi (plava, zelena, žuta)
    if (componentObj.pipeElements && componentObj.pipeElements.length > 0) {
        componentObj.pipeElements.forEach(el => {
            el.classList[actionForHidden]("pipe-stop"); // 'pipe-stop' klasa čini da cev izgleda isključeno
        });
    }

    // D. Ažuriranje internog statusa komponente u našem 'components' nizu
    componentObj.status = turnOn ? 1 : 0;
};


// --- 3. Funkcija za Ažuriranje Spoljnih Cevi (Crvena Linija) ---
// Ova funkcija je zasebna jer pipeOuter nije vezan za jednu komponentu u components nizu,
// ali se logički aktivira/deaktivira na osnovu Pumpe 01 i Solenoida.
const toggleOuterPipeVisuals = function(turnOn) {
    const actionForHidden = turnOn ? "remove" : "add"; // 'pipe-stop' znači isključeno/skriveno
    pipeOuter.forEach(el => {
        el.classList[actionForHidden]("pipe-stop");
    });
};


// --- 4. Glavna Logika Procesiranja Klikova sa Delegacijom Događaja ---
const startProcess = function() {
    controlPanel.addEventListener("click", function(e) {
        const clickedElement = e.target; // Element na koji je stvarno kliknuto

        // Pronađi koja je komponenta povezana sa kliknutim dugmetom
        for (const component of components) {
            const controlButtonClass = component.controlButton.classList[0]; // Uzimamo prvu klasu dugmeta (npr. "btn1")

            // Proveravamo da li je kliknuto dugme deo ove komponente
            if (clickedElement.closest(`.${controlButtonClass}`)) {

                // Logika za SOLENOID (posebna pravila)
                if (component.type === 'solenoid') {
                    if (component.status === 0) { // Solenoid je ISKLJUČEN -> UKLJUČI GA
                        toggleComponentVisuals(component, true);
                    } else { // Solenoid je UKLJUČEN -> ISKLJUČI GA
                        toggleComponentVisuals(component, false);
                        // KADA SE SOLENOID ISKLJUČI, OBAVEZNO ISKLJUČITI PUMPU 01 I SPOLJNE CEVI!
                        const pump01Component = components.find(comp => comp.id === 'pump01');
                        if (pump01Component && pump01Component.status === 1) { // Proveri da li je pumpa01 radila
                           toggleComponentVisuals(pump01Component, false); // Isključi pumpu01
                           toggleOuterPipeVisuals(false); // Isključi crvenu spoljnu cev
                        }
                    }
                    return; // Obrađeno, izlazimo iz petlje
                }

                // Logika za PUMPU 01 (posebna pravila - zavisi od solenoida)
                else if (component.id === 'pump01') {
                    const solenoidComponent = components.find(comp => comp.id === 'solenoid');
                    if (solenoidComponent.status === 1) { // Pumpa 01 može raditi samo ako je solenoid UKLJUČEN
                        // Prebaci status pumpe 01 (ON -> OFF, OFF -> ON)
                        toggleComponentVisuals(component, !component.status);
                        // Ažuriraj stanje crvene spoljne cevi da prati stanje pumpe 01
                        toggleOuterPipeVisuals(component.status === 1); // Ako je pumpa sad ON, i cev je ON
                    } else {
                        console.warn("Pump 01 cannot be started. Solenoid (SOV) is OFF.");
                        // NAPOMENA: Za prikazivanje poruka, koristite custom modal ili poruku na UI,
                        // izbegavajte 'alert()' u Canvas okruženju.
                        alert("Pump 01 cannot be started. Solenoid (SOV) is OFF.");
                    }
                    return; // Obrađeno, izlazimo iz petlje
                }

                // Logika za OSTALE PUMPE (Pumpa 02, Pumpa 03) - jednostavno prebacivanje stanja
                else if (component.type === 'pump') {
                    toggleComponentVisuals(component, !component.status); // Prebaci status (ON -> OFF, OFF -> ON)
                }
                break; // Izlazimo iz petlje jer smo obradili klik
            }
        }
    });
};

// Pokreće funkciju za slušanje događaja i inicijalizaciju sistema
startProcess();

// --- OPCIONALNO: Inicijalizacija vizuelnog stanja pri učitavanju stranice ---
// Ako želite da SVG elementi i dugmad na kontrolnoj tabli odmah prikažu
// inicijalni status (npr. sve isključeno), možete pozvati:
// components.forEach(comp => {
//     toggleComponentVisuals(comp, comp.status === 1); // Postavi vizuelno stanje na osnovu inicijalnog statusa
// });
// Takođe, postavite inicijalno stanje crvene cevi ako je potrebno (npr. isključeno)
// toggleOuterPipeVisuals(false);
