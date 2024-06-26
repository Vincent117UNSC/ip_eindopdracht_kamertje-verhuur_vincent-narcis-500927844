const horizontaalMuren = document.querySelectorAll(".muur-hor")
const verticaalMuren = document.querySelectorAll(".muur-ver")
const kamertjes = document.querySelectorAll(".kamertje")

const startKnop = document.querySelector("#startBtn")
const homeKnop1 = document.querySelector("#home1")
const homeKnop2 = document.querySelector("#home2")
const herstartKnop = document.querySelector("#herstart-knop")
const opnieuwKnop = document.querySelector('#opnieuw')

const popupStart = document.querySelector("#popupStart")
const popupBeginnen = document.querySelector("#popupBeurt")
const popupEind = document.querySelector("#popupEinde")
const beurtIndicator = document.querySelector("#spelers-beurt")
const beurtWeergave = document.querySelector("h2")
const wieBegint = document.querySelector("#wieBegint")
const wieBegintWeergave = document.querySelector("#wieBegintBox")
const beginTimer = document.querySelector("#beginTimer")
const timer = document.querySelector("#timer")

const speler1 = document.querySelector("#speler1")
const speler2 = document.querySelector("#speler2")
const naamInvulSpeler1 = document.querySelector("#spelerNaam1")
const naamInvulSpeler2 = document.querySelector("#spelerNaam2")
const scoreSpeler1 = document.querySelector("#score-speler1")
const scoreSpeler2 = document.querySelector("#score-speler2")
const winnaar = document.querySelector('#winnaar')
const verliezer = document.querySelector('#verliezer')
const puntenWinnaar = document.querySelector('#puntenWinnaar')
const puntenVerliezer = document.querySelector('#puntenVerliezer')

let huidigeSpeler = 'speler1'
let spelerNaam1 = ''
let spelerNaam2 = ''
let puntenSpeler1 = 0
let puntenSpeler2 = 0

let startTimer = 3
let beurtTimer = 10
let intervalStart
let intervalBeurt
let kamertjeGemaakt
let alleKamertjesGevuld = true
let eindeSpel = false
let veldGrootte = 5

//Hier de code die zorgt voor het inladen van de geluidsbestanden.
//Bron Audio en .play(): https://stackoverflow.com/questions/9419263/how-to-play-audio
//Bron mp3 Zapsplat: https://www.zapsplat.com/page/2/?s=cheer&post_type=music&sound-effect-category-id
function speelGeluid(geluid) {
    const geluiden = {
        plaatsMuurGeluid: 'audio/plaats-muur.mp3',
        kamertjeGevuldGeluid: 'audio/kamertje-gemaakt.mp3',
        spelEindeGeluid: 'audio/einde-cheer.mp3',
        beurtAftelBeep: 'audio/timer-beep.mp3',
        startAftelBeep: 'audio/start-beep.mp3',
        startHorn: 'audio/start-horn.mp3',
        clickGeluid: 'audio/click.mp3',
        misBeurtBuzzer: 'audio/buzzer.mp3'
    }
    let audio = new Audio(geluiden[geluid])
    audio.play()
}

// Vanaf hier de code die voor het starten van het spel zorgt.
// Bron value: https://stackoverflow.com/questions/44217872/javascript-value-property
function setEnUpdateSpelerInfo() {
    spelerNaam1 = naamInvulSpeler1.value || "Speler 1"
    spelerNaam2 = naamInvulSpeler2.value || "Speler 2"

    speler1.textContent = spelerNaam1
    speler2.textContent = spelerNaam2

    if(huidigeSpeler === 'speler1'){
        beurtIndicator.textContent = spelerNaam1
        beurtWeergave.style.backgroundColor = "#3787FF"
    } else {
        beurtIndicator.textContent = spelerNaam2
        beurtWeergave.style.backgroundColor = "#FF5555"
    }
}

function startGame() {
    popupStart.style.display = "none"
    setEnUpdateSpelerInfo()
    wieMagBeginnen()
    speelGeluid('clickGeluid')
}

function wieMagBeginnen() {
    beginTimer.textContent = startTimer
    let beginnen = Math.random()
    if(beginnen <= 0.5){
        huidigeSpeler = 'speler2'
        wieBegint.textContent = spelerNaam2
        wieBegintWeergave.style.backgroundColor = "#FF5555"
    } else {
        huidigeSpeler = 'speler1'
        wieBegint.textContent = spelerNaam1
        wieBegintWeergave.style.backgroundColor = "#3787FF"
    }
    //beginTimer.textContent = startTimer
    setEnUpdateSpelerInfo()
    intervalStart = setInterval(startSpel, 1000)
    popupBeginnen.style.display = "flex"
}

