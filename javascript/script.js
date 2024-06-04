const horizontaalMuren = document.querySelectorAll(".muur-hor")
const verticaalMuren = document.querySelectorAll(".muur-ver")
const kamertjes = document.querySelectorAll(".kamertje")

const startKnop = document.querySelector("#startBtn")
const homeKnop1 = document.querySelector("#home1")
const homeKnop2 = document.querySelector("#home2")
const herstartKnop = document.querySelector("#herstart-knop")
const opnieuwKnop = document.querySelector('#opnieuw')

const beurtIndicator = document.querySelector("#spelers-beurt")
const popupStart = document.querySelector("#popupStart")
const popupBeginnen = document.querySelector("#popupBeurt")
const popupEind = document.querySelector("#popupEinde")
const beurtWeergave = document.querySelector("h2")
const wieBegintWeergave = document.querySelector("#wieBegintBox")
const beginTimer = document.querySelector("#beginTimer")
const timer = document.querySelector("#timer")

const speler1 = document.querySelector("#speler1")
const speler2 = document.querySelector("#speler2")
const naamInvulSpeler1 = document.querySelector("#spelerNaam1")
const naamInvulSpeler2 = document.querySelector("#spelerNaam2")
const wieBegint = document.querySelector("#wieBegint")
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
let alleKamertjesGevuld = true
let eindeSpel = false

let veldGrootte = 3

console.log(huidigeSpeler)
console.log(spelerNaam1)
console.log(spelerNaam2)
console.log("Punten speler 1:",puntenSpeler1)
console.log("Punten speler 2:",puntenSpeler2)
console.log("Timer beurt:", beurtTimer)
console.log("Timer start:",startTimer)
//Bron value: https://stackoverflow.com/questions/44217872/javascript-value-property
function setSpelerInformatie() {
    spelerNaam1 = naamInvulSpeler1.value || "Speler 1"
    spelerNaam2 = naamInvulSpeler2.value || "Speler 2"

    speler1.textContent = spelerNaam1
    speler2.textContent = spelerNaam2
}

function startGame() {
    popupStart.style.display = "none"
    beginTimer.textContent = startTimer
    setSpelerInformatie()
    wieMagBeginnen()
}

function wieMagBeginnen() {
    let beginnen = Math.random()
    console.log(beginnen)
    if(beginnen <= 0.5){
        huidigeSpeler = 'speler2'
        wieBegint.textContent = spelerNaam2
        wieBegintWeergave.style.backgroundColor = "#FF5555"
    } else {
        wieBegint.textContent = spelerNaam1
        wieBegintWeergave.style.backgroundColor = "#3787FF"
    }
    intervalStart = setInterval(startSpel, 1000)
    updateSpelerInfo()
    popupBeginnen.style.display = "flex"
    console.log(huidigeSpeler)
}

function startSpel() {
    if(startTimer > 0){
        startTimer--
        beginTimer.textContent = startTimer
    } else {
        clearInterval(intervalStart)
        popupBeginnen.style.display = "none"
        startAftellen()
    }
}

function startAftellen() {
    if(intervalBeurt){
        clearInterval(intervalBeurt)
    }
    intervalBeurt = setInterval(beurtAftellen, 1000)
    console.log('Timer started', intervalBeurt)
}

function beurtAftellen() {
    if(beurtTimer > 0){
        beurtTimer--
        timer.textContent = beurtTimer
    } else {
        wisselSpeler()
        herstartTimer()
    }
}
function herstartTimer() {
    clearInterval(intervalBeurt)
    beurtTimer = 10
    timer.textContent = beurtTimer
    startAftellen()
}
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
    if(muur.dataset.isGeplaatst === "true" || eindeSpel) return
    muur.src = muur.classList.contains("muur-hor") ? "img/muur-horizontaal.svg" : "img/muur-verticaal.svg"
    muur.dataset.isGeplaatst = "true"
    checkKamertjes()
    if(!eindeSpel){
        wisselSpeler()
        herstartTimer()
    }
}
//De function checkKamertjes is deels gemaakt met behulp van ChatGPT, en weet wel wat er gebeurt.
//Bron data attributes: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
function checkKamertjes() {
    let kamertjeGemaakt = false

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
    if (kamertjeGemaakt && !eindeSpel) {
        wisselSpeler();
    }
}

