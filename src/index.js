const electron = require("electron")
const { ipcRenderer } = electron
const fileFields = document.querySelector("#fileFields")
const ioHook = require("iohook")
const fs = require("fs")
const path = require("path")
const jquery = $ = require("jquery")
'use strict'
const soundPlayer = require("play-sound")()
const soundUploadIcon = document.getElementById("sound-upload-icon")
const soundUploadContainer = document.getElementById("sound-upload-container")

document.ondragover = document.ondrop = (event) => {
    event.preventDefault()
}

document.ondragover = soundUploadContainer.onmouseover = (event) => {
    soundUploadIcon.textContent = "folder_open"
}

document.ondragend = soundUploadContainer.onmouseleave = (event) => {
    soundUploadIcon.textContent = "folder"
}

soundUploadContainer.ondrop = (event) => {
    event.preventDefault()
    removeAllAudioCells()
    uploadFilePathNames = []
    audioSequenceIndex = 0
    basePath = event.dataTransfer.files[0].path
    fs.readdir(basePath, function (err, files) {
        files.forEach(file => {
            uploadFilePathNames.push(file)
            let collectionItem = createAudioCell(file)
            fileFields.appendChild(collectionItem)
        })
    })
}

var basePath = ""
var uploadFilePathNames = []
const soundUploader = document.getElementById("sound-uploader")
soundUploader.onchange = (event) => {
    removeAllAudioCells()
    uploadFilePathNames = []
    audioSequenceIndex = 0
    basePath = event.target.files[0].path
    fs.readdir(basePath, function (err, files) {
        files.forEach(file => {
            uploadFilePathNames.push(file)
            let collectionItem = createAudioCell(file)
            fileFields.appendChild(collectionItem)
        })
    })
}

const sequenceSelect = document.getElementById("sequence-select")
var currentSequence = 0
var audioSequenceIndex = 0
sequenceSelect.addEventListener("change", (e) => {
    var value = sequenceSelect.value
    currentSequence = value
    audioSequenceIndex = 0
    console.log(value)
})

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, null);
})

ioHook.addListener("keydown", (keyEvent) => {
    if (uploadFilePathNames.length == 0) {
        return
    }

    if (currentSequence == 1) {
        playSound(uploadFilePathNames[audioSequenceIndex])
        audioSequenceIndex = (audioSequenceIndex + 1) % uploadFilePathNames.length
    }

    if (currentSequence == 2) {
        var randomIndex = getRandom(0, uploadFilePathNames.length - 1)
        playSound(uploadFilePathNames[randomIndex])
    }
})
ioHook.start()

function getRandom(min, max) {
    var random = Math.floor(Math.random() * (max + 1 - min)) + min;
    return random;
}

function shiftUpAudioSourceList(list, index) {
    if (list.length == 0) {
        return
    }

    let shiftItem = list[index]
    list.splice(index, 1)
    list.splice(Math.max(index - 1, 0), 0, shiftItem)

    return list
}

function shiftDownAudioSourceList(list, index) {
    if (list.length == 0) {
        return
    }

    let shiftItem = list[index]
    let originLength = list.length
    list.splice(index, 1)
    list.splice(Math.min(index + 1, originLength - 1), 0, shiftItem)

    return list
}

function refreshSoundFileCells() {
    if (uploadFilePathNames.length == 0) {
        return
    }

    removeAllAudioCells()

    uploadFilePathNames.forEach(fileName => {
        let collectionItem = createAudioCell(fileName)
        fileFields.appendChild(collectionItem)
    })
}

function removeAllAudioCells() {
    while (fileFields.firstChild) {
        fileFields.removeChild(fileFields.firstChild)
    }
}

function createAudioCell(fileName) {
    let cellContent = document.createElement("div")
    cellContent.classList.add("cell-content")
    cellContent.classList.add("col")
    cellContent.classList.add("s10")
    cellContent.classList.add("left")

    var collectionItem = document.createElement("li")
    collectionItem.className = "collection-item"
    var collectionItemICon = document.createElement("i")
    collectionItemICon.classList.add("material-icons")
    collectionItemICon.classList.add("waves-effect")
    collectionItemICon.classList.add("waves-teal")
    collectionItemICon.classList.add("button-flat")
    collectionItemICon.classList.add("left")
    collectionItemICon.appendChild(document.createTextNode("play_circle_filled"))
    collectionItemICon.addEventListener("click", e => {
        playSound(fileName)
    })

    let upArrowIcon = document.createElement("i")
    upArrowIcon.classList.add("material-icons")
    upArrowIcon.classList.add("right")
    upArrowIcon.classList.add("waves-effect")
    upArrowIcon.classList.add("waves-teal")
    upArrowIcon.classList.add("button-flat")
    upArrowIcon.appendChild(document.createTextNode("arrow_drop_up"))
    upArrowIcon.addEventListener("click", e => {
        shiftUpAudioSourceList(uploadFilePathNames, uploadFilePathNames.indexOf(fileName))
        refreshSoundFileCells()
    })

    let downArrowIcon = document.createElement("i")
    downArrowIcon.classList.add("material-icons")
    downArrowIcon.classList.add("right")
    downArrowIcon.classList.add("waves-effect")
    downArrowIcon.classList.add("waves-teal")
    downArrowIcon.classList.add("button-flat")
    downArrowIcon.appendChild(document.createTextNode("arrow_drop_down"))
    downArrowIcon.addEventListener("click", e => {
        shiftDownAudioSourceList(uploadFilePathNames, uploadFilePathNames.indexOf(fileName))
        refreshSoundFileCells()
    })

    cellContent.appendChild(collectionItemICon)
    cellContent.appendChild(document.createTextNode(fileName))
    cellContent.appendChild(upArrowIcon)
    cellContent.appendChild(downArrowIcon)

    let keybind = document.createElement("div")
    keybind.clientHeight = 51
    keybind.style = "margin: 0px; margin-top:3px;"
    keybind.classList.add("keybind")
    keybind.classList.add("col")
    keybind.classList.add("s2")
    keybind.classList.add("right")

    let keybindSelect = document.createElement("select")
    keybindSelect.className = "keybind-select"
    keybind.appendChild(keybindSelect)

    let keybindTable = ["KeyBind", "AnyKey", "Enter", "Ctrl", "Shift", "Alt"]
    for (let index = 0; index < keybindTable.length; index++) {
        const keyBindElement = keybindTable[index];
        let option = new Option(keyBindElement, index, index == 1, index == 1)
        option.disabled = index == 0
        keybindSelect.options[index] = option
    }

    $('.keybind-select').ready(() => {
        let elements = $('.keybind-select')
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            console.log(element)
            M.FormSelect.init(element, element.options);
        }
    })

    let audioCell = document.createElement("div")
    audioCell.classList.add("row")
    audioCell.classList.add("card-panel")
    audioCell.classList.add("white")
    audioCell.classList.add("audio-cell")

    audioCell.appendChild(cellContent)
    audioCell.appendChild(keybind)

    return audioCell
}

function playSound(fileName) {
    soundPlayer.play(path.join(basePath, fileName))
}