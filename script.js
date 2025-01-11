let speech = new SpeechSynthesisUtterance();
let voices = [];
const voiceSelect = document.querySelector("select");
const speakButton = document.querySelector("#speakButton");

function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
        setTimeout(loadVoices, 100);
        return;
    }

    voiceSelect.innerHTML = "";
    voices.forEach((voice, index) => {
        voiceSelect.options[index] = new Option(voice.name, index);
    });
    speech.voice = voices[0];
}

window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[parseInt(voiceSelect.value)];
});

speakButton.addEventListener("click", () => {
    speech.text = document.querySelector("textarea").value.trim();
    if (speech.text) {
        window.speechSynthesis.speak(speech);
    } else {
        alert("Please enter text to speak.");
    }
});
