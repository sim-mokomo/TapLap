const electron = require("electron")
const { ipcRenderer } = electron
const fileFields = document.querySelector("#fileFields")
const ioHook = require("iohook")
const fs = require("fs")
const path = require("path")
'use strict'
const soundPlayer = require("play-sound")()
var audioSourceList = []

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
    if(uploadFilePathNames.length == 0){
        return
    }

    if (currentSequence == 1) {
        var fileName = path.join(basePath, uploadFilePathNames[audioSequenceIndex])
        soundPlayer.play(fileName)
        console.log(fileName)
        audioSequenceIndex = (audioSequenceIndex + 1) % uploadFilePathNames.length
    }

    if (currentSequence == 2) {
        var randomIndex = getRandom(0, uploadFilePathNames.length - 1)
        var fileName = path.join(basePath,uploadFilePathNames[randomIndex])
        console.log(fileName)
        soundPlayer.play(fileName)
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