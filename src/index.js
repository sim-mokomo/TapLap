const electron = require("electron")
const { ipcRenderer } = electron
const fileFields = document.querySelector("#fileFields")
const ioHook = require("iohook")
const fs = require("fs")
const path = require("path")
var audioSourceList = []

const increaseField = document.querySelector("#increaseFieldBtn")
increaseField.addEventListener("click", () => {

    var container = document.createElement("div")
    container.classList.add("container")
    container.classList.add("file-field")
    var row = document.createElement("div")
    row.className = "row"
    container.appendChild(row)

    var fileField = document.createElement("div")
    fileField.classList.add("col")
    fileField.classList.add("s10")
    fileField.classList.add("input-field")

    var btn = document.createElement("div")
    btn.classList.add("btn")
    btn.classList.add("blue")
    btn.appendChild(document.createElement("span").appendChild(document.createTextNode("File")))

    var input = document.createElement("input")
    input.className = "file-input"
    input.type = "file"
    input.addEventListener("change",(e)=>{
        audioSourceList = refreshAudioSourceList()
    })
    btn.appendChild(input)
    fileField.appendChild(btn)

    var filePath = document.createElement("div")
    filePath.className = "file-path-wrapper"
    var filePathInput = document.createElement("input")
    filePathInput.classList.add("file-path")
    filePathInput.classList.add("validate")
    filePathInput.type = "text"

    var arrowUpButton = document.createElement("button")
    arrowUpButton.classList.add("btn-small")
    var arrowUpIcon = document.createElement("i")
    arrowUpIcon.classList.add("col")
    arrowUpIcon.classList.add("s1")
    arrowUpIcon.classList.add("material-icons")
    arrowUpIcon.appendChild(document.createTextNode("arrow_drop_up"))
    arrowUpButton.appendChild(arrowUpIcon)
    arrowUpButton.addEventListener("click",(e) => {
        var file = input.files[0]
        shiftUpAudioSourceList(file)
        audioSourceList = refreshAudioSourceList()
    })
    
    var arrowDownButton = document.createElement("button")
    arrowDownButton.classList.add("btn-small")
    var arrowDownIcon = document.createElement("i")
    arrowDownIcon.classList.add("col")
    arrowDownIcon.classList.add("s1")
    arrowDownIcon.classList.add("material-icons")
    arrowDownIcon.appendChild(document.createTextNode("arrow_drop_down"))
    arrowDownButton.appendChild(arrowDownIcon)
    arrowDownButton.addEventListener("click",(e)=>{
        var file = input.files[0]
        shiftDownAudioSourceList(file)
        audioSourceList = refreshAudioSourceList()
var basePath = ""
var uploadFilePathNames = []
const soundUploader = document.getElementById("sound-uploader")
soundUploader.addEventListener("change", (event) => {
    console.log(event.target.files)
    basePath = event.target.files[0].path
    fs.readdir(event.target.files[0].path, function (err, files) {
        files.forEach(file => {
            uploadFilePathNames.push(file)
        })
    })

    filePath.appendChild(filePathInput)
    fileField.appendChild(filePath)

    row.appendChild(fileField)
    row.appendChild(arrowUpButton)
    row.appendChild(arrowDownButton)

    fileFields.appendChild(container)
})
const decreaseField = document.querySelector("#decreaseFieldBtn")
decreaseField.addEventListener("click", () => {
    if (fileFields.hasChildNodes() == false) {
        return
    }
    var last = fileFields.lastChild
    fileFields.removeChild(last)
})

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
    console.log(keyEvent.key)
    var fileFields = document.querySelector("#fileFields")
    if (!fileFields.hasChildNodes()) {
        return
    }

    if (currentSequence == 1) {
        console.log(audioSequenceIndex)
        var sequenceFiled = fileFields.children[audioSequenceIndex]
        var file = sequenceFiled.getElementsByTagName("input")[0].files[0]
        if (file != null) {
            var audio = new Audio(URL.createObjectURL(file))
            audio.play()
            audio = null
        }
        audioSequenceIndex = (audioSequenceIndex + 1) % fileFields.children.length
    }

    if (currentSequence == 2) {
        var randomIndex = getRandom(0, fileFields.children.length - 1)
        console.log(randomIndex)
        var randomFileField = fileFields.children[randomIndex]
        var file = randomFileField.getElementsByTagName("input")[0].files[0]
        if (file != null) {
            var audio = new Audio(URL.createObjectURL(file))
            audio.play()
            audio = null
        }
    }
})
ioHook.start()

function getRandom(min, max) {
    var random = Math.floor(Math.random() * (max + 1 - min)) + min;
    return random;
}

function refreshAudioSourceList() {
    var files = []
    var nodes = fileFields.children
    for (let index = 0; index < nodes.length; index++) {
        const element = nodes[index];
        var file = element.getElementsByTagName("input")[0].files[0]
        files.push(file)
    }
    return files
}

function shiftUpAudioSourceList(file) {
    var targetAudioSourceIndex = audioSourceList.indexOf(file)
    if(targetAudioSourceIndex == 0){
        return
    }

    var nodes = fileFields.children
    for (let index = 0; index < nodes.length; index++) {
        const element = nodes[index];
        if(index == targetAudioSourceIndex){
            fileFields.insertBefore(element,nodes[targetAudioSourceIndex-1])
        }
    }
    return audioSourceList
}

function shiftDownAudioSourceList(file) {
    var targetAudioSourceIndex = audioSourceList.indexOf(file)
    if(targetAudioSourceIndex == audioSourceList.length-1){
        return
    }

    var nodes = fileFields.children
    for (let index = 0; index < nodes.length; index++) {
        const element = nodes[index];
        if(index == targetAudioSourceIndex){
            fileFields.insertBefore(element,nodes[targetAudioSourceIndex+2])
        }
    }
    return audioSourceList
}