function startSpel() {
    if(startTimer > 0){
        startTimer--
        beginTimer.textContent = startTimer
        speelGeluid('startAftelBeep')
    } else {
        clearInterval(intervalStart)
        popupBeginnen.style.display = "none"
        startAftellen()
        speelGeluid('startHorn')
    }
}

//Vanaf hier de code die verantwoordelijk is voor de timer, die een beurt van een speler afteld.
function startAftellen() {
    if(intervalBeurt){
        clearInterval(intervalBeurt)
    }
    intervalBeurt = setInterval(beurtAftellen, 1000)
}

function beurtAftellen() {
    if(beurtTimer > 0){
        beurtTimer--
        timer.textContent = beurtTimer
    } else {
        speelGeluid('misBeurtBuzzer')
        wisselSpeler()
        herstartTimer()
    }
    if(beurtTimer < 3){
        speelGeluid('beurtAftelBeep')
        timer.style.border = "10px solid #FF0000"
    } else {
        timer.style.border = "2px solid black"
    }
}
function herstartTimer() {
    clearInterval(intervalBeurt)
    beurtTimer = 10
    timer.textContent = beurtTimer
    startAftellen()
}

//Vanaf hier de code die verantwoordelijk is voor de muurtjes, het hoveren en plaatsen ervan.
//Bron ?en: : https://javascript.info/ifelse
function hoverOnMuur(muur) {
    if(muur.dataset.isGeplaatst === "false"){
        if(muur.classList.contains("muur-hor")){
            muur.src = huidigeSpeler === 'speler1' ? "img/hover-hor-blauw.svg" : "img/hover-hor-rood.svg"
        } else {
            muur.src = huidigeSpeler === 'speler1' ? "img/hover-ver-blauw.svg" : "img/hover-ver-rood.svg"
        }
    }
}

function hoverOffMuur(muur) {
    if(muur.dataset.isGeplaatst === "false"){
        muur.src = muur.classList.contains("muur-hor") ? "img/muur-horizontaal-leeg.svg" : "img/muur-verticaal-leeg.svg"
    }
}

function plaatsMuur(muur) {
    if(muur.dataset.isGeplaatst === "false"){
        muur.src = muur.classList.contains("muur-hor") ? "img/muur-horizontaal.svg" : "img/muur-verticaal.svg"
        muur.dataset.isGeplaatst = "true"
        speelGeluid('plaatsMuurGeluid')
    
        kamertjeGemaakt = checkKamertjes()
        if(kamertjeGemaakt){
            speelGeluid('kamertjeGevuldGeluid')
            herstartTimer()
        }
        if(!kamertjeGemaakt && !eindeSpel){
            wisselSpeler()
            herstartTimer()
        }
    }
    if(eindeSpel){
        speelGeluid('spelEindeGeluid')
        clearInterval(intervalBeurt)
    }
}

//Dit is de code die kijkt of er een kamertje gevormd is, en hem vervolgens vuld met de kleur van de speler die aan de beurt is.
//De function checkKamertjes is deels gemaakt met behulp van ChatGPT, en weet wel wat er gebeurt.
//Bron data attributes: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
function checkKamertjes() {
    kamertjeGemaakt = false

    kamertjes.forEach((kamertje, index) => {
        if(kamertje.dataset.isGevuld === "false"){
            let row = Math.floor(index / veldGrootte) 
            let col = index % veldGrootte 

            let bovenMuurIndex = row * veldGrootte + col
            let onderMuurIndex = bovenMuurIndex + veldGrootte
            let linkerMuurIndex = row * (veldGrootte + 1) + col
            let rechterMuurIndex = linkerMuurIndex + 1

            let bovenMuur = horizontaalMuren[bovenMuurIndex]
            let onderMuur = horizontaalMuren[onderMuurIndex]
            let linkerMuur = verticaalMuren[linkerMuurIndex]
            let rechterMuur = verticaalMuren[rechterMuurIndex]
            
            if (bovenMuur.dataset.isGeplaatst === "true" &&
                onderMuur.dataset.isGeplaatst === "true" &&
                linkerMuur.dataset.isGeplaatst === "true" &&
                rechterMuur.dataset.isGeplaatst === "true") {
                if(huidigeSpeler === 'speler1'){
                    kamertje.src = "img/kamertje-blauw.svg"
                    kamertje.dataset.isGevuld = "true"
                    puntenSpeler1++
                    scoreSpeler1.textContent = puntenSpeler1
                    console.log("Kamertje index " + index + " is gevuld met blauw!")
                } else {
                    kamertje.src = "img/kamertje-rood.svg"
                    kamertje.dataset.isGevuld = "true"
                    puntenSpeler2++
                    scoreSpeler2.textContent = puntenSpeler2
                    console.log("Kamertje index " + index + " is gevuld met rood!")
                }
                kamertjeGemaakt = true
                checkGewonnen()
            }
        }
    })
    return kamertjeGemaakt
}

