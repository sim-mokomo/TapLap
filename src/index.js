const electron = require("electron")
const { ipcRenderer } = electron
const fileFields = document.querySelector("#fileFields")
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

window.addEventListener("keydown", (keyEvent) => {
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

function getRandom(min, max) {
    var random = Math.floor(Math.random() * (max + 1 - min)) + min;
    return random;
}