function wisselSpeler() {
    if (huidigeSpeler === 'speler1'){
        huidigeSpeler = 'speler2'
    } else {
        huidigeSpeler = 'speler1'
    }
    updateSpelerInfo()
}

function updateSpelerInfo() {
    if(spelerNaam1 && spelerNaam2){
        if(huidigeSpeler === 'speler1'){
            beurtIndicator.textContent = spelerNaam1
            beurtWeergave.style.backgroundColor = "#3787FF"
        } else {
            beurtIndicator.textContent = spelerNaam2
            beurtWeergave.style.backgroundColor = "#FF5555"
        }
    } else {
        if(huidigeSpeler === 'speler1'){
            beurtIndicator.textContent = 'speler 1'
            beurtWeergave.style.backgroundColor = "#3787FF"
        } else {
            beurtIndicator.textContent = 'speler 2'
            beurtWeergave.style.backgroundColor = "#FF5555"
        }
    }
}

function checkGewonnen() {
    alleKamertjesGevuld = true
    kamertjes.forEach(kamertje => {
        if (kamertje.dataset.isGevuld === "false"){
            alleKamertjesGevuld = false
        } 
    })
    if (alleKamertjesGevuld) {
        console.log("Alle kamertjes zijn gevuld!")
        clearInterval(intervalBeurt)
        eindeSpel = true
        console.log('Timer stopped in checkGewonnen', intervalBeurt)
        deWinnaar()
    }
}

function deWinnaar(){
    popupEind.style.display = "flex"
    clearInterval(intervalBeurt)
    console.log('Timer stopped in deWinnaar', intervalBeurt)
    if(spelerNaam1 && spelerNaam2){
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
    } else {
        if(puntenSpeler1 > puntenSpeler2){
            winnaar.textContent = "Speler 1"
            puntenWinnaar.textContent = puntenSpeler1
            verliezer.textContent = "Speler 2"
            puntenVerliezer.textContent = puntenSpeler2
        } else if(puntenSpeler1 < puntenSpeler2){
            winnaar.textContent = "Speler 2"
            puntenWinnaar.textContent = puntenSpeler2
            verliezer.textContent = "Speler 1"
            puntenVerliezer.textContent = puntenSpeler1
        }

    }
}

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
    huidigeSpeler = 'speler1'
    puntenSpeler1 = 0
    puntenSpeler2 = 0
    alleKamertjesGevuld = false
    beurtTimer = 10
    startTimer = 3
    eindeSpel = false
    beurtIndicator.textContent = spelerNaam1 || "speler 1"
    beurtWeergave.style.backgroundColor = "#3787FF"
    scoreSpeler1.textContent = puntenSpeler1
    scoreSpeler2.textContent = puntenSpeler2
    popupEind.style.display = "none"
    timer.textContent = beurtTimer
    clearInterval(intervalBeurt)
}

function herstartSpel() {
    resetInstellingen()
    herstartTimer()
}

function resetAll() {
    naamInvulSpeler1.value = ''
    naamInvulSpeler2.value = ''
    popupStart.style.display = "flex"
    resetInstellingen()
}

kamertjes.forEach(kamerje => {
    kamerje.dataset.isGevuld = "false"
})

horizontaalMuren.forEach(horMuur => {
    horMuur.dataset.isGeplaatst = "false"
    horMuur.addEventListener('mouseover', () => hoverOnMuur(horMuur))
    horMuur.addEventListener('mouseout', () => hoverOffMuur(horMuur))
    horMuur.addEventListener('click', () => plaatsMuur(horMuur))
})

verticaalMuren.forEach(verMuur => {
    verMuur.dataset.isGeplaatst = "false"
    verMuur.addEventListener('mouseover', () => hoverOnMuur(verMuur))
    verMuur.addEventListener('mouseout', () => hoverOffMuur(verMuur))
    verMuur.addEventListener('click', () => plaatsMuur(verMuur))
})

startKnop.addEventListener('click', startGame)
homeKnop1.addEventListener('click', resetAll)
homeKnop2.addEventListener('click', resetAll)
herstartKnop.addEventListener('click', herstartSpel)
opnieuwKnop.addEventListener('click', herstartSpel)

document.addEventListener('DOMContentLoaded', resetAll)

//Bron forEach: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