//Vanaf hier de code die de speler wisselt, maar ook checkt wie de winnaar is en dat vervolgens ook laat zien.
function wisselSpeler() {
    huidigeSpeler = huidigeSpeler === 'speler1' ? 'speler2' : 'speler1'
    setEnUpdateSpelerInfo()
}

function checkGewonnen() {
    alleKamertjesGevuld = true
    kamertjes.forEach(kamertje => {
        if (kamertje.dataset.isGevuld === "false"){
            alleKamertjesGevuld = false
        } 
    })
    if (alleKamertjesGevuld) {
        clearInterval(intervalBeurt)
        eindeSpel = true
        deWinnaar()
    }
}

function deWinnaar(){
    popupEind.style.display = "flex"
    clearInterval(intervalBeurt)
    if(puntenSpeler1 > puntenSpeler2){
        winnaar.textContent = spelerNaam1
        puntenWinnaar.textContent = puntenSpeler1
        verliezer.textContent = spelerNaam2
        puntenVerliezer.textContent = puntenSpeler2
    } else if(puntenSpeler1 < puntenSpeler2){
        winnaar.textContent = spelerNaam2
        puntenWinnaar.textContent = puntenSpeler2
        verliezer.textContent = spelerNaam1
        puntenVerliezer.textContent = puntenSpeler1
    }
}

//Vanaf hier de code die ervoor zorgt dat bij het herladen van de pagina, of opnieuw het spel spelen, of terug naar homepagina alle waarden reset naar origineel.
function resetInstellingen() {
    horizontaalMuren.forEach(horMuur => {
        horMuur.src = "img/muur-horizontaal-leeg.svg"
        horMuur.dataset.isGeplaatst = "false"
    })
    verticaalMuren.forEach(verMuur => {
        verMuur.src = "img/muur-verticaal-leeg.svg"
        verMuur.dataset.isGeplaatst = "false"
    })
    kamertjes.forEach(kamertje => {
        kamertje.src = "img/kamertje-leeg.svg"
        kamertje.dataset.isGevuld = "false"
    })
    puntenSpeler1 = 0
    puntenSpeler2 = 0
    alleKamertjesGevuld = false
    beurtTimer = 10
    startTimer = 3
    eindeSpel = false
    scoreSpeler1.textContent = puntenSpeler1
    scoreSpeler2.textContent = puntenSpeler2
    popupEind.style.display = "none"
    timer.textContent = beurtTimer
    clearInterval(intervalBeurt)
}

function herstartSpel() {
    resetInstellingen()
    clearInterval(intervalStart)
    wieMagBeginnen()
    speelGeluid('clickGeluid')
}

function resetAll() {
    naamInvulSpeler1.value = ''
    naamInvulSpeler2.value = ''
    popupStart.style.display = "flex"
    resetInstellingen()
    speelGeluid('clickGeluid')
}

function herlaadPagina() {
    naamInvulSpeler1.value = ''
    naamInvulSpeler2.value = ''
    popupStart.style.display = "flex"
    resetInstellingen()
}

//En vanaf hier de code voor de Events, die de functies aanroepen.
function plaatsMuurEvent(muur) {
    muur.dataset.isGeplaatst = "false"
    muur.addEventListener('mouseover', () => hoverOnMuur(muur))
    muur.addEventListener('mouseout', () => hoverOffMuur(muur))
    muur.addEventListener('click', () => plaatsMuur(muur))
}

horizontaalMuren.forEach(muur => plaatsMuurEvent(muur))
verticaalMuren.forEach(muur => plaatsMuurEvent(muur))

kamertjes.forEach(kamerje => {
    kamerje.dataset.isGevuld = "false"
})

startKnop.addEventListener('click', startGame)
homeKnop1.addEventListener('click', resetAll)
homeKnop2.addEventListener('click', resetAll)
herstartKnop.addEventListener('click', herstartSpel)
opnieuwKnop.addEventListener('click', herstartSpel)

document.addEventListener('DOMContentLoaded', herlaadPagina)